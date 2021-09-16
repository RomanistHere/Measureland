<script>
    import { _, json, locale } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import Input from '../../../Input.svelte';
    import Spinner from '../../../Spinner.svelte';
    import SecondaryButton from '../SecondaryButton.svelte';
    import FormButton from '../FormButton.svelte';

    import { openAnotherOverlay, debounce, showSuccessNotification, closeOverlays } from "../../../../utilities/helpers.js";
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

    const openLoginPopup = () => openAnotherOverlay('loginPopup');

    const resendLink = () => {
        // TODO: resend link
        console.log('heh')
    }

    const submit = async () => {
        // TODO: make in more declarative way
        if (document)
            document.activeElement.blur();

        isError = false;
        shouldShowMatchError = false;
        const isValuesNotEmpty = password.length > 0 && passwordConfirm.length > 0;
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
        const { error, data } = await reset(password, popupData);
        isLoading = false;

        if (error) {
            console.warn(error);
            isError = true;
            errorType = 'unrecognizedError';

            if (error === 'Matches old password') {
                errorType = 'samePass';
            } else if (error === 'Too many requests, please try again later') {
                errorType = 'manyRequests';
            } else if (error === 'Password link is invalid or expired') {
                errorType = 'linkExpired';
            }

            return;
        }

        closeOverlays();
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

<PopupWrap className='login__wrap login__wrap-reset'>
    <form class="rating__popup rating__popup-active login__popup form" on:submit|preventDefault={debouncedSubmit}>
        <div class="rating__content reset__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">Password change</strong>
            </p>

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

            {#if isLoading}
                <Spinner className='reset__spinner' />
            {/if}

            <div class="reset__notifications_wrap">
                {#if isError && errorType === 'linkExpired'}
                    <div class="reset__notifications">
                        <span class="login__notifications-small">{$_('errors.linkExpired')}</span>
                        <a href={"#"} class="login__notifications-small link" on:click|preventDefault={resendLink}>{$_('errors.linkExpiredLink')}</a>
                    </div>
                {:else if isError}
                    <span class="reset__notifications">
                        {errorsObj[errorType]}
                    </span>
                {/if}
            </div>
        </div>

        <div class="rating__btns btns_wrap">
            <FormButton text='Change the password' className='reset__btn' action={debouncedSubmit} />
        </div>
    </form>
</PopupWrap>

<style>
    .reset__notifications {
        display: block;
    }

    .reset__notifications_wrap {
        align-items: center;
    }
</style>
