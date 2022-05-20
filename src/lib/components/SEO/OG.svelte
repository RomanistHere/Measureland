<script>
    import { locale } from "svelte-i18n";

    export let isArticle = false;
    export let isSquareImage = false;
    export let imageAltText = "";
    export let imageSrc;
    export let description;
    export let pageTitle;
    export let siteTitle;
    export let url;
</script>

<svelte:head>
    <meta property="og:site_name" content={siteTitle} />
    <meta property="og:locale" content={$locale} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={isArticle ? "article" : "website"} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    {#if isSquareImage}
        <meta property="og:image" content={imageSrc} />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:alt" content={imageAltText} />
    {:else if imageSrc}
        <meta property="og:image" content={imageSrc} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta property="og:image:alt" content={imageAltText} />
    {/if}
</svelte:head>
