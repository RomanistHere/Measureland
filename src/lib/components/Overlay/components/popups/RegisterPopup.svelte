<script>
	import { _, locale } from 'svelte-i18n';

	import Input from '../../../ui-elements/Input.svelte';
	import SubmissionState from '../../../ui-elements/SubmissionState.svelte';
	import SecondaryButton from '../../../ui-elements/SecondaryButton.svelte';
	import FormButton from '../../../ui-elements/FormButton.svelte';
	import PopupTitle from './PopupTitle.svelte';

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

	let email = '';
	let password = '';
	let passwordConfirm = '';
	let isEmailValid = true;
	let isPasswordValid = true;
	let isPasswordConfirmValid = true;
	let isError = false;
	let errorType = '';
	let isLoading = false;
	let isSpam = null;
	let shouldShowMatchError = false;
	let emailInputRef = null;
	let passInputRef = null;
	let passSecondInputRef = null;

	const openLoginPopup = () => openAnotherOverlay('loginPopup');

	const submit = async () => {
		blurCurrentInput(document);

		registerAction('trySubmitRegister');
		isError = false;
		shouldShowMatchError = false;
		const isValuesNotEmpty = email.length > 0 && password.length > 0 && passwordConfirm.length > 0;
		if (!isValuesNotEmpty || !isEmailValid || !isPasswordValid || !isPasswordConfirmValid) {
			isError = true;
			errorType = 'fieldsError';

			if (!isEmailValid || email.length === 0)
				emailInputRef?.focus();
			else if (!isPasswordValid || password.length === 0)
				passInputRef?.focus();
			else if (!isPasswordConfirmValid || passwordConfirm.length === 0)
				passSecondInputRef?.focus();

			return;
		} else if (password !== passwordConfirm) {
			passSecondInputRef?.focus();
			shouldShowMatchError = true;
			isError = true;
			errorType = 'fieldsError';

			return;
		}

		registerAction('submitRegister');
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

		registerAction('successRegister');
		openAnotherOverlay('checkEmailPopup');
		showSuccessNotification();
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
	<PopupTitle title={$_('registrationPopup.title')} />

	<Input
		autofocus={true}
		title={$_('registrationPopup.email')}
		type='email'
		id='new-email'
		maxlength={256}
		bind:value={email}
		bind:isInputValid={isEmailValid}
		bind:this={emailInputRef}
	/>

	<Input
		title={$_('registrationPopup.password')}
		type='password'
		id='new-password'
		maxlength={512}
		bind:value={password}
		bind:isInputValid={isPasswordValid}
		bind:shouldShowMatchError={shouldShowMatchError}
		bind:this={passInputRef}
	/>

	<Input
		title={$_('registrationPopup.repeatPassword')}
		type='password'
		id='repeat-new-password'
		maxlength={512}
		bind:value={passwordConfirm}
		bind:isInputValid={isPasswordConfirmValid}
		bind:shouldShowMatchError={shouldShowMatchError}
		bind:this={passSecondInputRef}
	/>

	<SubmissionState
		{ isLoading }
		{ errorType }
	/>

	<div class="flex justify-evenly items-center">
		<SecondaryButton text={$_('registrationPopup.goToLoginBtn')} action={openLoginPopup} />
		<FormButton text={$_('registrationPopup.registerBtn')} action={debouncedSubmit} />
	</div>
</form>
