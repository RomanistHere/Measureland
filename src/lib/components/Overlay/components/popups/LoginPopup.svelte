<script>
    import PopupWrap from './PopupWrap.svelte';
    import Input from '../../../Input.svelte';

    import { openAnotherOverlay } from "../../../../utilities/helpers.js";

    const openRegisterPopup = () => openAnotherOverlay('registerPopup');
</script>

<PopupWrap className='login__wrap'>
    <form class="rating__popup rating__popup-active login__popup loginPopup1 loginPopup form" id="loginForm" action="#login">
        <div class="rating__content login__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">Log in</strong>
            </p>

            <div class="container">
                <Input
                    title='Email'
                    type='email'
                    id='current-email'
                />

                <Input
                    title='Password'
                    type='password'
                    id='current-password'
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
                    <a href="#" class="login__notifications-small login__reverify formText10">Resend letter</a>
                </div>
            </div>
        </div>

        <div class="rating__btns btns_wrap">
            <a href="#" class="rating__btn btn btn-low openForgotPass">
                Forgot password
            </a>
            <button type="submit" class="rating__btn btn form__btn" id="logInBtn">Log in</button>
        </div>
        <a href="#" class="login__link" on:click|preventDefault={openRegisterPopup}>
            I want to register!
        </a>
    </form>
</PopupWrap>
