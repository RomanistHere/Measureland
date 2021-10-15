<script>
    import L from 'leaflet';
    // import 'leaflet-draw';
    // can't use original version because of https://github.com/Leaflet/Leaflet.draw/issues/945
    // fixed by adding "var radius";
    import '../../../../external/leaflet.draw.js';
    import 'leaflet-draw/dist/leaflet.draw.css';
    import { locale } from 'svelte-i18n';

    import { mapReference, geocodeServiceReference } from '../../../../../stores/references.js';
    import { appStateStore } from '../../../../../stores/state.js';
    import { roundToFifthDecimal, roundToTen, debounce, showSomethingWrongNotification } from "../../../../utilities/helpers.js";
    import { translateDrawRU } from './drawLocalization.js';

    export let mapClickRefFuntcion;

    const map = $mapReference;

    const drawnItems = new L.FeatureGroup();
    const initStateOfShapes = {
    	"type" : "FeatureCollection",
    	"features" : null,
    };

    let shapesGeoJSON = { ...initStateOfShapes };
    let currentString = null;

    const concatGeoJSON = (g1, g2) => ({
    	"type" : "FeatureCollection",
    	"features": [ ...g1.features, g2 ],
    });

    const handleActions = () => {
    	map.on(L.Draw.Event.EDITED, takeAllShapesToURL);
    	map.on(L.Draw.Event.DELETED, takeAllShapesToURL);

    	// editing ON
    	map.on(L.Draw.Event.DRAWSTART, () => {
    		map.off('click', mapClickRefFuntcion);
    	});

    	map.on(L.Draw.Event.EDITSTART, () => {
    		map.off('click', mapClickRefFuntcion);
    	});

    	map.on(L.Draw.Event.DELETESTART, () => {
    		map.off('click', mapClickRefFuntcion);
    	});

    	// editing OFF
    	map.on(L.Draw.Event.DRAWSTOP, () => {
    		setTimeout(() => { map.on('click', mapClickRefFuntcion) }, 100);
    	});

    	map.on(L.Draw.Event.EDITSTOP, () => {
    		setTimeout(() => { map.on('click', mapClickRefFuntcion) }, 100);
    	});

    	map.on(L.Draw.Event.DELETESTOP, () => {
    		setTimeout(() => { map.on('click', mapClickRefFuntcion) }, 100);
    	});

    	map.on(L.Draw.Event.CREATED, e => {
    		const type = e.layerType;
    		const layer = e.layer;
    		drawnItems.addLayer(layer);
    		const shape = layer.toGeoJSON();

    		if (type === 'circle') {
    			const radius = layer.getRadius();
    			shape.properties.radius = roundToTen(radius);
    		}

    		addToCommongGeoJSON(shape);
    	});
    };

    const takeAllShapesToURL = () => {
    	// reset previous changes
    	appStateStore.update(state => ({ ...state, shades: null }));
    	shapesGeoJSON = { ...initStateOfShapes };
    	// get all drawn items
    	drawnItems.eachLayer(layer => {
    		const shape = layer.toGeoJSON();

    		if (layer instanceof L.Circle) {
    			const radius = layer.getRadius();
    			shape.properties.radius = roundToTen(radius);
    		}

    		addToCommongGeoJSON(shape);
    	});
    };

    const addToCommongGeoJSON = shape => {
    	if (shape.geometry.type !== 'Point') {
    		try {
    			shape.geometry.coordinates[0] = shape.geometry.coordinates[0].map(coordsArr => {
    				const [ lat, lng ] = coordsArr;
    				return [ roundToFifthDecimal(lat), roundToFifthDecimal(lng) ];
    			});
    			delete shape['properties'];
    		} catch (error) {
    			console.warn(error);
    			showSomethingWrongNotification();
    		}
    	}

    	if (shapesGeoJSON['features'] === null)
    		shapesGeoJSON['features'] = [ shape ];
    	else
    		shapesGeoJSON = concatGeoJSON(shapesGeoJSON, shape);

    	const string = JSON.stringify(shapesGeoJSON);
    	const urlString = encodeURIComponent(string);

    	if (urlString.length >= 2000) {
    		console.warn('URL length is too long');
    		showSomethingWrongNotification();
    		return;
    	}

    	currentString = urlString;
    	appStateStore.update(state => ({ ...state, shades: urlString }));
    };

    const initControls = () => {
    	const drawOptions = {
    		position: 'bottomright',
    		draw: {
    			marker: false,
    			circlemarker: false,
    			polyline: false,
    		},
    		edit: {
    			featureGroup: drawnItems,
    		},
    	};
    	map.addLayer(drawnItems);
    	const drawControl = new L.Control.Draw(drawOptions);
    	if ($locale === 'ru')
    		translateDrawRU(L);
    	map.addControl(drawControl);
    };

    initControls();
    handleActions();

    const drawFromURL = shades => {
    	if (!shades || shades === currentString)
    		return;

    	currentString = shades;
    	const string = decodeURIComponent(shades);
    	shapesGeoJSON = JSON.parse(string);

    	L.geoJson(shapesGeoJSON, {
    		pointToLayer: (feature, latlng) => {
    			if (feature.properties.radius) {
    				return new L.Circle(latlng, feature.properties.radius);
    			}
    			return;
    		},
    	}).eachLayer(layer => {
    		layer.addTo(drawnItems);
    	});
    };

    const debDrawFromURL = debounce(shades => drawFromURL(shades), 300);
    $: debDrawFromURL($appStateStore.shades);
</script>

<style global>
    .leaflet-draw-toolbar {
        margin-top: 0px;
    }

    .leaflet-draw-section {
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 0.375rem;
        margin-top: 1rem;
    }

    .leaflet-touch .leaflet-draw-toolbar .leaflet-disabled {
        opacity: .3;
    }

    @supports ((-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))) {
        .leaflet-draw-section {
            backdrop-filter: blur(7px) saturate(180%);
            -webkit-backdrop-filter: blur(7px) saturate(180%);
            background-color: rgba(255, 255, 255, 0.75);
        }
    }
</style>
