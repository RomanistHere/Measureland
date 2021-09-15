<script>
    export let action;
    export let text = 'Submit';
    export let className = '';
</script>

<button type="submit" class="rating__btn btn form__btn {className}" on:click|preventDefault={action}>{text}</button>
