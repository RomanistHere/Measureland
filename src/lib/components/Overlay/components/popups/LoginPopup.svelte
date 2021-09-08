<script>
    import PopupWrap from './PopupWrap.svelte';
    import Input from '../../../Input.svelte';

    import { openAnotherOverlay } from "../../../../utilities/helpers.js";

    let email = '';
    let password = '';
    let isEmailValid = true;
    let isPasswordValid = true;

    const openRegisterPopup = () => openAnotherOverlay('registerPopup');

    const submit = async () => {
        const isValuesNotEmpty = email.length > 0 && password.length > 0;
        if (isValuesNotEmpty && isEmailValid && isPasswordValid) {
            console.log('submitted')
            console.log('email: ', email)
            console.log('password: ', password)
        } else {
            console.log("didn't submit")
            console.log("check the fields")
        }
    }
</script>

<PopupWrap className='login__wrap'>
    <form class="rating__popup rating__popup-active login__popup form" id="loginForm" on:submit|preventDefault={submit}>
        <div class="rating__content login__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">Log in</strong>
            </p>

            <div class="container">
                <Input
                    autofocus={true}
                    title='Email'
                    type='email'
                    id='current-email'
                    bind:value={email}
                    bind:isInputValid={isEmailValid}
                />

                <Input
                    title='Password'
                    type='password'
                    id='current-password'
                    bind:value={password}
                    bind:isInputValid={isPasswordValid}
                />
            </div>

            <div class="spinner__wrap login__spinner">
                <div class="spinner__centr">
                    <div class="spinner"></div>
                </div>
            </div>

            <div class="login__notifications_wrap">
                <span class="login__notifications login__notifications-email_not_exist">
                    Couldn't find your account
                </span>
                <span class="login__notifications login__notifications-wrong_pass">
                    Wrong password
                </span>
                <span class="login__notifications login__notifications-err">
                    Error, try again later :(
                </span>
                <span class="login__notifications login__notifications-fill">
                    Check all the fields!
                </span>
                <span class="login__notifications login__notifications-timeout">
                    Too many attempts, wait a bit!
                </span>
                <span class="login__notifications login__notifications-already_verified">
                    Already verified. Just log in :)
                </span>
                <div class="login__notifications login__notifications-verify">
                    <span class="login__notifications-small">Check email for verification letter</span>
                    <a href="#" class="login__notifications-small login__reverify">Resend letter</a>
                </div>
            </div>
        </div>

        <div class="rating__btns btns_wrap">
            <a href={"#"} class="rating__btn btn btn-low">
                Forgot password
            </a>
            <button type="submit" class="rating__btn btn form__btn" on:click|preventDefault={submit}>Log in</button>
        </div>
        <a href={"#"} class="login__link" on:click|preventDefault={openRegisterPopup}>
            I want to register!
        </a>
    </form>
</PopupWrap>
