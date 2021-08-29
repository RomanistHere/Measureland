<script>
    import ToolTip from '../../../ToolTip.svelte';
    import ShowRatingPopupStars from './ShowRatingPopupStars.svelte';

    export let title;
    export let tooltip;
    export let side = 'top';
</script>

<li class="rating__stars rating__item">
    <h2 class="rating__title title rating__item_text">
        { title }
        <ToolTip { tooltip } { side } />
    </h2>
    <ShowRatingPopupStars />
</li>

<style>
    .rating__title {
        width: 100%;
        margin: 25px 0 0;

        font-size: 100%;
        color: var(--sug-color);
    }

    .rating__stars {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .rating__item {
        display: flex;

        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;

        margin: 0;
        padding: 0;
    }

    .rating__item-hide {
        display: none;
    }

    .rating__item_text {
        margin: 0;
        font-weight: normal;
    }
</style>
