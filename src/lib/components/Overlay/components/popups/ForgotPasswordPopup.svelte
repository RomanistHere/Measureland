<script>
    import { _, json } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import Input from '../../../Input.svelte';
    import Spinner from '../../../Spinner.svelte';
    import SecondaryButton from '../SecondaryButton.svelte';
    import FormButton from '../FormButton.svelte';

    import { openAnotherOverlay, debounce, showSuccessNotification } from "../../../../utilities/helpers.js";
    import { sendResetPass } from "../../../../utilities/api.js";

    $: errorsObj = $json('errors');

    let isLoading = false;
    let email = '';
    let isEmailValid = true;
    let isError = false;
    let errorType = '';
    let isSpam = null;

    const openRegisterPopup = () => openAnotherOverlay('registerPopup');

    const submit = async () => {
        // TODO: make in more declarative way
        if (document)
            document.activeElement.blur();

        isError = false;
        const isValuesNotEmpty = email.length > 0;
        if (!isValuesNotEmpty || !isEmailValid) {
            // TODO: focus needed input
            isError = true;
            errorType = 'fieldsError';
            return;
        }

        isLoading = true;
        const { error, data } = await sendResetPass(email);
        isLoading = false;

        console.log(data)

        if (error) {
            console.warn(error);
            isError = true;
            errorType = 'unrecognizedError';

            if (error === 'Email is wrong') {
                errorType = 'noAccount';
            } else if (error === 'Too many requests, please try again later') {
                errorType = 'manyRequests';
            }

            return;
        }

        showSuccessNotification();
        openAnotherOverlay('confirmForgotPasswordPopup');
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

<PopupWrap className='login__wrap-forgot'>
    <form class="rating__popup login__popup rating__popup-active form" on:submit|preventDefault={debouncedSubmit}>
        <div class="rating__content forgot__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">{$_('forgotPasswordPopup.title')}</strong>
            </p>

            <Input
                autofocus={true}
                title={$_('forgotPasswordPopup.email')}
                type='email'
                id='old-email-restore'
                bind:value={email}
                bind:isInputValid={isEmailValid}
            />

            {#if isLoading}
                <Spinner className='login__spinner' />
            {/if}

            <div class="forgot__notifications_wrap">
                {#if isError}
                    <span class="forgot__notifications">
                        {errorsObj[errorType]}
                    </span>
                {/if}
            </div>
        </div>

        <div class="rating__btns btns_wrap">
            <SecondaryButton text={$_('forgotPasswordPopup.secondaryBtn')} className="rating__btn btn-low" action={openRegisterPopup} />
            <FormButton text={$_('forgotPasswordPopup.mainBtn')} action={debouncedSubmit} />
        </div>
    </form>
</PopupWrap>

<style>
    .forgot__notifications_wrap {
        align-items: center;
    }

    .forgot__notifications {
        display: block;
    }
</style>
