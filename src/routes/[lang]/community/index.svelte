<script>
	import { _, json } from 'svelte-i18n';
	import '/static/styles/general.css';

	import SEO from '../../../lib/components/SEO/SEO.svelte';
	import Overlay from '../../../lib/components/Overlay/Overlay.svelte';
	import GlassGroup from '../../../lib/components/ui-elements/GlassGroup/GlassGroup.svelte';
</script>

<SEO
    pageTitle={$_('commuinty.titleSEO')}
    description={$_('commuinty.descriptionSEO')}
    imageSrc='https://measureland.org/images/PWA-icon-512x512.png'
	imageAltText={$_('SEO.imageAltText')}
    isApp={false}
/>

<section></section>

<div class="relative page">
    <h1 class="text-center pt-4 pb-8 px-4 text-5xl -md:text-4xl -md:pt-8">
        <strong>
			{$_('commuinty.title')}
		</strong>
		{$_('commuinty.titleEmoj')}
    </h1>

	<h2 class="pb-8 text-xl text-center px-60 -lg:px-4 -md:text-lg -md:pb-4">
		{$_('commuinty.subtitlePart1')}
		<strong>
			{$_('commuinty.subtitleStrong1')}
		</strong>
		{$_('commuinty.subtitlePart2')}
		<strong class="whitespace-nowrap">
			{$_('commuinty.subtitleStrong2')}
		</strong>
		{$_('commuinty.subtitlePart3')}
	</h2>

	<div class="flex justify-between -lg:block">
		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title={$_('commuinty.news.title')}
				list={$json('commuinty.news.list')}
			/>

			<GlassGroup
				title={$_('commuinty.members.title')}
				list={$json('commuinty.members.list')}
			/>
		</div>

		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title={$_('commuinty.tasks.title')}
				list={$json('commuinty.tasks.list')}
				type='vote'
			/>
		</div>

		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title={$_('commuinty.communities.title')}
				list={$json('commuinty.communities.list')}
			/>

			<GlassGroup
				title={$_('commuinty.developement.title')}
				list={$json('commuinty.developement.list')}
			/>
		</div>
	</div>

	<a href="../" class="hidden -lg:block underline text-right mx-4 pb-4">
		{$_('commuinty.linkBack')}
	</a>
</div>

<Overlay
	mainScreen={false}
	hiddenLoading={true}
/>

<style>
	:global(#svelte),
	:global(body),
	:global(html) {
		overflow: unset;
	}

    section {
		position: fixed;
        background:
			radial-gradient(22.66% 33.75% at 74.36% 14.26%, rgba(255, 240, 160, 0.85) 0%, rgba(212, 239, 245, 0) 100%),
			radial-gradient(41.2% 43.79% at 13.52% 54%, #FFE0FA 0%, rgba(255, 254, 254, 0) 100%),
			radial-gradient(33.57% 49.54% at 50.03% 94.11%, #FFD8D8 0%, rgba(212, 239, 245, 0) 100%),
			radial-gradient(26.63% 48.46% at 81.36% 69.46%, #D0CFFF 0%, rgba(212, 239, 245, 0) 100%),
			radial-gradient(23.18% 29.66% at 33.76% 31.67%, #C9FFC8 0%, #D4EFF5 100%);
        height: 100%;
        width: 100%;
		top: 0;
		left: 0;
    }

	.page {
        top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        .page {
            top: 0;
        }
    }
</style>
