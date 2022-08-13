<script>
	import Login from "./Login.svelte";
	import Story from "./Story.svelte";
	import Community from "./Community.svelte";
	import OnMapClick from "./OnMapClick.svelte";
	import Registration from "./Registration.svelte";
	import RestorePassword from "./RestorePassword.svelte";

	export let modalName;
	export let modalData;

	const sidebarList = {
		communityAbroadModal: Community,
		loginModal: Login,
		onMapClickModal: OnMapClick,
		registrationModal: Registration,
		restorePasswordModal: RestorePassword,
		storyModal: Story,
	};

	$: Modal = sidebarList[modalName];
</script>

<svelte:component this={Modal} { modalData }/>
