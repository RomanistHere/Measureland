<script>
    import { _ } from 'svelte-i18n';

    import ChangeLanguage from './ChangeLanguage.svelte';

    export let postsArray;
    export let blogOrGuides;
</script>

<nav class="article__nav">
    {$_('blog.navbar.text1')}
    <a class="article__link aside__link" href="../">
        {$_('blog.navbar.textLink2')}
    </a>
</nav>

<ChangeLanguage
    hrefEN='../../en/{blogOrGuides}/'
    hrefRU='../../ru/{blogOrGuides}/'
/>

<main class="article__wrap blog grt">
    <h1 class="blog__title">{$_(`blog.${blogOrGuides}Title`)}</h1>

    <ul class="blog__list">
        {#each postsArray as { slug, date, description, title }}
            <li class="blog__item">
                <a href="{slug}/" class="blog__link">
                    <p class="blog__title">{title}</p>
                </a>
            </li>
        {/each}
    </ul>
</main>

<style>
    p {
        margin: 1rem 0;
    }
</style>
