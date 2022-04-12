<script>
	import { _, json } from 'svelte-i18n';
	import { onDestroy, onMount } from 'svelte';

	import PopupTitle from '../PopupTitle.svelte';
	import QuizItem from './QuizItem.svelte';
	import Spinner from '../../../../ui-elements/Spinner.svelte';
	import TextLink from '../../../../ui-elements/TextLink.svelte';
	import SecondaryButton from '../../../../ui-elements/SecondaryButton.svelte';
	import PrimaryButton from '../../../../ui-elements/PrimaryButton.svelte';
	import Textarea from '../../../../ui-elements/Textarea.svelte';
	import Select from '../../../../ui-elements/Select.svelte';

	import { saveToDB } from "../../../../../utilities/api.js";
	import {
		centerMap,
		closeOverlays,
		debounce,
		generateYearsBetween,
		getFinalRating,
		logError,
		openAnotherOverlay,
		registerAction,
		roundToFifthDecimal,
		roundToTen,
		showSomethingWrongNotification,
		showSuccessNotification,
		getErrorType,
	} from "../../../../../utilities/helpers.js";
	import { leafletReference, mapReference } from "../../../../../../stores/references.js";
	import { isDesktop, markerStore, userStateStore } from "../../../../../../stores/state.js";

	export let popupData;

	$: errorsObj = $json('errors');
	$: criteriaObj = $json('criteria');
	$: quizArray = Object.keys(criteriaObj).map(key => ({
		title: criteriaObj[key]['title'],
		tooltip: criteriaObj[key]['tooltip'],
		caption: criteriaObj[key]['caption'],
		rating: null,
		key,
	}));

	$: isUserLoggedIn = $userStateStore.userID !== null;
	$: currentStage = 1;

	const currentYear = new Date().getFullYear();
	const timelineStamps = {
		1: currentYear,
		2: currentYear - 4,
		3: currentYear - 10,
	};

	let circle;
	let remainingCommentLength = 330;
	let errorType = null;
	let isLoading = false;
	let isError = false;
	let quizState = {
		ratings: {},
		comment: null,
		isPersonalExperience: false,
		timeline: new Date().getFullYear() - 4,
	};

	$: timelineOptions = [{
		value: timelineStamps[1],
		text: $_('quizPopup.timelineSelectOption1'),
		selected: timelineStamps[1] >= quizState.timeline && timelineStamps[2] < quizState.timeline,
	}, {
		value: timelineStamps[2],
		text: $_('quizPopup.timelineSelectOption2'),
		selected: timelineStamps[2] >= quizState.timeline && timelineStamps[3] < quizState.timeline,
	}, {
		value: timelineStamps[3],
		text: $_('quizPopup.timelineSelectOption3'),
		selected: timelineStamps[3] >= quizState.timeline,
	}];

	$: yearSelectOptions = generateYearsBetween(1980).sort((a, b) => b - a).map(year => ({
		value: year,
		text: year,
		selected: year === quizState.timeline,
	}));

	const L = $leafletReference;
	const map = $mapReference;
	const maxCommentLength = 330;

	const nextStage = () => {
		currentStage = currentStage + 1;
		isError = false;
	};
	const prevStage = () => {
		currentStage = currentStage - 1;
		isError = false;
	};

	const updateComment = e => {
		const comment = e.target.value;
		remainingCommentLength = 330 - comment.length;
		quizState = { ...quizState, comment };
	};

	const changePersonalExperience = isPersonalExperience => {
		nextStage();
		quizState = { ...quizState, isPersonalExperience };
	};

	const setTimeline = event => {
		const timeline = Number(event.target.value);
		quizState = { ...quizState, timeline };
	};

	const setRating = event => {
		const { key, rating } = event.detail;
		for (let i = 0; i < quizArray.length; i++) {
			const item = quizArray[i];
			if (item.key === key)
				item.rating = rating;
		}

		quizState = {
			...quizState,
			ratings: {
				...quizState.ratings,
				[key]: rating,
			},
		};
	};

	const checkAndGetData = rating => {
		const { finalRating, answersNumber } = getFinalRating(rating);

		return {
			isDataValid: answersNumber === 11,
			averageRating: roundToTen(finalRating),
		};
	};

	const submit = async () => {
		registerAction('trySubmitQuiz');
		errorType = null;
		isError = false;
		isLoading = true;
		const { isDataValid, averageRating } = checkAndGetData(quizState.ratings);
		if (!isDataValid) {
			// TODO: later forward to non rated field
			errorType = 'rateEveryField';
			isLoading = false;
			isError = true;
			return;
		}

		const currentCoords = [ roundToFifthDecimal(popupData.lat), roundToFifthDecimal(popupData.lng) ];

		try {
			registerAction('submitQuiz');
			const { ratings, comment, isPersonalExperience, timeline } = quizState;
			const { error, data } = await saveToDB(currentCoords, ratings, averageRating, comment, isPersonalExperience, timeline);
			isLoading = false;

			if (error) {
				logError(error);
				isError = true;
				errorType = getErrorType(error);

				showSomethingWrongNotification();
				return;
			}

			const isUpdated = data.message === 'Rating updated';
			if (isUpdated) {
				const { coords } = data;
				markerStore.update(state => ({
					...state,
					markersToRemove: [ ...state.markersToRemove, { coords }],
					markersToAdd: [ ...state.markersToAdd, { coords, rating: data.averageRating }],
				}));
			} else {
				markerStore.update(state => ({
					...state,
					markersToAdd: [ ...state.markersToAdd, { coords: currentCoords.reverse(), rating: averageRating }],
				}));
			}

			registerAction('successQuiz');
			userStateStore.update(state => ({ ...state, activeRatings: state.activeRatings - 1 }));
			closeOverlays();
			showSuccessNotification();
		} catch (e) {
			logError(e);
			errorType = 'unrecognizedError';
			isError = true;
			isLoading = false;
			showSomethingWrongNotification();
		}
	};

	const debouncedSubmit = debounce(submit, 300);

	const addCircle = () => {
		const { lat, lng } = popupData;
		circle = L.circle(popupData, 200, { color: '#007097' });

		circle.addTo(map);

		centerMap(map, lat, lng, $isDesktop, true);
	};

	const removeCircle = () =>
		map.removeLayer(circle);

	onMount(addCircle);
	onDestroy(removeCircle);
</script>

<div class="max-w-sm w-full">
	{#if currentStage === 1}
		<p class="my-4">
			{$_('quizPopup.soYouWantToRate')}
		</p>

		<p class="italic my-4">
			{$_('quizPopup.doYouHavePersonalExperience')}
		</p>

		<img src="/images/crowd.png" width="400" height="180" alt="{$_('quizPopup.imageTitle')}">

		<p class="text-xs text-center my-4">
			{$_('quizPopup.beSincere')}
		</p>
	{:else if currentStage === 2}
		<p class="my-4">
			{$_('quizPopup.tenCriteria')}
			<strong class="underline font-normal">{$_('quizPopup.tenCriteriaStrong')}</strong>:
		</p>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[0] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[1] }
		/>
	{:else if currentStage === 3}
		<PopupTitle title={$_('quizPopup.title3')} />

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[2] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[3] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[4] }
		/>
	{:else if currentStage === 4}
		<PopupTitle title={$_('quizPopup.title4')} />

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[5] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[6] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[7] }
		/>
	{:else if currentStage === 5}
		<PopupTitle title={$_('quizPopup.title5')} />

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[8] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[9] }
		/>

		<QuizItem
			on:setRating={setRating}
			{ ...quizArray[10] }
		/>
	{:else if currentStage === 6}
		<PopupTitle title={$_('quizPopup.title6')} />

		<Select
			title={$_('quizPopup.timelineSelectTitle')}
			id='timeline-select'
			options={timelineOptions}
			className='mb-8'
			on:change={setTimeline}
		/>

		<Select
			title={$_('quizPopup.yearSelectTitle')}
			id='year-select'
			options={yearSelectOptions}
			className='mb-8'
			on:change={setTimeline}
		/>
	{:else if currentStage === 7}
		<PopupTitle title={$_('quizPopup.title7')} />

		<p class="my-4">
			{$_('quizPopup.isThereAnythingToAdd')}
		</p>

		<Textarea
			placeholder="{$_('quizPopup.textAreaPlaceholder')}"
			maxlength="{maxCommentLength}"
			on:input={updateComment}
			className='mt-10'
		/>

		<p>
			{remainingCommentLength}
		</p>

		<div class="flex justify-center items-center h-24 relative w-full">
			{#if isLoading}
				<Spinner />
			{:else if isError && errorType === 'youRateTooOften'}
				<div class="italic font-bold text-center">
					{$_('errors.youRateTooOften')}
					<TextLink
						href="blog/how-to-become-citizen/"
						blank={true}
						text={$_('errors.youRateTooOftenLink')}
					/>
				</div>
			{:else if isError}
				<div class="italic font-bold">
					{errorsObj[errorType]}
				</div>
			{/if}
		</div>

	{/if}

	<div class="flex justify-evenly items-center my-4">
		{#if isUserLoggedIn && currentStage === 1}
			<PrimaryButton
				action={() => { changePersonalExperience(false) }}
				text={$_('quizPopup.noPersonalExperienceBtn')}
			/>
			<PrimaryButton
				action={() => { changePersonalExperience(true) }}
				text={$_('quizPopup.yesPersonalExperienceBtn')}
			/>
		{:else if currentStage === 1}
			<PrimaryButton
				action={() => { openAnotherOverlay('loginPopup') }}
				text={$_('quizPopup.loginBtn')}
			/>
		{:else}
			<SecondaryButton
				action={prevStage}
				text={$_('quizPopup.backBtn')}
			/>
			{#if currentStage === 7}
				<PrimaryButton
					action={debouncedSubmit}
					text={$_('quizPopup.submitBtn')}
				/>
			{:else}
				<PrimaryButton
					action={nextStage}
					text={$_('quizPopup.nextBtn')}
				/>
			{/if}
		{/if}
	</div>

	<div class="absolute inset-x-0 bottom-0 h-5">
		<div class="progress h-full w-0 progress-stage{currentStage}"></div>
	</div>
</div>

<style>
	.progress {
		background-color: var(--active-color);
		transition: width .5s;
	}

	.rating__status {
		opacity: 1;
	}

	.progress-stage1 {
		width: 0;
	}

	.progress-stage2 {
		width: 16.67%;
	}

	.progress-stage3 {
		width: 33.34%;
	}

	.progress-stage4 {
		width: 50%;
	}

	.progress-stage5 {
		width: 66.67%;
	}

	.progress-stage6 {
		width: 83.34%;
	}

	.progress-stage7 {
		width: 100%;
	}
</style>
