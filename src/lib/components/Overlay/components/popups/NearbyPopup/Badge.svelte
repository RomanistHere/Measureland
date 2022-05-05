<script>
    import { fly } from 'svelte/transition';
    import { json } from 'svelte-i18n';

    import { registerAction } from '../../../../../utilities/helpers.js';

    export let key;
    export let isGood;

    let isRatingExpanded = false;
    let tooltipTimeout = null;
    let title = null;
    let description = null;

    const handleMouseleave = () => {
    	tooltipTimeout = setTimeout(() => { isRatingExpanded = false }, 100);
    };

    const handleMouseenter = () => {
    	clearTimeout(tooltipTimeout);
    	isRatingExpanded = true;
    	registerAction('hoverBadge');
    };

    const generateBadge = (keyProp, isGoodCondition) => {
    	const prop = isGoodCondition ? 'good' : 'bad';
    	const data = $json('badges')[prop][keyProp];
    	title = data.title;
    	description = data.description;
    };

    $: generateBadge(key, isGood);
</script>

<span
    class="rounded-md px-2 py-0.5 text-sm mb-2 block relative z-5 mr-1 duration-500 transition-colors bg-good-feeling hover:bg-active hover:text-white"
    class:bg-bad-feeling={!isGood}
    on:mouseenter={handleMouseenter}
    on:mouseleave={handleMouseleave}
>
    {title}

    {#if isRatingExpanded}
        <div
            class="info__tooltip text-sm w-60 absolute z-1 p-2 left-1/2 transform -translate-x-1/2 rounded-md font-normal glassmorphism"
            in:fly="{{ y: 10, duration: 200 }}"
            out:fly="{{ y: -10, duration: 200 }}"
        >
            {description}
        </div>
    {/if}
</span>

<style>
    .info__tooltip {
        color: var(--text-color);

        bottom: 160%;
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
