<script>
	import { json, _ } from "svelte-i18n";

	let customClass = "";
	export { customClass as class };
	export let errorType = "unrecognizedError";
	export let handleErrorAction = () => {};

	const animate = node =>
		setTimeout(() => { node.classList.add("py-3", "max-h-24", "min-h-[4rem]") }, 50);
</script>

{#if errorType}
	<div
		class="rounded-lg bg-bg_danger px-8 text-txt_danger text-center leading-5 flex justify-center items-center {customClass} max-h-0 min-h-0 overflow-hidden transition-all duration-300"
		use:animate
	>
		{#if errorType === "verificationLetter"}
			<div>
				<span class="block text-center">
					{$_("errors.errorVerification")}
				</span>
				<button
					class="underline"
					on:click|preventDefault={handleErrorAction}
				>
					{$_("errors.errorVerificationBtn")}
				</button>
			</div>
		{:else}
			{$json("errors")[errorType]}
		{/if}
	</div>
{/if}
