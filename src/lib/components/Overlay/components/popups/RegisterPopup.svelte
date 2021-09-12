<script>
    import { _, json, locale } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import Input from '../../../Input.svelte';
    import Spinner from '../../../Spinner.svelte';

    import { openAnotherOverlay, debounce, showSuccessNotification } from "../../../../utilities/helpers.js";
    import { register } from "../../../../utilities/api.js";

    $: errorsObj = $json('loginErrors');

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

    const submit = async () => {
        // TODO: make in more declarative way
        if (document)
            document.activeElement.blur();

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

        isLoading = true;
        const { error, data } = await register(email, password, $locale);
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

            return;
        }

        openAnotherOverlay('checkEmailPopup');
        showSuccessNotification()
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

<PopupWrap className='login__wrap login__wrap-register'>
    <form class="rating__popup rating__popup-active login__popup loginPopup form" on:submit|preventDefault={debouncedSubmit}>
        <div class="rating__content register__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">{$_('registrationPopup.title')}</strong>
            </p>

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

            {#if isLoading}
                <Spinner className='register__spinner' />
            {/if}

            <div class="register__notifications_wrap">
                {#if isError}
                    <span class="register__notifications">
                        {errorsObj[errorType]}
                    </span>
                {/if}
            </div>
        </div>

        <div class="rating__btns btns_wrap">
            <a href={"#"} class="rating__btn btn btn-low openLogin" on:click|preventDefault={openLoginPopup}>
                {$_('registrationPopup.goToLoginBtn')}
            </a>
            <button type="submit" class="rating__btn btn form__btn" on:click|preventDefault={debouncedSubmit}>
                {$_('registrationPopup.registerBtn')}
            </button>
        </div>
    </form>
</PopupWrap>

<style>
    .register__notifications {
        display: block;
    }

    .register__notifications_wrap {
        align-items: center;
    }
</style>
