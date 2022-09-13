<script>
	import { fly } from "svelte/transition";

	export let title = "";
	export let description = null;

	let customClass = "";
	export { customClass as class };

	$: isIconHovered = false;

	const handleMouseenter = e => {
		e.stopPropagation();
		isIconHovered = true;
	};

	const handleMouseleave = () => {
		isIconHovered = false;
	};
</script>

<button
        on:click
        class="relative flex items-center border-2 border-bg_darker bg-bg_darker rounded-lg w-full text-white text-left px-4 py-2 leading-5 transition-colors hover:border-main {customClass}"
        class:justify-between={description}
        class:justify-center={!description}
>
    {title}
    {#if description}
        <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="p-2 box-content -mr-2"
            on:mouseenter={handleMouseenter}
            on:mouseleave={handleMouseleave}
        >
            <g>
                <path d="M8.00004 14.6673C11.6819 14.6673 14.6667 11.6825 14.6667 8.00065C14.6667 4.31875 11.6819 1.33398 8.00004 1.33398C4.31814 1.33398 1.33337 4.31875 1.33337 8.00065C1.33337 11.6825 4.31814 14.6673 8.00004 14.6673Z"
                      stroke={isIconHovered ? "#3877F1" : "#9A9AA7"} class="transition-all" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 5.33398V8.00065" stroke={isIconHovered ? "#3877F1" : "#9A9AA7"} class="transition-all" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M8 10.666H8.00667" stroke={isIconHovered ? "#3877F1" : "#9A9AA7"} class="transition-all" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </g>
        </svg>
    {/if}

    {#if isIconHovered}
        <div
            in:fly="{{ y: 10, duration: 100 }}"
            out:fly="{{ y: 10, duration: 100 }}"
            class="w-60 absolute top-1/2 -right-6 translate-x-full -translate-y-1/2 bg-neutral-600 p-2 rounded-lg"
        >
            {description}
            <div class="absolute w-0 h-0 left-0 top-1/2 -translate-x-full -translate-y-1/2 border-y-transparent border-l-transparent border-r-neutral-600 border-y-8 border-r-8 border-l-0"></div>
        </div>
    {/if}
</button>
