<script>
    import '/static/styles/blog.css';

    import EndCaption from './EndCaption.svelte';
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
    import Title from './Title.svelte';
    import SEO from '../../SEO/SEO.svelte';

    export let title;
    export let date;
    export let author;
    export let slug;
    export let description;
    export let isAnotherLang = true;
    export let isGuide = false;
</script>

<SEO
    isApp={false}
    description={description}
    isArticle={true}
    pageTitle={title}
    author={author}
    {isAnotherLang}
/>

<Header
    {slug}
    {isAnotherLang}
    {isGuide}
/>

<main class="article__wrap grt">
    <Title {title} />

    <article class="article">
        <slot>
        </slot>

        <EndCaption />
    </article>

    <Footer
        {date}
        {author}
        {isGuide}
    />
</main>
