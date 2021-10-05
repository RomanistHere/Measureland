<script>
    import { _ } from 'svelte-i18n';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    import MarkerCluster from './components/MarkerCluster.svelte';
    import GeoSearch from './components/GeoSearch.svelte';
    import TextLink from '../ui-elements/TextLink.svelte';

    import { appStateStore } from "../../../stores/state.js";
    import { mapReference } from "../../../stores/references.js";
    import { openAnotherOverlay } from '../../utilities/helpers.js';
    import { appInfo } from '../../../configs/index.js';

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
    <div use:mapAction class="w-full h-full">
        {#if map}
            <MarkerCluster />
            <GeoSearch />
        {/if}
        <!-- // drawing component -->
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

    div {
        /* height: calc(100% - var(--navbar-height)); */
        /* top: var(--navbar-height); */
    }

    :global(.leaflet-top) {
        top: calc(1rem + var(--navbar-height))
    }

    :global(.leaflet-left .leaflet-control) {
        margin-left: 1rem;
    }

    :global(.leaflet-top .leaflet-control) {
        margin-top: 1rem;
    }

    :global(.leaflet-right .leaflet-control) {
        margin-right: 1rem;
    }

    :global(.leaflet-bottom .leaflet-control) {
        margin-bottom: 1rem;
    }

    :global(.leaflet-container .leaflet-control-attribution) {
        margin: 0;
    }

    :global(.leaflet-container) {
        z-index: 1;
    }

    :global(.geocoder-control .geocoder-control-input),
    :global(.leaflet-control-zoom) {
        background-color: var(--side-bg-color);
        border: 1px solid var(--text-color);
        box-shadow: 0 0 1px var(--text-color);
    }

    :global(.leaflet-touch .leaflet-bar a) {
        background-color: transparent;
    }

    :global(.leaflet-touch .leaflet-draw-toolbar a),
    :global(.leaflet-touch .leaflet-control-layers),
    :global(.leaflet-touch .leaflet-bar) {
        border-color: var(--text-color);
        border-width: 1px;
    }

    :global(.leaflet-touch .leaflet-draw-toolbar .leaflet-disabled) {
        background-color: var(--bg-color-add-non-transparent);
    }

    :global(.leaflet-touch .geocoder-control-suggestion) {
        background-color: var(--bg-color-add-non-transparent);
    }

    :global(.leaflet-touch .geocoder-control-suggestion:hover) {
        background-color: var(--side-bg-color);
        border-color: var(--side-bg-color);
    }

    @supports ((-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))) {
        :global(.geocoder-control .geocoder-control-input),
        :global(.leaflet-control-zoom) {
            background-color: var(--side-bg-color);
            border: 1px solid var(--text-color);
            backdrop-filter: blur(7px) saturate(180%);
            -webkit-backdrop-filter: blur(7px) saturate(180%);
            background-color: rgba(255, 255, 255, 0.75);
            border: 1px solid var(--text-color);
            box-shadow: 0 0 1px var(--text-color);
        }
    }

    @media screen and (max-width: 1023px) {
        :global(.leaflet-top) {
            top: 0
        }
    }
</style>
