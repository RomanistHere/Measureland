<script>
    import CloseBtn from '../../../CloseBtn.svelte';

    export let className;

    const overlayType = 'sidebar';
    const buttonClassName = 'sidebar__close';
</script>

<div class="min-h-full px-0 pt-8 pb-20 -lg:pb-4">
    <slot></slot>
</div>
<CloseBtn { overlayType } className={buttonClassName} />

<style>
    div {
        background-color: var(--side-bg-color);
    }
</style>
