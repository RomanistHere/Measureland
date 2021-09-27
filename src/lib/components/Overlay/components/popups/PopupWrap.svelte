<script>
    import { fly } from 'svelte/transition';

    import CloseBtn from '../../../CloseBtn.svelte';

    export let className;

    const overlayType = 'popup';
</script>

<div
    class="rating__wrap popup-shadow {className}"
    in:fly="{{ y: 80, duration: 300 }}"
    out:fly="{{ y: -80, duration: 300 }}"
>
    <slot></slot>
    <CloseBtn { overlayType } className='top-1 right-1 z-2 -lg:top-3 -lg:right-3' />
</div>

<style>
    div {
        box-sizing: content-box;
    }
</style>
