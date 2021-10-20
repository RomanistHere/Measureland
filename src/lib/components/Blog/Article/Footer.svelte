<script>
    import { _, locale } from 'svelte-i18n';

    import { appInfo } from '../../../../configs/index.js';

    export let date;
    export let author = appInfo.authorName;

    const langCode = $locale === 'ru' && 'ru-RU';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    const yearsCopyright = currentYear === startYear ? currentYear : `${startYear}-${currentYear}`;
</script>

<footer>
    <p class="article__date">
        {$_('blog.footer.lastChanges')}
        {new Date(date).toLocaleDateString(langCode, options)}
    </p>
    <p class="article__copyright">
        {author}
        {$_('blog.footer.copyright1')}
        <span class="desktop">
            {yearsCopyright}.
            {$_('blog.footer.copyright2')}
        </span>
    </p>
</footer>
