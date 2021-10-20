<script>
    import { _ } from 'svelte-i18n';

    import { appInfo } from '../../../../configs/index.js';

    const gihubLink = appInfo.github;
    const supportEmail = appInfo.supportEmail;
    const telegramLink = appInfo.telegramBot;
</script>

<hr>

<p>
    {$_('blog.endCpation.text1')}
    <a href="{gihubLink}" class="article__link" target="_blank" rel="noopener">
        {$_('blog.endCpation.textLink1')}
    </a>
    {$_('blog.endCpation.text2')}
    <a href="mailto:{supportEmail}" class="article__link">
        {supportEmail}
    </a>
    {$_('blog.endCpation.text3')}
    <a href="{telegramLink}" class="article__link" target="_blank" rel="noopener">
        {$_('blog.endCpation.textLink3')}
    </a>
</p>
