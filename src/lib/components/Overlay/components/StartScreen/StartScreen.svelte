<script>
    import { fade } from 'svelte/transition';
    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import SwiperCore, { Mousewheel, Pagination } from 'swiper';
    import 'swiper/css';
    import 'swiper/css/pagination';

    import Slide from './Slide.svelte';

    SwiperCore.use([Mousewheel, Pagination]);

    let shouldShowScrollCaption = true;

    const slides = [{
        title: 'We are useful',
        text: 'We help people by saving time, energy and reducing the stress while looking for a place to stay.'
    },{
        title: 'We are community driven',
        text: 'There are no thing like promoted rating or paid review. Content created for people by people.'
    },{
        title: 'We are non-commercial',
        text: 'We would love your attention, but making the money is not the goal of this service.'
    },{
        title: 'We are privacy oriented',
        text: 'Do not trust our words. Trust our code. It is open source. We do not share personal data.'
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
        {#each slides as { title, text }}
            <SwiperSlide>
                <Slide { title } { text } />
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

    :global(.swiper-pagination-bullet-active) {
        background: var(--active-color);
    }
</style>
