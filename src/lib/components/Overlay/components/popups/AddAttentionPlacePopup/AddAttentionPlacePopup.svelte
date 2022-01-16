<script>
	import { onMount } from "svelte";
	import { _, json } from 'svelte-i18n';

	import InputGroupSimple from '../../../../ui-elements/InputGroupSimple.svelte';
	import Textarea from '../../../../ui-elements/Textarea.svelte';
	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import FormButton from '../../../../ui-elements/FormButton.svelte';
	import TagsInput from '../../../../ui-elements/TagsInput.svelte';
	import PopupTitle from '../PopupTitle.svelte';

	import {
		debounce,
		showSuccessNotification,
		closeOverlays,
		showSomethingWrongNotification,
		logError,
		openAnotherOverlay,
	} from "../../../../../utilities/helpers.js";
	import { sendFeedback } from "../../../../../utilities/api.js";
	import { userStateStore } from "../../../../../../stores/state.js";

	$: errorsObj = $json('errors');

	let isError = false;
	let errorType = '';
	let isLoading = false;
	let isSpam = null;
	let attentionPlaceState = {
		title: '',
		description: '',
		tags: [],
	};

	const updateInputValue = e => {
		const { value } = e.target;
		attentionPlaceState = { ...attentionPlaceState, title: value };
	};

	const updateTextareaValue = e => {
		const { value } = e.target;
		attentionPlaceState = { ...attentionPlaceState, description: value };
	};
	
	const updateListOfTags = e => {
		const newTag = e.detail;
		if (attentionPlaceState.tags.includes(newTag))
			return;
		attentionPlaceState = { ...attentionPlaceState, tags: [ ...attentionPlaceState.tags, newTag ] };
	};
	
	const removeTagFromList = e => {
		const key = e.detail;
		attentionPlaceState = { ...attentionPlaceState, tags: attentionPlaceState.tags.filter(item => item !== key) };
	};

	const submit = async() => {
		// TODO: make in more declarative way
		if (document)
			document.activeElement.blur();

		isError = false;

		const isValuesNotEmpty = attentionPlaceState.description.length > 0 && attentionPlaceState.title.length > 2;
		if (!isValuesNotEmpty) {
			// TODO: focus needed input
			isError = true;
			errorType = 'fieldsError';

			return;
		}

		isLoading = true;
		const { error } = await sendFeedback(attentionPlaceState, $userStateStore.userID);
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
	<PopupTitle title={$_('addAttentionPlacePopup.title')} />

	<InputGroupSimple
		title={$_('addAttentionPlacePopup.inputTitle')}
		on:change={updateInputValue}
		placeholder={$_('addAttentionPlacePopup.inputPlaceholder')}
		autocomplete="point of interest"
	/>

	<p class="my-4">
		{$_('addAttentionPlacePopup.text')}
	</p>

	<Textarea
		placeholder={$_('addAttentionPlacePopup.textAreaPlaceholder')}
		maxlength="{1400}"
		on:input={updateTextareaValue}
		className='mt-0'
	/>

	<TagsInput
		listOfTags={attentionPlaceState.tags}
		on:addNewTag={updateListOfTags}
		on:removeTag={removeTagFromList}
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
		<FormButton text={$_('addAttentionPlacePopup.submitBtn')} action={debouncedSubmit} />
	</div>
</form>
