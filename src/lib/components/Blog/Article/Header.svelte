<script>
    import { _ } from 'svelte-i18n';

    import ChangeLanguage from '../ChangeLanguage.svelte';

    export let slug;
    export let isAnotherLang = true;
</script>

<nav class="article__nav">
    {$_('blog.navbar.text1')}
    <a class="article__link aside__link" href="../">
        {$_('blog.navbar.textLink1')}
    </a>
    {$_('blog.navbar.text2')}
    <a class="article__link aside__link" href="../../">
        {$_('blog.navbar.textLink2')}
    </a>
</nav>

{#if isAnotherLang}
    <ChangeLanguage
        hrefEN='../../../en/blog/{slug}/'
        hrefRU='../../../ru/blog/{slug}/'
    />
{/if}
