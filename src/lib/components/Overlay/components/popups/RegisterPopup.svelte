<script>
    import { _, json, locale } from 'svelte-i18n';

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
    } from "../../../../utilities/helpers.js";
    import { register } from "../../../../utilities/api.js";

    $: errorsObj = $json('errors');

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

    const openLoginPopup = () => openAnotherOverlay('loginPopup');

    const submit = async() => {
    	// TODO: make in more declarative way
    	if (document)
    		document.activeElement.blur();

    	registerAction('trySubmitRegister');
    	isError = false;
    	shouldShowMatchError = false;
    	const isValuesNotEmpty = email.length > 0 && password.length > 0 && passwordConfirm.length > 0;
    	if (!isValuesNotEmpty || !isEmailValid || !isPasswordValid || !isPasswordConfirmValid) {
    		// TODO: focus needed input
    		isError = true;
    		errorType = 'fieldsError';

    		return;
    	} else if (password !== passwordConfirm) {
    		// TODO: focus needed input
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
    		console.warn(error);
    		isError = true;
    		errorType = 'unrecognizedError';

    		if (error === 'Email already exists') {
    			errorType = 'accountExists';
    		} else if (error === 'Too many requests, please try again later') {
    			errorType = 'manyRequests';
    		}

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
        bind:value={email}
        bind:isInputValid={isEmailValid}
    />

    <Input
        title={$_('registrationPopup.password')}
        type='password'
        id='new-password'
        bind:value={password}
        bind:isInputValid={isPasswordValid}
        bind:shouldShowMatchError={shouldShowMatchError}
    />

    <Input
        title={$_('registrationPopup.repeatPassword')}
        type='password'
        id='repeat-new-password'
        bind:value={passwordConfirm}
        bind:isInputValid={isPasswordConfirmValid}
        bind:shouldShowMatchError={shouldShowMatchError}
    />

    <div class="relative flex justify-center items-center h-28">
        {#if isLoading}
            <Spinner />
        {/if}
        {#if isError}
            <span class="italic font-bold sug-color">
                {errorsObj[errorType]}
            </span>
        {/if}
    </div>

    <div class="flex justify-evenly items-center">
        <SecondaryButton text={$_('registrationPopup.goToLoginBtn')} action={openLoginPopup} />
        <FormButton text={$_('registrationPopup.registerBtn')} action={debouncedSubmit} />
    </div>
</form>
