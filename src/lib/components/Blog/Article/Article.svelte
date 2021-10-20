<script>
    import '/static/styles/blog.css';

    import EndCaption from './EndCaption.svelte';
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';

    export let title;
    export let date;
    export let author;
</script>

<main class="article__wrap grt">
    <Header {title} />

    <article class="article">
        <slot>
        </slot>

        <EndCaption />
    </article>

    <Footer {date} {author} />
</main>
