<script>
	import { _ } from "svelte-i18n";
	import { fade, fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import Input from "$lib/components/UI/Input.svelte";
	import ErrorBlock from "$lib/components/UI/ErrorBlock.svelte";
	import TextButton from "$lib/components/UI/TextButton.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import PrimaryButton from "$lib/components/UI/PrimaryButton.svelte";
	import AdditionalAuthButtons from "$lib/components/UI/AdditionalAuthButtons.svelte";

	import {
		openAnotherOverlay,
		debounce,
		showSuccessNotification,
		showSomethingWrongNotification,
		registerAction,
		logError,
		getErrorType,
		blurCurrentInput,
		closeOverlay,
	} from "../../../../utilities/helpers.js";
	import { login, reverify } from "../../../../utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";

	let email = "";
	let password = "";
	let isEmailValid = true;
	let isPasswordValid = true;
	let isError = false;
	let errorType = null;
	let isLoading = false;
	let isSpam = null;
	let emailInputRef = null;
	let passInputRef = null;

	const openRegisterModal = e => {
		e.preventDefault();
		isEmailValid = true;
		openAnotherOverlay("registrationModal");
	};

	const openForgotPasswordPopup = () =>
		openAnotherOverlay("forgotPasswordPopup", { isChangePass: false });

	const closeModal = e => {
		if (e.target !== e.currentTarget)
			return;

		closeOverlay("modal");
	};

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

<div
	class="fixed z-10 inset-0 backdrop-blur-sm"
	on:click={closeModal}
	in:fade="{{ duration: 500 }}"
	out:fade="{{ duration: 500 }}"
>
	<form
		class="max-w-sm w-96 absolute absolute-centered bg-white p-4 rounded-3xl font-medium"
		on:submit|preventDefault={debouncedSubmit}
		use:focusTrap
		in:fly="{{ y: 50, duration: 500 }}"
		out:fade="{{ duration: 500 }}"
	>
		<h2 class="text-5xl mb-6 tracking-tighter mt-4">
			{$_("loginPopup.title")}
		</h2>

		{#if errorType}
			<ErrorBlock { errorType } />
		{/if}

		<Input
			autofocus={true}
			title={$_("loginPopup.email")}
			type="email"
			id="current-email"
			placeholder="ivan_ivanovich@mail.ru"
			maxlength={64}
			bind:value={email}
			bind:isInputValid={isEmailValid}
			bind:this={emailInputRef}
		/>

		<Input
			title={$_("loginPopup.password")}
			type="password"
			id="current-password"
			placeholder="*******"
			maxlength={128}
			bind:value={password}
			bind:isInputValid={isPasswordValid}
			bind:this={passInputRef}
		/>

		<div class="text-right mt-1">
			<TextButton
				text={$_("loginPopup.forgotPasswordBtn")}
				on:click={openForgotPasswordPopup}
				class="py-1"
			/>
		</div>

		<PrimaryButton
			text={$_("loginPopup.loginBtn")}
			class="w-full mt-4 py-3"
			on:click={debouncedSubmit}
		/>

		<div class="text-right mt-1 mb-3">
			<TextButton
				text="У меня нет аккаунта"
				on:click={openRegisterModal}
				class="py-1"
			/>
		</div>

		<AdditionalAuthButtons isRegistration={false} />

		<CloseButton
			overlayType="modal"
			class="top-2 right-2"
		/>

	<!--	<SubmissionState-->
	<!--		{ isLoading }-->
	<!--		{ errorType }-->
	<!--		onVerificationLetterAction={resendVerificationLetter}-->
	<!--	/>-->
	</form>
</div>
