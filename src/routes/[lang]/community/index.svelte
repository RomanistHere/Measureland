<script>
	import { _, json, locale } from "svelte-i18n";
	import "/static/styles/general.css";

	import SEO from "../../../lib/components/SEO/SEO.svelte";
	import Overlay from "../../../lib/components/Overlay/Overlay.svelte";
	import GlassGroup from "../../../lib/components/ui-elements/GlassGroup/GlassGroup.svelte";
</script>

<SEO
    pageTitle={$_("commuinty.titleSEO")}
    description={$_("commuinty.descriptionSEO")}
	imageSrc='https://measureland.org/images/preview/community_{$locale}_150.jpg'
	isSquareImage={false}
	imageAltText={$_("SEO.imageAltText")}
    isApp={false}
/>

<section class="fixed-grad-bg"></section>

<main class="relative page">
    <h1 class="text-center pt-4 pb-8 px-4 text-5xl -md:text-4xl -md:pt-8">
        <strong>
			{$_("commuinty.title")}
		</strong>
		{$_("commuinty.titleEmoj")}
    </h1>

	<h2 class="pb-8 text-xl text-center px-60 -lg:px-4 -md:text-lg -md:pb-4">
		{$_("commuinty.subtitlePart1")}
		<strong>
			{$_("commuinty.subtitleStrong1")}
		</strong>
		{$_("commuinty.subtitlePart2")}
		<strong class="whitespace-nowrap">
			{$_("commuinty.subtitleStrong2")}
		</strong>
		{$_("commuinty.subtitlePart3")}
	</h2>

	<div class="flex justify-between -lg:block">
		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title={$_("commuinty.news.title")}
				list={$json("commuinty.news.list")}
			/>

			<GlassGroup
				title={$_("commuinty.members.title")}
				list={$json("commuinty.members.list")}
				showedNumber={5}
			/>
		</div>

		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title={$_("commuinty.tasks.title")}
				list={$json("commuinty.tasks.list")}
				type='vote'
				showedNumber={7}
			/>
		</div>

		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title={$_("commuinty.communities.title")}
				list={$json("commuinty.communities.list")}
			/>

			<GlassGroup
				title={$_("commuinty.developement.title")}
				list={$json("commuinty.developement.list")}
			/>
		</div>
	</div>

	<a href="../" class="hidden -lg:block underline text-xl text-right mx-4 pb-4">
		{$_("commuinty.linkBack")}
	</a>
</main>

<Overlay
	mainScreen={false}
	hiddenLoading={true}
/>

<style>
	main {
        top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        main {
            top: 0;
        }
    }
</style>
