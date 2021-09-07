<script>
    export let className = 'rate__spinner';
    // TODO: language support
    // TODO: extended version (with words)
</script>

<div class="spinner__wrap {className}">
    <div class="spinner__centr">
        <div class="spinner"></div>
        <p class="spinner__text">Loading</p>
    </div>
</div>

<style>
    .spinner__wrap {
        display: flex;
    }
</style>
