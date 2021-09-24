<script>
    import CloseBtn from '../../../CloseBtn.svelte';

    export let className;

    const overlayType = 'sidebar';
    const buttonClassName = 'sidebar__close';
</script>

<div class="settings sidebar__section sidebar__section-show px-0 pt-8 pb-20">
    <slot></slot>
</div>
<CloseBtn { overlayType } className={buttonClassName} />
