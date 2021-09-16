<script>
    import { _ } from 'svelte-i18n';

    import PopupWrap from './PopupWrap.svelte';
    import Select from '../../../Select.svelte';
    import FormButton from '../FormButton.svelte';

    import { closeOverlay, showSuccessNotification, debounce } from "../../../../utilities/helpers.js";
    import { onboard } from "../../../../utilities/api.js";
    import { userStateStore } from "../../../../../stores/state.js";

    let defaultName = $_('onboardingPopup.defaultName');
    let email = '';
    let password = '';
    let isSpam = null;
    let onboardingState = {
        name: defaultName,
        ageGrp: 1,
        moneyGrp: 1
    };

    const ageOptions = [{
        text: $_('onboardingPopup.ageOption1'),
        selected: false,
    },{
        text: $_('onboardingPopup.ageOption2'),
        selected: true,
    },{
        text: $_('onboardingPopup.ageOption3'),
        selected: false,
    },{
        text: $_('onboardingPopup.ageOption4'),
        selected: false,
    }];

    const incomeOptions = [{
        text: $_('onboardingPopup.incomeOption1'),
        selected: false,
    },{
        text: $_('onboardingPopup.incomeOption2'),
        selected: true,
    },{
        text: $_('onboardingPopup.incomeOption3'),
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
                <strong class="rating__text-highlight">
                    {$_('onboardingPopup.title')}
                </strong>
            </p>
            <p class="rating__text">
                {$_('onboardingPopup.caption')}
            </p>

            <Select
                options={ageOptions}
                id='age-select'
                title={$_('onboardingPopup.yourAgeGroup')}
                on:change={(e) => { handleSelect(e, 'ageGrp') }}
            />

            <Select
                options={incomeOptions}
                id='money-select'
                title={$_('onboardingPopup.incomeLevel')}
                on:change={(e) => { handleSelect(e, 'moneyGrp') }}
            />

            <div class="rating__stars">
                <h2 class="rating__title title">
                    {$_('onboardingPopup.yourName', { values: [defaultName] })}
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

        <FormButton text={$_('onboardingPopup.mainBtn')} className='onboarding__btn' action={debouncedSubmit} />
    </form>
</PopupWrap>
