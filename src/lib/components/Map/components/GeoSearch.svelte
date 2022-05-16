<script>
	import * as ELG from 'esri-leaflet-geocoder';
	import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
	import { _ } from 'svelte-i18n';

	import { geocodeServiceReference, mapReference } from '../../../../stores/references.js';

	// usage is limited to the domain, good luck using it outside
	const esriApiKey = 'AAPKdec033141fc049a1936e3862bd2fec4ce1WeDmCkYfNW9w7DMLrt7bfPVl8vWPRistJ8w-fEzIg0u4I6uVRL1tIxuqajfw7Q';
	const geocodeService = new ELG.geocodeService({ apikey: esriApiKey });
	const map = $mapReference;

	geocodeServiceReference.set(geocodeService);

	const searchControl = new ELG.geosearch({
		providers: [
			ELG.arcgisOnlineProvider({
				apikey: esriApiKey,
			}),
		],
		placeholder: $_('_.searchPlaceholder'),
		useMapBounds: false,
	}).addTo(map);
</script>
