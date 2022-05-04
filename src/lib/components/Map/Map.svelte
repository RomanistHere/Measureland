<script>
	import { _ } from 'svelte-i18n';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import '/static/styles/map.css';

	import PointsOfInterest from './components/PointsOfInterest.svelte';
	import MarkerCluster from './components/MarkerCluster.svelte';
	import GeoSearch from './components/GeoSearch.svelte';
	import Draw from './components/Draw/Draw.svelte';
	import TextLink from '../ui-elements/TextLink.svelte';

	import { appStateStore } from "../../../stores/state.js";
	import { mapReference, leafletReference } from "../../../stores/references.js";
	import { openAnotherOverlay, debounce } from '../../utilities/helpers.js';
	import { appInfo } from '../../../configs/index.js';
	import { militaryConflictCountries } from './objects/militaryConflictCountries.js';

	let map;

	const onMapClick = (e, isWar) =>
		openAnotherOverlay('onMapClickDialog', { coords: e.latlng, isWar });

	const createMap = node => {
		const { zoom, center } = $appStateStore;

		const mapObj = L.map(node, {
			center: center || [ 53.8, 27.5 ],
			minZoom: 4,
			maxZoom: 18,
			zoom: zoom || 7,
			preferCanvas: true,
			worldCopyJump: true,
			bounceAtZoomLimits: false,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: [ 'a', 'b', 'c' ],
		}).addTo(mapObj);

		const conflictAreas = L.geoJson(militaryConflictCountries, {
			style: {
				stroke: false,
				fill: false,
			},
		}).addTo(mapObj);

		conflictAreas.eachLayer(layer => {
			layer.on('click', e => {
				mapObj.off('click', onMapClick);
				onMapClick(e, true);
				// without debounce click will propagate and fire the second time
				debouncedAssign();
			});
		});

		mapObj.zoomControl.setPosition('bottomleft');

		const debouncedAssign = debounce(() => { mapObj.on('click', onMapClick) }, 350);
		mapObj.on('click', onMapClick);
		mapObj.on('zoomstart', () => { mapObj.off('click', onMapClick) });
		mapObj.on('zoomend', debouncedAssign);

		return mapObj;
	};

	const mapAction = wrap => {
		map = createMap(wrap);
		mapReference.set(map);
		leafletReference.set(L);
		return {
			destroy: () => {
				map.remove();
			},
		};
	};
</script>

{#if $appStateStore.shouldWork}
	<div use:mapAction class="w-full h-full">
		{#if map}
			<MarkerCluster />
			<PointsOfInterest />
			<GeoSearch />
			<Draw mapClickRefFuntcion={onMapClick} />
		{/if}
	</div>
{:else}
	<section class="fixed inset-0 z-5 flex justify-center items-center">
		<p class="error_text px-4">
			{$_('errors.limitError.textBeforeLink')}
			<TextLink
				text={$_('errors.limitError.textFirstLink')}
				href="blog/how-to-become-citizen/"
			/>
			{$_('errors.limitError.textBetweenLinks')}
			<TextLink
				text={$_('errors.limitError.textSecondLink')}
				href="mailto:{appInfo.supportEmail}"
			/>
			{$_('errors.limitError.textAfterLinks')}
		</p>
	</section>
{/if}

<style>
	section {
		background-color: var(--side-bg-color);
	}

	.error_text {
		width: 30rem;
	}
</style>
