<script>
	import { onMount, onDestroy } from 'svelte';
	import { _ } from 'svelte-i18n';

	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import Select from '../../../../ui-elements/Select.svelte';
	import TextButton from "../../../../ui-elements/TextButton.svelte";
	import Tag from "../../../../ui-elements/Tag.svelte";
	import PopupTitle from '../PopupTitle.svelte';
	import Badge from './Badge.svelte';

	import { getNearbyPointData } from "../../../../../utilities/api.js";
	import {
		leafletReference,
		mapReference,
		markersReference,
		poiReference,
	} from "../../../../../../stores/references.js";
	import { isDesktop } from "../../../../../../stores/state.js";
	import {
		roundToTen,
		centerMap,
		showSomethingWrongNotification,
		registerAction,
		logError,
		openAnotherOverlay,
	} from '../../../../../utilities/helpers.js';
	import { generateSmartReport } from './generateSmartReport.js';
	import { generateBadges } from './generateBadges.js';

	export let popupData;

	let circle = null;
	let averageNearbyRating = null;
	let numberOfRatings = null;
	let numberOfPOIs = null;
	let isLoading = true;
	let isData = true;

	const map = $mapReference;
	const L = $leafletReference;

	$: pointsOfInterest = [];
	$: ratingsGood = [];
	$: ratingsBad = [];
	$: badges = [];
	$: radiusOptions = [{
		value: 800,
		zoomLevel: 15,
		text: $_('nearbyPopup.selectOption1'),
		selected: true,
	}, {
		value: 1200,
		zoomLevel: 14,
		text: $_('nearbyPopup.selectOption2'),
		selected: false,
	}, {
		value: 2000,
		zoomLevel: 14,
		text: $_('nearbyPopup.selectOption3'),
		selected: false,
	}, {
		value: 10000,
		zoomLevel: 12,
		text: $_('nearbyPopup.selectOption4'),
		selected: false,
	}];

	const loadData = async ({ lat, lng }, radiusParam = null) => {
		const pointsOfInterestLayer = $poiReference;
		const clusterLayer = $markersReference;
		const radius = radiusParam || radiusOptions[0]['value'];

		const squareBounds = L.latLng(lat, lng).toBounds(radius * 2);
		const bounds = L.rectangle(squareBounds).getBounds();
		const bbox = [ bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth() ];
		const clusters = clusterLayer.getClusters(bbox, 20);
		const pointsOfInterestApprox = pointsOfInterestLayer.getClusters(bbox, 20);
		numberOfPOIs = pointsOfInterestApprox.length;

		if (!clusters || clusters.length === 1) {
			averageNearbyRating = null;
			numberOfRatings = null;
			isData = false;
			isLoading = false;
			return;
		}

		const average = clusters.reduce((a, b) => a + b.properties.averageRating, 0) / clusters.length;
		averageNearbyRating = roundToTen(average);
		numberOfRatings = clusters.length;

		if (radius >= 5000) {
			ratingsBad = [];
			ratingsGood = [];
			pointsOfInterest = [];
			badges = [];
			numberOfPOIs = null;
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

		const { ratings, pois } = data;

		if (!pois || ratings.pois === 0) {
			numberOfPOIs = null;
		}

		numberOfPOIs = pois.length;
		pointsOfInterest = pois;

		if (!ratings || ratings.length === 1) {
			averageNearbyRating = null;
			numberOfRatings = null;
			isData = false;
			return;
		}

		const { bestRatings, worstRatings } = generateSmartReport(ratings);

		numberOfRatings = ratings.length;

		ratingsGood = bestRatings.map(({ key, value, numberOfUsers }) => ({
			title: $_(`criteria.${key}.title`),
			numberOfUsers,
			value,
		})).sort((a, b) => b.numberOfUsers - a.numberOfUsers);

		ratingsBad = worstRatings.map(({ key, value, numberOfUsers }) => ({
			title: $_(`criteria.${key}.title`),
			numberOfUsers,
			value,
		})).sort((a, b) => b.numberOfUsers - a.numberOfUsers);

		badges = generateBadges(bestRatings, worstRatings, numberOfRatings);
	};

	const openPOI = ({ coordinates }) => {
		const [ lng, lat ] = coordinates;
		openAnotherOverlay('pointOfInterestPopup', { lat, lng });
	};

	const removeCircle = () => {
		map.removeLayer(circle);
		circle = null;
	};

	const drawCircle = ({ lat, lng }, radius = null) => {
		const { zoomLevel } = radiusOptions.find(({ selected }) => selected === true);
		circle = L.circle({ lng, lat }, radius || radiusOptions[0]['value'], { color: '#007097' });

		circle.addTo(map);
		centerMap(map, lat, lng, $isDesktop, false, zoomLevel);
	};

	const handleSelect = event => {
		const newValue = Number(event.target.value);
		radiusOptions.forEach(item => {
			item.selected = item.value === newValue;
		});

		removeCircle();
		drawCircle(popupData, newValue);
		loadData(popupData, newValue);
		registerAction(`nearbySelect-${newValue}`);
	};

	onMount(() => {
		drawCircle(popupData);
		loadData(popupData);
	});

	onDestroy(removeCircle);
</script>

<div class="max-w-sm w-full">
	<strong class="text-active">
		{#if averageNearbyRating}
			{$_('nearbyPopup.averageRating')}: {averageNearbyRating}.
			{$_('nearbyPopup.numberOfRatings')}: {numberOfRatings}
		{:else}
			{$_('nearbyPopup.noData')}
		{/if}
	</strong>

	<Select
		title={$_('nearbyPopup.selectTitle')}
		id='radius-select'
		options={radiusOptions}
		className='mb-6'
		on:change={handleSelect}
	/>

	{#if isLoading}
		<Spinner
			className='absolute'
		/>
	{:else if isData}
		{#if ratingsGood.length > 0}
			<PopupTitle title={$_('nearbyPopup.secondTitle')} />
			<ul class="my-4">
				{#each ratingsGood as { title, numberOfUsers, value }}
					<li>
						{numberOfUsers}
						{#if numberOfUsers === 1}
							{$_('nearbyPopup.usersRated_single')}
						{:else}
							{$_('nearbyPopup.usersRated_other')}
						{/if}
						<strong class="text-active">
							{title}
						</strong>
						{$_('nearbyPopup.as')}
						<strong class="text-active">
							{value}
						</strong>
					</li>
				{/each}
			</ul>
		{/if}

		{#if ratingsBad.length > 0}
			<PopupTitle title={$_('nearbyPopup.thirdTitle')} />
			<ul class="my-4">
				{#each ratingsBad as { title, numberOfUsers, value }}
					<li>
						{numberOfUsers}
						{#if numberOfUsers === 1}
							{$_('nearbyPopup.usersRated_single')}
						{:else}
							{$_('nearbyPopup.usersRated_other')}
						{/if}
						<strong class="text-active">
							{title}
						</strong>
						{$_('nearbyPopup.as')}
						<strong class="text-active">
							{value}
						</strong>
					</li>
				{/each}
			</ul>
		{/if}

		{#if badges && badges.length > 0}
			<PopupTitle title={$_('nearbyPopup.fourthTitle')} />
			<div class="my-4 flex justify-left flex-wrap">
				{#each badges as { key, isGood }}
					<Badge
						{key}
						{isGood}
					/>
				{/each}
			</div>
		{/if}

		{#if numberOfPOIs > 0}
			<strong class="text-active">
				{$_('nearbyPopup.pointsOfInterest')}: {numberOfPOIs}
			</strong>
			<ul class="my-4">
				{#each pointsOfInterest as { title, location, tags }}
					<li class="list-disc my-2 ml-4">
						<div class="flex">
							<div class="truncate hover:text-white hover:bg-active self-start">
								<TextButton
									text={title}
									action={() => { openPOI(location) }}
									{title}
								/>
							</div>
							<ul class="ml-2 -mb-2 flex flex-wrap">
								{#each tags as tag}
									<Tag key={tag} />
								{/each}
							</ul>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>
