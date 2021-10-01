<script>
    export let rating;

    $: rating = Math.round(rating);

    const character = String.fromCharCode('0xE900');
    const possibleRatingsArr = [5, 4, 3, 2, 1];
</script>

<div class="flex-row-reverse inline-flex">
    {#each possibleRatingsArr as number}
        <span
            class="leading-none text-2xl ml-1"
            class:active={rating === number}
        >{character}</span>
    {/each}
</div>

<style>
    span {
        font-family: 'star__icon';
        color: var(--non-active-color);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .active,
    .active ~ span {
        color: var(--active-color);
    }
</style>
