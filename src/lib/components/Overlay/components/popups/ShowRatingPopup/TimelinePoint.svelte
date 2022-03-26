<script>
	import { fly } from 'svelte/transition';
	import { json, _ } from 'svelte-i18n';

	import TextButton from '../../../../ui-elements/TextButton.svelte';

	import { fetchSingleRating, reactOnRating } from '../../../../../utilities/api.js';
	import {
		showSuccessNotification,
		openAnotherOverlay,
		showSomethingWrongNotification,
		debounce,
		registerAction,
		logError,
	} from '../../../../../utilities/helpers.js';

	export let averageRating;
	export let timeline;
	export let _id;
	export let isActive = false;

	$: ratings = null;

	let isRatingExpanded = false;
	let tooltipTimeout = null;
	let isPersExp = false;
	let isOwnRating = false;
	let isAlreadyReported = false;
	let isAlreadyEndorsed = false;

	// eslint-disable-next-line no-unused-vars
	const resetRatings = ratingID => {
		// this needed for the case when user clicks
		// new ratings without closing previous one
		ratings = null;
	};

	$: resetRatings(_id);

	const handleTimeClick = async () => {
		if (!ratings) {
			const { error, data } = await fetchSingleRating(_id);

			if (error) {
				logError(error);
				showSomethingWrongNotification();
				return;
			}

			const { ratingData } = data;
			const { rating, isPersonalExperience, isReported, isEndorsed, isYours } = ratingData;
			ratings = Object.entries(rating).map(([ key, value ]) => ({ ...$json('criteria')[key], rating: value }));
			isPersExp = isPersonalExperience;
			isOwnRating = isYours;
			isAlreadyReported = isReported;
			isAlreadyEndorsed = isEndorsed;
			isRatingExpanded = true;
			registerAction('fetchRating');
		}
	};

	const handleMouseleave = () => {
		tooltipTimeout = setTimeout(() => { isRatingExpanded = false }, 100);
	};

	const handleMouseenter = () => {
		clearTimeout(tooltipTimeout);
		isRatingExpanded = true;
	};

	const reportRating = async () => {
		// const { error } = await reactOnRating(_id, true);

		openAnotherOverlay('reportReasonDialog', { id: _id });

		// if (!error) {
		// 	isAlreadyReported = true;
		// 	showSuccessNotification();
		// } else if (error === 'User is not logged in') {
		// 	openAnotherOverlay('loginPopup');
		// } else {
		// 	logError(error);
		// 	showSomethingWrongNotification();
		// }
		//
		// registerAction('reportRating');
	};

	const endorseRating = async () => {
		const { error } = await reactOnRating(_id, false);

		if (!error) {
			isAlreadyEndorsed = true;
			showSuccessNotification();
		} else if (error === 'User is not logged in') {
			openAnotherOverlay('loginPopup');
		} else {
			logError(error);
			showSomethingWrongNotification();
		}

		registerAction('endorseRating');
	};

	const debouncedEndorseRating = debounce(endorseRating, 300);
	const debouncedReportRating = debounce(reportRating, 300);
</script>

<a
	href={"#"}
	class="rounded-md px-2 py-0.5 text-sm mb-1 block relative z-5"
	class:active={isActive}
	on:mouseenter={handleMouseenter}
	on:mouseleave={handleMouseleave}
	on:click|preventDefault={handleTimeClick}
>
	{timeline}

	{#if isRatingExpanded}
		<div
			class="info__tooltip text-sm w-80 absolute z-1 p-2 rounded-md font-normal glassmorphism cursor-default"
			in:fly="{{ y: 10, duration: 200 }}"
			out:fly="{{ y: -10, duration: 200 }}"
		>
			{#if ratings}
				<div class="font-bold">
					{#if isPersExp}
						{$_('timelinePoint.personalExp')}
					{:else}
						{$_('timelinePoint.alienExp')}
					{/if}
					<p>
						{$_('timelinePoint.average')}: {averageRating}
					</p>
				</div>
				{#each ratings as { title, rating }}
					<div class="my-2">
						{title}:
						<span class="font-bold text-base">{rating}</span>
					</div>
				{/each}

				{#if isOwnRating}
					<span class="font-bold">{$_('timelinePoint.yourRating')}</span>
				{:else if !isAlreadyReported && !isAlreadyEndorsed}
					<TextButton
						text={$_('timelinePoint.report')}
						className='px-1 font-bold'
						action={debouncedReportRating}
					/>

					<TextButton
						text={$_('timelinePoint.endorse')}
						className='px-1 font-bold'
						action={debouncedEndorseRating}
					/>
				{:else if isAlreadyReported}
					{$_('timelinePoint.reported')}
				{:else if isAlreadyEndorsed}
					{$_('timelinePoint.endorsed')}
				{/if}
			{:else}
				{$_('timelinePoint.clickToExpand', { values: [ averageRating ] })}
			{/if}
		</div>
	{/if}
</a>

<style>
	a {
		background-color: var(--neutral-feeling-color);
		transition: background-color .5s, color .5s;
	}

	.active,
	a:hover {
		background-color: var(--active-color);
		color: var(--side-bg-color);
	}

	.active {
		cursor: default;
	}

	.info__tooltip {
		color: var(--text-color);

		bottom: 160%;
		left: -8.5rem;
	}

	.info__tooltip::after {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: var(--text-color) transparent transparent transparent;
	}
</style>
