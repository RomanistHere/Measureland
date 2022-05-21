<script>
	import Cross from "../inline-images/Cross.svelte";

	import { closeOverlay } from "../../utilities/helpers.js";
	import { isDesktop } from "../../../stores/state.js";

	let customClass = "";
	export { customClass as class };
	export let overlayType = null;

	let isActive = false;

	const close = () => {
		isActive = true;
		closeOverlay(overlayType);
	};
</script>

<button
	class="absolute top-7 right-6 p-3 rounded-full bg-stroke hoverable-link {customClass}"
	on:click={close}
	on:focus={() => { isActive = true }}
	on:blur={() => { isActive = false }}
>
	<Cross {isActive} />
	{#if $isDesktop}
		<span class="absolute left-1/2 -bottom-4 transform -translate-x-1/2 text-xs">esc</span>
	{/if}
</button>
