<script>
    import VoteButton from "../VoteButton.svelte";

    import { userStateStore } from "../../../../stores/state.js";
    import {
    	openAnotherOverlay,
    	showSomethingWrongNotification,
    	logError,
    } from "../../../utilities/helpers.js";

    import { voteForTask } from "../../../utilities/api.js";

    export let title = '';
    export let text = '';
    export let id = null;

    let upvoted = 0;
    let downvoted = 0;
    let isUpvoted = false;
    let isDownvoted = false;

    $: isUserLoggedIn = $userStateStore.userID === null ? false : true;

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
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}
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
    		logError(error);
    		showSomethingWrongNotification();
    		return;
    	}
    };
</script>

<div class="block p-2">
    {#if title}
        <h4 class="font-bold">{title}</h4>
    {/if}
    {#if text}
        <p>{text}</p>
    {/if}

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
</div>
