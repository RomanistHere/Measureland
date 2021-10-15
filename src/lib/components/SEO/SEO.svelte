<script>
    import { page } from '$app/stores';
    import { _ } from 'svelte-i18n';

    import OG from './OG.svelte';
    import Twitter from './Twitter.svelte';

    import { appInfo } from '../../../configs/index.js';
    import { API_DOMAIN } from '../../../configs/env.js';

    export let keywords = $_('SEO.keywords');
    export let subject = $_('SEO.subject');

    export let isArticle = false;
    export let isSquareImage = false;
    export let imageAltText = '';
    export let description = '';
    export let pageTitle = '';
    export let siteTitle = $_('SEO.title');
    export let imageSrc;
    export let url = `${$page.host}${$page.path}`;

    export let author = $_('SEO.author');
    export let twitterUsername = appInfo.twitterID;
    export let timeToRead;
</script>

<svelte:head>
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="me" href="mailto:{appInfo.personalEmail}">

    <meta http-equiv="Content-Security-Policy" content="
        base-uri 'self';
        connect-src 'self' {API_DOMAIN} plausible.io *.openstreetmap.org *.sentry.io geocode-api.arcgis.com;
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

<head class="flex justify-center items-center absolute -top-20">
    <h1 class="text-bold px-4 w-96">
        {description}
    </h1>
</head>
