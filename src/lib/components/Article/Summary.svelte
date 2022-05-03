<script>
    import { _ } from 'svelte-i18n';

    export let text;
    export let text2;
</script>

<div class="note">
    <strong class="mb-2 mt-1 block">
        {$_('blog.summary')}
    </strong>

    <p>
        {text}
    </p>

    {#if text2}
        <p>
            {text2}
        </p>
    {/if}
</div>

<style>
    .note {
        background-color: rgba(163, 255, 209, 0.75);
        backdrop-filter: blur(5px) saturate(180%);
        -webkit-backdrop-filter: blur(5px) saturate(180%);
        border-radius: 0.375rem;
    }
</style>
