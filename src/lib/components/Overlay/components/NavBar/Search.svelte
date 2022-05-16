<script>
	import SearchIcon from "$lib/components/inline-images/SearchIcon.svelte";
	import { closeOverlay, openAnotherOverlay } from "$lib/utilities/helpers.js";
	import { overlayStateStore } from "../../../../../stores/state.js";

	export let isSidebarActive = false;

	let isActive = false;
	let isMouseOver = false;

	const handleClick = () => {
		isActive = !isActive;

		if (isActive)
			openAnotherOverlay('menuSidebar');
		else
			closeOverlay('sidebar');
	};

	$: if (isSidebarActive) {
		const sidebarData = Object.values($overlayStateStore).filter(({ isOpen, type }) => isOpen === true && type === 'sidebar')[0];
		if (sidebarData && Object.entries(sidebarData.data).length === 0)
			isActive = true;
	} else {
		isActive = false;
	}
</script>

<div class="bg-white rounded-md overflow-hidden shadow-lg border border-stroke flex">
	<button
		class="flex justify-center items-center cursor-pointer hover:bg-new-active px-1 transition-colors"
		class:bg-new-active={isActive}
		aria-label="Main menu"
		aria-expanded={isActive && "true"}
		on:click={handleClick}
	>
		<span class="burger w-4 h-3 flex flex-col justify-between p-2 box-content">
			<span
				class:bg-main={isActive}
				class:bg-txt-main={!isActive}
				class="w-full h-0.5 rounded-md transition-colors"
			></span>
			<span
				class:bg-main={isActive}
				class:bg-txt-main={!isActive}
				class="w-full h-0.5 rounded-md transition-colors"
			></span>
			<span
				class:bg-main={isActive}
				class:bg-txt-main={!isActive}
				class="w-full h-0.5 rounded-md transition-colors"
			></span>
		</span>
	</button>

	<input
		type="text"
		class="px-2 my-2"
		placeholder="Поиск мест и адресов"
	>

	<button
		class="flex justify-center items-center cursor-pointer hover:bg-new-active px-3 transition-colors"
		on:mouseover={() => { isMouseOver = true }}
		on:mouseout={() => { isMouseOver = false }}
	>
		<SearchIcon color={isMouseOver ? "#AFAFBB" : "#212121"}/>
	</button>
</div>
