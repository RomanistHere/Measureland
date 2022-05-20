<script>
	import { _, locale } from "svelte-i18n";

	import { communitiesInfoRU, communitiesInfoEN } from "../../../../../communities/index.js";
	import { closeOverlay } from "$lib/utilities/helpers.js";

	export let dialogData;

	$: communityInfo = $locale === "ru"
		? communitiesInfoRU[dialogData.communityID]
		: communitiesInfoEN[dialogData.communityID];

	$: if (!communityInfo) {
		// change language to no info
		closeOverlay("dialog");
	}
</script>

<h3 class="text-2xl -md:text-lg pr-6">
	Список полезных ресурсов русскоязычного сообщества в {communityInfo && communityInfo.name}.
</h3>

{#if communityInfo && communityInfo.telegramLinks && communityInfo.telegramLinks.length > 0}
	<h4 class="pt-4 font-bold">
		Телеграм:
	</h4>

	<ul class="pt-2">
		{#each communityInfo.telegramLinks as { text, link }}
			<li class="list-square ml-4">
				<a href={link} target="_blank" class="underline hoverable-link">{text}</a>
			</li>
		{/each}
	</ul>
{/if}

{#if communityInfo && communityInfo.otherLinks && communityInfo.otherLinks.length > 0}
	<h4 class="pt-4 font-bold">
		Другое:
	</h4>

	<ul class="pt-2">
		{#each communityInfo.otherLinks as { text, link }}
			<li class="list-square ml-4">
				<a href={link} target="_blank" class="underline hoverable-link">{text}</a>
			</li>
		{/each}
	</ul>
{/if}
