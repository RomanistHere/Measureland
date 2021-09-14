<script>
    import { onMount } from 'svelte';

    import { appStateStore, filtersStore } from '../../stores/state.js';
    import { mapReference } from "../../stores/references.js";

    // TODO: check roundToTen OK or need to use roundToFifthDecimal
    import { roundToFifthDecimal, openAnotherOverlay, objToString, fillFiltersFromArrOfStrings } from "../utilities/helpers.js";

    $: if (typeof window !== 'undefined') {
        updateURL($appStateStore, $filtersStore);
    };

    const checkIfMapLoaded = () =>
        $mapReference === null ? false : true;

    const updateURL = ({ center, zoom, openModal, showRating }, { isFiltersOn, filters }) => {
    	const [lat, lng] = center;

        const url = new URL(window.location.href);
        url.searchParams.set('lat', roundToFifthDecimal(lat));
    	url.searchParams.set('lng', roundToFifthDecimal(lng));
        url.searchParams.set('zoom', zoom);

    	if (isFiltersOn && filters)
    		url.searchParams.set('fi', objToString(filters));
        else
            url.searchParams.delete('fi');

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
        const filters = url.searchParams.get('fi');
        const showRating = url.searchParams.get('showRating');
        // TODO: other params
        const center = [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ];

        if (lat && lng)
            appStateStore.update(state => ({ ...state, center }));

        if (zoom)
            appStateStore.update(state => ({ ...state, zoom }));

        if (showRating) {
            // open popup only after map is loaded
            const interval = setInterval(() => {
                const isMapReady = checkIfMapLoaded();

                if (isMapReady) {
                    openAnotherOverlay('showRatingsPopup', { lat, lng });
                    clearInterval(interval);
                }
            }, 60);
        }

        if (filters) {
            const arrOfStrings = filters.split(',');
            fillFiltersFromArrOfStrings(arrOfStrings);
        }

        url.searchParams.delete('openModal');
        window.history.replaceState(null, null, url);
    }

    if (typeof window !== 'undefined') {
        updateAppStateFromURL();
    }
</script>
