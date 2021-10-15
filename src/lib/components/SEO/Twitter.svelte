<script>
    export let isArticle = false;
    export let author;
    export let twitterUsername;
    export let imageSrc;
    export let timeToRead = 0;
</script>

<svelte:head>
    <meta name="twitter:card" content="summary_large_image" />

    <meta name="twitter:creator" content={`@${twitterUsername}`} />
    <meta name="twitter:site" content={`@${twitterUsername}`} />
    <meta name="twitter:label1" content="Written by" />
    <meta name="twitter:data1" content={author} />
    {#if imageSrc}
        <meta name="twitter:image" content={imageSrc} />
    {/if}
    {#if isArticle && 0 < timeToRead}
        <meta name="twitter:label2" content="Est. reading time" />
        <meta name="twitter:data2" content={1 !== timeToRead ? `${timeToRead} minutes` : '1 minute'} />
    {/if}
</svelte:head>
