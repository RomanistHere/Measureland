<script>
    import MainButton from './MainButton.svelte';
    export let action;
    export let text = '';
    export let className = '';
    export let disabled = false;
</script>

<MainButton
    { action }
    { text }
    { disabled }
    className="{className} btn-low"
/>

<style>

</style>
