<script>
    import PopupWrap from './PopupWrap.svelte';

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
                <div class="rating__stars form__grp">
                    <label for="current-email" class="rating__title title form__label">Email</label>
                    <input class="form__input inputEmail" type="email" id="current-email">
                    <span class="form__error">Wrong email format! Example: yournick@mail.com</span>
                </div>

                <div class="rating__stars form__grp">
                    <label for="current-password" class="rating__title title form__label">
                        <span class="loginText3">Password</span>
                        <a href="#" class="form__label_help togglePass">Show/hide</a>
                    </label>
                    <input class="form__input inputPass" type="password" id="current-password" autocomplete="current-password">
                    <span class="form__error">Password should be longer than 6 characters!</span>
                </div>
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
