<script>
    import { browser } from '$app/env';
    import { onMount, onDestroy } from 'svelte';
    import { _, json } from 'svelte-i18n';

    import Spinner from '../../../ui-elements/Spinner.svelte';
    import Select from '../../../ui-elements/Select.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import { getNearbyPointData } from "../../../../utilities/api.js";
    import { mapReference, markersReference } from "../../../../../stores/references.js";
    import { isDesktop } from "../../../../../stores/state.js";
    import {
    	roundToTen,
    	openAnotherOverlay,
    	centerMap,
    	showSomethingWrongNotification,
    	registerAction,
    	logError,
    } from '../../../../utilities/helpers.js';

    export let popupData;

    let circle = null;
    let averageNearbyRating = null;
    let isLoading = true;
    let isData = true;

    const map = $mapReference;

    $: ratingsGood = [];
    $: ratingsBad = [];
    $: radiusOptions = [{
    	value: 800,
    	zoomLevel: 15,
    	text: '800 м',
    	selected: true,
    }, {
    	value: 1200,
    	zoomLevel: 14,
    	text: '1.2 км',
    	selected: false,
    }, {
    	value: 2000,
    	zoomLevel: 14,
    	text: '2 км',
    	selected: false,
    }, {
    	value: 10000,
    	zoomLevel: 12,
    	text: '10 км (размеры города)',
    	selected: false,
    }];

    const generateSmartReport = ratings => {
    	const length = ratings.length;

    	let highestRating = {
    		key: null,
    		value: 1,
    		numberOfUsers: 0,
    	};

    	let secondHighestRating = {
    		key: null,
    		value: 1,
    		numberOfUsers: 0,
    	};

    	let thirdHighestRating = {
    		key: null,
    		value: 1,
    		numberOfUsers: 0,
    	};

    	let lowestRating = {
    		key: null,
    		value: 5,
    		numberOfUsers: 0,
    	};

    	let secondLowestRating = {
    		key: null,
    		value: 5,
    		numberOfUsers: 0,
    	};

    	let thirdLowestRating = {
    		key: null,
    		value: 5,
    		numberOfUsers: 0,
    	};

    	for (let i = 0; i < length; i++) {
    		const { rating, reported } = ratings[i];
    		if (reported.length > 0)
    			continue;

    		for (const [ key, value ] of Object.entries(rating)) {
    			if (value > highestRating.value) {
    				highestRating = {
    					key,
    					value,
    					numberOfUsers: 1,
    				};
    			} else if (value === highestRating.value && key === highestRating.key) {
    				highestRating = {
    					...highestRating,
    					numberOfUsers: highestRating.numberOfUsers + 1,
    				};
    			} else if (value > secondHighestRating.value) {
    				secondHighestRating = {
    					key,
    					value,
    					numberOfUsers: 1,
    				};
    			} else if (value === secondHighestRating.value && key === secondHighestRating.key) {
    				secondHighestRating = {
    					...secondHighestRating,
    					numberOfUsers: secondHighestRating.numberOfUsers + 1,
    				};
    			} else if (value > thirdHighestRating.value) {
    				thirdHighestRating = {
    					key,
    					value,
    					numberOfUsers: 1,
    				};
    			} else if (value === thirdHighestRating.value && key === thirdHighestRating.key) {
    				thirdHighestRating = {
    					...thirdHighestRating,
    					numberOfUsers: thirdHighestRating.numberOfUsers + 1,
    				};
    			}

    			if (value > thirdLowestRating.value)
    				continue;

    			if (value < lowestRating.value) {
    				lowestRating = {
    					key,
    					value,
    					numberOfUsers: 1,
    				};
    			} else if (value === lowestRating.value && key === lowestRating.key) {
    				lowestRating = {
    					...lowestRating,
    					numberOfUsers: lowestRating.numberOfUsers + 1,
    				};
    			} else if (value < secondLowestRating.value) {
    				secondLowestRating = {
    					key,
    					value,
    					numberOfUsers: 1,
    				};
    			} else if (value === secondLowestRating.value && key === secondLowestRating.key) {
    				secondLowestRating = {
    					...secondLowestRating,
    					numberOfUsers: secondLowestRating.numberOfUsers + 1,
    				};
    			} else if (value < thirdLowestRating.value) {
    				thirdLowestRating = {
    					key,
    					value,
    					numberOfUsers: 1,
    				};
    			} else if (value === thirdLowestRating.value && key === thirdLowestRating.key) {
    				thirdLowestRating = {
    					...thirdLowestRating,
    					numberOfUsers: thirdLowestRating.numberOfUsers + 1,
    				};
    			}
    		}
    	}

    	const bestRatings = [
    		highestRating,
    		secondHighestRating,
    		thirdHighestRating,
    	];

    	const worstRatings = [
    		lowestRating,
    		secondLowestRating,
    		thirdLowestRating,
    	];

    	return {
    		bestRatings,
    		worstRatings,
    	};
    };

    const loadData = async({ lat, lng }, radiusParam = null) => {
    	const clusterLayer = $markersReference;
    	const radius = radiusParam || radiusOptions[0]['value'];

    	// eslint-disable-next-line no-undef
    	const squareBounds = L.latLng(lat, lng).toBounds(radius * 2);
    	// eslint-disable-next-line no-undef
    	const bounds = L.rectangle(squareBounds).getBounds();
    	const bbox = [ bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth() ];
    	const clusters = clusterLayer.getClusters(bbox, 20);

    	if (!clusters || clusters.length === 1) {
    		// TODO: show "no ratings nearby"
    		averageNearbyRating = null;
    		isData = false;
    		isLoading = false;
    		return;
    	}

    	const average = clusters.reduce((a, b) => a + b.properties.averageRating, 0) / clusters.length;
    	averageNearbyRating = roundToTen(average);

    	if (radius >= 5000) {
    		return;
    	}

    	isLoading = true;
    	const { data, error } = await getNearbyPointData([ lat, lng ], radius);
    	isLoading = false;
    	isData = true;

    	if (error) {
    		logError(error);
    		isData = false;
    		showSomethingWrongNotification();
    	}

    	const { ratings } = data;
    	const { bestRatings, worstRatings } = generateSmartReport(ratings);

    	ratingsGood = bestRatings.map(({ key, value, numberOfUsers }) => ({
    		title: $_(`criteria.${key}.title`),
    		numberOfUsers,
    		value,
    	}));

    	ratingsBad = worstRatings.map(({ key, value, numberOfUsers }) => ({
    		title: $_(`criteria.${key}.title`),
    		numberOfUsers,
    		value,
    	}));
    };

    const removeCircle = () => {
    	map.removeLayer(circle);
    	circle = null;
    };

    const drawCircle = ({ lat, lng }, radius = null) => {
    	const { zoomLevel } = radiusOptions.find(({ selected }) => selected === true);
    	// eslint-disable-next-line no-undef
    	circle = L.circle({ lng, lat }, radius || radiusOptions[0]['value'], { color: '#007097' });

    	circle.addTo(map);
    	centerMap(map, lat, lng, $isDesktop, false, zoomLevel);
    };

    const handleSelect = event => {
    	const newValue = Number(event.target.value);
    	radiusOptions.forEach(item => {
    		if (item.value === newValue) {
    			item.selected = true;
    		} else {
    			item.selected = false;
    		}
    	});

    	removeCircle();
    	drawCircle(popupData, newValue);
    	loadData(popupData, newValue);
    };

    onMount(() => {
    	drawCircle(popupData);
    	loadData(popupData);
    });

    onDestroy(removeCircle);
</script>

<div class="max-w-sm w-full">
    <PopupTitle title='Оценки поблизости' />

    <Select
        title='Выбери радиус, в котором ты хочешь увидеть оценки'
        id='radius-select'
        options={radiusOptions}
        className='mb-8'
        on:change={handleSelect}
    />

    {#if averageNearbyRating}
        <p>
            Средний рейтинг: {averageNearbyRating}
        </p>
    {:else}
        Других данных поблизости нет
    {/if}

    {#if isLoading}
        <Spinner
            className='absolute'
        />
    {:else if isData}
        <strong class="text-bold my-4">Некоторые лучшние рейтинги поблизости</strong>
        <ul class="my-2">
            {#each ratingsGood as { title, numberOfUsers, value }}
                <li>
                    {numberOfUsers}
                    человек оценили
                    {title}
                    на
                    {value}
                </li>
            {/each}
        </ul>

        <strong class="text-bold my-4">Некоторые хучшие рейтинги поблизости</strong>
        <ul class="my-2">
            {#each ratingsBad as { title, numberOfUsers, value }}
                <li>
                    {numberOfUsers}
                    человек оценили
                    {title}
                    на
                    {value}
                </li>
            {/each}
        </ul>
    {:else}
        
    {/if}
</div>
