<script>
	import { _, locale } from 'svelte-i18n';

	import VoteButton from "../../../../ui-elements/VoteButton.svelte";
	import SmallButton from "../../../../ui-elements/SmallButton.svelte";

	import { userStateStore } from "../../../../../../stores/state.js";
	import {
		closeOverlay,
		logError,
		registerAction,
		openAnotherOverlay,
		showSomethingWrongNotification,
	} from "../../../../../utilities/helpers.js";
	import { reactOnComment, reactOnCommentPOI } from "../../../../../utilities/api.js";
	import { translateText } from "../../../../../utilities/externalApi.js";

	export let type;
	export let data;

	const { isYours, isLiked, isDisliked, rating, comment, username, id } = data;
	let { liked, disliked } = data;
	let isLikesDisabled = isLiked || isYours;
	let isDislikesDisabled = isDisliked || isYours;
	let translatedText = null;
	let isTranslated = false;

	const isUserLoggedIn = $userStateStore.userID !== null;
	const reactOnCommentsObj = {
		'POI': reactOnCommentPOI,
		'rating': reactOnComment,
	};
	const react = reactOnCommentsObj[type];

	const likeComment = async () => {
		if (!isUserLoggedIn) {
			closeOverlay('sidebar');
			openAnotherOverlay('loginPopup');
			return;
		}

		if (isLikesDisabled)
			return;

		if (isDislikesDisabled) {
			isDislikesDisabled = false;
			disliked = disliked - 1;
		}

		liked = liked + 1;
		isLikesDisabled = true;

		const { error } = await react('like', id);
		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}
	};

	const dislikeComment = async () => {
		if (!isUserLoggedIn) {
			closeOverlay('sidebar');
			openAnotherOverlay('loginPopup');
			return;
		}

		if (isDislikesDisabled)
			return;

		if (isLikesDisabled) {
			isLikesDisabled = false;
			liked = liked - 1;
		}

		disliked = disliked + 1;
		isDislikesDisabled = true;

		const { error } = await react('dislike', id);
		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}
	};

	const toggleTranslationComment = async () => {
		if (isTranslated) {
			translatedText = null;
			isTranslated = false;
			return;
		}

		const translationResponse = await translateText(comment, 'en-US');

		if (translationResponse.error) {
			logError(translationResponse.error);
			showSomethingWrongNotification();
			return;
		}

		registerAction('translateComment');
		translatedText = translationResponse.data.translation.text;
		isTranslated = true;
	};
</script>

<li
	class="mt-4 px-8"
	class:isYours
>
	<p class="font-bold">
		{username}
		{#if isYours}
			({$_('_.user')})
		{/if}
		{#if type === 'rating'}
			<span class="italic opacity-60 text-sm">{$_('_.commentConnector')} {rating}</span>
		{/if}
	</p>

	<p class="my-2">{translatedText || comment}</p>

	{#if $locale === 'en'}
		<SmallButton
			on:click={toggleTranslationComment}
			text={isTranslated ? 'Show original' : 'Translate to English'}
		/>
	{/if}

	<div>
		<VoteButton
			isLike={true}
			isDisabled={isLikesDisabled}
			action={likeComment}
			text={liked}
		/>
		<VoteButton
			isLike={false}
			isDisabled={isDislikesDisabled}
			action={dislikeComment}
			text={disliked}
		/>

	</div>
</li>

<style>
	.isYours {
		position: relative;
	}

	.isYours::after {
		content: '';
		position: absolute;

		left: 0;
		top: 0;
		bottom: 0;
		width: .5rem;

		background-color: var(--active-color);
	}
</style>
