<script>
    import { onMount } from 'svelte';

    import { appStateStore } from '../../stores/state.js';

    // TODO: check roundToTen OK or need to use roundToFifthDecimal
    import { roundToFifthDecimal } from "../utilities/helpers.js";

    $: if (typeof window !== 'undefined') {
        updateURL($appStateStore);
    };

    const updateURL = ({ center, zoom, filters, isFiltersOn, openModal, showRating }) => {
    	const [lat, lng] = center;

        const url = new URL(window.location.href);
        url.searchParams.set('lat', roundToFifthDecimal(lat));
    	url.searchParams.set('lng', roundToFifthDecimal(lng));
        url.searchParams.set('zoom', zoom);

    	if (isFiltersOn && filters)
    		url.searchParams.set('fi', objToString(filters));

        if (openModal)
            url.searchParams.set('openModal', true);
        else
            url.searchParams.delete('openModal');

        if (showRating)
            url.searchParams.set('showRating', true);
        else
            url.searchParams.delete('showRating');

    	window.history.replaceState(null, null, url);
    };

    const updateAppStateFromURL = () => {
        const url = new URL(window.location.href);
        const lat = url.searchParams.get('lat');
        const lng = url.searchParams.get('lng');
        const zoom = url.searchParams.get('zoom');
        const showRating = url.searchParams.get('showRating');
        // TODO: other params
        const center = [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ];

        if (lat && lng)
            appStateStore.update(state => ({ ...state, center }));

        if (zoom)
            appStateStore.update(state => ({ ...state, zoom }));

        if (showRating)
            appStateStore.update(state => ({ ...state, showRating: true }));

        url.searchParams.delete('openModal');
        window.history.replaceState(null, null, url);
    }

    if (typeof window !== 'undefined') {
        updateAppStateFromURL();
    }
</script>
