<script>
    import { _, json } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import MainButton from '../MainButton.svelte';

    import { closeOverlay } from "../../../../utilities/helpers.js";

    const closePopup = () => closeOverlay('popup');
</script>

<PopupWrap className='login__wrap-check'>
    <div class="rating__popup rating__popup-active login__popup">
        <div class="rating__content login__content-check">
            <p class="rating__text">
                <strong class="rating__text-highlight">{$_('checkEmailPopup.title')}</strong>
            </p>

            <p class="rating__text">
                {$_('checkEmailPopup.text')}
            </p>
        </div>

        <MainButton text="{$_('checkEmailPopup.button')}" className="login__recover" action={closePopup} />
    </div>
</PopupWrap>
