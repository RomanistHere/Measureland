<script>
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";

	import { mapReference, poiReference } from "../../../../stores/references.js";
	import {
		debounce,
		getBoundsData,
		getScreenData,
		getMapZoom,
		logError,
		openAnotherOverlay,
		showSomethingWrongNotification,
		truncateString,
		pipe,
		roundToHundredth,
	} from "$lib/utilities/helpers.js";
	import { fetchStories } from "$lib/utilities/api.js";
	import { appStateStore, poisStore, mapLoadingProgress } from "../../../../stores/state.js";

	const map = $mapReference;

	let hoveredStoryId = null;

	const truncateStringToTwenty = str =>
		truncateString(str, 20);

	// const prepareTitle = pipe(
	// 	prepareStringToNotBreak,
	// 	truncateStringToTwenty,
	// );
	// let currentCenter = [ 0, 0 ];

	const initPointOfInterestPopup = latlng =>
		openAnotherOverlay("", latlng);

	const loadStories = async () => {
		const { error, data } = await fetchStories();

		if (error === "Too many requests, please try again later") {
			appStateStore.update(state => ({ ...state, shouldWork: false }));
			showSomethingWrongNotification();
			return;
		} else if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		const { result } = data;

		displayData(result);
	};

	const debouncedLoading = debounce(loadStories, 300);

	// don't use native "moveend" event, it triggers on every button click in popups
	map.on("move", debouncedLoading);
	onMount(debouncedLoading);

	const imagesToLoad = {
		"story-marker": "../images/map/story.png",
	};

	let loadedImages = {};

	const loadImages = (urls, callback) => {
		const makeCallback = name =>
			(err, image) => {
				loadedImages = {
					...loadedImages,
					[name]: err ? null : image,
				};

				// if all images are loaded, call the callback
				if (Object.keys(loadedImages).length === Object.keys(urls).length) {
					callback(loadedImages);
				}
			};

		if (Object.keys(loadedImages).length === Object.keys(urls).length) {
			callback(loadedImages);
			return;
		}

		for (const name in urls) {
			map.loadImage(urls[name], makeCallback(name));
		}
	};

	const preparePOIsJson = markerData => ({
		"type": "FeatureCollection",
		"features": markerData.map(({ location, title, slug }) => ({
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": location.coordinates,
			},
			"properties": {
				"image-name": "story-marker",
				"name": truncateStringToTwenty(title),
				title,
				slug,
			},
		})),
	});

	const displayData = storiesData => {
		if (!storiesData || storiesData.length === 0)
			return;

		loadImages(imagesToLoad, imagesResp => {
			const storiesJson = preparePOIsJson(storiesData);

			if (map.getSource("stories")) {
				return;
			}

			map.addImage("story-marker", imagesResp["story-marker"], {
				"pixelRatio": 2,
			});

			map.addSource("stories", {
				"type": "geojson",
				"data": storiesJson,
				"generateId": true,
			});

			// Add a symbol layer
			map.addLayer({
				"id": "stories-layer",
				"type": "symbol",
				"source": "stories",
				"layout": {
					"icon-image": "story-marker",
					"icon-size": 3,
				},
			});

			map.on("mousemove", "stories-layer", e => {
				e.originalEvent.preventDefault();
				map.getCanvas().style.cursor = "pointer";
				if (e.features.length > 0) {
					if (hoveredStoryId) {
						map.setFeatureState({
							source: "POIs",
							id: hoveredStoryId,
						}, {
							hover: false,
						});
					}
					// console.log(e.features[0]);
					hoveredStoryId = e.features[0].id;

					map.setFeatureState({
						source: "POIs",
						id: hoveredStoryId,
					}, {
						hover: true,
					});
				}
			});

			map.on("mouseleave", "stories-layer", () => {
				map.getCanvas().style.cursor = "";

				if (hoveredStoryId !== null) {
					map.setFeatureState({
						source: "POIs",
						id: hoveredStoryId,
					}, {
						hover: false,
					});
				}

				hoveredStoryId = null;
			});

			map.on("click", "stories-layer", e => {
				openAnotherOverlay("storyModal", {
					storySlug: e.features[0].properties.slug,
					title: e.features[0].properties.title,
					lngLat: e.lngLat,
				});
			});

			try {
				map.moveLayer("stories-layer", "communities-layer");
			} catch (e) {
				logError("Error in layers priority change");
				logError(e);
			}
			mapLoadingProgress.update(state => ({ ...state, stories: true }));
		});
	};
</script>
