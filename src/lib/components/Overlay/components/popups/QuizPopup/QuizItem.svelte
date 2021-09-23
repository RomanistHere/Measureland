<script>
    import { createEventDispatcher } from 'svelte';

    import Tooltip from '../../../../Tooltip.svelte';

    export let title;
    export let tooltip;
    export let caption;
    export let rating;
    export let key;

    const dispatch = createEventDispatcher();

    const handleClick = newRating => {
        rating = newRating;
        dispatch('setRating', { rating, key });
    }
</script>

<div class="rating__stars">
    <h2 class="rating__title title">
        {title}
        <Tooltip { tooltip } />
    </h2>
    <div class="star-wrapper">
        <a href={"#"} class="star s1 {rating === 5 ? 'star-active' : ''}" on:click|preventDefault={(e) => { handleClick(5);e.currentTarget.blur(); }}></a>
        <a href={"#"} class="star s2 {rating === 4 ? 'star-active' : ''}" on:click|preventDefault={(e) => { handleClick(4);e.currentTarget.blur(); }}></a>
        <a href={"#"} class="star s3 {rating === 3 ? 'star-active' : ''}" on:click|preventDefault={(e) => { handleClick(3);e.currentTarget.blur(); }}></a>
        <a href={"#"} class="star s4 {rating === 2 ? 'star-active' : ''}" on:click|preventDefault={(e) => { handleClick(2);e.currentTarget.blur(); }}></a>
        <a href={"#"} class="star s5 {rating === 1 ? 'star-active' : ''}" on:click|preventDefault={(e) => { handleClick(1);e.currentTarget.blur(); }}></a>
    </div>
    <span class="rating__caption">{caption}</span>
</div>
