<script>
	import Tooltip from "./Tooltip.svelte";

	export let title = "";
	export let description = null;

	let customClass = "";
	export { customClass as class };
</script>

<button
    on:click
    class="flex items-center border-2 border-bg_darker bg-bg_darker rounded-lg w-full text-white text-left px-4 py-2 leading-5 transition-colors hover:border-main {customClass}"
    class:justify-between={description}
    class:justify-center={!description}
>
    {title}
    {#if description}
        <Tooltip {description} />
    {/if}
</button>
