<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import noUiSlider from 'nouislider';
    import 'nouislider/dist/nouislider.min.css';

    let slider;
    const dispatch = createEventDispatcher();

    export let className;
    export let start = [1, 5];
    export let connect = true;
    // export let margin;
    // export let limit;
    // export let padding;
    export let step = 1;
    // export let orientation = 'horizontal';
    // export let direction = 'ltr';
    // export let tooltips = false;
    // export let animate = true;
    // export let animationDuration = 300;
    // export let keyboardSupport = true;
    export let range = {
        min: 1,
        max: 5
    };
    // export let behaviour = 'tap';

    export const set = value => slider.noUiSlider.set(value);
    export const getApi = () => slider.noUiSlider;

    onMount(() => {
        noUiSlider.create(slider, {
            start,
            connect,
            // margin,
            // limit,
            // padding,
            step,
            // orientation,
            // direction,
            // tooltips,
            // animate,
            // animationDuration,
            // keyboardSupport,
            // behaviour,
            range
        });

        slider.noUiSlider.on(
            'update',
            (values, handle, unencoded, tap, positions) =>
                dispatch('update', { values, handle, unencoded, tap, positions })
        );
        // slider.noUiSlider.on(
        //     'slide',
        //     (values, handle, unencoded, tap, positions) =>
        //         dispatch('slide', { values, handle, unencoded, tap, positions })
        // );
        // slider.noUiSlider.on(
        //     'set',
        //     (values, handle, unencoded, tap, positions) =>
        //         dispatch('set', { values, handle, unencoded, tap, positions })
        // );
        // slider.noUiSlider.on(
        //     'change',
        //     (values, handle, unencoded, tap, positions) =>
        //         dispatch('change', { values, handle, unencoded, tap, positions })
        // );
        // slider.noUiSlider.on(
        //     'start',
        //     (values, handle, unencoded, tap, positions) =>
        //         dispatch('start', { values, handle, unencoded, tap, positions })
        // );
        slider.noUiSlider.on(
            'end',
            (values, handle, unencoded, tap, positions) =>
                dispatch('end', { values, handle, unencoded, tap, positions })
        );
    });
</script>

<div class="slider {className}" bind:this={slider}></div>

<style>
    :global(.noUi-horizontal) {
        height: 14px;
    }

    :global(.noUi-horizontal .noUi-handle) {
        width: 26px;
        height: 22px;
        right: -12px;
        top: -5px;
    }

    :global(.noUi-handle::after), :global(.noUi-handle::before) {
        content: "";
        display: block;
        position: absolute;
        height: 12px;
        width: 1px;
        background: #E8E7E6;
        left: 10px;
        top: 4px;
    }

    :global(.noUi-handle::after) {
        left: 13px;
    }

    :global(.noUi-connect) {
        background-color: var(--bg-color);
    }
</style>
