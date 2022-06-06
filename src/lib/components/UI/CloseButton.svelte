<script>
	import Cross from "../inline-images/Cross.svelte";

	import { closeOverlay } from "../../utilities/helpers.js";
	import { isDesktop } from "../../../stores/state.js";

	let customClass = "";
	export { customClass as class };
	export let overlayType = null;

	const close = () =>
		closeOverlay(overlayType);
</script>

<button
	class="absolute top-7 right-6 p-3 rounded-full border border-transparent hover:bg-bg_gray focus:outline-0 focus:border-main active:bg-bg_blue active:border-bg_blue transition-colors {customClass}"
	on:click|preventDefault={close}
>
	<Cross />
	{#if $isDesktop}
		<span class="absolute left-1/2 -bottom-4 transform -translate-x-1/2 text-xs">esc</span>
	{/if}
</button>
