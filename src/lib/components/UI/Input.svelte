<script>
	import { _ } from "svelte-i18n";

	import EyeCrossed from "$lib/components/inline-images/EyeCrossed.svelte";
	import Eye from "$lib/components/inline-images/Eye.svelte";

	import { generateRandomString } from "$lib/utilities/helpers.js";

	let customClass = "";
	export { customClass as class };
	export let title;
	export let type = "string";
	export let id = generateRandomString();
	export let autofocus = false;
	export let maxlength = null;
	export let placeholder = null;
	export let value = "";
	export let isInputValid = true;
	export let externalError = false;

	let shouldShowPassword = false;
	let isInputActive = false;
	let hasTypingStarted = false;

	$: inputType = type !== "password" || (type === "password" && shouldShowPassword) ? "text" : "password";

	let ref;

	export const focus = () =>
		ref?.focus();

	const validateEmail = email =>
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

	const validatePass = pass =>
		pass.length > 6 && pass.length < 128;

	const validateLogin = str =>
		str.length > 2 && str.length < 64 && !str.includes("@");

	const validateMixedLogin = str =>
		str.length > 2 && str.length < maxlength;

	const changeInputType = e => {
		if (e.detail !== 0) {
			// clicked with mouse
			e.preventDefault();
			shouldShowPassword = !shouldShowPassword;
		}
	};

	const onBlur = e => {
		isInputActive = false;
		value = e.currentTarget.value;

		if (type === "email") {
			value = value.toLowerCase();
			isInputValid = validateEmail(value);
		} else if (type === "password") {
			isInputValid = validatePass(value);
		} else if (type === "login") {
			isInputValid = validateLogin(value);
		} else if (type === "mixedLogin") {
			isInputValid = validateMixedLogin(value);
		}
	};

	const onInput = e => {
		isInputValid = false;
		hasTypingStarted = true;
		isInputActive = true;
		value = e.currentTarget.value;
	};

	$: isError = (!isInputValid && !isInputActive && value !== "") || externalError;
	$: isValid = isInputValid && hasTypingStarted && !isInputActive && !externalError;
</script>

<div class="mt-2 {customClass}">
	<label
		class="lowercase text-sm"
		class:text-txt_danger={isError}
		for={id}
	>
		{#if externalError}
			{externalError}
		{:else if isError}
			{#if type === "email" && value}
				{$_("input.emailError")}
			{:else if type === "email" && !value}
				{$_("input.emailEmpty")}
			{:else if type === "login"}
				{$_("input.loginError")}
			{:else if type === "password"}
				{$_("input.passwordError")}
			{:else if type === "mixedLogin"}
				{$_("input.mixedLoginError")}
			{/if}
		{:else}
			{title}
		{/if}
	</label>

	<div class="relative mt-2">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="bg-bg_gray border-bg_gray border rounded-lg p-3 px-6 w-full focus:outline-0 transition-colors hover:border-stroke focus:border-main focus:bg-white"
			class:border-txt_danger={isError}
			class:hover:border-txt_danger={isError}
			class:pr-12={type === "password"}
			autocomplete={id}
			{ id }
			{ autofocus }
			{ maxlength }
			{ placeholder }
			type={inputType}
			on:blur={onBlur}
			on:input={onInput}
			bind:this={ref}
		>

		{#if type === "password"}
			<button
				class="absolute top-1/2 right-4 transform -translate-y-1/2 p-2"
				on:click={changeInputType}
			>
				{#if shouldShowPassword}
					<Eye />
				{:else}
					<EyeCrossed />
				{/if}
			</button>
		{/if}
	</div>
</div>

<style>
	.border-bg_gray:focus {
		border-color: var(--main);
	}
</style>
