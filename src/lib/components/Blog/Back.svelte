<script>
    import { _ } from 'svelte-i18n';

    export let backLevel = 2;
    export let isGuide = false;
    export let className = '';
</script>

{#if backLevel === 2}
    <nav class="article__nav {className}">
        {$_('blog.navbar.text1')}
        <a class="article__link aside__link" href="../">
            {#if !isGuide}
                {$_('blog.navbar.textLink1')}
            {:else if isGuide}
                {$_('blog.navbar.textLink1Alter')}
            {/if}
        </a>
        {$_('blog.navbar.text2')}
        <a class="article__link aside__link" href="../../">
            {$_('blog.navbar.textLink2')}
        </a>
    </nav>
{:else if backLevel === 1}
    <nav class="article__nav">
        {$_('blog.navbar.text1')}
        <a class="article__link aside__link" href="../">
            {$_('blog.navbar.textLink2')}
        </a>
    </nav>
{/if}
