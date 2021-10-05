<script>
    import InputSimple from './InputSimple.svelte';
    import GroupTitle from './GroupTitle.svelte';

    export let title;
    export let placeholder;
    export let autocomplete;
</script>

<div class="relative">
    <GroupTitle { title } />

    <InputSimple
        { autocomplete }
        { placeholder }
        on:change
    />
</div>
