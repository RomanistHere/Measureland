<script>
    import { locale } from 'svelte-i18n';

    import { userStateStore } from "../../../../../../stores/state.js";
    import { openAnotherOverlay } from "../../../../../utilities/helpers.js";

    export let data;

    const { isYours, isLiked, isDisliked, rating, comment, username, liked, disliked, id } = data;

    const isUserLoggedIn = $userStateStore.userID === null ? false : true;

    // TODO: like/dislike comments
    const likeComment = () => {
        if (!isUserLoggedIn) {
            openAnotherOverlay('loginPopup');
            return;
        }
    }

    const dislikeComment = () => {
        if (!isUserLoggedIn) {
            openAnotherOverlay('loginPopup');
            return;
        }
    }
</script>

<li class="comments__item {isYours ? 'comments__item-highlight' : ''}">
    <p class="comments__name rating__title">
        {username}
        <span class="comments__rating">{$locale === 'en' ? 'gave' : 'поставил/а'} {rating}</span>
    </p>
    <p class="comments__text">{comment}</p>
    <div class="comments__btns">
        <a href={"#"} class="comment__btn" data-goal="like" data-key="{id}" data-disabled="{isLiked || isYours}" on:click|preventDefault={likeComment}>
            <span class="comment__btn-emoj">👍</span>
            <span class="comment__btn-numb">{liked}</span>
        </a>
        <a href={"#"} class="comment__btn" data-goal="dislike" data-key="{id}" data-disabled="{isDisliked || isYours}" on:click|preventDefault={dislikeComment}>
            <span class="comment__btn-emoj">👎</span>
            <span class="comment__btn-numb">{disliked}</span>
        </a>
    </div>
</li>
