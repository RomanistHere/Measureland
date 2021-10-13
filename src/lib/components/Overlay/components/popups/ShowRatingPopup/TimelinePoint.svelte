<script>
    import { fly } from 'svelte/transition';
    import { json, _ } from 'svelte-i18n';

    import { fetchSingleRating } from '../../../../../utilities/api.js';
    import TextButton from '../../../../ui-elements/TextButton.svelte';

    export let averageRating;
    export let timeline;
    export let _id;
    export let isActive = false;

    $: ratings = null;

    let showTooltip = false;
    let tooltipTimeout = null;
    let isPersExp = false;

    const handleTimeClick = async () => {
        if (!ratings) {
            const { error, data } = await fetchSingleRating(_id);

            if (error) {
                console.log(error)
                return;
            }

            const { ratingData } = data;
            const { rating, isPersonalExperience } = ratingData;
            ratings = Object.entries(rating).map(([ key, value ]) => ({ ...$json('criteria')[key], rating: value }));
            isPersExp = isPersonalExperience;
            showTooltip = true;
        }
    }

    const handleMouseleave = () => {
        tooltipTimeout = setTimeout(() => { showTooltip = false }, 100);
    }

    const handleMouseenter = () => {
        clearTimeout(tooltipTimeout);
        showTooltip = true;
    }
</script>

<a
    href={"#"}
    class="rounded-md px-2 py-0.5 text-sm mb-1 block relative block z-5"
    class:active={isActive}
    on:mouseenter={handleMouseenter}
    on:mouseleave={handleMouseleave}
    on:click|preventDefault={handleTimeClick}
>
    {timeline}

    {#if showTooltip}
        <div
            class="info__tooltip text-sm w-80 absolute z-1 p-2 rounded-md font-normal glassmorphism cursor-default"
            in:fly="{{ y: 10, duration: 200 }}"
            out:fly="{{ y: -10, duration: 200 }}"
        >
            {#if ratings}
                <span class="font-bold">
                    {#if isPersExp}
                        {$_('timelinePoint.personalExp')}
                    {:else}
                        {$_('timelinePoint.alienExp')}
                    {/if}
                    {$_('timelinePoint.average')}:
                    {averageRating}
                </span>
                {#each ratings as { title, rating }}
                    <div class="my-2">
                        {title}:
                        <span class="font-bold text-base">{rating}</span>
                    </div>
                {/each}

                <TextButton
                    text={$_('timelinePoint.report')}
                    className='px-1 font-bold'
                />

                <TextButton
                    text={$_('timelinePoint.endorse')}
                    className='px-1 font-bold'
                />
            {:else}
                {$_('timelinePoint.clickToExpand', { values: [averageRating] })}
            {/if}
        </div>
    {/if}
</a>

<style>
    a {
        background-color: #fcd9f6;
        transition: background-color .5s, color .5s;
    }

    .active,
    a:hover {
        background-color: var(--active-color);
        color: var(--side-bg-color);
    }

    .active {
        cursor: default;
    }

    .info__tooltip {
        color: var(--text-color);

        bottom: 160%;
        left: -8.5rem;
    }

    .info__tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--text-color) transparent transparent transparent;
    }
</style>
