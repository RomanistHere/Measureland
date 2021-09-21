<script>
    import { fly } from 'svelte/transition';

    import CloseBtn from '../../../CloseBtn.svelte';

    export let className;

    const overlayType = 'popup';
</script>

<div
    class="rating__wrap {className}"
    in:fly="{{ y: 80, duration: 300 }}"
    out:fly="{{ y: -80, duration: 300 }}"
>
    <slot></slot>
    <CloseBtn { overlayType } />
</div>

<style>
    /* div {
        position: absolute;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 470px;
        height: 490px;

        background-color: var(--side-bg-color);
        border: 20px solid var(--bg-color);
        border-bottom-color: var(--bg-color-add);
        border-top-color: var(--bg-color-add);
    } */
</style>
