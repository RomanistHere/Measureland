<script>
    import ShowRatingPopupStars from './ShowRatingPopupStars.svelte';

    export let title;
    export let tooltip;
    export let rating;
    export let side = 'top';
</script>

<li class="rating__stars rating__item">
    <h2 class="rating__title title rating__item_text">
        { title }
    </h2>
    <ShowRatingPopupStars { rating } />
</li>
