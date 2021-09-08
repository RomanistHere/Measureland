<script>
    import { _ } from 'svelte-i18n';

    export let title = 'Email';
    export let type = 'email';
    export let id = 'current-email';
    export let value = '';
    export let isInputValid = true;
    export let autofocus = false;
    export let shouldShowMatchError = false;

    let shouldShowPassword = false;
    let isInputActive = false;
    let hasTypingStarted = false;

    const validateEmail = email =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

    const validatePass = pass =>
        pass.length > 6 && pass.length < 255;

    const changeInputType = () =>
        shouldShowPassword = !shouldShowPassword;

    const onBlur = e => {
        isInputActive = false;
        value = e.currentTarget.value;

        if (type === 'email') {
            value = value.toLowerCase();
            isInputValid = validateEmail(value);
        } else if (type === 'password') {
            isInputValid = validatePass(value);
        }
    }

    const onInput = e => {
        isInputValid = false;
        shouldShowMatchError = false;
        hasTypingStarted = true;
        isInputActive = true;
        value = e.currentTarget.value;
    }
</script>

<div class="rating__stars form__grp">
    <label for={id} class="rating__title title form__label">
        <span>{title}</span>
        {#if type === 'password'}
            <a href={"#"} class="form__label_help" on:click|preventDefault={changeInputType}>{$_('input.showOrHide')}</a>
        {/if}
    </label>
    <input
        class="form__input {(!isInputValid && !isInputActive) || shouldShowMatchError ? 'form__input-error' : ''} {isInputValid && hasTypingStarted && !isInputActive && !shouldShowMatchError ? 'form__input-success' : ''}"
        type={shouldShowPassword ? 'text' : type}
        id={id}
        autocomplete={id}
        on:blur={onBlur}
        on:input={onInput}
        { autofocus }
    >

    {#if !isInputValid && !isInputActive}
        {#if type === 'email'}
            <span class="form__error">{$_('input.emailError')}</span>
        {:else if type === 'password'}
            <span class="form__error">{$_('input.passwordError')}</span>
        {/if}
    {/if}

    {#if shouldShowMatchError}
        <span class="form__error">Passwords should match!</span>
    {/if}
</div>

<style>
    .form__error {
        opacity: 1;
    }
</style>
