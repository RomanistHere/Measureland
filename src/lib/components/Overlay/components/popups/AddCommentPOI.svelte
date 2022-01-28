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
	} from "../../../../utilities/helpers.js";
	import { addCommentPOI, sendFeedback } from "../../../../utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";
	
	$: errorsObj = $json('errors');
	
	export let popupData;
	
	let isError = false;
	let errorType = '';
	let isLoading = false;
	let isSpam = null;
	let comment = '';
	
	const updateTextareaValue = e => {
		comment = e.target.value;
	};
	
	const submit = async () => {
		const { pointID } = popupData;
		blurCurrentInput();
	
		isError = false;
	
		const isValuesNotEmpty = comment.length > 2;
		if (!isValuesNotEmpty) {
			// TODO: focus needed input
			isError = true;
			errorType = 'fieldsError';
	
			return;
		}
	
		isLoading = true;
		const { error } = await addCommentPOI(pointID, comment, $userStateStore.userName);
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
	<PopupTitle title="Добавление комментария" />
	
	<p class="my-4">
		Комментируй примечательные места, чтобы дополнить информацию или указать на неактуальность оной.
	</p>
	
	<Textarea
		placeholder="Разделяю негодование автора и хочу добавить, что в последнее время..."
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
		<FormButton text="Добавить комментарий" action={debouncedSubmit} />
	</div>
</form>
