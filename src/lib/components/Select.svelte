<script>
    export let options = [];
    export let title = '';
    export let id = '';
</script>

<div class="rating__stars">
    <h2 class="rating__title title">{title}</h2>
    <select class="form__select" id="{id}" on:change>
        {#each options as { value, text, selected }, i}
            <option value={i} { selected }>{text}</option>
        {/each}
    </select>
</div>
