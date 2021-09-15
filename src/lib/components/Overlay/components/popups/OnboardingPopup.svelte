<script>
    import { _ } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import Select from '../../../Select.svelte';
    import FormButton from '../FormButton.svelte';

    import { closeOverlay, showSuccessNotification, debounce } from "../../../../utilities/helpers.js";
    import { onboard } from "../../../../utilities/api.js";
    import { userStateStore } from "../../../../../stores/state.js";

    let defaultName = 'Anonym';
    let email = '';
    let password = '';
    let isSpam = null;
    let onboardingState = {
        name: defaultName,
        ageGrp: 1,
        moneyGrp: 1
    };

    const ageOptions = [{
        text: 'Yonger than 25 years',
        selected: false,
    },{
        text: '25 - 40 years',
        selected: true,
    },{
        text: '41 - 55 years',
        selected: false,
    },{
        text: 'Older than 55 years',
        selected: false,
    }];

    const incomeOptions = [{
        text: 'Below average',
        selected: false,
    },{
        text: 'Average',
        selected: true,
    },{
        text: 'Above average',
        selected: false,
    }];

    const handleSelect = (event, key) => {
        const value = Number(event.target.value);
        onboardingState = { ...onboardingState, [key]: value };
    }

    const handleInput = e => {
        const value = e.currentTarget.value;
        onboardingState = { ...onboardingState, name: value };
    }

    const submit = async () => {
        const { name, ageGrp, moneyGrp } = onboardingState;
        const userName = name.trim() === '' ? defaultName : name;

        if (userName === defaultName && ageGrp === 1 && moneyGrp === 1) {
            showSuccessNotification();
            closeOverlay('popup');
            return
        }

        const { error } = await onboard(userName, ageGrp, moneyGrp, $userStateStore.userID);

        if (error) {
            // TODO:
            alert('unrecognizedError')
            console.warn(error)
            return;
        }

        showSuccessNotification();
        closeOverlay('popup');
    }

    const debouncedSubmit = debounce(() => {
        if (isSpam) {
            clearTimeout(isSpam);
            isSpam = setTimeout(() => {
                clearTimeout(isSpam);
                isSpam = null;
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

<PopupWrap className='login__wrap-onboarding'>
    <form class="rating__popup rating__popup-active login__popup" on:submit|preventDefault={debouncedSubmit}>
        <div class="onboarding__content">
            <p class="rating__text">
                <strong class="rating__text-highlight">Thank you for registration!</strong>
            </p>
            <p class="rating__text">
                You'll help us by answering this two simple questions (deafault values applied if skipped), and we would help you if you were looking for a new place to live in the future :)
            </p>

            <Select
                options={ageOptions}
                id='age-select'
                title='Your age group:'
                on:change={(e) => { handleSelect(e, 'ageGrp') }}
            />

            <Select
                options={incomeOptions}
                id='money-select'
                title='Income level (roughly):'
                on:change={(e) => { handleSelect(e, 'moneyGrp') }}
            />

            <div class="rating__stars">
                <h2 class="rating__title title">
                    Your name. If skipped, you're going to be "{defaultName}" in the comments
                </h2>
                <input
                    class="form__input onboarding__input"
                    type="text"
                    autocomplete="username"
                    placeholder="{defaultName}"
                    on:change={handleInput}
                >
            </div>
        </div>

        <FormButton text="Let's go" className='onboarding__btn' action={debouncedSubmit} />
    </form>
</PopupWrap>
