<script>
    import { page } from '$app/stores';
    import { _, json } from 'svelte-i18n';

    import OG from './OG.svelte';
    import Twitter from './Twitter.svelte';

    import { appInfo } from '../../../configs/index.js';
    import { API_DOMAIN, WEB_DOMAIN } from '../../../configs/env.js';

    export let keywords = $_('SEO.keywords');
    export let subject = $_('SEO.subject');
    export let isApp = true;

    export let isArticle = false;
    export let isSquareImage = true;
    export let imageAltText = '';
    export let description = '';
    export let pageTitle = '';
    export let siteTitle = $_('SEO.title');
    export let imageSrc = 'https://measureland.org/images/preview/square_100.jpg';
    export let url = `${$page.host || WEB_DOMAIN}${$page.path}`;

    export let author = $_('SEO.author');
    export let twitterUsername = appInfo.twitterID;
    export let timeToRead;

    export let isAnotherLang = true;
    const lang = $page.params.lang;
    const altLang = lang === 'en' ? 'ru' : 'en';
    const altPath = $page.path.replace(lang, altLang);
    const altUrl = `${$page.host || WEB_DOMAIN}${altPath}`;
</script>

<svelte:head>
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="me" href="mailto:{appInfo.personalEmail}">

    <meta http-equiv="Content-Security-Policy" content="
        base-uri 'self';
        connect-src 'self' {API_DOMAIN} plausible.io *.openstreetmap.org geocode-api.arcgis.com api.waqi.info api.openweathermap.org en.wikipedia.org eu1.locationiq.com;
        default-src 'self';
        font-src 'self' data:;
        img-src 'self' *.openstreetmap.org data:;
        media-src 'self';
        script-src 'self' 'unsafe-inline' plausible.io;
        style-src 'self' 'unsafe-inline';
    "/>

    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="subject" content={subject} />

    {#if isAnotherLang}
        <link rel="alternate" hreflang={lang} href={url} />
        <link rel="alternate" hreflang={altLang} href={altUrl} />
    {/if}

    <!-- <script defer data-domain="measureland.org" src="https://plausible.io/js/plausible.js"></script> -->

    <title>{pageTitle}</title>
</svelte:head>

<OG
    { isArticle }
    { isSquareImage }
    { imageAltText }
    { description }
    { pageTitle }
    { siteTitle }
    { imageSrc }
    { url }
/>

<Twitter
    { isArticle }
    { author }
    { twitterUsername }
    { imageSrc }
    { timeToRead }
/>

{#if isApp}
    <header class="flex justify-center items-center absolute -top-20 -z-5 w-full left-0">
        <!-- // testing purposes. Check if crawlers get it -->
        <h1 class="text-bold px-4 w-96">
            {description}
        </h1>

        <div class="opacity-20">
            {#each Object.values($json('startScreen.slides')) as { title, text1, text2 }}
                <h2>
                    {title}
                </h2>
                <p>
                    {text1}
                </p>
                <p>
                    {text2}
                </p>
            {/each}
        </div>
    </header>
{/if}
