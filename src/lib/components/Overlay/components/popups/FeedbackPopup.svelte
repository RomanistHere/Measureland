<script>
    import { onMount } from "svelte";
    import { _, json } from 'svelte-i18n';

    import InputGroupSimple from '../../../ui-elements/InputGroupSimple.svelte';
    import Textarea from '../../../ui-elements/Textarea.svelte';
    import Spinner from '../../../ui-elements/Spinner.svelte';
    import FormButton from '../../../ui-elements/FormButton.svelte';
    import PopupTitle from './PopupTitle.svelte';

    import {
    	debounce,
    	showSuccessNotification,
    	closeOverlays,
    	showSomethingWrongNotification,
    	logError,
    	openAnotherOverlay,
    } from "../../../../utilities/helpers.js";
    import { sendFeedback } from "../../../../utilities/api.js";
    import { userStateStore } from "../../../../../stores/state.js";

    $: errorsObj = $json('errors');

    let isError = false;
    let errorType = '';
    let isLoading = false;
    let isSpam = null;
    let feedbackState = {
    	heading: '',
    	comment: '',
    };

    const updateInputValue = e => {
    	const { value } = e.target;
    	feedbackState = { ...feedbackState, heading: value };
    };

    const updateTextareaValue = e => {
    	const { value } = e.target;
    	feedbackState = { ...feedbackState, comment: value };
    };

    const submit = async() => {
    	// TODO: make in more declarative way
    	if (document)
    		document.activeElement.blur();

    	isError = false;

    	const isValuesNotEmpty = feedbackState.comment.length > 0 && feedbackState.heading.length > 0;
    	if (!isValuesNotEmpty) {
    		// TODO: focus needed input
    		isError = true;
    		errorType = 'fieldsError';

    		return;
    	}

    	isLoading = true;
    	const { error } = await sendFeedback(feedbackState, $userStateStore.userID);
    	isLoading = false;

    	if (error) {
    		logError(error);
    		isError = true;
    		errorType = 'unrecognizedError';

    		if (error === 'Too many requests, please try again later') {
    			errorType = 'manyRequests';
    		}

    		showSomethingWrongNotification();
    		return;
    	}

    	closeOverlays();
    	showSuccessNotification();
    };

    const debouncedSubmit = debounce(() => {
    	if (isSpam) {
    		isError = true;
    		errorType = 'manyAttempts';
    		clearTimeout(isSpam);
    		isSpam = setTimeout(() => {
    			clearTimeout(isSpam);
    			isSpam = null;
    			isError = false;
    		}, 2000);
    		return;
    	}

    	isSpam = setTimeout(() => {
    		clearTimeout(isSpam);
    		isSpam = null;
    	}, 2000);

    	submit();
    }, 200);

    onMount(() => {
    	if ($userStateStore.userID === null)
    		openAnotherOverlay('loginPopup');
    });
</script>

<form class="max-w-sm w-full" on:submit|preventDefault={debouncedSubmit}>
    <PopupTitle title={$_('feedbackPopup.title')} />

    <InputGroupSimple
        title={$_('feedbackPopup.inputTitle')}
        on:change={updateInputValue}
        placeholder={$_('feedbackPopup.inputPlaceholder')}
        autocomplete="feedback"
    />

    <p class="my-4">
        {$_('feedbackPopup.text')}
    </p>

    <Textarea
        placeholder={$_('feedbackPopup.textAreaPlaceholder')}
        maxlength="{1400}"
        on:input={updateTextareaValue}
        className='mt-0'
    />

    <div class="relative flex justify-center items-center h-28">
        {#if isLoading}
            <Spinner />
        {/if}
        {#if isError}
            <span class="italic font-bold sug-color">
                {errorsObj[errorType]}
            </span>
        {/if}
    </div>

    <div class="flex justify-evenly items-center">
        <FormButton text={$_('feedbackPopup.submitBtn')} action={debouncedSubmit} />
    </div>
</form>
