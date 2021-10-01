<script>
    import { fly } from 'svelte/transition';
    // after install change node_modules/svelte-focus-trap/src/index.js if error persists
    //https://github.com/Duder-onomy/svelte-focus-trap/issues/4
    import { focusTrap } from 'svelte-focus-trap';
    import { closeOverlays } from '../../../../utilities/helpers.js';

    import CloseBtn from '../../../CloseBtn.svelte';

    import ConfirmForgotPasswordPopup from './ConfirmForgotPasswordPopup.svelte';
    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';
    import AskForMoreRatingsPopup from './AskForMoreRatingsPopup.svelte';
    import ChangePasswordPopup from './ChangePasswordPopup.svelte';
    import ForgotPasswordPopup from './ForgotPasswordPopup.svelte';
    import CheckEmailPopup from './CheckEmailPopup.svelte';
    import OnboardingPopup from './OnboardingPopup.svelte';
    import QuizPopup from './QuizPopup/QuizPopup.svelte';
    import HowToRatePopup from './HowToRatePopup.svelte';
    import LoggedInPopup from './LoggedInPopup.svelte';
    import RegisterPopup from './RegisterPopup.svelte';
    import PartnersPopup from './PartnersPopup.svelte';
    import MyPlacesPopup from './MyPlacesPopup.svelte';
    import LoginPopup from './LoginPopup.svelte';

    export let popupName;
    export let popupData;

    const popupList = {
        askForMoreRatingsPopup: {
            className: 'rate_ask_ratings',
            component: AskForMoreRatingsPopup
        },
        changePasswordPopup: {
            className: 'login',
            component: ChangePasswordPopup
        },
        checkEmailPopup: {
            className: 'login',
            component: CheckEmailPopup
        },
        confirmForgotPasswordPopup: {
            className: 'login',
            component: ConfirmForgotPasswordPopup
        },
        forgotPasswordPopup: {
            className: 'login',
            component: ForgotPasswordPopup
        },
        howToRatePopup: {
            className: 'rate_tutorial',
            component: HowToRatePopup
        },
        loggedInPopup: {
            className: 'login',
            component: LoggedInPopup
        },
        loginPopup: {
            className: 'login',
            component: LoginPopup
        },
        myPlacesPopup: {
            className: 'places',
            component: MyPlacesPopup
        },
        onboardingPopup: {
            className: 'partners',
            component: OnboardingPopup
        },
        partnersPopup: {
            className: 'partners',
            component: PartnersPopup
        },
        quizPopup: {
            className: 'rating ratingShow',
            component: QuizPopup
        },
        registerPopup: {
            className: 'register',
            component: RegisterPopup
        },
        showRatingsPopup: {
            className: 'rate',
            component: ShowRatingPopup
        },
    };

    $: Popup = popupList[popupName]['component'];
    $: popupParentClass = popupList[popupName]['className'];
</script>

<div
    class="z-2 inset-0 left-1/2 absolute flex justify-center items-center -lg:left-0 px-4"
    use:focusTrap
    in:fly="{{ y: 80, duration: 300 }}"
    out:fly="{{ y: -80, duration: 300 }}"
>
    <svelte:component this={Popup} { popupData }/>
    <CloseBtn overlayType='popup' className='top-3 right-3 z-2 -lg:top-3 -lg:right-3' />
</div>

<style>
    div {
        background-color: var(--bg-color-add-non-transparent);
        top: var(--navbar-height);
    }
</style>
