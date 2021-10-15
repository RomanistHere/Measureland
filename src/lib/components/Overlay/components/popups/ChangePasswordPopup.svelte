<script>
    import { _, json } from 'svelte-i18n';

    import Input from '../../../ui-elements/Input.svelte';
    import Spinner from '../../../ui-elements/Spinner.svelte';
    import FormButton from '../../../ui-elements/FormButton.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import {
    	openAnotherOverlay,
    	debounce,
    	showSuccessNotification,
    	closeOverlays,
    	showSomethingWrongNotification,
    } from "../../../../utilities/helpers.js";
    import { reset } from "../../../../utilities/api.js";

    export let popupData;

    $: errorsObj = $json('errors');

    let password = '';
    let passwordConfirm = '';
    let isPasswordValid = true;
    let isPasswordConfirmValid = true;
    let isError = false;
    let errorType = '';
    let isLoading = false;
    let isSpam = null;
    let shouldShowMatchError = false;

    const resendLink = () => openAnotherOverlay('forgotPasswordPopup');

    const submit = async() => {
    	// TODO: make in more declarative way
    	if (document)
    		document.activeElement.blur();

    	isError = false;
    	shouldShowMatchError = false;
    	const isValuesNotEmpty = 0 < password.length && 0 < passwordConfirm.length;
    	if (!isValuesNotEmpty || !isPasswordValid || !isPasswordConfirmValid) {
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

    	isLoading = true;
    	const { error } = await reset(password, popupData);
    	isLoading = false;

    	if (error) {
    		console.warn(error);
    		isError = true;
    		errorType = 'unrecognizedError';

    		if ('Matches old password' === error) {
    			errorType = 'samePass';
    		} else if ('Too many requests, please try again later' === error) {
    			errorType = 'manyRequests';
    		} else if ('Password link is invalid or expired' === error) {
    			errorType = 'linkExpired';
    		}

    		showSomethingWrongNotification();
    		return;
    	}

    	closeOverlays();
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
    <PopupTitle title='Password change' />

    <Input
        title='Type new password here'
        type='password'
        id='new-password-reset'
        bind:value={password}
        bind:isInputValid={isPasswordValid}
        bind:shouldShowMatchError={shouldShowMatchError}
    />

    <Input
        title='Repeat the password'
        type='password'
        id='repeat-new-password-reset'
        bind:value={passwordConfirm}
        bind:isInputValid={isPasswordConfirmValid}
        bind:shouldShowMatchError={shouldShowMatchError}
    />

    <div class="relative flex justify-center items-center h-28">
        {#if isLoading}
            <Spinner />
        {/if}
        {#if isError && 'linkExpired' === errorType}
            <div class="italic font-bold sug-color">
                <span class="block text-center">{$_('errors.linkExpired')}</span>
                <a href={"#"} class="block text-center underline" on:click|preventDefault={resendLink}>{$_('errors.linkExpiredLink')}</a>
            </div>
        {:else if isError}
            <span class="italic font-bold sug-color">
                {errorsObj[errorType]}
            </span>
        {/if}
    </div>

    <div class="flex justify-evenly items-center">
        <FormButton text='Change the password' action={debouncedSubmit} />
    </div>
</form>
