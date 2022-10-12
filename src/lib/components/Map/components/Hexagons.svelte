<script>
	import { bbox, collect, flatten, hexGrid } from "@turf/turf";
	import { fly } from "svelte/transition";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import {
		getBoundsData,
		roundToInt,
		debounce,
		getMapZoom,
		roundToHundredth,
		logError,
	} from "$lib/utilities/helpers.js";
	import {
		assignIDsToFeatures,
		getPointsInsideAndOutsidePolygon,
	} from "$lib/components/Map/utils/index.js";
	import { cityBounds } from "$lib/components/Map/objects/cityBounds.js";
	import { mapLoadingProgress } from "../../../../stores/state.js";

	let hoveredHexagonId = null;
	let hoveredHexagon = null;
	let prevZoomLevel = 0;

	const zoomToHexSize = {
		18: .05,
		17: .05,
		16: .1,
		15: .1,
		14: .2,
		13: .2,
		12: .3,
		11: .5,
		10: .8,
		9: 1.5,
		8: 2,
		7: 3,
		6: 3,
		5: 3,
		4: 3,
	};

	const getCorrectCollection = zoom => {
		const collection = flatten({
			"type": "FeatureCollection",
			"features": $ratingsReference,
		});

		if (zoom <= 9) {
			// todo: with growth of cities, detect only visible cityBounds
			const { outside } = getPointsInsideAndOutsidePolygon(collection, cityBounds);
			return outside;
		}

		return collection;
	};

	const updateHexagonGrid = ratings => {
		if (!ratings)
			return;

		const map = $mapReference;
		const { east, north, south, west, zoom } = getBoundsData(map);

		if (zoom < 6)
			return;

		const bounds = [ west, south, east, north ];

		const hexagons = hexGrid(bounds, zoomToHexSize[roundToInt(zoom)]);
		const collection = getCorrectCollection(zoom);

		const hexagonsWithin = collect(hexagons, collection, "averageRating", "ratings");
		const notEmptyHexagonValues = hexagonsWithin.features.filter(({ properties }) => properties.ratings.length !== 0);
		const averagedHexagonValues = notEmptyHexagonValues.map(item => {
			const { properties } = item;
			const { length } = properties.ratings;
			return {
				...item,
				properties: {
					averageRatingRounded: roundToInt(properties.ratings.reduce((i, acc) => acc + i, 0) / length),
					averageRating: roundToHundredth(properties.ratings.reduce((i, acc) => acc + i, 0) / length),
					numberOfRatings: length,
				},
			};
		});
		const notEmptyHexagons = {
			"type": "FeatureCollection",
			"features": averagedHexagonValues,
		};
		const hexagonsWithIds = assignIDsToFeatures(notEmptyHexagons);

		if (map.getSource("hexagons")) {
			map.getSource("hexagons").setData(hexagonsWithIds);
			return;
		}

		map.addSource("hexagons", {
			type: "geojson",
			data: hexagonsWithIds,
		});

		map.addLayer({
			"id": "hexagons-layer",
			"type": "fill",
			"maxzoom": 16,
			"minzoom": 6,
			"source": "hexagons",
			"layout": {
				"visibility": "visible",
			},
			"paint": {
				"fill-color": {
					"property": "averageRatingRounded", // this will be your density property form you geojson
					"stops": [
						[ 1, "#f9da00" ],
						[ 2, "#bdc31d" ],
						[ 3, "#80ab1a" ],
						[ 4, "#358717" ],
						[ 5, "#00703d" ],
					],
				},
				"fill-opacity": [
					"case",
					[ "boolean", [ "feature-state", "hover" ], false ],
					.9,
					.6,
				],
			},
		});

		map.on("mousemove", "hexagons-layer", e => {
			e.originalEvent.preventDefault();
			map.getCanvas().style.cursor = "pointer";
			if (e.features.length > 0) {
				if (hoveredHexagonId) {
					map.setFeatureState({
						source: "hexagons",
						id: hoveredHexagonId,
					}, {
						hover: false,
					});
				}

				hoveredHexagonId = e.features[0].id;
				hoveredHexagon = {
					number: e.features[0].properties.numberOfRatings,
					average: e.features[0].properties.averageRating,
				};

				map.setFeatureState({
					source: "hexagons",
					id: hoveredHexagonId,
				}, {
					hover: true,
				});
			}
		});

		map.on("mouseleave", "hexagons-layer", () => {
			map.getCanvas().style.cursor = "";

			if (hoveredHexagonId !== null) {
				map.setFeatureState({
					source: "hexagons",
					id: hoveredHexagonId,
				}, {
					hover: false,
				});
			}

			hoveredHexagonId = null;
			hoveredHexagon = null;
		});

		map.on("click", "hexagons-layer", e => {
			e.originalEvent.preventDefault();
			const box = bbox(e.features[0].geometry);
			map.fitBounds(box);
		});

		try {
			map.moveLayer("hexagons-layer", "POIs-layer");
		} catch (e) {
			logError("Error in layers priority change");
			logError(e);
		}
		mapLoadingProgress.update(state => ({ ...state, hexagons: true }));
	};

	const onZoomEnd = () => {
		const zoom = getMapZoom($mapReference);
		const zoomInt = roundToInt(zoom);

		if (zoomInt === prevZoomLevel)
			return;

		prevZoomLevel = zoomInt;
		updateHexagonGrid($ratingsReference);
	};

	$mapReference.on("zoomend", debounce(onZoomEnd, 300));
	$: updateHexagonGrid($ratingsReference);
</script>

{#if hoveredHexagon}
	<div
		class="absolute px-5 py-2.5 top-36 right-0 z-5 bg-white w-64 text-left rounded-l-lg overflow-hidden transition-transform translate-x-2 hover:translate-x-0"
		in:fly="{{ x: 300, duration: 500 }}"
		out:fly="{{ x: 300, duration: 500 }}"
	>
		<span class="absolute w-2.5 h-full left-0 top-0 bg-main"></span>
		<span class="block leading-5 pb-px text-main">
			{hoveredHexagon.number} оценки, средняя: {hoveredHexagon.average}
		</span>
	</div>
{/if}
