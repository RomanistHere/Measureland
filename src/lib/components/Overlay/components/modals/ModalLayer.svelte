<script>
	import Login from "./Login.svelte";
	import Community from "./Community.svelte";
	import Registration from "./Registration.svelte";

	export let modalName;
	export let modalData;

	const sidebarList = {
		communityAbroadModal: Community,
		registrationModal: Registration,
		loginModal: Login,
	};

	$: Sidebar = sidebarList[modalName];
</script>

<svelte:component this={Sidebar} { modalData }/>
