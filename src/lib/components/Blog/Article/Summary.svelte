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
    .note {
        background-color: var(--gentle-color);
    }

    h3 {
        margin-top: 0;
        font-size: 100%;
    }
</style>
