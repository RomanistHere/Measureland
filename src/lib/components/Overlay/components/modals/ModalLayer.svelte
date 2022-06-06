<script>
	import Login from "./Login.svelte";
	import Community from "./Community.svelte";
	import Registration from "./Registration.svelte";
	import RestorePassword from "./RestorePassword.svelte";

	export let modalName;
	export let modalData;

	const sidebarList = {
		communityAbroadModal: Community,
		loginModal: Login,
		registrationModal: Registration,
		restorePasswordModal: RestorePassword,
	};

	$: Sidebar = sidebarList[modalName];
</script>

<svelte:component this={Sidebar} { modalData }/>
