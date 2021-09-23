<script>
    export let action;
    export let text = 'Submit';
    export let className = '';
</script>

<button type="submit" class="text-base lg:text-lg rating__btn btn form__btn {className}" on:click|preventDefault={action}>{text}</button>
