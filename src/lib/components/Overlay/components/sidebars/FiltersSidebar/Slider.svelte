<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import noUiSlider from 'nouislider';
    import 'nouislider/dist/nouislider.min.css';
    import '/static/styles/slider.css';

    let slider;
    const dispatch = createEventDispatcher();

    export let className;
    export let start = [ 1, 5 ];
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
    	max: 5,
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
    		range,
    	});

    	slider.noUiSlider.on(
    		'update',
    		(values, handle, unencoded, tap, positions) =>
    			dispatch('update', { values, handle, unencoded, tap, positions }),
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
    			dispatch('end', { values, handle, unencoded, tap, positions }),
    	);
    });
</script>

<div class="{className}" bind:this={slider}></div>
