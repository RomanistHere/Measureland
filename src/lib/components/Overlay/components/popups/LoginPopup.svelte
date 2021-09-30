<script>
    import { _, json } from 'svelte-i18n';

    import Input from '../../../Input.svelte';
    import Spinner from '../../../Spinner.svelte';
    import SecondaryButton from '../SecondaryButton.svelte';
    import FormButton from '../FormButton.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import { openAnotherOverlay, debounce, sleep, showSuccessNotification } from "../../../../utilities/helpers.js";
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
        const { error, data } = await reverify(email);
        isLoading = false;

        if (error) {
            console.warn(error);
            isError = true;
            errorType = 'unrecognizedError';

            if (error === 'Email is wrong') {
                errorType = 'noAccount';
            } else if (error === 'Already verified') {
                errorType = 'alreadyVerified';
            }

            return;
        }

        openAnotherOverlay('checkEmailPopup');
    }

    const submit = async () => {
        // TODO: make in more declarative way
        if (document)
            document.activeElement.blur();

        isError = false;
        const isValuesNotEmpty = email.length > 0 && password.length > 0;
        if (!isValuesNotEmpty || !isEmailValid || !isPasswordValid) {
            // TODO: focus needed input
            isError = true;
            errorType = 'fieldsError';
            return;
        }

        isLoading = true;
        const { error, data } = await login(email, password);
        isLoading = false;

        if (error) {
            console.warn(error);
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

            return;
        }

        const { userID, activeRatings, userName, wantMoreRatings } = data;

        userStateStore.update(state => ({
            ...state,
            userID,
            activeRatings,
            userName,
            wantMoreRatings
        }));

        openAnotherOverlay('loggedInPopup');
        showSuccessNotification();
    }

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
            <Spinner className='bg-transparent' />
        {/if}
        {#if isError && errorType === 'verificationLetter'}
            <div class="login__notifications login__notifications-verify">
                <span class="login__notifications-small">{$_('errors.errorVerification')}</span>
                <a href={"#"} class="login__notifications-small" on:click|preventDefault={resendVerificationLetter}>{$_('errors.errorVerificationBtn')}</a>
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

<style>
    .login__notifications {
        display: block;
    }
</style>
