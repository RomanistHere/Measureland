<script>
    import { _ } from 'svelte-i18n';

    export let text;
</script>

<div class="note">
    <h3>
        {$_('blog.summary')}
    </h3>

    <p>
        {text}
    </p>
</div>

<style>
    h3 {
        margin-top: 0;
        font-size: 100%;
    }

    .note {
        background-color: rgba(163, 255, 209, 0.75);
        backdrop-filter: blur(5px) saturate(180%);
        -webkit-backdrop-filter: blur(5px) saturate(180%);
        border-radius: 0.375rem;
    }
</style>
