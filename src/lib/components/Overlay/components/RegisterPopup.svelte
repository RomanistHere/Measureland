<script>
    import PopupWrap from './PopupWrap.svelte';

    import { openAnotherOverlay } from "../../../utilities/helpers.js";

    const openLoginPopup = () => openAnotherOverlay('loginPopup')
</script>

<PopupWrap className='login__wrap login__wrap-register'>
    <form class="rating__popup rating__popup-active login__popup loginPopup2 loginPopup form" id="registerForm" action="#register">
        <div class="rating__content register__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">Registration</strong>
            </p>

            <div class="container">
                <div class="rating__stars form__grp">
                    <label for="new-email" class="rating__title title form__label">Email</label>
                    <input class="form__input inputEmail" type="email" id="new-email">
                    <span class="form__error">Wrong email format! Example: yournick@mail.com</span>
                </div>

                <div class="rating__stars form__grp">
                    <label for="new-password" class="rating__title title form__label">
                        <span class="loginText3">Password</span>
                        <a href="#" class="form__label_help togglePass">Show/hide</a>
                    </label>
                    <input class="form__input inputPass" type="password" id="new-password" autocomplete="new-password">
                    <span class="form__error">Password should be longer than 6 characters!</span>
                    <span class="form__error form__error-passw">Passwords should match!</span>
                </div>

                <div class="rating__stars form__grp">
                    <label for="repeat-new-password" class="rating__title title form__label">
                        <span>Repeat the password</span>
                        <a href="#" class="form__label_help togglePass">Show/hide</a>
                    </label>
                    <input class="form__input inputPass" type="password" id="repeat-new-password" autocomplete="repeat-new-password">
                    <span class="form__error">Password should be longer than 6 characters!</span>
                    <span class="form__error form__error-passw">Passwords should match!</span>
                </div>
            </div>

            <div class="spinner__wrap register__spinner">
                <div class="spinner__centr">
                    <div class="spinner"></div>
                </div>
            </div>

            <div class="register__notifications_wrap">
                <span class="register__notifications register__notifications-email_exists">
                    Account already exists
                </span>
                <span class="register__notifications register__notifications-err">
                    Error, try again later :(
                </span>
                <span class="register__notifications register__notifications-fill">
                    Check all the fields!
                </span>
                <span class="register__notifications register__notifications-timeout">
                    Too many attempts, wait a bit!
                </span>
            </div>
        </div>

        <div class="rating__btns btns_wrap">
            <a href="#" class="rating__btn btn btn-low openLogin" on:click|preventDefault={openLoginPopup}>
                Go to Login
            </a>
            <button type="submit" class="rating__btn btn form__btn" id="registerBtn">Registration</button>
        </div>
    </form>
</PopupWrap>

<style>

</style>
