<script>
    import { _, locale } from 'svelte-i18n';

    import { userStateStore } from "../../../../../../stores/state.js";
    import { openAnotherOverlay } from "../../../../../utilities/helpers.js";
    import { reactOnComment } from "../../../../../utilities/api.js";

    export let data;

    let { isYours, isLiked, isDisliked, rating, comment, username, liked, disliked, id } = data;
    let isLikesDisabled = isLiked || isYours;
    let isDislikesDisabled = isDisliked || isYours;

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;

    const likeComment = async () => {
        if (!isUserLoggedIn) {
            openAnotherOverlay('loginPopup');
            return;
        }

        if (isLikesDisabled)
            return;

        if (isDislikesDisabled) {
            isDislikesDisabled = false;
            disliked -= 1;
        }

        liked += 1;
        isLikesDisabled = true;

        const { error, data } = await reactOnComment('like', id);
        if (error) {
            console.warn(error);
            alert('error');
            return;
        }
    }

    const dislikeComment = async () => {
        if (!isUserLoggedIn) {
            openAnotherOverlay('loginPopup');
            return;
        }

        if (isDislikesDisabled)
            return;

        if (isLikesDisabled) {
            isLikesDisabled = false;
            liked -= 1;
        }

        disliked += 1;
        isDislikesDisabled = true;

        const { error, data } = await reactOnComment('dislike', id);
        if (error) {
            console.warn(error);
            alert('error');
            return;
        }
    }
</script>

<li class="comments__item {isYours ? 'comments__item-highlight' : ''}">
    <p class="comments__name rating__title">
        {username}
        <span class="comments__rating">{$_('_.commentConnector')} {rating}</span>
    </p>
    <p class="comments__text">{comment}</p>
    <div class="comments__btns">
        <a href={"#"} class="comment__btn" data-disabled="{isLikesDisabled}" on:click|preventDefault={likeComment}>
            <span class="comment__btn-emoj">👍</span>
            <span class="comment__btn-numb">{liked}</span>
        </a>
        <a href={"#"} class="comment__btn" data-disabled="{isDislikesDisabled}" on:click|preventDefault={dislikeComment}>
            <span class="comment__btn-emoj">👎</span>
            <span class="comment__btn-numb">{disliked}</span>
        </a>
    </div>
</li>
