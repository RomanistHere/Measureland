<script>
	import SearchIcon from "$lib/components/inline-images/SearchIcon.svelte";

	import {
		closeOverlay,
		debounce,
		getOpenedOverlay,
		logError,
		openAnotherOverlay,
		registerAction,
		showSomethingWrongNotification,
	} from "$lib/utilities/helpers.js";
	import { getGeoCandidates, getGeoSuggestions } from "$lib/utilities/externalApi.js";

	import { overlayStateStore } from "../../../../../stores/state.js";
	import { mapReference } from "../../../../../stores/references.js";

	// sidebar and burger button

	let isActive = false;

	const handleClick = () => {
		isActive = !isActive;

		if (isActive)
			openAnotherOverlay("menuSidebar");
		else
			closeOverlay("sidebar");
	};

	// eslint-disable-next-line no-unused-vars
	const checkOpenedOverlay = somethingNotImportant => {
		const { overlay } = getOpenedOverlay();
		isActive = overlay === "menuSidebar";
	};

	$: checkOpenedOverlay($overlayStateStore);

	// search

	let searchSuggestions = [];
	let searchInputValue = null;

	const handleSearchInputChange = async e => {
		const { value } = e.target;
		searchInputValue = value;
		const resp = await getGeoSuggestions(value);
		const { suggestions, error } = await resp.json();

		if (error) {
			logError(error);
			showSomethingWrongNotification();
		}

		if (suggestions)
			searchSuggestions = [ ...suggestions ];
		else
			searchSuggestions = [];
	};

	const setViewFromSearch = async (text, magicKey = "") => {
		searchSuggestions = [];

		const resp = await getGeoCandidates(text, magicKey);
		const { candidates } = await resp.json();
		const { extent } = candidates[0];

		$mapReference.fitBounds([[ extent.ymin, extent.xmin ], [ extent.ymax, extent.xmax ]]);
		searchInputValue = null;
		registerAction("mapSearch");
	};

	const debouncedSearch = debounce(e => { handleSearchInputChange(e) }, 200);
</script>

<div class="bg-white rounded-md overflow-hidden shadow-lg flex">
	<button
		class="flex justify-center items-center cursor-pointer hover:bg-bg_hover px-1 transition-colors focus:bg-bg_active active:bg-bg_active"
		class:bg-new-active={isActive}
		class:focus:outline-none={!isActive}
		aria-label="Main menu"
		aria-expanded={isActive && "true"}
		on:click={handleClick}
	>
		<span class="burger w-4 h-3 flex flex-col justify-between p-2 box-content">
			<span
				class:bg-main={isActive}
				class:bg-txt_main={!isActive}
				class="w-full h-0.5 rounded-md transition-colors"
			></span>
			<span
				class:bg-main={isActive}
				class:bg-txt_main={!isActive}
				class="w-full h-0.5 rounded-md transition-colors"
			></span>
			<span
				class:bg-main={isActive}
				class:bg-txt_main={!isActive}
				class="w-full h-0.5 rounded-md transition-colors"
			></span>
		</span>
	</button>

	<input
		type="text"
		class="px-2 my-2 focus:outline-none border-b border-transparent focus:border-text"
		placeholder="Поиск мест и адресов"
		on:input={debouncedSearch}
	>

	<button
		class="flex justify-center items-center cursor-pointer px-3 hover:bg-bg_hover transition-colors focus:bg-bg_active active:bg-bg_active focus:outline-none"
		on:click={() => { setViewFromSearch(searchInputValue) }}
	>
		<SearchIcon color={searchInputValue ? "#212121" : "#AFAFBB"} />
	</button>
</div>

{#if searchSuggestions.length > 0}
	<ul class="w-80 bg-white rounded-md overflow-hidden shadow-lg absolute top-16 left-0">
		{#each searchSuggestions as { text, magicKey }}
			<li class="">
				<button
					class="p-2 block w-full text-left hover:bg-new-active hover:text-main transition-colors"
					on:click={() => { setViewFromSearch(text, magicKey) }}
				>
					{text}
				</button>
			</li>
		{/each}
	</ul>
{/if}
