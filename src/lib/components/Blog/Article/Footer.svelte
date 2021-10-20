<script>
    import { page } from '$app/stores';
    import { appInfo } from '../../../../configs/index.js';

    export let date;
    export let author = appInfo.authorName;

    const { lang } = $page.params;
    const langCode = lang === 'ru' && 'ru-RU';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
</script>

<footer>
    <p class="article__date">
        Last changes: {new Date(date).toLocaleDateString(langCode, options)}
    </p>
    <p class="article__copyright">
        {author} for Measureland © <span class="desktop">2021. All rights reserved.</span>
    </p>
</footer>
