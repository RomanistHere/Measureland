<script>
	import { bbox, collect, flatten, hexGrid } from "@turf/turf";

	import { mapReference, ratingsReference } from "../../../../stores/references.js";
	import { getBoundsData, roundToInt } from "$lib/utilities/helpers.js";
	import {
		assignIDsToFeatures,
		getPointsInsideAndOutsidePolygon,
	} from "$lib/components/Map/utils/index.js";
	import { cityBounds } from "$lib/components/Map/objects/cityBounds.js";

	let hoveredHexagonId = null;

	const zoomToHexSize = {
		18: .05,
		17: .05,
		16: .1,
		15: .1,
		14: .2,
		13: .3,
		12: .5,
		11: .8,
		10: 1,
		9: 1.5,
		8: 2,
		7: 3,
		6: 10,
		5: 20,
		4: 50,
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
						[ 1, "#ffec64" ],
						[ 2, "#c6ca59" ],
						[ 3, "#8ea94e" ],
						[ 4, "#558842" ],
						[ 5, "#006837" ],
					],
				},
				"fill-opacity": [
					"case",
					[ "boolean", [ "feature-state", "hover" ], false ],
					.8,
					.5,
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

	// todo: on moveend redraw grid
	$: updateHexagonGrid($ratingsReference);
</script>
