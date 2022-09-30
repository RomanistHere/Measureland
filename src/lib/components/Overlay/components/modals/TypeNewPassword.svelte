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
		logError,
		getErrorType,
		blurCurrentInput,
		closeOverlay,
	} from "../../../../utilities/helpers.js";
	import { reset, sendResetPass } from "../../../../utilities/api.js";

	export let modalData = {};
	$: console.log(modalData);

	let password = "";
	let isPasswordValid = true;
	let isError = false;
	let errorType = "";
	let isLoading = false;
	let isSuccess = false;
	let isSpam = null;
	let passInputRef = null;

	const closeModal = e => {
		if (e.target !== e.currentTarget)
			return;

		closeOverlay("modal");
	};

	const submit = async () => {
		blurCurrentInput(document);

		isSuccess = false;
		isError = false;
		const isValuesNotEmpty = password.length > 0;
		if (!isValuesNotEmpty || !isPasswordValid) {
			passInputRef?.focus();
			isError = true;
			errorType = "fieldsError";
			return;
		}

		isLoading = true;
		const { error } = await reset(password, modalData);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

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
		<LoginTitle title="Восстановить аккаунт" />

		{#if isSuccess}
			<SuccessBlock
				successType="PasswordChanged"
			/>

			<p class="px-8 text-sm text-center text-txt_secondary mt-3 mb-4 leading-5">
				Теперь ты можешь войти <br />
				используя новый пароль.
			</p>
		{:else}
			{#if errorType}
				<ErrorBlock { errorType } />
			{/if}

			<Input
				autofocus={true}
				title={$_("confirmNewPasswordPopup.input1Title")}
				type='password'
				id='new-password-reset'
				maxlength={64}
				bind:value={password}
				bind:isInputValid={isPasswordValid}
				bind:this={passInputRef}
			/>

			<PrimaryButton
				text="Изменить пароль"
				class="w-full mt-4 py-3 mb-6"
				on:click={debouncedSubmit}
			/>
		{/if}

		<CloseButton
			overlayType="modal"
			class="top-2 right-2"
		/>
	</form>
</div>
