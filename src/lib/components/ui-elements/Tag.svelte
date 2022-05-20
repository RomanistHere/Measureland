<script>
	import { fly } from "svelte/transition";
	import { json } from "svelte-i18n";

	import { registerAction } from "../../utilities/helpers.js";

	export let key = null;
	export let clickable = false;

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
		registerAction("hoverTag");
	};

	const generateBadge = (keyProp, obj) => {
		const data = obj[keyProp];
		title = data.title;
		description = data.description;
		isNeutral = data.isNeutral;
		isGood = data.isGood;
		isBad = data.isBad;
	};

	$: generateBadge(key, $json("tags"));
</script>

<span
	class="rounded-md px-2 py-0.5 text-sm mb-2 block relative z-5 mr-2 transition-colors duration-500 hover:bg-active hover:text-white"
	class:bg-bad-feeling={isBad}
	class:bg-good-feeling={isGood}
	class:bg-neutral-feeling={isNeutral}
	class:cursor-pointer={clickable}
	on:mouseenter={handleMouseenter}
	on:mouseleave={handleMouseleave}
	on:click
>
    {title}

	{#if isExpanded}
        <div
	        class="info__tooltip text-black text-sm w-60 absolute z-1 p-2 left-1/2 transform -translate-x-1/2 rounded-md font-normal glassmorphism pointer-events-none"
	        in:fly="{{ y: 10, duration: 200 }}"
	        out:fly="{{ y: -10, duration: 200 }}"
        >
            {description}
        </div>
    {/if}
</span>

<style>
	.info__tooltip {
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
