<script>
	import Community from "./Community.svelte";
	import Registration from "./Registration.svelte";

	export let modalName;
	export let modalData;

	const sidebarList = {
		communityAbroadModal: Community,
		registrationModal: Registration,
	};

	$: Sidebar = sidebarList[modalName];
</script>

<svelte:component this={Sidebar} { modalData }/>
