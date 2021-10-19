<script>
    import { fly } from 'svelte/transition';
    import { focusTrap } from 'svelte-focus-trap';

    import CloseButton from '../../../ui-elements/CloseButton.svelte';

    import ConfirmForgotPasswordPopup from './ConfirmForgotPasswordPopup.svelte';
    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';
    import AskForMoreRatingsPopup from './AskForMoreRatingsPopup.svelte';
    import ChangePasswordPopup from './ChangePasswordPopup.svelte';
    import ForgotPasswordPopup from './ForgotPasswordPopup.svelte';
    import NearbyPopup from './NearbyPopup/NearbyPopup.svelte';
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
    	askForMoreRatingsPopup: AskForMoreRatingsPopup,
    	changePasswordPopup: ChangePasswordPopup,
    	checkEmailPopup: CheckEmailPopup,
    	confirmForgotPasswordPopup: ConfirmForgotPasswordPopup,
    	forgotPasswordPopup: ForgotPasswordPopup,
    	howToRatePopup: HowToRatePopup,
    	loggedInPopup: LoggedInPopup,
    	loginPopup: LoginPopup,
    	myPlacesPopup: MyPlacesPopup,
    	nearbyPopup: NearbyPopup,
    	onboardingPopup: OnboardingPopup,
    	partnersPopup: PartnersPopup,
    	quizPopup: QuizPopup,
    	registerPopup: RegisterPopup,
    	showRatingsPopup: ShowRatingPopup,
    };

    $: Popup = popupList[popupName];
</script>

<div
    class="glassmorphism z-2 inset-4 left-1/2 absolute flex justify-center items-center flex-wrap -lg:left-4 -md:inset-0 -md:rounded-none px-4 py-6 overflow-auto"
    use:focusTrap
    in:fly="{{ y: 80, duration: 300 }}"
    out:fly="{{ y: -80, duration: 300 }}"
>
    <svelte:component this={Popup} { popupData }/>
    <CloseButton overlayType='popup' className='-md:top-3 -md:right-3' />
</div>

<style>
    div {
        /* background-color: var(--bg-color-add-non-transparent);
        top: var(--navbar-height); */
        top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        div {
            top: 0;
        }
    }
</style>
