<script>
	import { _ } from "svelte-i18n";

	import Input from "../../../ui-elements/Input.svelte";
	import SubmissionState from "../../../ui-elements/SubmissionState.svelte";
	import SecondaryButton from "../../../ui-elements/SecondaryButton.svelte";
	import FormButton from "../../../ui-elements/FormButton.svelte";
	import PopupTitle from "./PopupTitle.svelte";

	import {
		openAnotherOverlay,
		debounce,
		showSuccessNotification,
		showSomethingWrongNotification,
		registerAction,
		logError,
		getErrorType,
		blurCurrentInput,
	} from "../../../../utilities/helpers.js";
	import { login, reverify } from "../../../../utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";

	let email = "";
	let password = "";
	let isEmailValid = true;
	let isPasswordValid = true;
	let isError = false;
	let errorType = "";
	let isLoading = false;
	let isSpam = null;
	let emailInputRef = null;
	let passInputRef = null;

	const openRegisterPopup = () =>
		openAnotherOverlay("registerPopup");

	const openForgotPasswordPopup = () =>
		openAnotherOverlay("forgotPasswordPopup", { isChangePass: false });

	const resendVerificationLetter = async () => {
		isError = false;
		if (!isEmailValid || email.length === 0) {
			emailInputRef?.focus();
			isError = true;
			errorType = "fieldsError";
			return;
		}

		isLoading = true;
		const { error } = await reverify(email);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		openAnotherOverlay("checkEmailPopup");
	};

	const submit = async () => {
		blurCurrentInput(document);

		registerAction("trySubmitLogin");
		isError = false;
		const isValuesNotEmpty = email.length > 0 && password.length > 0;
		if (!isValuesNotEmpty || !isEmailValid || !isPasswordValid) {
			isError = true;
			errorType = "fieldsError";

			if (!isEmailValid || email.length === 0)
				emailInputRef?.focus();
			else if (!isPasswordValid || password.length === 0)
				passInputRef?.focus();

			return;
		}

		registerAction("submitLogin");
		isLoading = true;
		const { error, data } = await login(email, password);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		const { userID, activeRatings, userName, wantMoreRatings } = data;

		userStateStore.update(state => ({
			...state,
			userID,
			activeRatings,
			userName,
			wantMoreRatings,
		}));

		registerAction("successLogin");
		openAnotherOverlay("loggedInPopup");
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
	<PopupTitle title={$_("loginPopup.title")} />

	<Input
		autofocus={true}
		title={$_("loginPopup.email")}
		type='email'
		id='current-email'
		maxlength={256}
		bind:value={email}
		bind:isInputValid={isEmailValid}
		bind:this={emailInputRef}
	/>

	<Input
		title={$_("loginPopup.password")}
		type='password'
		id='current-password'
		maxlength={512}
		bind:value={password}
		bind:isInputValid={isPasswordValid}
		bind:this={passInputRef}
	/>

	<SubmissionState
		{ isLoading }
		{ errorType }
		onVerificationLetterAction={resendVerificationLetter}
	/>

	<div class="flex justify-evenly items-center">
		<SecondaryButton text={$_("loginPopup.forgotPasswordBtn")} action={openForgotPasswordPopup} />
		<FormButton text={$_("loginPopup.loginBtn")} action={debouncedSubmit} />
	</div>
	<a href={"#"} class="underline block text-center p-2 my-2 mx-auto w-60" on:click|preventDefault={openRegisterPopup}>
		{$_("loginPopup.registerBtn")}
	</a>
</form>
