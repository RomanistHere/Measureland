<script>
    import { onMount } from 'svelte';

    import { appStateStore } from '../../stores/state.js';

    // TODO: check roundToTen OK or need to use roundToFifthDecimal
    import { roundToFifthDecimal } from "../utilities/helpers.js";

    $: if (typeof window !== 'undefined') {
        updateURL($appStateStore);
    };

    const updateURL = ({ center, zoom, filters, isFiltersOn }) => {
        console.log(center, zoom);
    	const [lat, lng] = center;

        const url = new URL(window.location.href);
        url.searchParams.set('lat', roundToFifthDecimal(lat));
    	url.searchParams.set('lng', roundToFifthDecimal(lng));
        url.searchParams.set('zoom', zoom);

    	if (isFiltersOn && filters) {
    		url.searchParams.set('fi', objToString(filters));
    	}

    	window.history.replaceState(null, null, url);
    };

    const updateAppStateFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat');
        const lng = urlParams.get('lng');
        const zoom = urlParams.get('zoom');
        // TODO: other params
        const center = [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ];

        if (lat && lng)
            appStateStore.update(state => ({ ...state, center }));

        if (zoom)
            appStateStore.update(state => ({ ...state, zoom }));
    }

    if (typeof window !== 'undefined') {
        updateAppStateFromURL();
    }
</script>
