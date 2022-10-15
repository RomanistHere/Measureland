<script>
	import { _ } from "svelte-i18n";
	import mapboxgl from "mapbox-gl";
	import "mapbox-gl/dist/mapbox-gl.css";
	import "/static/styles/mapbox.css";

	import Communities from "./components/Communities.svelte";
	import Countries from "./components/Countries.svelte";
	import Stories from "./components/Stories.svelte";
	import POIs from "./components/POIs.svelte";
	import Data from "./components/Data.svelte";
	import Hexagons from "./components/Hexagons.svelte";
	import Cities from "./components/Cities.svelte";
	import Districts from "./components/Districts.svelte";
	// import Draw from "./components/Draw/Draw.svelte";
	import TextLink from "../ui-elements/TextLink.svelte";

	import { appStateStore } from "../../../stores/state.js";
	import { mapReference, leafletReference } from "../../../stores/references.js";
	import { openAnotherOverlay, debounce } from "../../utilities/helpers.js";
	import { appInfo } from "../../../configs/index.js";

	let map;
	let isMapLoaded = false;

	const onMapClick = e => openAnotherOverlay("onMapClickModal", {
		coords: e.lngLat,
		pageX: e.originalEvent.pageX,
		pageY: e.originalEvent.pageY,
	});

	const createMap = node => {
		const { zoom, center } = $appStateStore;

		const token = "pk.eyJ1Ijoicm9tYW5pc3RoZXJlIiwiYSI6ImNrc3E2cjYyMTA5eXkyeG5xZXpkcTI0dnUifQ.Bm8W-u4ylJZTzs3sNFu91w";
		const mapObj = new mapboxgl.Map({
			accessToken: token,
			container: node,
			center: center.reverse() || [ 53.8, 27.5 ],
			style: "mapbox://styles/romanisthere/cl4vg1sk8002414p6vf8gouz9", // style URL
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

		// const debouncedAssign = debounce(() => { mapObj.on("click", onMapClick) }, 350);
		mapObj.on("contextmenu", onMapClick);
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
		<Data />
		<Countries />
		<Cities />
		<Districts />
		<Hexagons />
		<POIs />
		<Stories />
		<Communities />
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
