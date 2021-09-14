<script>
    import Tooltip from '../../../../Tooltip.svelte';

    export let title;
    export let tooltip;
    export let caption;
    export let key;
</script>

<div class="rating__stars">
    <h2 class="rating__title title">
        {title}
        <Tooltip { tooltip } />
    </h2>
    <div class="star-wrapper">
        <a href="#" class="setRating star s1" data-rating="5"></a>
        <a href="#" class="setRating star s2" data-rating="4"></a>
        <a href="#" class="setRating star s3" data-rating="3"></a>
        <a href="#" class="setRating star s4" data-rating="2"></a>
        <a href="#" class="setRating star s5" data-rating="1"></a>
    </div>
    <span class="rating__caption">{caption}</span>
</div>
