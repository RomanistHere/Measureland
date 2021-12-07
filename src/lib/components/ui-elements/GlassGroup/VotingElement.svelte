<script>
    import { onMount, createEventDispatcher } from "svelte";

    import VoteButton from "../VoteButton.svelte";

    import { userStateStore } from "../../../../stores/state.js";
    import {
    	openAnotherOverlay,
    	showSomethingWrongNotification,
    	logError,
    } from "../../../utilities/helpers.js";

    import { voteForTask, checkVotes } from "../../../utilities/api.js";

    export let title = '';
    export let text = '';
    export let link = '';
    export let id = null;

    const dispatch = createEventDispatcher();

    let upvoted = 0;
    let downvoted = 0;
    let isUpvoted = false;
    let isDownvoted = false;
    let isError = false;

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;

    const updateNumbers = () => {
    	dispatch('updateNumbers', {
    		upvoted,
    		downvoted,
    		id,
    	});
    };

    const upvote = async() => {
    	if (!isUserLoggedIn) {
    		openAnotherOverlay('loginPopup');
    		return;
    	}

    	if (isUpvoted)
    		return;

    	if (isDownvoted) {
    		isDownvoted = false;
    		downvoted = downvoted - 1;
    	}

    	upvoted = upvoted + 1;
    	isUpvoted = true;

    	const { error } = await voteForTask('upvote', id);
    	if (error) {
    		isError = true;
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}

    	updateNumbers();
    };

    const downvote = async() => {
    	if (!isUserLoggedIn) {
    		openAnotherOverlay('loginPopup');
    		return;
    	}

    	if (isDownvoted)
    		return;

    	if (isUpvoted) {
    		isUpvoted = false;
    		upvoted = upvoted - 1;
    	}

    	downvoted = downvoted + 1;
    	isDownvoted = true;

    	const { error } = await voteForTask('downvote', id);
    	if (error) {
    		isError = true;
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}

    	updateNumbers();
    };

    onMount(async() => {
    	const { error, data } = await checkVotes(id);
    	if (error) {
    		isError = true;
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}

    	const { info, message } = data;

    	if (message === 'No task with the given ID')
    		return;

    	const { liked, disliked, isLiked, isDisliked } = info;

    	upvoted = liked;
    	downvoted = disliked;
    	isUpvoted = isLiked;
    	isDownvoted = isDisliked;

    	updateNumbers();
    });
</script>

<div class="block p-2">
    {#if link}
        <a href={link} class="link inline-block" target="_blank" rel="noopener">
            {#if title}
                <h4 class="font-bold">{title}</h4>
            {/if}
            {#if text}
                <p>{text}</p>
            {/if}
        </a>
    {:else}
        {#if title}
            <h4 class="font-bold">{title}</h4>
        {/if}
        {#if text}
            <p>{text}</p>
        {/if}
    {/if}

    {#if !isError}
        <div>
            <VoteButton
                isLike={true}
                isDisabled={isUpvoted}
                action={upvote}
                text={upvoted}
            />
            <VoteButton
                isLike={false}
                isDisabled={isDownvoted}
                action={downvote}
                text={downvoted}
            />
        </div>
    {/if}
</div>

<style>
    @media (hover: hover) and (pointer: fine) {
        .link {
            transition: background-color .2s, color .2s;
        }

        .link:hover {
            background-color: var(--active-color);
            color: white;
        }
    }
</style>
