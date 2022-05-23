<script>
	import Community from "./Community.svelte";

	export let modalName;
	export let modalData;

	const sidebarList = {
		communityAbroadModal: Community,
	};

	$: Sidebar = sidebarList[modalName];
</script>

<svelte:component this={Sidebar} { modalData }/>
