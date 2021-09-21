<script>
    import { Swiper, SwiperSlide } from 'swiper/svelte';
    import 'swiper/css';
</script>

<div class="start_screen fixed z-10 top-0 right-0 bottom-0 pt-20 left-1/2">
    <!-- <Swiper
        direction='vertical'
        slidesPerView={1}
        on:slideChange={() => console.log('slide change')}
        on:swiper={(e) => console.log(e.detail[0])}
    >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
    </Swiper> -->
</div>

<style>
    .start_screen {
        background-color: var(--bg-color);
    }
</style>
