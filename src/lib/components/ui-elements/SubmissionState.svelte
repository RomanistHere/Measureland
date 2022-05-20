<script>
	import { _, json } from "svelte-i18n";

	import Spinner from "./Spinner.svelte";
	import TextButton from "./TextButton.svelte";

	export let isLoading = false;
	export let errorType = "";
	export let onVerificationLetterAction = () => {};

	$: errorsObj = $json("errors");
</script>

<div class="relative flex justify-center text-center items-center h-28">
	{#if isLoading}
		<Spinner />
	{:else if errorType === "verificationLetter"}
		<div class="italic font-bold">
			<span class="block text-center">{$_("errors.errorVerification")}</span>
			<TextButton
				action={onVerificationLetterAction}
				text={$_("errors.errorVerificationBtn")}
			/>
		</div>
	{:else if errorType.length > 0}
        <span class="italic font-bold">
            {errorsObj[errorType]}
        </span>
	{/if}
</div>
