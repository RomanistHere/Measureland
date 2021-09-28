<script>
    import { _ } from 'svelte-i18n';

    import Slider from './Slider.svelte';
    import Tooltip from '../../../../Tooltip.svelte';

    import { filtersStore } from "../../../../../../stores/state.js";

    let slider;
    export const setSlider = val => slider.set(val);

    export let key = '';
    export let title = '';
    export let tooltip = '';
    export let start = [1, 5];
    export let currentValue = '1-5';
    export let isShortDesc = true;
    $: description = isShortDesc ? '' : $_('filterSidebar.currentValue');

    const setFilterText = e => {
        const { values, handle, unencoded } = e.detail;
        const [leftVal, rightVal] = unencoded;
        currentValue = leftVal !== rightVal
            ? `${leftVal}-${rightVal}`
            : leftVal;
    }

    const setFilter = e => {
        const { values, handle, unencoded } = e.detail;
        const [leftVal, rightVal] = unencoded;
        filtersStore.update(state => {
            let newState = {
                ...state,
                isFiltersOn: true,
                filters: {
                    ...state.filters,
                    [key]: `${leftVal}-${rightVal}`
                }
            };

            if (leftVal === 1 && rightVal === 5)
                delete newState.filters[key];

            if (Object.keys(newState.filters).length === 0)
                newState = { ...newState, filters: null };

            return newState;
        });

        // TODO: maybe do thorugh dispatch event
        // const presetElems = $All('.filter__preset')
        // presetElems.forEach(elem => { removeClass(elem, 'filter__preset-active') })
    }
</script>

<li class="mb-4 px-8 text-base">
    <span>
        {title}
        <Tooltip { tooltip } />
        <div class="inline-block font-bold">
            ({description}{currentValue})
        </div>
    </span>

    <Slider
        className='my-2 mx-3'
        on:update={setFilterText}
        on:end={setFilter}
        bind:this={slider}
        { start }
    />
</li>
