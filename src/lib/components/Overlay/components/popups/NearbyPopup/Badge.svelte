<script>
    import { fly } from 'svelte/transition';
    import { json, _ } from 'svelte-i18n';

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
    };

    const generateBadge = (key, isGood) => {
    	const prop = isGood ? 'good' : 'bad';
    	const data = $json('badges')[prop][key];
    	title = data.title;
    	description = data.description;
    };

    $: generateBadge(key, isGood);
</script>

<span
    class="rounded-md px-2 py-0.5 text-sm mb-2 block relative z-5 mr-1"
    class:alert={!isGood}
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
    span {
        background-color: #bcedb5;
        transition: background-color .5s, color .5s;
    }

    .alert {
        background-color: #ffbaba;
    }

    span:hover {
        background-color: var(--active-color);
        color: var(--side-bg-color);
    }

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
