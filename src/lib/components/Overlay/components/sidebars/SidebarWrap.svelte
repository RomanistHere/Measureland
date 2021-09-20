<script>
    import CloseBtn from '../../../CloseBtn.svelte';

    export let className;

    const overlayType = 'sidebar';
    const buttonClassName = 'sidebar__close';
</script>

<div class="settings sidebar__section sidebar__section-show">
    <slot></slot>
</div>
<CloseBtn { overlayType } className={buttonClassName} />

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
