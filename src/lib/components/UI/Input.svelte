<script>
	import { _ } from "svelte-i18n";

	import EyeCrossed from "$lib/components/inline-images/EyeCrossed.svelte";
	import Eye from "$lib/components/inline-images/Eye.svelte";

	import { generateRandomString } from "$lib/utilities/helpers.js";

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

	let ref;

	export const focus = () =>
		ref?.focus();

	const validateEmail = email =>
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

	const validatePass = pass =>
		pass.length > 6 && pass.length < 255;

	const changeInputType = () =>
		(shouldShowPassword = !shouldShowPassword);

	const onBlur = e => {
		isInputActive = false;
		value = e.currentTarget.value;

		if (type === "email") {
			value = value.toLowerCase();
			isInputValid = validateEmail(value);
		} else if (type === "password") {
			isInputValid = validatePass(value);
		}
	};

	const onInput = e => {
		isInputValid = false;
		hasTypingStarted = true;
		isInputActive = true;
		value = e.currentTarget.value;
	};

	$: isError = (!isInputValid && !isInputActive) || externalError;
	$: isValid = isInputValid && hasTypingStarted && !isInputActive && !externalError;
</script>

<div class="mt-2">
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
			{:else if type === "password"}
				{$_("input.passwordError")}
			{/if}
		{:else}
			{title}
		{/if}
	</label>

	<div class="relative mt-2">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="bg-bg_gray border-bg_gray border rounded-lg p-3 px-6 w-full focus:outline-0 transition-colors focus:border-main focus:bg-white"
			class:border-txt_danger={isError}
			class:pr-12={type === "password"}
			autocomplete={id}
			{ id }
			{ autofocus }
			{ maxlength }
			{ placeholder }
			type={shouldShowPassword ? "text" : type}
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
