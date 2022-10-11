<script>
	import { _ } from "svelte-i18n";

	import { logError } from "$lib/utilities/helpers.js";

	let customClass = "";
	export { customClass as class };
	export let text = "";
	export let label = "";

	let justCopied = false;

	const copyText = () => {
		try {
			navigator.clipboard.writeText(text);
			justCopied = true;
			setTimeout(() => { justCopied = false }, 1000);
		} catch (e) {
			logError(e);
		}
	};
</script>

<div class="text-txt_secondary {customClass}">
	<p class="text-sm mb-1">
		{label}
	</p>
	<div class="bg-bg_gray border-bg_gray border rounded-lg p-3 px-6 relative">
		<p>
			{#if justCopied}
				{$_("showRatingPopup.copied")}
			{:else}
				{text}
			{/if}
		</p>

		<button
			class="absolute top-1/2 transform -translate-y-1/2 right-6"
			on:click={copyText}
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_1938_9163)">
					<path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="#9A9AA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M3.33398 9.9987H2.66732C2.3137 9.9987 1.97456 9.85822 1.72451 9.60817C1.47446 9.35813 1.33398 9.01899 1.33398 8.66536V2.66536C1.33398 2.31174 1.47446 1.9726 1.72451 1.72256C1.97456 1.47251 2.3137 1.33203 2.66732 1.33203H8.66732C9.02094 1.33203 9.36008 1.47251 9.61013 1.72256C9.86018 1.9726 10.0007 2.31174 10.0007 2.66536V3.33203" stroke="#9A9AA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</g>
				<defs>
					<clipPath id="clip0_1938_9163">
						<rect width="16" height="16" fill="white"/>
					</clipPath>
				</defs>
			</svg>
		</button>
	</div>
</div>