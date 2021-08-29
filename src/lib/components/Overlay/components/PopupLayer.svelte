<script>
    import ShowRatingPopup from './ShowRatingPopup/ShowRatingPopup.svelte';
</script>

<div>
    <ShowRatingPopup />
</div>

<style>
    div {
        position: fixed;
        z-index: 1;

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        opacity: 1;
        background-color: rgba(0, 0, 0, .2);
        transition: opacity .5s;

        font-size: var(--normal-fz);
    }
</style>
