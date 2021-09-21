<script>
    import { onMount } from 'svelte';
    import SwiperCore, { Mousewheel } from 'swiper';

    let Slider;
    let Slide;

	onMount(async () => {
        SwiperCore.use([Mousewheel]);
		const module = await import('swiper/svelte');
        Slider = module.Swiper;
		Slide = module.SwiperSlide;
	});
</script>

<div class="start_screen fixed z-10 top-0 right-0 bottom-0 pt-20 left-1/2">
    <svelte:component
        this={Slider}
        direction='vertical'
        mousewheel={true}
        slidesPerView={1}
        on:slideChange={() => console.log('slide change')}
        on:swiper={(e) => console.log(e.detail[0])}
    >
        <svelte:component this={Slide}>Slide 1</svelte:component>
        <svelte:component this={Slide}>Slide 2</svelte:component>
        <svelte:component this={Slide}>Slide 3</svelte:component>
        <svelte:component this={Slide}>Slide 4</svelte:component>
    </svelte:component>
</div>

<style>
    .start_screen {
        background-color: var(--bg-color);
    }

    :global(.swiper) {
        height: 100%;
    }
</style>
