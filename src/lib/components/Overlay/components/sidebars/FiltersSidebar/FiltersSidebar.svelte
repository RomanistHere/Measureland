<script>
    import { _, json } from 'svelte-i18n';

    import FiltersItem from './FiltersItem.svelte';
    import PresetBtn from './PresetBtn.svelte';
    import TextLink from '../../../../ui-elements/TextLink.svelte';

    import { filtersStore } from "../../../../../../stores/state.js";
    import { fillFiltersFromArrOfStrings, debounce, registerAction } from '../../../../../utilities/helpers.js';

    $: criteria = $json('criteria');
    $: filters = Object.keys(criteria).map((key, i) => ({
    	title: criteria[key]['title'],
    	tooltip: criteria[key]['tooltip'],
    	isShortDesc: 0 === i ? false : true,
    	key,
    	start: $filtersStore.filters && $filtersStore.filters[key]
    		? [ Number($filtersStore.filters[key].split('-')[0]), Number($filtersStore.filters[key].split('-')[1]) ]
    		: [ 1, 5 ],
    }));

    $: presets = [{
    	presetText: $_('filterSidebar.preset1Text'),
    	isActive: false,
    	value: [
    		"air:4-5",
    		"water:4-5",
    		"noize:4-5",
    		"clean:4-5",
    		"chill:4-5",
    		"pets:4-5",
    		"kids:4-5",
    		"safety:4-5",
    	],
    }, {
    	presetText: $_('filterSidebar.preset4Text'),
    	isActive: false,
    	value: [
    		"air:4-5",
    		"water:4-5",
    		"noize:4-5",
    		"chill:4-5",
    		"pets:3-5",
    		"logistic:4-5",
    		"transport:4-5",
    		"clean:4-5",
    		"safety:4-5",
    		"kids:3-5",
    		"parking:3-5",
    	],
    }, {
    	presetText: $_('filterSidebar.preset2Text'),
    	isActive: false,
    	value: [
    		"clean:4-5",
    		"safety:4-5",
    		"logistic:4-5",
    		"transport:4-5",
    		"parking:3-5",
    		"chill:3-5",
    	],
    }, {
    	presetText: $_('filterSidebar.preset3Text'),
    	isActive: false,
    	value: [
    		"air:5-5",
    		"water:5-5",
    		"noize:5-5",
    		"chill:5-5",
    		"pets:5-5",
    	],
    }];

    const refs = [
    	{ key: 'air', ref: null },
    	{ key: 'chill', ref: null },
    	{ key: 'clean', ref: null },
    	{ key: 'kids', ref: null },
    	{ key: 'logistic', ref: null },
    	{ key: 'noize', ref: null },
    	{ key: 'parking', ref: null },
    	{ key: 'pets', ref: null },
    	{ key: 'safety', ref: null },
    	{ key: 'transport', ref: null },
    	{ key: 'water', ref: null },
    ];

    const resetFilters = shouldGetNewData => {
    	if (false !== shouldGetNewData) {
    		presets = presets.map(item => ({ ...item, isActive: false }));
    		filtersStore.update(state => ({
    			...state,
    			isFiltersOn: true,
    			filters: null,
    		}));
    	}

    	const reset = refs.map(({ ref }) => { ref.setSlider([ 1, 5 ]) });
    	registerAction('filtersReset');
    };
    const debouncedResetFilters = debounce(resetFilters, 300);

    const applyPreset = event => {
    	const { presetNumber } = event.detail;
    	const preset = presets[presetNumber]['value'];
    	presets = presets.map((item, i) => ({
    		...item,
    		isActive: presetNumber === i,
    	}));

    	resetFilters(false);
    	fillFiltersFromArrOfStrings(preset, refs);
    	registerAction('filtersPreset');
    };
    const debouncedApplyPreset = debounce(applyPreset, 300);
</script>

<div class="min-h-full px-0 pt-8 pb-20 -lg:pb-4">
    <h2 class="font-bold px-8 text-xl mb-2">
        {$_('filterSidebar.title')}
    </h2>

    <h4 class="px-8 mb-2">
        {$_('filterSidebar.filterPresets')}
    </h4>

    <ul class="flex flex-wrap justify-between px-8 mb-4">
        {#each presets as { presetText, value, isActive }, presetNumber}
            <li>
                <PresetBtn
                    on:presetClick={debouncedApplyPreset}
                    { presetText }
                    { presetNumber }
                    { isActive }
                />
            </li>
        {/each}
    </ul>

    <ul>
        {#each filters as filterConfig, i}
            <FiltersItem { ...filterConfig } bind:this={refs[i].ref} />
        {/each}
    </ul>

    <div class="px-8 mb-4 text-right">
        <a
            href={"#"}
            class="underline cursor-default opacity-60"
            class:hoverable={$filtersStore.isFiltersOn}
            on:click|preventDefault={debouncedResetFilters}
        >
            {$_('filterSidebar.resetBtn')}
        </a>
    </div>

    <div class="px-8 text-sm -mb-10 -lg:mb-2">
        {$_('filterSidebar.footerText1')}
        <TextLink
            href="https://www.donationalerts.com/r/romanisthere"
            blank={true}
            text={$_('filterSidebar.footerLink')}
        />
        {$_('filterSidebar.footerText2')}
        <span class="text-xs hidden">{$_('filterSidebar.footerTextSmall')}</span>
    </div>
</div>

<style>
    .hoverable {
        opacity: 1;
        cursor: pointer;
        transition: color .2s;
    }

    .hoverable:hover {
        color: var(--active-color);
    }
</style>
