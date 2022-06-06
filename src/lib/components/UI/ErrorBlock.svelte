<script>
	import { json, _ } from "svelte-i18n";

	export let errorType = "unrecognizedError";
	export let handleErrorAction = () => {};
</script>

{#if errorType}
	<div class="rounded-lg bg-bg_danger py-3 px-8 text-txt_danger text-center leading-5">
		{#if errorType === "verificationLetter"}
			<span class="block text-center">
				{$_("errors.errorVerification")}
			</span>
			<button
				class="underline"
				on:click|preventDefault={handleErrorAction}
			>
				{$_("errors.errorVerificationBtn")}
			</button>
		{:else}
			{$json("errors")[errorType]}
		{/if}
	</div>
{/if}
