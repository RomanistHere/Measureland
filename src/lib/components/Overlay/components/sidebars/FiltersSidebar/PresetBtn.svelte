<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let presetNumber = 0;
    export let presetText = '';
    export let isActive = false;

    const onPresetBtnClick = () =>
        dispatch('presetClick', { presetNumber });
</script>

<a
    href={"#"}
    class="settings__link rating__title filter__preset {isActive ? 'filter__preset-active' : ''}"
    on:click|preventDefault={onPresetBtnClick}
>
    {presetText}
</a>
