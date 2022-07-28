<script>
	import { closeOverlay } from "../../utilities/helpers.js";
	import { isDesktop } from "../../../stores/state.js";

	let customClass = "";
	export { customClass as class };
	export let overlayType = null;
	export let isWhite = false;

	const close = () =>
		closeOverlay(overlayType);
</script>

<button
	class="absolute top-7 right-6 p-4 rounded-full border border-transparent hover:bg-bg_gray focus:outline-0 focus:border-main active:bg-bg_blue active:border-bg_blue transition-colors {customClass}"
	class:hover:bg-like_bg={isWhite}
	on:click|preventDefault={close}
>
	<span
		class="w-px h-3 block absolute-centered transform rotate-45"
		class:bg-txt_main={!isWhite}
		class:bg-white={isWhite}
	></span>
	<span
		class="w-px h-3 block absolute-centered transform -rotate-45"
		class:bg-txt_main={!isWhite}
		class:bg-white={isWhite}
	></span>
	{#if $isDesktop}
		<span class="absolute left-1/2 -bottom-4 transform -translate-x-1/2 text-xs">esc</span>
	{/if}
</button>
