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
    export let imageSrc;

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
    {imageSrc}
    isSquareImage={!imageSrc}
/>

<section class="fixed-grad-bg"></section>

<main class="grt static mx-auto glassmorphism box-content mb-4 -lg:m-2 overflow-hidden">
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

<a href="../" class="hidden relative -lg:block text-xl underline text-right mx-4 py-4">
    {$_('blog.linkBack')}
</a>

<footer class="grt static mx-auto glassmorphism box-content mb-2 -lg:m-2">
    <EndCaption />

    <span class="text-center text-base block -mb-4 mt-4 -md:mb-0">
        {author}
        {$_('blog.footer.copyright1')}
        <span class="desktop">
            {yearsCopyright}.
            {$_('blog.footer.copyright2')}
        </span>
    </span>
</footer>

<div class="static w-full h-2"></div>

<Overlay
	mainScreen={false}
	hiddenLoading={true}
/>

<style>
    @media screen and (min-width: 766px) {
        main {
            margin-top: var(--distance-top);
        }
    }
</style>
