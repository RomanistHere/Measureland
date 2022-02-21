<script>
	import { _, locale } from 'svelte-i18n';

	import Spinner from '../../../ui-elements/Spinner.svelte';
	import TextButton from '../../../ui-elements/TextButton.svelte';

	import { fetchRatedPlaces, deleteUserRating, deletePOI } from "../../../../utilities/api.js";
	import { getApproximateAddressAndCountry } from "../../../../utilities/externalApi.js";
	import { openAnotherOverlay, showSomethingWrongNotification, logError } from "../../../../utilities/helpers.js";
	import { markerStore, poisToDelete } from "../../../../../stores/state.js";
	import { WEB_DOMAIN } from '../../../../../configs/env.js';

	const openShowRatingsPopup = (lat, lng) =>
		openAnotherOverlay('showRatingsPopup', { lat, lng });

	const editRatingYear = (timeline, ratingID, address) =>
		openAnotherOverlay('changeYearPopup', { timeline, ratingID, address });

	const deleteRating = async ratingID => {
		const { error, data } = await deleteUserRating(ratingID);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		const { message, coords, averageRating } = data;

		if (message === 'Rating deleted') {
			if (averageRating !== null) {
				markerStore.update(state => ({
					...state,
					markersToRemove: [ ...state.markersToRemove, { coords }],
					markersToAdd: [ ...state.markersToAdd, { coords, rating: averageRating }],
				}));
			} else {
				markerStore.update(state => ({
					...state,
					markersToRemove: [ ...state.markersToRemove, { coords }],
				}));
			}
		}

		return null;
	};

	const openPOI = ({ coordinates }) => {
		const [ lng, lat ] = coordinates;
		openAnotherOverlay('pointOfInterestPopup', { lat, lng });
	};

	const removePOI = async id => {
		const { data, error } = await deletePOI(id);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		const { message, coords } = data;

		if (message === 'Point of Interest deleted') {
			poisToDelete.update(state => [ ...state, coords ]);
		}
		return null;
	};

	const fetchData = async () => {
		const { error, data } = await fetchRatedPlaces();

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return [];
		}

		const { places, pois } = data;

		const ratings = await Promise.all(places.map(async ({ location, ratingObj }) => {
			const { ratingID, timeline } = ratingObj;
			const { coordinates } = location;
			const [ lng, lat ] = coordinates;

			const { address } = await getApproximateAddressAndCountry(lat, lng, $locale);

			return ({
				lang: $locale,
				lat,
				lng,
				address: address ? address : $_('myPlacesPopup.defaultAdress'),
				ratingID,
				timeline,
			});
		}));

		return {
			ratings,
			pois,
		};
	};

	const promise = fetchData();
</script>

<div class="max-w-sm w-full">
	{#await promise}
		<Spinner isWithText={true} className="absolute w-full h-full inset-0 z-5" />
	{:then { ratings, pois }}
		<strong class="text-active">
			{$_('myPlacesPopup.title')}
		</strong>

		<ul class="max-h-96 overflow-y-auto mt-2 py-2">
			{#if ratings.length === 0}
				<span>{$_('myPlacesPopup.youHaveNotRated')}</span>
			{:else}
				{#each ratings as { lang, lat, lng, address, ratingID, timeline }}
					<li
						class="relative pr-4 -lg:pr-6 border-y border-transparent hover:border-active"
						class:hidden={ratingID === null}
					>
						<a
							href={"#"}
							title={$_('myPlacesPopup.deleteRating')}
							class="py-1 font-bold no-underline text-2xl delete hidden absolute right-1 top-1/2 transform -translate-y-1/2 -lg:right-2"
							on:click|preventDefault={async () => { ratingID = await deleteRating(ratingID) }}
						>
							x
						</a>
						<TextButton
							href="#"
							action={() => editRatingYear(timeline, ratingID, address)}
							text={timeline}
							className="py-1 font-bold"
						/>
						:
						<TextButton
							href="{WEB_DOMAIN}/{lang}/?zoom=13&srlat={lat}&srlng={lng}"
							action={() => openShowRatingsPopup(lat, lng)}
							text={address}
							className="py-1"
						/>
					</li>
				{/each}
			{/if}
		</ul>

		<strong class="text-active mt-4 block">
			Your points of interest
		</strong>

		<ul class="max-h-96 overflow-y-auto mt-2 py-2">
			{#if pois.length === 0}
				<span>
					You haven't added Point of interest yet :(
				</span>
			{:else}
				{#each pois as { _id, title, location }}
					<li
						class="relative pr-4 py-1 -lg:pr-6 border-y border-transparent hover:border-active"
						class:hidden={_id === null}
					>
						<a
							href={"#"}
							title="Delete Point of interest"
							class="py-1 font-bold no-underline text-2xl delete hidden absolute right-1 top-1/2 transform -translate-y-1/2 -lg:right-2"
							on:click|preventDefault={async () => { _id = await removePOI(_id) }}
						>
							x
						</a>
<!--						todo: add href when POI can be opened from URL-->
<!--						href="{WEB_DOMAIN}/{$locale}/?zoom=13&srlat={location.coordinates[1]}&srlng={location.coordinates[0]}"-->
						<TextButton
							href="#"
							action={() => openPOI(location)}
							text={title}
							className="py-1"
						/>
					</li>
				{/each}
			{/if}
		</ul>
	{/await}
</div>

<style>
	li:hover .hidden {
		display: block;
	}

	.delete {
		color: #ff0000a3;
		transition: color .2s;
	}

	.delete:hover {
		color: #ff0000;
	}

	:global(.delete:hover + a) {
		color: #ff0000;
	}

	@media screen and (max-width: 1023px) {
		li .hidden {
			display: block;
		}
	}
</style>
