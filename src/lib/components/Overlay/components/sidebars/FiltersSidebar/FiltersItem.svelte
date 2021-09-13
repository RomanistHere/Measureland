<script>
    import Slider from './Slider.svelte';

    import { filtersStore } from "../../../../../../stores/state.js";

    export let key = '';
    export let title = '';
    export let tooltip = '';
    export let currentValue = '1-5';
    export let isShortDesc = true;
    $: description = isShortDesc ? '' : 'current value: ';

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

        // TODO: maybe do
        // const presetElems = $All('.filter__preset')
        // presetElems.forEach(elem => { removeClass(elem, 'filter__preset-active') })
    }
</script>

<li class="filters__item">
    <span class="filters__label">
        {title}
        <div class="info">
            ?
            <span class="info__tooltip info__tooltip-top">
                {tooltip}
            </span>
        </div>
        <div class="filter__value_wrap">
            ({description}<span class="filter__value">{currentValue}</span>)
        </div>
    </span>

    <Slider
        className='filter__slider'
        on:slide={setFilterText}
        on:end={setFilter}
    />
</li>
