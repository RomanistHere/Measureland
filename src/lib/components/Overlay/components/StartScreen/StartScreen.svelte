<script>
	import { _, json } from 'svelte-i18n';
	import { fade } from 'svelte/transition';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Mousewheel, Pagination } from 'swiper';
	import 'swiper/css';
	import 'swiper/css/pagination';

	import Slide from './Slide.svelte';
	import TextLink from '../../../ui-elements/TextLink.svelte';
	import CheckBox from '../../../ui-elements/CheckBox.svelte';
	import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';
	import SecondaryButton from '../../../ui-elements/SecondaryButton.svelte';
	import ScrollBottomText from './ScrollBottomText.svelte';

	import {
		fillFiltersFromArrOfStrings,
		openAnotherOverlay,
		registerAction,
		setCookie,
		centerMap,
	} from '../../../../utilities/helpers.js';
	import { appStateStore, isDesktop } from '../../../../../stores/state.js';
	import { mapReference } from "../../../../../stores/references.js";

	SwiperCore.use([ Mousewheel, Pagination ]);

	let shouldShowScrollCaption = true;
	const map = $mapReference;

	$: contentSlides = Object.values($json('startScreen.slides')).map(item => ({
		...item,
		action: item.action === 'openFilters'
			? () => {
				if (!$appStateStore.termsOfUseAgreed)
					return;
				closeStartScreen();
				centerMap(map, 53.9, 27.5, $isDesktop);
				setTimeout(() => {
					fillFiltersFromArrOfStrings([ 'water:5-5' ]);
				}, 1000);
			}
			: () => {
				registerAction('startScreenExternalLink');
				window.open(item.href, '_blank');
			},
		disabled: item.action === 'openFilters' && !$appStateStore.termsOfUseAgreed,
	}));

	$: lastSlideList = Object.values($json('startScreen.lastSlide.list'));

	const onSlideChange = () => {
		shouldShowScrollCaption = false;
		registerAction('startScreenSlideChange');
	};

	const closeStartScreen = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		appStateStore.update(state => ({ ...state, startScreen: false }));
		setCookie('startScreen', '0', 365);
	};

	const openRegister = () => {
		if (!$appStateStore.termsOfUseAgreed)
			return;
		closeStartScreen();
		openAnotherOverlay('registerPopup');
	};
</script>

{#if !$appStateStore.termsOfUseAgreed}
	<div class="fixed z-1 inset-0 lg:right-1/2"></div>
{/if}

<div
	class="start_screen fixed z-1 inset-4 lg:left-1/2 -lg:text-xl glassmorphism"
	transition:fade
>
	<Swiper
		direction='vertical'
		mousewheel={true}
		pagination={{ clickable: true }}
		slidesPerView={1}
		on:slideChange={onSlideChange}
	>
		<SwiperSlide>
			<section class="flex items-center justify-center w-full h-full slide-1 px-10">
				<div class="max-w-xl">
					<h1 class="lg:text-6xl -lg:text-5xl -md:text-3xl mb-5">
						{$_('startScreen.firstSlide.titleLow')}
						<span class="lg:text-7xl -lg:text-6xl -md:text-5xl font-bold">
                            {$_('startScreen.firstSlide.titleBig')}
                        </span>
					</h1>
					<p class="lg:text-2xl -md:text-base">
						{$_('startScreen.firstSlide.text')}
					</p>
					<CheckBox
						text={$_('startScreen.checkboxText')}
						textLink={$_('startScreen.checkboxLink')}
						hrefLink='blog/terms-of-use/'
						bind:checked={$appStateStore.termsOfUseAgreed}
						className="mt-5 text-base -md:text-sm"
					/>
					<div
						class="flex items-center justify-left -lg:flex-wrap {!$appStateStore.termsOfUseAgreed && 'opacity-30'}"
					>
						<SecondaryButton
							text={$_('startScreen.firstSlide.btn1')}
							className="mr-5 mt-5 -md:text-sm"
							disabled={!$appStateStore.termsOfUseAgreed}
							action={closeStartScreen}
						/>
						<PrimaryButton
							text={$_('startScreen.firstSlide.btn2')}
							className='block mt-5 -md:text-sm'
							disabled={!$appStateStore.termsOfUseAgreed}
							action={openRegister}
						/>
					</div>
				</div>
			</section>
		</SwiperSlide>

		{#each contentSlides as slideData, i}
			<SwiperSlide>
				<Slide { ...slideData } slideNumber={i} />
			</SwiperSlide>
		{/each}

		<SwiperSlide>
			<section class="flex items-center justify-center w-full h-full slide-1 px-10">
				<div class="max-w-xl">
					<h1 class="lg:text-5xl -lg:text-3xl mb-10 @lg:text-5xl -md:text-2xl">
						{$_('startScreen.lastSlide.title')}
					</h1>
					<ul class="list-inside">
						{#each lastSlideList as { url, text }}
							<li>
								<TextLink
									href={url} { text } blank={true} className="text-2xl leading-9 -md:text-base"
								/>
							</li>
						{/each}
					</ul>
					<div
						class="flex items-center justify-left mt-4 -lg:flex-wrap {!$appStateStore.termsOfUseAgreed && 'opacity-30'}"
					>
						<SecondaryButton
							text={$_('startScreen.firstSlide.btn1')}
							className="mr-5 mt-5 -md:text-sm"
							disabled={!$appStateStore.termsOfUseAgreed}
							action={closeStartScreen}
						/>
						<PrimaryButton
							text={$_('startScreen.firstSlide.btn2')}
							className='block mt-5 -md:text-sm'
							disabled={!$appStateStore.termsOfUseAgreed}
							action={openRegister}
						/>
					</div>
				</div>
			</section>
		</SwiperSlide>
	</Swiper>

	{#if shouldShowScrollCaption}
		<ScrollBottomText text={$_('startScreen.scrollToLearnMode')} />
	{/if}
</div>

<style>
	.start_screen {
		top: var(--distance-top);
	}

	:global(.swiper) {
		height: 100%;
	}

	:global(.swiper-pagination-bullet) {
		background: var(--text-color);
	}

	:global(.swiper-pagination-bullet-active) {
		background: var(--active-color);
	}

	ul {
		list-style-type: square;
	}
</style>
