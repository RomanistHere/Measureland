<script>
    import { _ } from 'svelte-i18n';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    import MarkerCluster from './components/MarkerCluster.svelte';
    import GeoSearch from './components/GeoSearch.svelte';

    import { appStateStore } from "../../../stores/state.js";
    import { mapReference } from "../../../stores/references.js";
    import { openAnotherOverlay } from '../../utilities/helpers.js'

    let map;

    const onMapClick = e =>
        openAnotherOverlay('quizPopup', e.latlng);

    const createMap = (node) => {
        const { zoom, center } = $appStateStore;

        const map = L.map(node, {
            center: center || [53.8, 27.5],
            minZoom: 4,
            zoom: zoom || 7,
            preferCanvas: true,
            worldCopyJump: true,
            bounceAtZoomLimits: false,
        });

        L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo(map);

        map.zoomControl.setPosition('bottomleft');

        map.on('click', onMapClick);

        return map;
    }

    const mapAction = wrap => {
        map = createMap(wrap);
        mapReference.set(map);
        return {
            destroy: () => {
                map.remove();
            },
        };
    }
</script>

{#if $appStateStore.shouldWork}
    <div use:mapAction class="w-full">
        {#if map}
            <MarkerCluster />
            <GeoSearch />
        {/if}
        <!-- // drawing component -->
    </div>
{:else}
    <div class="limit_error">
        {$_('errors.limitError.textBeforeLink')}
        <a href="blog/how-to-become-citizen/">{$_('errors.limitError.textFirstLink')}</a>
        {$_('errors.limitError.textBetweenLinks')}
        <a href="mailto:support@measureland.org">{$_('errors.limitError.textSecondLink')}</a>
        {$_('errors.limitError.textAfterLinks')}
    </div>
{/if}

<style>
    div {
        height: calc(100% - var(--navbar-height));
        top: var(--navbar-height);
    }

    .limit_error {
        display: block;

        width: 480px;
        height: 200px;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
