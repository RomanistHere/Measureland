<script>
	import { _, locale } from 'svelte-i18n';
	import { onDestroy } from 'svelte';

	import PopupTitle from '../PopupTitle.svelte';
	import Tag from "../../../../ui-elements/Tag.svelte";
	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import VoteButton from '../../../../ui-elements/VoteButton.svelte';
	// import TextButton from '../../../../ui-elements/TextButton.svelte';

	import { getSinglePointOfInterest, reactOnPOI } from "../../../../../utilities/api.js";
	import {
		openAnotherOverlay,
		showSomethingWrongNotification,
		logError,
		closeOverlay,
		centerMap,
	} from "../../../../../utilities/helpers.js";
	import { mapReference, geocodeServiceReference } from "../../../../../../stores/references.js";
	import { appStateStore, isDesktop, userStateStore } from "../../../../../../stores/state.js";

	const map = $mapReference;
	const geocodeService = $geocodeServiceReference;

	export let popupData;

	let likes = 0;
	let dislikes = 0;
	let isLikesDisabled = true;
	let isDislikesDisabled = true;
	let isOwnPOI = false;
	let circle = null;
	let pointID = null;

	$: approximateAdress = $_('showRatingPopup.approximateAddressDefault');
	$: isUserLoggedIn = $userStateStore.userID !== null;

	const endorseRelevant = async () => {
		if (!isUserLoggedIn) {
			closeOverlay('sidebar');
			openAnotherOverlay('loginPopup');
			return;
		}

		if (isLikesDisabled || !pointID)
			return;

		if (isDislikesDisabled) {
			isDislikesDisabled = false;
			dislikes = dislikes - 1;
		}

		likes = likes + 1;
		isLikesDisabled = true;

		const { error } = await reactOnPOI('upvote', pointID);
		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}
	};

	const endorseIrrelevant = async () => {
		if (!isUserLoggedIn) {
			closeOverlay('sidebar');
			openAnotherOverlay('loginPopup');
			return;
		}

		if (isDislikesDisabled || !pointID)
			return;

		if (isLikesDisabled) {
			isLikesDisabled = false;
			likes = likes - 1;
		}

		dislikes = dislikes + 1;
		isDislikesDisabled = true;
	
		const { error } = await reactOnPOI('downvote', pointID);
		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}
	};

	const openCommentsSidebar = () =>
		openAnotherOverlay('commentsSidebar', {});

	const fetchData = async ({ lng, lat }) => {
		geocodeService.reverse().latlng({ lng, lat }).language($locale).run((error, result) => {
			if (error) {
				logError(error);
				return;
			}
			approximateAdress = result.address.LongLabel;
		});

		if (circle)
			map.removeLayer(circle);

		// eslint-disable-next-line no-undef
		circle = L.circle({ lng, lat }, 300, { color: '#007097' });

		circle.addTo(map);
		centerMap(map, lat, lng, $isDesktop);
		const { error, data } = await getSinglePointOfInterest([ lng, lat ]);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return [];
		}
	
		const { properties } = data;
		const { title, description, tags, isYourPOI, isLiked, isDisliked } = properties;

		likes = properties.likes;
		dislikes = properties.dislikes;
		isLikesDisabled = isYourPOI || isLiked;
		isDislikesDisabled = isYourPOI || isDisliked;
		isOwnPOI = isYourPOI;
		pointID = properties.pointID;

		return {
			title,
			description,
			tags,
		};
	};

	$: promise = fetchData(popupData);

	onDestroy(() => {
		map.removeLayer(circle);
		circle = null;
	});
</script>

<div class="max-w-sm w-full">
	{#await promise}
		<Spinner isWithText={true} className="absolute w-full h-full inset-0 z-5" />
	{:then { title, description, tags }}
		<PopupTitle title={title} />

		<p class="my-4 italic text-sm font-bold -md:px-10">
			{$_('showRatingPopup.approximateAddress')}: {approximateAdress}
		</p>
		
		{#if tags.length > 0 || isOwnPOI}
			<div class="flex mt-4 flex-wrap">
				{#if isOwnPOI}
					<Tag key="own" />
				{/if}
				{#each tags as tag}
					<Tag key={tag} />
				{/each}
			</div>
		{/if}

		<p class="my-4">
			{description}
		</p>

		<div class="flex justify-between">
			<VoteButton
				isLike={true}
				isDisabled={isLikesDisabled}
				action={endorseRelevant}
				text="{likes} - {$_('pointOfInterestPopup.relevant')}"
			/>

			<VoteButton
				isLike={false}
				isDisabled={isDislikesDisabled}
				action={endorseIrrelevant}
				text="{dislikes} - {$_('pointOfInterestPopup.irrelevant')}"
			/>
		</div>

<!--		<div>-->
<!--			<a href={"#"} class="underline" on:click|preventDefault={openCommentsSidebar}>{$_('showRatingPopup.comments')}</a>:-->
<!--			<span class="sug-col font-bold text-2xl -md:text-lg">12</span>-->
<!--		</div>-->
	{/await}
</div>

<style>

</style>
