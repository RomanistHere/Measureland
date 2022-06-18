<script>
	import { bbox, collect, flatten, hexGrid } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { getBoundsData, roundToInt, debounce, getMapZoom } from "$lib/utilities/helpers.js";
	import { assignIDsToFeatures, getPointsInsideAndOutsidePolygon } from "$lib/components/Map/utils/index.js";
	import { cityBounds } from "$lib/components/Map/objects/cityBounds.js";

	let hoveredHexagonId = null;
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
		5: 10,
		4: 20,
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
		const bounds = [ west, south, east, north ];

		const hexagons = hexGrid(bounds, zoomToHexSize[roundToInt(zoom)]);
		const collection = getCorrectCollection(zoom);

		const hexagonsWithin = collect(hexagons, collection, "averageRating", "ratings");
		const notEmptyHexagonValues = hexagonsWithin.features.filter(({ properties }) => properties.ratings.length !== 0);
		const averagedHexagonValues = notEmptyHexagonValues.map(item => {
			const { properties } = item;
			return {
				...item,
				properties: {
					avRating: roundToInt(properties.ratings.reduce((i, acc) => acc + i, 0) / properties.ratings.length),
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
					"property": "avRating", // this will be your density property form you geojson
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
		});

		map.on("click", "hexagons-layer", e => {
			const bounds = bbox(e.features[0].geometry);
			map.fitBounds(bounds);
		});
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
