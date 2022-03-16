<script>
	import { _ } from 'svelte-i18n';

	import FormButton from '../../../ui-elements/FormButton.svelte';
	import Select from '../../../ui-elements/Select.svelte';
	import PopupTitle from './PopupTitle.svelte';

	import {
		closeOverlay,
		generateYearsBetween,
		debounce,
		logError,
		showSomethingWrongNotification,
		showSuccessNotification,
		registerAction,
	} from "../../../../utilities/helpers.js";
	import { updateRatingYear } from "../../../../utilities/api.js";

	export let popupData = {};

	$: newTimeline = popupData.timeline;
	$: yearSelectOptions = generateYearsBetween(1980).sort((a, b) => b - a).map(year => ({
		value: year,
		text: year,
		selected: year === popupData.timeline,
	}));

	const setTimeline = event => {
		const timeline = Number(event.target.value);
		newTimeline = timeline;
		registerAction('changeYear');
	};

	const submit = async () => {
		if (newTimeline === popupData.timeline) {
			return;
		}

		const { error } = await updateRatingYear(popupData.ratingID, newTimeline);

		if (error) {
			logError(error);
			showSomethingWrongNotification();
			return;
		}

		registerAction('saveNewYear');
		showSuccessNotification();
		closeOverlay('popup');
	};

	const debouncedSubmit = debounce(submit, 200);
</script>

<form class="max-w-sm w-full" on:submit|preventDefault={debouncedSubmit}>
	<PopupTitle title={$_('changeYearPopup.title')} />

	<Select
		title={$_('changeYearPopup.selectTitle', { values: { address: popupData.address } })}
		id='year-select'
		options={yearSelectOptions}
		className='mb-8'
		on:change={setTimeline}
	/>

	<div class="flex justify-evenly items-center">
		<FormButton
			text={$_('changeYearPopup.submitBtn')}
			action={debouncedSubmit}
			disabled={newTimeline === popupData.timeline}
		/>
	</div>

	<div
		class="text-center mt-2 text-sm transition-opacity"
		class:opacity-0={newTimeline !== popupData.timeline}
	>
		{$_('changeYearPopup.warning')}
	</div>
</form>
