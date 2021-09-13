<script>
    import { _, json } from 'svelte-i18n';
    import SidebarWrap from '../SidebarWrap.svelte';
    import FiltersItem from './FiltersItem.svelte';
    import PresetBtn from './PresetBtn.svelte';

    import { filtersStore } from "../../../../../../stores/state.js";
    import { filterReferences } from "../../../../../../stores/references.js";
    import { fillFiltersFromArrOfStrings, debounce } from '../../../../../utilities/helpers.js'

    $: criteria = $json('criteria');
    $: filters = Object.keys(criteria).map((key, i) => ({
        title: criteria[key]['title'],
        tooltip: criteria[key]['tooltip'],
        isShortDesc: i === 0 ? false : true,
        key,
    }));

    let refs = $filterReferences;
    $: filterReferences.update(store => [ ...refs ]);

    const applyFilters = () => {
        // filtersStore.update(state => ({ ...state, isFiltersOn: true }));
        // showNotification('.filters_notification')
    }

    const resetFilters = shouldGetNewData => {
        if (shouldGetNewData !== false) {
            presets = presets.map(item => ({ ...item, isActive: false }));
            filtersStore.update(state => ({
                ...state,
                isFiltersOn: true,
                filters: null
            }));
        }

        refs.map(({ ref }) => { ref.setSlider([1,5]); });

        // hideNotification('.filters_notification')
    }
    const debouncedResetFilters = debounce(resetFilters, 300);

    const applyPreset = event => {
        const { presetNumber } = event.detail;
        const preset = presets[presetNumber]['value'];
        presets = presets.map((item, i) => ({
            ...item,
            isActive: presetNumber === i
        }));

        resetFilters(false);
        fillFiltersFromArrOfStrings(preset, refs);

        // showNotification('.filters_notification')
    }
    const debouncedApplyPreset = debounce(applyPreset, 300);

    let presets = [{
        presetText: $_('filterSidebar.preset1Text'),
        isActive: false,
        value: ["air:4-5", "water:4-5", "noize:4-5", "clean:4-5", "chill:4-5", "pets:4-5", "kids:4-5", "safety:4-5"]
    },{
        presetText: $_('filterSidebar.preset2Text'),
        isActive: false,
        value: ["clean:4-5", "safety:4-5", "logistic:4-5", "transport:4-5", "parking:3-5", "chill:3-5"]
    },{
        presetText: $_('filterSidebar.preset3Text'),
        isActive: false,
        value: ["air:5-5", "water:5-5", "noize:5-5", "chill:5-5", "pets:5-5"]
    },{
        presetText: $_('filterSidebar.preset4Text'),
        isActive: false,
        value: ["air:4-5", "water:4-5", "noize:4-5", "chill:4-5", "pets:3-5", "logistic:4-5", "transport:4-5", "clean:4-5", "safety:4-5", "kids:3-5", "parking:3-5"]
    }];
</script>

<SidebarWrap>
    <h2 class="rating__title title rating__item_text comments__title sidebar__title">{$_('filterSidebar.title')}</h2>
    <hr>
    <h4 class="fiters__subtitle">{$_('filterSidebar.filterPresets')}</h4>
    <ul class="settings__list filters__top_block">
        {#each presets as { presetText, value, isActive }, presetNumber}
            <li class="setting__item">
                <PresetBtn
                    on:presetClick={debouncedApplyPreset}
                    { presetText }
                    { presetNumber }
                    { isActive }
                />
            </li>
        {/each}
    </ul>
    <hr>
    <ul class="filters__list">
        {#each filters as filterConfig, i}
            <FiltersItem { ...filterConfig } bind:this={refs[i].ref} />
        {/each}
    </ul>
    <a href={"#"} class="filters__apply btn" on:click|preventDefault={applyFilters}>{$_('filterSidebar.applyBtn')}</a>
    <a href={"#"} class="filters__reset" on:click|preventDefault={debouncedResetFilters}>{$_('filterSidebar.resetBtn')}</a>
    <div class="filters__bot">
        {$_('filterSidebar.footerText1')}
        <a href="https://www.donationalerts.com/r/romanisthere" rel="noopener" target="_blank" class="footer__link">
            {$_('filterSidebar.footerLink')}
        </a>
        {$_('filterSidebar.footerText2')}
        <span class="filters__bot-small">{$_('filterSidebar.footerTextSmall')}</span>
    </div>
</SidebarWrap>
