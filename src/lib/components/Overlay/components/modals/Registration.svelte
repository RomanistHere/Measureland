<script>
	import { _, locale } from "svelte-i18n";
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
	} from "../../../../utilities/helpers.js";
	import { register } from "../../../../utilities/api.js";

	let email = "";
	let password = "";
	let isEmailValid = true;
	let isPasswordValid = true;
	let isError = false;
	let errorType = "";
	let isLoading = false;
	let isSpam = null;
	let shouldShowMatchError = false;
	let emailInputRef = null;
	let passInputRef = null;

	const openLoginPopup = () => openAnotherOverlay("loginPopup");

	const submit = async () => {
		blurCurrentInput(document);

		registerAction("trySubmitRegister");
		isError = false;
		shouldShowMatchError = false;
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

		registerAction("submitRegister");
		isLoading = true;
		const { error } = await register(email, password, $locale);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		registerAction("successRegister");
		openAnotherOverlay("checkEmailPopup");
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

<form
	class="max-w-sm w-96 absolute absolute-centered z-1 bg-white p-4 rounded-3xl font-medium"
	on:submit|preventDefault={debouncedSubmit}
	use:focusTrap
>
	<h2 class="text-5xl mb-6 tracking-tighter mt-4">
		Регистрация
	</h2>

	{#if errorType}
		<ErrorBlock { errorType } />
	{/if}

	<Input
		autofocus={true}
		title={$_("registrationPopup.email")}
		type='email'
		id='new-email'
		placeholder="ivan_ivanovich@mail.ru"
		maxlength={64}
		bind:value={email}
		bind:isInputValid={isEmailValid}
		bind:this={emailInputRef}
	/>

	<Input
		title={$_("registrationPopup.password")}
		type='password'
		id='new-password'
		placeholder="*******"
		maxlength={128}
		bind:value={password}
		bind:isInputValid={isPasswordValid}
		bind:shouldShowMatchError={shouldShowMatchError}
		bind:this={passInputRef}
	/>

	<PrimaryButton
		text={$_("registrationPopup.registerBtn")}
		class="w-full mt-12 py-3"
		on:click={debouncedSubmit}
	/>

	<div class="text-right mt-1 mb-3">
		<TextButton
			text={$_("registrationPopup.goToLoginBtn")}
			on:click={openLoginPopup}
			class="py-1"
		/>
	</div>

	<AdditionalAuthButtons isRegistration={true} />

	<CloseButton
		overlayType="modal"
		class="top-2 right-2"
	/>
</form>
