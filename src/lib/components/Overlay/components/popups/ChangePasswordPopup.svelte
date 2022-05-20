<script>
	import { _, json } from "svelte-i18n";

	import Input from "../../../ui-elements/Input.svelte";
	import Spinner from "../../../ui-elements/Spinner.svelte";
	import FormButton from "../../../ui-elements/FormButton.svelte";
	import PopupTitle from "./PopupTitle.svelte";

	import {
		openAnotherOverlay,
		debounce,
		showSuccessNotification,
		closeOverlays,
		showSomethingWrongNotification,
		logError,
		getErrorType,
		blurCurrentInput,
	} from "../../../../utilities/helpers.js";
	import { reset } from "../../../../utilities/api.js";

	export let popupData;

	$: errorsObj = $json("errors");

	let password = "";
	let passwordConfirm = "";
	let isPasswordValid = true;
	let isPasswordConfirmValid = true;
	let isError = false;
	let errorType = "";
	let isLoading = false;
	let isSpam = null;
	let shouldShowMatchError = false;
	let passInputRef = null;
	let passSecondInputRef = null;

	const resendLink = () => openAnotherOverlay("forgotPasswordPopup");

	const submit = async () => {
		blurCurrentInput(document);

		isError = false;
		shouldShowMatchError = false;
		const isValuesNotEmpty = password.length > 0 && passwordConfirm.length > 0;
		if (!isValuesNotEmpty || !isPasswordValid || !isPasswordConfirmValid) {
			isError = true;
			errorType = "fieldsError";

			if (!isPasswordValid || password.length === 0)
				passInputRef?.focus();
			else if (!isPasswordConfirmValid || passwordConfirm.length === 0)
				passSecondInputRef?.focus();

			return;
		} else if (password !== passwordConfirm) {
			passSecondInputRef?.focus();
			shouldShowMatchError = true;
			isError = true;
			errorType = "fieldsError";

			return;
		}

		isLoading = true;
		const { error } = await reset(password, popupData);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		closeOverlays();
		showSuccessNotification();
	};

	const debouncedSubmit = debounce(() => {
		if (isSpam) {
			isError = true;
			errorType = "manyAttempts";
			clearTimeout(isSpam);
			isSpam = setTimeout(() => {
				clearTimeout(isSpam);
				isSpam = null;
				isError = false;
			}, 2000);
			return;
		}

		isSpam = setTimeout(() => {
			clearTimeout(isSpam);
			isSpam = null;
		}, 2000);

		submit();
	}, 200);
</script>

<form class="max-w-sm w-full" on:submit|preventDefault={debouncedSubmit}>
	<PopupTitle title={$_("confirmNewPasswordPopup.title")} />

	<Input
		title={$_("confirmNewPasswordPopup.input1Title")}
		type='password'
		id='new-password-reset'
		maxlength={512}
		bind:value={password}
		bind:isInputValid={isPasswordValid}
		bind:shouldShowMatchError={shouldShowMatchError}
		bind:this={passInputRef}
	/>

	<Input
		title={$_("confirmNewPasswordPopup.input2Title")}
		type='password'
		id='repeat-new-password-reset'
		maxlength={512}
		bind:value={passwordConfirm}
		bind:isInputValid={isPasswordConfirmValid}
		bind:shouldShowMatchError={shouldShowMatchError}
		bind:this={passSecondInputRef}
	/>

	<div class="relative flex justify-center items-center h-28">
		{#if isLoading}
			<Spinner />
		{/if}
		{#if isError && errorType === "linkExpired"}
			<div class="italic font-bold">
				<span class="block text-center">{$_("errors.linkExpired")}</span>
				<a
					href={"#"} class="block text-center underline" on:click|preventDefault={resendLink}
				>{$_("errors.linkExpiredLink")}</a>
			</div>
		{:else if isError}
            <span class="italic font-bold">
                {errorsObj[errorType]}
            </span>
		{/if}
	</div>

	<div class="flex justify-evenly items-center">
		<FormButton text={$_("confirmNewPasswordPopup.submitBtn")} action={debouncedSubmit} />
	</div>
</form>
