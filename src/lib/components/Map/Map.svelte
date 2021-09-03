<script>
    import { setContext } from 'svelte';

    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    import { appStateStore } from "../../../stores/state.js";

    import MarkerCluster from './components/MarkerCluster.svelte';
    import GeoSearch from './components/GeoSearch.svelte';

    setContext('MEASURELAND_MAP', {
		getMap: () => map
	});

    let map;

    const onMapClick = e => {
        console.log(e.latlng);
        // TODO:
    }

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
        return {
            destroy: () => {
                map.remove();
            },
        };
    }
</script>

<div use:mapAction>
    {#if map}
        <MarkerCluster />
        <GeoSearch />
    {/if}
    <!-- // drawing component -->
</div>

<style>
    div {
        height: 100%;
        width: 100%;
    }
</style>
