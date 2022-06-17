<script>
	import { _ } from "svelte-i18n";
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	// import L from "leaflet";
	// import "leaflet/dist/leaflet.css";
	import "/static/styles/mapbox.css";

	import PointsOfInterest from "./components/PointsOfInterest.svelte";
	import Communities from "./components/Communities.svelte";
	import Countries from "./components/Countries.svelte";
	import Hexagons from "./components/Hexagons.svelte";
	import Data from "./components/Data.svelte";
	import Polygons from "./components/Polygons.svelte";
	import Cities from "./components/Cities.svelte";
	import Draw from "./components/Draw/Draw.svelte";
	import TextLink from "../ui-elements/TextLink.svelte";

	import { appStateStore } from "../../../stores/state.js";
	import { mapReference, leafletReference } from "../../../stores/references.js";
	import { openAnotherOverlay, debounce } from "../../utilities/helpers.js";
	import { appInfo } from "../../../configs/index.js";

	let map;
	let isMapLoaded = false;

	const onMapClick = (e, isWar) =>
		openAnotherOverlay("onMapClickDialog", { coords: e.latlng, isWar });

	const createMap = node => {
		const { zoom, center } = $appStateStore;

		// const mapObj = L.map(node, {
		// 	center: center || [ 53.8, 27.5 ],
		// 	minZoom: 4,
		// 	maxZoom: 18,
		// 	zoom: zoom || 7,
		// 	preferCanvas: true,
		// 	worldCopyJump: true,
		// 	bounceAtZoomLimits: false,
		// });

		const token = "pk.eyJ1Ijoicm9tYW5pc3RoZXJlIiwiYSI6ImNrc3E2cjYyMTA5eXkyeG5xZXpkcTI0dnUifQ.Bm8W-u4ylJZTzs3sNFu91w";
		const mapObj = new mapboxgl.Map({
			accessToken: token,
			container: node,
			center: center.reverse() || [ 27.5, 53.8 ],
			style: "mapbox://styles/romanisthere/cl3vxfje0001w15nvusadxt25", // style URL
			minZoom: 4,
			maxZoom: 18,
			zoom: zoom || 7,
			dragRotate: false,
			logoPosition: "bottom-right",
		});

		mapObj.addControl(new mapboxgl.FullscreenControl({ container: node }), "bottom-right");
		mapObj.addControl(new mapboxgl.NavigationControl(), "bottom-right");

		mapObj.on("load", () => {
			isMapLoaded = true;
		});

		// https://www.mediawiki.org/wiki/Wikimedia_Maps/API
		// https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png?lang=en
		// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
		// L.tileLayer("https://api.mapbox.com/styles/v1/romanisthere/cl3vxfje0001w15nvusadxt25/tiles/256/{z}/{x}/{y}@2x?access_token=", {
		// 	attribution: "© <a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\" rel='noopener'>Mapbox</a> © <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a>",
		// 	subdomains: [ "a", "b", "c" ],
		// }).addTo(mapObj);

		// mapObj.zoomControl.setPosition("topright");

		// const debouncedAssign = debounce(() => { mapObj.on("click", onMapClick) }, 350);
		// mapObj.on("click", onMapClick);
		// mapObj.on("zoomstart", () => { mapObj.off("click", onMapClick) });
		// mapObj.on("zoomend", debouncedAssign);

		return mapObj;
	};

	const mapAction = wrap => {
		map = createMap(wrap);
		mapReference.set(map);

		return {
			destroy: () => {
				map.remove();
			},
		};
	};
</script>

{#if $appStateStore.shouldWork}
	<div use:mapAction class="w-full h-full"></div>

	{#if isMapLoaded}
<!--		<Communities />-->
		<Data />
		<Countries />
		<Cities />
		<Polygons />
<!--		<Hexagons />-->
<!--		<PointsOfInterest />-->
<!--		<Draw mapClickRefFuntcion={onMapClick} />-->
	{/if}
{:else}
	<section class="fixed inset-0 z-5 flex justify-center items-center bg-white">
		<p class="error_text px-4">
			{$_("errors.limitError.textBeforeLink")}
			<TextLink
				text={$_("errors.limitError.textFirstLink")}
				href="blog/how-to-become-citizen/"
			/>
			{$_("errors.limitError.textBetweenLinks")}
			<TextLink
				text={$_("errors.limitError.textSecondLink")}
				href="mailto:{appInfo.supportEmail}"
			/>
			{$_("errors.limitError.textAfterLinks")}
		</p>
	</section>
{/if}

<style>
	.error_text {
		width: 30rem;
	}
</style>
