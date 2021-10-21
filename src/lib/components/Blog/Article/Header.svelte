<script>
    import { _ } from 'svelte-i18n';

    import FlagRU from '../../inline-images/FlagRU.svelte';
    import FlagGB from '../../inline-images/FlagGB.svelte';

    export let slug;
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

<aside class="aside">
    <a
        href="../../../ru/blog/{slug}/"
        class="w-14 h-8 inline-block rounded-md overflow-hidden"
    >
        <FlagRU className="w-full h-full" />
    </a>
    <a
        href="../../../en/blog/{slug}/"
        class="w-14 h-8 inline-block rounded-md overflow-hidden"
    >
        <FlagGB className="w-full h-full" />
    </a>
</aside>
