<script>
	import { onMount } from "svelte";
	import { _ } from "svelte-i18n";

	import InputGroupSimple from "../../../ui-elements/InputGroupSimple.svelte";
	import Textarea from "../../../ui-elements/Textarea.svelte";
	import SubmissionState from "../../../ui-elements/SubmissionState.svelte";
	import FormButton from "../../../ui-elements/FormButton.svelte";
	import PopupTitle from "./PopupTitle.svelte";

	import {
		debounce,
		showSuccessNotification,
		closeOverlays,
		showSomethingWrongNotification,
		logError,
		openAnotherOverlay,
		getErrorType, blurCurrentInput,
	} from "../../../../utilities/helpers.js";
	import { sendFeedback } from "../../../../utilities/api.js";
	import { userStateStore } from "../../../../../stores/state.js";

	let isError = false;
	let errorType = "";
	let isLoading = false;
	let isSpam = null;
	let inputRef = null;
	let textAreaRef = null;
	let feedbackState = {
		heading: "",
		comment: "",
	};

	const updateInputValue = e => {
		const { value } = e.target;
		feedbackState = { ...feedbackState, heading: value };
	};

	const updateTextareaValue = e => {
		feedbackState = { ...feedbackState, comment: e.detail };
	};

	const submit = async () => {
		blurCurrentInput(document);

		isError = false;

		const isValuesNotEmpty = feedbackState.comment.length > 0 && feedbackState.heading.length > 3;
		if (!isValuesNotEmpty) {
			isError = true;
			errorType = "fieldsError";

			if (feedbackState.heading.length <= 2)
				inputRef?.focus();
			else if (feedbackState.comment.length === 0)
				textAreaRef?.focus();

			return;
		}

		isLoading = true;
		const { error } = await sendFeedback(feedbackState, $userStateStore.userID);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		closeOverlays();
		showSuccessNotification();
	};

	const debouncedSubmit = debounce(() => {
		if (isSpam) {
			isError = true;
			errorType = "manyAttempts";
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
			openAnotherOverlay("loginPopup");
	});
</script>

<form class="max-w-sm w-full" on:submit|preventDefault={debouncedSubmit}>
	<PopupTitle title={$_("feedbackPopup.title")} />

	<InputGroupSimple
		title={$_("feedbackPopup.inputTitle")}
		on:change={updateInputValue}
		placeholder={$_("feedbackPopup.inputPlaceholder")}
		autocomplete="feedback"
		bind:this={inputRef}
		maxlength={256}
	/>

	<p class="my-4">
		{$_("feedbackPopup.text")}
	</p>

	<Textarea
		placeholder={$_("feedbackPopup.textAreaPlaceholder")}
		maxlength="{800}"
		on:input={updateTextareaValue}
		className='mt-0'
		bind:this={textAreaRef}
	/>

	<SubmissionState
		{ isLoading }
		{ errorType }
	/>

	<div class="flex justify-evenly items-center">
		<FormButton text={$_("feedbackPopup.submitBtn")} action={debouncedSubmit} />
	</div>
</form>
