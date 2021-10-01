<script>
    import Tooltip from '../../../../../components/Tooltip.svelte';
    import ShowRatingPopupStars from './ShowRatingPopupStars.svelte';

    export let title;
    export let tooltip;
    export let rating;
</script>

<li class="flex items-center justify-between my-3">
    <h2>
        { title }
        <Tooltip { tooltip } />
    </h2>
    <ShowRatingPopupStars { rating } />
</li>

<style>
    h2 {
        font-size: 1.05rem;
    }
</style>
