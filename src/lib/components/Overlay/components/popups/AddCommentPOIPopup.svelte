<script>
	import { onMount } from "svelte";
	import { _, json } from 'svelte-i18n';
	
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
		blurCurrentInput,
		getErrorType, registerAction,
	} from "../../../../utilities/helpers.js";
	import { addCommentPOI } from "../../../../utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";
	
	$: errorsObj = $json('errors');
	
	export let popupData;
	
	let isError = false;
	let errorType = '';
	let isLoading = false;
	let isSpam = null;
	let comment = '';
	let textAreaRef = null;
	
	const updateTextareaValue = e => {
		comment = e.target.value;
	};
	
	const submit = async () => {
		const { pointID } = popupData;
		blurCurrentInput();

		registerAction('trySubmitCommentPOI');
		isError = false;
		const isValuesNotEmpty = comment.length > 2;
		if (!isValuesNotEmpty) {
			textAreaRef?.focus();
			isError = true;
			errorType = 'fieldsError';
	
			return;
		}

		registerAction('submitCommentPOI');
		isLoading = true;
		const { error } = await addCommentPOI(pointID, comment, $userStateStore.userName);
		isLoading = false;
	
		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);
	
			showSomethingWrongNotification();
			return;
		}

		registerAction('successCommentPOI');
		userStateStore.update(state => ({ ...state, activeRatings: state.activeRatings - 1 }));
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
	<PopupTitle title={$_('addCommentPOIPopup.title')} />
	
	<p class="my-4">
		{$_('addCommentPOIPopup.description')}
	</p>
	
	<Textarea
		placeholder={$_('addCommentPOIPopup.textAreaPlaceholder')}
		maxlength="{1400}"
		on:input={updateTextareaValue}
		className='mt-0'
		bind:this={textAreaRef}
	/>
	
	<div class="relative flex justify-center items-center h-28">
		{#if isLoading}
			<Spinner />
		{/if}
		{#if isError}
            <span class="italic font-bold">
                {errorsObj[errorType]}
            </span>
		{/if}
	</div>
	
	<div class="flex justify-evenly items-center">
		<FormButton text={$_('addCommentPOIPopup.primaryBtnText')} action={debouncedSubmit} />
	</div>
</form>
