<script>
	import { _, locale } from "svelte-i18n";
	import { fade, fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import Input from "$lib/components/UI/Input.svelte";
	import ErrorBlock from "$lib/components/UI/ErrorBlock.svelte";
	import TextButton from "$lib/components/UI/TextButton.svelte";
	import LoginTitle from "$lib/components/UI/LoginTitle.svelte";
	import SuccessBlock from "$lib/components/UI/SuccessBlock.svelte";
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
	} from "$lib/utilities/helpers.js";
	import { register } from "$lib/utilities/api.js";

	let email = "";
	let password = "";
	let isEmailValid = true;
	let isPasswordValid = true;
	let isError = false;
	let isSuccess = false;
	let errorType = null;
	let isLoading = false;
	let isSpam = null;
	let emailInputRef = null;
	let passInputRef = null;

	const openLoginPopup = e => {
		e.preventDefault();
		isEmailValid = true;
		openAnotherOverlay("loginModal");
	};

	const closeModal = e => {
		if (e.target !== e.currentTarget)
			return;

		closeOverlay("modal");
	};

	const submit = async () => {
		blurCurrentInput(document);

		registerAction("trySubmitRegister");
		isError = false;
		errorType = null;
		isSuccess = false;
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
		showSuccessNotification();
		isSuccess = true;
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
		class="max-w-sm w-96 absolute absolute-centered z-1 bg-white p-4 rounded-3xl font-medium"
		on:submit|preventDefault={debouncedSubmit}
		use:focusTrap
		in:fly="{{ y: 50, duration: 500 }}"
		out:fade="{{ duration: 500 }}"
	>
		<LoginTitle
			title="Регистрация"
		/>

		{#if isSuccess}
			<SuccessBlock />

			<p class="px-8 text-sm text-center text-txt_secondary mt-3 mb-4 leading-5">
				Нужно перейти по ссылке из почты, <br /> чтобы получить доступ <br /> ко
				<a href={"#"} class="text-main hover:underline focus:underline" on:click|preventDefault={() => {}}>всем возможностям</a>
				Измерии
			</p>
		{:else}
			<ErrorBlock { errorType } />

			<Input
				autofocus={true}
				title={$_("registrationPopup.email")}
				type="email"
				id="new-email"
				placeholder="ivan_ivanovich@mail.ru"
				maxlength={64}
				bind:value={email}
				bind:isInputValid={isEmailValid}
				bind:this={emailInputRef}
			/>

			<Input
				title={$_("registrationPopup.password")}
				type="password"
				id="new-password"
				placeholder="*******"
				maxlength={128}
				bind:value={password}
				bind:isInputValid={isPasswordValid}
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
		{/if}

		<CloseButton
			overlayType="modal"
			class="top-2 right-2"
		/>
	</form>
</div>
