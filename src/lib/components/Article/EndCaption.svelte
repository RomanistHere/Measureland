<script>
    import { _ } from 'svelte-i18n';

    import TextLink from '../ui-elements/TextLink.svelte';

    import { appInfo } from '../../../configs/index.js';

    const gihubLink = appInfo.github;
    const supportEmail = appInfo.supportEmail;
    const telegramLink = appInfo.telegramBot;
</script>

{$_('blog.endCpation.text1')}
<TextLink
    href="{gihubLink}"
    blank={true}
    text={$_('blog.endCpation.textLink1')}
/>
{$_('blog.endCpation.text2')}
<TextLink
    href="mailto:{supportEmail}"
    text={supportEmail}
/>
{$_('blog.endCpation.text3')}
<TextLink
    href="{telegramLink}"
    blank={true}
    text={$_('blog.endCpation.textLink3')}
/>
