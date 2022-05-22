<script>
	import { _, locale } from "svelte-i18n";
	import { fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import { communitiesInfoEN, communitiesInfoRU } from "../../../../../communities/index.js";
	import { closeOverlay } from "$lib/utilities/helpers.js";

	export let modalData;

	$: communityInfo = $locale === "ru"
		? communitiesInfoRU[modalData.communityID]
		: communitiesInfoEN[modalData.communityID];

	$: console.log(communityInfo);

	$: if (!communityInfo) {
		// change language to no info
		closeOverlay("modal");
	}

	let isSubmenuOpen = false;

	const handleFocus = () => {
		isSubmenuOpen = true;
	};

	const handleBlur = () => {
		isSubmenuOpen = false;
	};
</script>

<div
	class="fixed top-20 left-4 bg-white rounded-lg z-1 w-64 p-4 min-h-[30rem]"
	class:rounded-r-none={isSubmenuOpen}
	use:focusTrap
	in:fly="{{ y: 50, duration: 200 }}"
	out:fly="{{ y: 50, duration: 200 }}"
>
	<h1 class="text-2xl my-2">
		{$_("communityAbroadModal.title")} {communityInfo && communityInfo.name}
	</h1>

	<ul class="-mx-4 pb-16">
		{#each Object.entries(communityInfo.links) as [key, value]}
			{#if value.length > 0}
				<li>
					<a
						href={"#"}
						class="py-2.5 block text-main px-4 hover:bg-bg_active focus:bg-bg_active"
						on:mouseover={handleFocus}
						on:focus={handleFocus}
						on:mouseout={handleBlur}
						on:blur={handleBlur}
					>
						<span>
							{$_(`communityAbroadModal.keysToText.${key}.long`)}
						</span>

						<div
							class="absolute left-full top-0 bg-white h-full rounded-r-lg w-64 p-4 drop-shadow-[0_4px_7px_rgba(10,13,84,0.05)] hidden cursor-default"
							on:mouseover={handleFocus}
							on:focus={handleFocus}
							on:mouseout={handleBlur}
							on:blur={handleBlur}
						>
							<h2 class="text-2xl my-2 mb-0 text-txt_main">
								{$_(`communityAbroadModal.keysToText.${key}.short`)}
							</h2>
							<p class="text-sm text-txt_tertiary">
								{$_(`communityAbroadModal.keysToText.${key}.description`)}
							</p>

							<ul class="mt-1 -mx-4">
								{#each value as { text, link }}
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
					</a>
				</li>
			{/if}
		{/each}
	</ul>

	<div class="absolute inset-x-4 bottom-4">
		<a
			href={"#"}
			class="text-sm text-txt_tertiary hoverable-link"
		>
			Добавить новое сообщество
		</a>
		<a
			href={"#"}
			class="text-sm text-txt_tertiary hoverable-link"
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
