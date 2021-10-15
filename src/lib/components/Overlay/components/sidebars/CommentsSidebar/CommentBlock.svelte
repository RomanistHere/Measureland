<script>
    import { _ } from 'svelte-i18n';

    import VoteButton from "../../../../ui-elements/VoteButton.svelte";

    import { userStateStore } from "../../../../../../stores/state.js";
    import {
    	openAnotherOverlay,
    	closeOverlay,
    	showSomethingWrongNotification,
    	logError,
    } from "../../../../../utilities/helpers.js";
    import { reactOnComment } from "../../../../../utilities/api.js";

    export let data;

    const { isYours, isLiked, isDisliked, rating, comment, username, id } = data;
    let { liked, disliked } = data;
    let isLikesDisabled = isLiked || isYours;
    let isDislikesDisabled = isDisliked || isYours;

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;

    const likeComment = async() => {
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

    	const { error } = await reactOnComment('like', id);
    	if (error) {
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}
    };

    const dislikeComment = async() => {
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

    	const { error } = await reactOnComment('dislike', id);
    	if (error) {
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}
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
        <span class="italic opacity-60 text-sm">{$_('_.commentConnector')} {rating}</span>
    </p>

    <p class="my-2">{comment}</p>

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
