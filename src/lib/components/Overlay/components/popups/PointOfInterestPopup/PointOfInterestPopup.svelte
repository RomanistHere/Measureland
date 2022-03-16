<script>
	import { _, locale } from 'svelte-i18n';
	import { onDestroy } from 'svelte';

	import PopupTitle from '../PopupTitle.svelte';
	import Tag from "../../../../ui-elements/Tag.svelte";
	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import VoteButton from '../../../../ui-elements/VoteButton.svelte';
	import TextButton from '../../../../ui-elements/TextButton.svelte';

	import { getSinglePointOfInterest, reactOnPOI } from "../../../../../utilities/api.js";
	import {
		openAnotherOverlay,
		showSomethingWrongNotification,
		logError,
		closeOverlay,
		centerMap,
		registerAction,
	} from "../../../../../utilities/helpers.js";
	import { getApproximateAddressAndCountry } from '../../../../../utilities/externalApi.js';
	import { mapReference } from "../../../../../../stores/references.js";
	import { isDesktop, overlayStateStore, userStateStore } from "../../../../../../stores/state.js";

	const map = $mapReference;

	export let popupData = {};

	let likes = 0;
	let dislikes = 0;
	let numberOfComments = 0;
	let isLikesDisabled = true;
	let isDislikesDisabled = true;
	let isOwnPOI = false;
	let circle = null;
	let pointID = null;
	let currentCoords = { lat: 0, lng: 0 };

	$: approximateAdress = $_('showRatingPopup.approximateAddressDefault');
	$: isUserLoggedIn = $userStateStore.userID !== null;
	$: promise = null;

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

		registerAction('endorsePOI');
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

		registerAction('reportPOI');
	};
	
	const openCommentsSidebar = () =>
		openAnotherOverlay('commentsSidebar', { id: pointID, type: 'POI' });
	
	const checkCommentsRelevanceAndOpen = () => {
		if (!$overlayStateStore.commentsSidebar.isOpen)
			openCommentsSidebar();
	};
	
	const openAddCommentPopup = () =>
		openAnotherOverlay('addCommentPOIPopup', { pointID });

	const fetchData = async ({ lng, lat }) => {
		const { address } = await getApproximateAddressAndCountry(lat, lng, $locale);
		approximateAdress = address;

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
		const { title, description, tags, isYourPOI, isLiked, isDisliked, comments } = properties;

		likes = properties.likes;
		dislikes = properties.dislikes;
		isLikesDisabled = isYourPOI || isLiked;
		isDislikesDisabled = isYourPOI || isDisliked;
		isOwnPOI = isYourPOI;
		pointID = properties.pointID;
		numberOfComments = comments;
	
		// update comments if they opened
		if ($overlayStateStore.commentsSidebar.isOpen && $overlayStateStore.commentsSidebar.data.id !== pointID)
			openCommentsSidebar();

		return {
			title,
			description,
			tags,
		};
	};

	// need to check in order not to do unnecessary requests.
	$: if (currentCoords.lat !== popupData.lat && currentCoords.lng !== popupData.lng) {
		promise = fetchData(popupData);
		currentCoords = { ...popupData };
	}

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

		<div class="flex justify-between items-end mt-4">
			<div>
				<TextButton
					text={$_('showRatingPopup.comments')}
					action={checkCommentsRelevanceAndOpen}
					isDisabled={numberOfComments === 0}
				/>:
				<span class="sug-col font-bold leading-3 text-2xl -md:text-lg">
					{numberOfComments}
				</span>
			</div>
			
			<TextButton
				text="{$_('pointOfInterestPopup.addCommentBtn')} 💬"
				action={openAddCommentPopup}
			/>
		</div>
	{/await}
</div>
