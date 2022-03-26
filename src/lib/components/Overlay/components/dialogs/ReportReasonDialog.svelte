<script>
	import { _ } from 'svelte-i18n';

	import RadioGroup from '../../../ui-elements/RadioGroup.svelte';
	import Textarea from '../../../ui-elements/Textarea.svelte';
	import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';

	import { closeOverlay, logError, showSuccessNotification } from "$lib/utilities/helpers.js";
	import { reportReason } from "$lib/utilities/api.js";

	export let dialogData;

	let textareaValue = null;

	$: code = 'noReason';
	$: reportFeedbackCodes = {
		irrelevantProved: $_('reportReasonDialog.irrelevantProved'),
		irrelevantNotProved: $_('reportReasonDialog.irrelevantNotProved'),
		deprecated: $_('reportReasonDialog.deprecated'),
		behavior: $_('reportReasonDialog.behavior'),
		other: $_('reportReasonDialog.other'),
		noReason: "",
	};

	const closeDialog = () =>
		closeOverlay('dialog');

	const getCodeFromMessage = message => {
		for (const [ key, value ] of Object.entries(reportFeedbackCodes)) {
			if (message === value)
				return key;
		}
	};

	const handleRadioChange = e => {
		code = getCodeFromMessage(e.detail);
	};

	const handleTextareaChange = e => {
		textareaValue = e.target.value;
	};

	const sendReport = async () => {
		const { id, type } = dialogData;

		const { error } = await reportReason(id, type, code, textareaValue);

		if (error)
			logError(error);

		closeDialog();
		showSuccessNotification();
	};
</script>

<h3 class="text-2xl -md:text-lg pr-8">
	{$_('reportReasonDialog.title')}
</h3>

<div class="mt-4">
	<RadioGroup
		firstVal={reportFeedbackCodes.irrelevantProved}
		secondVal={reportFeedbackCodes.irrelevantNotProved}
		thirdVal={reportFeedbackCodes.deprecated}
		fourthVal={reportFeedbackCodes.behavior}
		fifthVal={reportFeedbackCodes.other}
		on:input={handleRadioChange}
		isExpandableLast={true}
	>
		<h2 class="my-4">
			{$_('reportReasonDialog.textareaTitle')}
		</h2>
		<Textarea
			placeholder={$_('reportReasonDialog.textareaPlaceholder')}
			maxCommentLength={1024}
			on:input={handleTextareaChange}
		/>
	</RadioGroup>
</div>

{#if code !== 'noReason'}
	<div class="my-4">
		<PrimaryButton
			text={$_('reportReasonDialog.primaryButton')}
			action={sendReport}
		/>
	</div>
{/if}
