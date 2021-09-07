<script>
    export let title = 'Email';
    export let type = 'email';
    export let id = 'current-email';

    let shouldShowPassword = false;
    let isInputValid = true;
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
        const inputContent = e.currentTarget.value;

        if (type === 'email') {
            const email = inputContent.toLowerCase();
            isInputValid = validateEmail(email);
        } else if (type === 'password') {
            isInputValid = validatePass(inputContent);
        }
    }

    const onInput = e => {
        isInputValid = false;
        hasTypingStarted = true;
        isInputActive = true;
        const inputContent = e.currentTarget.value;
    }
</script>

<div class="rating__stars form__grp">
    <label for="current-email" class="rating__title title form__label">
        <span>{title}</span>
        {#if type === 'password'}
            <a href={"#"} class="form__label_help" on:click|preventDefault={changeInputType}>Show/hide</a>
        {/if}
    </label>
    <input
        class="form__input {!isInputValid && !isInputActive ? 'form__input-error' : ''} {isInputValid && hasTypingStarted && !isInputActive ? 'form__input-success' : ''}"
        type="{shouldShowPassword ? 'text' : type}"
        id="{id}"
        autocomplete='{id}'
        on:blur={onBlur}
        on:input={onInput}
    >

    {#if !isInputValid && !isInputActive}
        {#if type === 'email'}
            <span class="form__error">Wrong email format! Example: yournick@mail.com</span>
        {:else if type === 'password'}
            <span class="form__error">Password should be longer than 6 characters!</span>
        {/if}
    {/if}
</div>

<style>
    .form__error {
        opacity: 1;
    }
</style>
