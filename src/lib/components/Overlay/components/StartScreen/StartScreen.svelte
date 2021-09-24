<script>
    import { _, json } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import SwiperCore, { Mousewheel, Pagination } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/pagination';

    import Slide from './Slide.svelte';
    import TextLink from '../../../TextLink.svelte';
    import CheckBox from '../../../CheckBox.svelte';
    import MainButton from '../MainButton.svelte';
    import SecondaryButton from '../SecondaryButton.svelte';
    import ScrollBottomText from './ScrollBottomText.svelte';

    import { setCookie, openAnotherOverlay, fillFiltersFromArrOfStrings } from '../../../../utilities/helpers.js';
    import { appStateStore } from '../../../../../stores/state.js';

    SwiperCore.use([Mousewheel, Pagination]);

    let shouldShowScrollCaption = true;

    $: contentSlides = Object.values($json('startScreen.slides')).map(item => ({
        ...item,
        action: item.action === 'openFilters'
            ? () => {
                closeStartScreen();
                fillFiltersFromArrOfStrings(['water:5-5']);
            }
            : () => {
                window.open(item.href,'_blank');
            }
    }));

    $: lastSlideList = Object.values($json('startScreen.lastSlide.list'));

    const onSlideChange = () => {
        shouldShowScrollCaption = false;
    }

    const closeStartScreen = () => {
        if (!$appStateStore.termsOfUseAgreed)
            return;
        appStateStore.update(state => ({ ...state, startScreen: false }));
        setCookie('startScreen', '0', 365);
    }

    const openRegister = () => {
        if (!$appStateStore.termsOfUseAgreed)
            return;
        closeStartScreen();
        openAnotherOverlay('registerPopup');
    }
</script>

{#if !$appStateStore.termsOfUseAgreed}
    <div class="fixed z-1 inset-0 lg:right-1/2"></div>
{/if}

<div
    class="start_screen fixed z-1 inset-0 lg:left-1/2 -lg:text-xl"
    transition:fade
>
    <Swiper
        direction='vertical'
        mousewheel={true}
        pagination={true}
        slidesPerView={1}
        on:slideChange|once={onSlideChange}
    >
        <SwiperSlide>
            <section class="flex items-center justify-center w-full h-full slide-1 px-10">
                <div class="max-w-xl">
                    <h1 class="lg:text-6xl -lg:text-5xl mb-5">
                        {$_('startScreen.firstSlide.titleLow')}
                        <span class="lg:text-7xl -lg:text-6xl font-bold">
                            {$_('startScreen.firstSlide.titleBig')}
                        </span>
                    </h1>
                    <p class="lg:text-2xl">
                        {$_('startScreen.firstSlide.text')}
                    </p>
                    <CheckBox
                        text='By using Measureland I agree with'
                        textLink='terms of use'
                        hrefLink='blog/terms-of-use/'
                        bind:checked={$appStateStore.termsOfUseAgreed}
                        className="mt-5 text-base"
                    />
                    <div class="flex items-center justify-left -lg:flex-wrap {!$appStateStore.termsOfUseAgreed && 'opacity-30'}">
                        <SecondaryButton
                            text={$_('startScreen.firstSlide.btn1')}
                            className="mr-5 mt-5"
                            disabled={!$appStateStore.termsOfUseAgreed}
                            action={closeStartScreen}
                        />
                        <MainButton
                            text={$_('startScreen.firstSlide.btn2')}
                            className='block mt-5'
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
                    <h1 class="lg:text-5xl -lg:text-3xl mb-10 @lg:text-5xl">
                        {$_('startScreen.lastSlide.title')}
                    </h1>
                    <ul>
                        {#each lastSlideList as {url, text}}
                            <li>
                                <TextLink href={url} { text } blank={true} className="text-2xl" />
                            </li>
                        {/each}
                    </ul>
                    <div class="flex items-center justify-left -lg:flex-wrap {!$appStateStore.termsOfUseAgreed && 'opacity-30'}">
                        <SecondaryButton
                            text={$_('startScreen.firstSlide.btn1')}
                            className="mr-5 mt-5"
                            disabled={!$appStateStore.termsOfUseAgreed}
                            action={closeStartScreen}
                        />
                        <MainButton
                            text={$_('startScreen.firstSlide.btn2')}
                            className='block mt-5'
                            disabled={!$appStateStore.termsOfUseAgreed}
                            action={openRegister}
                        />
                    </div>
                </div>
            </section>
        </SwiperSlide>
    </Swiper>

    {#if shouldShowScrollCaption}
        <ScrollBottomText text={$_('startScreen.ScrollToLearnMode')} />
    {/if}
</div>

<style>
    .slide-1 {
        background: radial-gradient(59.96% 40.57% at 80.44% 52.41%, #FFF0A0 0%, #D4EFF5 100%);
    }

    .start_screen {
        background-color: var(--bg-color);
        padding-top: var(--navbar-height);
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
