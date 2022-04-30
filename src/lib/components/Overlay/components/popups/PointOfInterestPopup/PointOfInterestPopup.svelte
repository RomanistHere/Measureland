<script>
	import { _, locale } from 'svelte-i18n';
	import { onDestroy } from 'svelte';

	import PopupTitle from '../PopupTitle.svelte';
	import Tag from "../../../../ui-elements/Tag.svelte";
	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import VoteButton from '../../../../ui-elements/VoteButton.svelte';
	import TextButton from '../../../../ui-elements/TextButton.svelte';
	import SmallButton from '../../../../ui-elements/SmallButton.svelte';

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
	import { translateText } from "../../../../../utilities/serverToExternalApi.js";
	import { mapReference, leafletReference } from "../../../../../../stores/references.js";
	import { appStateStore, isDesktop, overlayStateStore, userStateStore } from "../../../../../../stores/state.js";

	const map = $mapReference;
	const L = $leafletReference;

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
	// translation
	let titleGlob = null;
	let titleGlobTranslated = null;
	let descriptionGlob = null;
	let descriptionGlobTranslated = null;
	let isTranslated = false;

	$: approximateAdress = $_('showRatingPopup.approximateAddressDefault');
	$: isUserLoggedIn = $userStateStore.userID !== null;
	$: promise = null;

	const translatePOI = async () => {
		if (isTranslated) {
			titleGlobTranslated = null;
			descriptionGlobTranslated = null;
			isTranslated = false;
			return;
		}

		const { data, error } = await translateText([ titleGlob, descriptionGlob ], 'en-US');

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		registerAction('translatePOI');
		titleGlobTranslated = data.translation[0].text;
		descriptionGlobTranslated = data.translation[1].text;
		isTranslated = true;
	};

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

		openAnotherOverlay('reportReasonDialog', { id: pointID, type: 'POI' });
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

		circle = L.circle({ lng, lat }, 300, { color: '#007097' });

		circle.addTo(map);
		centerMap(map, lat, lng, $isDesktop);
		const { error, data } = await getSinglePointOfInterest([ lng, lat ]);

		if (error) {
			closeOverlay('popup');
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

		appStateStore.update(state => ({ ...state, showPOI: [ lat, lng ] }));
	
		// update comments if they opened
		if ($overlayStateStore.commentsSidebar.isOpen && $overlayStateStore.commentsSidebar.data.id !== pointID)
			openCommentsSidebar();

		titleGlob = title;
		descriptionGlob = description;

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
		appStateStore.update(state => ({ ...state, showPOI: false }));
		map.removeLayer(circle);
		circle = null;
	});
</script>

<div class="max-w-sm w-full">
	{#await promise}
		<Spinner isWithText={true} className="absolute w-full h-full inset-0 z-5" />
	{:then { title, description, tags }}
		<PopupTitle title={titleGlobTranslated || title} />

		<p class="my-4 italic text-sm font-bold">
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
			{descriptionGlobTranslated || description}
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

		{#if $locale === 'en'}
			<div class="mt-4">
				<SmallButton
					text={isTranslated ? 'Show original' : 'Translate to English'}
					on:click={translatePOI}
				/>
			</div>
		{/if}
	{/await}
</div>
