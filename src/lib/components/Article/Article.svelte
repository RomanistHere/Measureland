<script>
    import { _, locale } from 'svelte-i18n';

    import '/static/styles/general.css';
    import '/static/styles/grt.css';

    import EndCaption from './EndCaption.svelte';
    import SEO from '../SEO/SEO.svelte';
    import Overlay from '../Overlay/Overlay.svelte';

    import { appInfo } from '../../../configs/index.js';
    import { getCopyrightYears } from '../../utilities/helpers.js';

    export let title;
    export let date;
    export let author = appInfo.authorName;
    export let description;
    export let isAnotherLang = true;

    const langCode = $locale === 'ru' && 'ru-RU';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const yearsCopyright = getCopyrightYears();
</script>

<SEO
    isApp={false}
    description={description}
    isArticle={true}
    pageTitle="{$_('navBar.logoTitle')} - {title}"
    author={author}
    {isAnotherLang}
/>

<section class="fixed-grad-bg"></section>

<main class="grt static mx-auto glassmorphism box-content mb-4 overflow-hidden">
    <h1>
        {title}
    </h1>

    <article>
        <slot>
        </slot>

    </article>

    <span class="text-right italic block">
        {$_('blog.footer.lastChanges')}
        {new Date(date).toLocaleDateString(langCode, options)}
    </span>
</main>

<footer class="grt static mx-auto glassmorphism box-content mb-2">
    <EndCaption />

    <span class="text-center text-base block -mb-4 mt-4">
        {author}
        {$_('blog.footer.copyright1')}
        <span class="desktop">
            {yearsCopyright}.
            {$_('blog.footer.copyright2')}
        </span>
    </span>
</footer>

<div class="static w-full h-2"></div>

<a href="../" class="hidden relative -lg:block underline text-right mx-4 pb-4">
    {$_('blog.linkBack')}
</a>

<Overlay
	mainScreen={false}
	hiddenLoading={true}
/>

<style>
	main {
        margin-top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        main {
            margin-top: 0;
        }
    }
</style>
