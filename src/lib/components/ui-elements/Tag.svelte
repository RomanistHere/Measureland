<script>
	import { fly } from 'svelte/transition';
	import { json } from 'svelte-i18n';

	import { registerAction } from '../../utilities/helpers.js';

	export let key;

	let isExpanded = false;
	let isNeutral = true;
	let isGood = false;
	let isBad = false;
	let tooltipTimeout = null;
	let title = null;
	let description = null;

	const handleMouseleave = () => {
		tooltipTimeout = setTimeout(() => { isExpanded = false }, 100);
	};

	const handleMouseenter = () => {
		clearTimeout(tooltipTimeout);
		isExpanded = true;
		registerAction('hoverTag');
	};

	const generateBadge = (keyProp, obj) => {
		const data = obj[keyProp];
		title = data.title;
		description = data.description;
		isNeutral = data.isNeutral;
		isGood = data.isGood;
		isBad = data.isBad;
	};

	$: generateBadge(key, $json('tags'));
</script>

<span
	class="rounded-md px-2 py-0.5 text-sm mb-2 block relative z-5 mr-2"
	class:alert={isBad}
	class:good={isGood}
	class:neutral={isNeutral}
	on:mouseenter={handleMouseenter}
	on:mouseleave={handleMouseleave}
>
    {title}

	{#if isExpanded}
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
		transition: background-color .5s, color .5s;
	}

	.alert {
		background-color: var(--bad-feeling-color);
	}

	.good {
		background-color: var(--good-feeling-color);
	}

	.neutral {
		background-color: var(--neutral-feeling-color);
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
