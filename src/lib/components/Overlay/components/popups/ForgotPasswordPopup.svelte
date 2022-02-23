<script>
	import { _, json } from 'svelte-i18n';

	import Input from '../../../ui-elements/Input.svelte';
	import Spinner from '../../../ui-elements/Spinner.svelte';
	import SecondaryButton from '../../../ui-elements/SecondaryButton.svelte';
	import FormButton from '../../../ui-elements/FormButton.svelte';
	import PopupTitle from './PopupTitle.svelte';

	import {
		openAnotherOverlay,
		debounce,
		showSuccessNotification,
		showSomethingWrongNotification,
		logError,
		getErrorType,
		blurCurrentInput,
	} from "../../../../utilities/helpers.js";
	import { sendResetPass } from "../../../../utilities/api.js";

	export let popupData = {};

	$: isChangePass = popupData.isChangePass;
	$: title = isChangePass ? $_('changePasswordPopup.title') : $_('forgotPasswordPopup.title');
	$: mainBtn = isChangePass ? $_('changePasswordPopup.mainBtn') : $_('forgotPasswordPopup.mainBtn');
	$: errorsObj = $json('errors');

	let isLoading = false;
	let email = '';
	let isEmailValid = true;
	let isError = false;
	let errorType = '';
	let isSpam = null;
	let emailInputRef = null;

	const openRegisterPopup = () => openAnotherOverlay('registerPopup');

	const submit = async () => {
		blurCurrentInput(document);

		isError = false;
		const isValuesNotEmpty = email.length > 0;
		if (!isValuesNotEmpty || !isEmailValid) {
			emailInputRef?.focus();
			isError = true;
			errorType = 'fieldsError';
			return;
		}

		isLoading = true;
		const { error } = await sendResetPass(email);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		showSuccessNotification();
		openAnotherOverlay('confirmForgotPasswordPopup');
	};

	const debouncedSubmit = debounce(() => {
		if (isSpam) {
			isError = true;
			errorType = 'manyAttempts';
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
	<PopupTitle { title } />

	<Input
		autofocus={true}
		title={$_('forgotPasswordPopup.email')}
		type='email'
		id='old-email-restore'
		bind:value={email}
		bind:isInputValid={isEmailValid}
		bind:this={emailInputRef}
	/>

	<div class="relative flex justify-center items-center h-28">
		{#if isLoading}
			<Spinner />
		{/if}
		{#if isError}
            <span class="italic font-bold">
                {errorsObj[errorType]}
            </span>
		{/if}
	</div>

	<div class="flex justify-evenly items-center">
		{#if !isChangePass}
			<SecondaryButton text={$_('forgotPasswordPopup.secondaryBtn')} action={openRegisterPopup} />
		{/if}
		<FormButton text={mainBtn} action={debouncedSubmit} />
	</div>
</form>
