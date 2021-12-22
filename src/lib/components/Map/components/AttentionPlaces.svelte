<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	import L from 'leaflet';

	import { mapReference } from "../../../../stores/references.js";
	import { openAnotherOverlay } from "$lib/utilities/helpers.js";

	const map = $mapReference;

	const initShowRatingPopup = ({ latlng }) =>
		openAnotherOverlay('attentionPlacesPopup', latlng);

	const icon = L.icon({
		iconUrl: `../images/attention.svg`,
		iconSize: [ 20.5, 54 ],
		iconAnchor: [ 5, 30 ],
	});

	const marker = L.marker([ 53.9037, 27.5528 ], {
		icon,
		title: `Hello`,
		riseOnHover: true,
	}).addTo(map);

	marker.on('click', initShowRatingPopup);
</script>
