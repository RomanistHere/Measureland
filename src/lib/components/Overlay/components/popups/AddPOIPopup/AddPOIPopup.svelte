<script>
	import { onDestroy, onMount } from "svelte";
	import { _ } from 'svelte-i18n';

	import InputGroupSimple from '../../../../ui-elements/InputGroupSimple.svelte';
	import Textarea from '../../../../ui-elements/Textarea.svelte';
	import SubmissionState from '../../../../ui-elements/SubmissionState.svelte';
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
		roundToFifthDecimal,
		getErrorType,
		blurCurrentInput,
		registerAction,
		centerMap,
	} from "../../../../../utilities/helpers.js";
	import { savePOIToDB } from "../../../../../utilities/api.js";
	import { isDesktop, poisStore, userStateStore } from "../../../../../../stores/state.js";
	import { leafletReference, mapReference } from "../../../../../../stores/references.js";

	export let popupData;

	let circle;
	let isError = false;
	let errorType = '';
	let isLoading = false;
	let isSpam = null;
	let inputRef = null;
	let textAreaRef = null;
	let pointOfInterestState = {
		title: '',
		description: '',
		tags: [],
	};

	const L = $leafletReference;
	const map = $mapReference;

	const updateInputValue = e => {
		const { value } = e.target;
		pointOfInterestState = { ...pointOfInterestState, title: value };
	};

	const updateTextareaValue = e => {
		pointOfInterestState = { ...pointOfInterestState, description: e.detail };
	};
	
	const updateListOfTags = e => {
		const newTag = e.detail;
		if (pointOfInterestState.tags.includes(newTag))
			return;
		pointOfInterestState = { ...pointOfInterestState, tags: [ ...pointOfInterestState.tags, newTag ] };

		registerAction('addTagAddPOI');
	};
	
	const removeTagFromList = e => {
		const key = e.detail;
		pointOfInterestState = { ...pointOfInterestState, tags: pointOfInterestState.tags.filter(item => item !== key) };

		registerAction('removeTagAddPOI');
	};

	const submit = async () => {
		blurCurrentInput(document);

		registerAction('trySubmitAddPOI');
		isError = false;
		const isValuesNotEmpty = pointOfInterestState.description.length > 0 && pointOfInterestState.title.length > 2;
		if (!isValuesNotEmpty) {
			isError = true;
			errorType = 'fieldsError';

			if (pointOfInterestState.title.length <= 2)
				inputRef?.focus();
			else if (pointOfInterestState.description.length === 0)
				textAreaRef?.focus();

			return;
		}

		registerAction('submitAddPOI');
		const currentCoords = [ roundToFifthDecimal(popupData.lng), roundToFifthDecimal(popupData.lat) ];

		isLoading = true;
		const { error } = await savePOIToDB(currentCoords, pointOfInterestState);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		poisStore.update(state => ({ ...state, markersToAdd: [ ...state.markersToAdd, currentCoords ] }));
		userStateStore.update(state => ({ ...state, activeRatings: state.activeRatings - 1 }));
		closeOverlays();
		showSuccessNotification();
		registerAction('successAddPOI');
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

	const addCircle = () => {
		const { lat, lng } = popupData;
		circle = L.circle(popupData, 200, { color: '#007097' });

		circle.addTo(map);

		centerMap(map, lat, lng, $isDesktop, true);
	};

	const removeCircle = () =>
		circle && map.removeLayer(circle);

	onMount(() => {
		if ($userStateStore.userID === null)
			openAnotherOverlay('loginPopup');
		else
			addCircle();
	});

	onDestroy(removeCircle);
</script>

<form class="max-w-sm w-full" on:submit|preventDefault={debouncedSubmit}>
	<PopupTitle title={$_('addPOIPopup.title')} />

	<InputGroupSimple
		title={$_('addPOIPopup.inputTitle')}
		on:change={updateInputValue}
		placeholder={$_('addPOIPopup.inputPlaceholder')}
		autocomplete="point of interest"
		bind:this={inputRef}
		maxlength={256}
	/>

	<p class="my-4">
		{$_('addPOIPopup.text')}
	</p>

	<Textarea
		placeholder={$_('addPOIPopup.textAreaPlaceholder')}
		maxlength="{600}"
		on:input={updateTextareaValue}
		className='mt-0'
		bind:this={textAreaRef}
	/>

	<TagsInput
		listOfTags={pointOfInterestState.tags}
		on:addNewTag={updateListOfTags}
		on:removeTag={removeTagFromList}
	/>

	<SubmissionState
		{ isLoading }
		{ errorType }
	/>

	<div class="flex justify-evenly items-center">
		<FormButton text={$_('addPOIPopup.submitBtn')} action={debouncedSubmit} />
	</div>
</form>
