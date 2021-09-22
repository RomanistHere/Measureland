<script>
    import { fade } from 'svelte/transition';
    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import SwiperCore, { Mousewheel, Pagination } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/pagination';

    import Slide from './Slide.svelte';
    import MainButton from '../MainButton.svelte';
    import SecondaryButton from '../SecondaryButton.svelte';

    SwiperCore.use([Mousewheel, Pagination]);

    let shouldShowScrollCaption = true;

    const contentSlides = [{
        title: `We are simple and useful`,
        btnText: `Check good water around`,
        btnAction: () => {
            // open filters
            // remove layer
        },
        text: `We help people by saving time, energy and reducing the stress 🤯 while looking for a place to stay.`,
        text2: `Check the districts with good or bad water quality 💧 in the town (by townsman's opionion) in literally three clicks from now.`
    },{
        title:`We are community driven`,
        btnText: `Check our community guides`,
        btnAction: () => {
            // link to github
        },
        text: `There are no thing like promoted rating or paid review here. Content created for people by people.`,
        text2: `Become the creator. We will help you 👋`
    },{
        title: `We are non-commercial`,
        btnText: `Support us`,
        btnAction: () => {
            // link to support
        },
        text: `We would love your support, but making the money is not the goal of this service.`,
        text2: `There are more important things in life 🌼`
    },{
        title: `We are privacy oriented`,
        btnText: `Check our code`,
        btnAction: () => {
            // link to github
        },
        text: `Do not trust our words 🙈 Trust our code 🙉 It is open source.`,
        text2: `We can't sell or lose your personal data because we don't collect it 🙊`
    }];

    const onSlideChange = () => {
        shouldShowScrollCaption = false;
    }
</script>

<div
    class="start_screen fixed z-10 top-0 right-0 bottom-0 pt-20 left-1/2"
>
    <Swiper
        direction='vertical'
        mousewheel={true}
        pagination={true}
        slidesPerView={1}
        on:slideChange={onSlideChange}
        on:swiper={(e) => console.log(e.detail[0])}
    >
        <SwiperSlide>
            <section class="flex items-center justify-center w-full h-full">
                <div class="max-w-xl">
                    <h1 class="text-6xl mb-5">
                        Welcome to
                        <span class="text-7xl font-bold">
                            Measureland
                        </span>
                    </h1>
                    <p class="text-2xl mb-5">
                        Free service we built to help you share your residential experiences and find the best place 🏡 to rent or buy.
                    </p>
                    <div class="flex items-center justify-left">
                        <SecondaryButton text="Continue without signing in" className="mr-5" />
                        <MainButton text="Create account" className='block' />
                    </div>
                </div>
            </section>
        </SwiperSlide>

        {#each contentSlides as slideData}
            <SwiperSlide>
                <Slide { ...slideData } />
            </SwiperSlide>
        {/each}
    </Swiper>

    {#if shouldShowScrollCaption}
        <div class="absolute bottom-5 w-full flex justify-center animate-bounce" transition:fade>
            <svg class="mx-5 w-6 h-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            Scroll to learn more
            <svg class="mx-5 w-6 h-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
    {/if}
</div>

<style>
    .start_screen {
        background-color: var(--bg-color);
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
</style>
