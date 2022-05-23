<script>
	import { _, locale } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import { communitiesInfoEN, communitiesInfoRU } from "../../../../../communities/index.js";
	import { closeOverlay, openAnotherOverlay } from "$lib/utilities/helpers.js";

	export let modalData;

	$: communityInfo = $locale === "ru"
		? communitiesInfoRU[modalData.communityID]
		: communitiesInfoEN[modalData.communityID];

	$: if (!communityInfo) {
		// change language to no info
		closeOverlay("modal");
	}

	$: currentKey = Object.keys(communityInfo.links)[0];
	$: currentValue = communityInfo.links[currentKey];
	$: isFirstFocused = false;

	const handleFocus = key => {
		if (!isFirstFocused)
			isFirstFocused = true;

		currentKey = key;
	};
</script>

<div
	class="fixed top-20 left-4 bg-white rounded-l-lg z-1 w-64 p-4 min-h-[30rem]"
	use:focusTrap
	in:fly="{{ y: 50, duration: 200 }}"
	out:fly="{{ y: 50, duration: 200 }}"
>
	<h1 class="text-2xl my-2">
		{$_("communityAbroadModal.title")} {communityInfo && communityInfo.name}
	</h1>

	<ul class="-mx-4 pb-16">
		{#each Object.entries(communityInfo.links) as [key, value], i}
			{#if value.length > 0}
				<li>
					<a
						href={"#"}
						on:click|preventDefault={() => {}}
						class="py-2.5 block text-txt_main px-4 hover:bg-bg_active hover:text-main focus:bg-bg_active focus:text-main transition-colors"
						class:bg-bg_active={i === 0 && !isFirstFocused}
						class:text-main={i === 0 && !isFirstFocused}
						class:text-txt_main={i !== 0 && isFirstFocused}
						on:mouseover={() => { handleFocus(key) }}
						on:focus={() => { handleFocus(key) }}
					>
						<span>
							{$_(`communityAbroadModal.keysToText.${key}.long`)}
						</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>

	<div class="absolute left-full top-0 bg-white h-full rounded-r-lg w-64 p-4 drop-shadow-[0_4px_7px_rgba(10,13,84,0.05)]">
		<h2 class="text-2xl my-2 mb-0 text-txt_main">
			{$_(`communityAbroadModal.keysToText.${currentKey}.short`)}
		</h2>
		<p class="text-sm text-txt_tertiary">
			{$_(`communityAbroadModal.keysToText.${currentKey}.description`)}
		</p>

		<ul class="mt-1 -mx-4">
			{#each currentValue as { text, link }}
				<li>
					<a
						href={link}
						target="_blank"
						class="block text-main hoverable-link px-4 py-2.5 leading-5"
					>
						{text}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="absolute inset-x-4 bottom-4">
		<a
			href={"#"}
			on:click|preventDefault={() => { openAnotherOverlay("feedbackPopup") }}
			class="text-sm text-txt_tertiary hover:text-main focus:text-main"
		>
			Добавить новое сообщество
		</a>
		<a
			href="https://t.me/MeasurelandBot"
			target="_blank"
			class="text-sm text-txt_tertiary hover:text-main focus:text-main"
		>
			Сообщить о неточности
		</a>
	</div>

	<CloseButton
		overlayType="modal"
		class="top-4 right-2"
	/>
</div>

<style>
	a:hover .hidden,
	a:focus .hidden {
		display: block;
	}
</style>
