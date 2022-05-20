<script>
    import PrimaryButton from "./PrimaryButton.svelte";
    export let action;
    export let text = "";
    export let className = "";
    export let disabled = false;
</script>

<PrimaryButton
    { action }
    { text }
    { disabled }
    className="{className} secondary"
/>
