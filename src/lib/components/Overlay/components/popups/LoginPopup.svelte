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
    	registerAction,
    	logError,
    } from "../../../../utilities/helpers.js";
    import { login, reverify } from "../../../../utilities/api.js";
    import { userStateStore } from "../../../../../stores/state.js";

    $: errorsObj = $json('errors');

    let email = '';
    let password = '';
    let isEmailValid = true;
    let isPasswordValid = true;
    let isError = false;
    let errorType = '';
    let isLoading = false;
    let isSpam = null;

    const openRegisterPopup = () => openAnotherOverlay('registerPopup');

    const openForgotPasswordPopup = () => openAnotherOverlay('forgotPasswordPopup', { isChangePass: false });

    const resendVerificationLetter = async () => {
    	isError = false;
    	if (!isEmailValid || email.length === 0) {
    		// TODO: focus needed input
    		isError = true;
    		errorType = 'fieldsError';
    		return;
    	}

    	isLoading = true;
    	const { error } = await reverify(email);
    	isLoading = false;

    	if (error) {
    		logError(error);
    		isError = true;
    		errorType = 'unrecognizedError';

    		if (error === 'Email is wrong') {
    			errorType = 'noAccount';
    		} else if (error === 'Already verified') {
    			errorType = 'alreadyVerified';
    		}

    		showSomethingWrongNotification();
    		return;
    	}

    	openAnotherOverlay('checkEmailPopup');
    };

    const submit = async () => {
    	// TODO: make in more declarative way
    	if (document)
    		document.activeElement.blur();

    	registerAction('trySubmitLogin');
    	isError = false;
    	const isValuesNotEmpty = email.length > 0 && password.length > 0;
    	if (!isValuesNotEmpty || !isEmailValid || !isPasswordValid) {
    		// TODO: focus needed input
    		isError = true;
    		errorType = 'fieldsError';
    		return;
    	}

    	registerAction('submitLogin');
    	isLoading = true;
    	const { error, data } = await login(email, password);
    	isLoading = false;

    	if (error) {
    		logError(error);
    		isError = true;
    		errorType = 'unrecognizedError';

    		if (error === 'Email is wrong') {
    			errorType = 'noAccount';
    		} else if (error === 'User is not verified') {
    			errorType = 'verificationLetter';
    		} else if (error === 'Password is wrong') {
    			errorType = 'wrongPassword';
    		} else if (error === 'Too many requests, please try again later') {
    			errorType = 'manyRequests';
    		}

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

    	registerAction('successLogin');
    	openAnotherOverlay('loggedInPopup');
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
    <PopupTitle title={$_('loginPopup.title')} />

    <Input
        autofocus={true}
        title={$_('loginPopup.email')}
        type='email'
        id='current-email'
        bind:value={email}
        bind:isInputValid={isEmailValid}
    />

    <Input
        title={$_('loginPopup.password')}
        type='password'
        id='current-password'
        bind:value={password}
        bind:isInputValid={isPasswordValid}
    />

    <div class="relative flex justify-center items-center h-28">
        {#if isLoading}
            <Spinner />
        {/if}
        {#if isError && errorType === 'verificationLetter'}
            <div class="italic font-bold sug-color">
                <span class="block text-center">{$_('errors.errorVerification')}</span>
                <a href={"#"} class="block text-center underline" on:click|preventDefault={resendVerificationLetter}>{$_('errors.errorVerificationBtn')}</a>
            </div>
        {:else if isError}
            <span class="italic font-bold sug-color">
                {errorsObj[errorType]}
            </span>
        {/if}
    </div>

    <div class="flex justify-evenly items-center">
        <SecondaryButton text={$_('loginPopup.forgotPasswordBtn')} action={openForgotPasswordPopup} />
        <FormButton text={$_('loginPopup.loginBtn')} action={debouncedSubmit} />
    </div>
    <a href={"#"} class="underline block text-center p-2 my-2 mx-auto w-60" on:click|preventDefault={openRegisterPopup}>
        {$_('loginPopup.registerBtn')}
    </a>
</form>
