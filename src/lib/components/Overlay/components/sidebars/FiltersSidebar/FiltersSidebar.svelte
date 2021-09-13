<script>
    import { _, json } from 'svelte-i18n'
    import SidebarWrap from '../SidebarWrap.svelte';
    import FiltersItem from './FiltersItem.svelte';

    import { appStateStore } from "../../../../../../stores/state.js";

    $: criteria = $json('criteria');
    $: filters = Object.keys(criteria).map((key, i) => ({
        title: criteria[key]['title'],
        tooltip: criteria[key]['tooltip'],
        isShortDesc: i === 0 ? false : true,
        key,
    }));

    const applyFilters = () => {
        // appStateStore.update(state => ({ ...state, isFiltersOn: true }));
        // getNewData()
        // showNotification('.filters_notification')
    }
</script>

<SidebarWrap>
    <h2 class="rating__title title rating__item_text comments__title sidebar__title">Set up filters</h2>
    <hr>
    <h4 class="fiters__subtitle">Try our filter presets:</h4>
    <ul class="settings__list filters__top_block">
        <li class="setting__item">
            <a href={"#"} data-preset="quiet" class="settings__link rating__title filter__preset">Quiet</a>
        </li>
        <li class="setting__item">
            <a href={"#"} data-preset="center" class="settings__link rating__title filter__preset">Stir</a>
        </li>
        <li class="setting__item">
            <a href={"#"} data-preset="nature" class="settings__link rating__title filter__preset">Nature</a>
        </li>
        <li class="setting__item">
            <a href={"#"} data-preset="perfect" class="settings__link rating__title filter__preset">The perfect place</a>
        </li>
    </ul>
    <hr>
    <ul class="filters__list">
        {#each filters as filterConfig}
            <FiltersItem { ...filterConfig } />
        {/each}
    </ul>
    <a href={"#"} class="filters__apply btn" on:click|preventDefault={applyFilters}>Apply</a>
    <a href={"#"} class="filters__reset">Reset</a>
    <div class="filters__bot">
        Do you like our free features without any ads? <a href="https://www.donationalerts.com/r/romanisthere" rel="noopener" target="_blank" class="footer__link">Support Measureland</a>, so we can keep it that way!
    </div>
</SidebarWrap>
