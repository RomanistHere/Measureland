<script>
	import { _ } from "svelte-i18n";

	import TextButton from "./TextButton.svelte";

	export let title = "Email";
	export let type = "email";
	export let id = "current-email";
	export let value = "";
	export let isInputValid = true;
	export let autofocus = false;
	export let shouldShowMatchError = false;
	export let maxlength = null;

	let shouldShowPassword = false;
	let isInputActive = false;
	let hasTypingStarted = false;

	let ref;

	export const focus = () => {
		ref?.focus();
	};

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
		shouldShowMatchError = false;
		hasTypingStarted = true;
		isInputActive = true;
		value = e.currentTarget.value;
	};

	$: isError = (!isInputValid && !isInputActive) || shouldShowMatchError;
	$: isValid = isInputValid && hasTypingStarted && !isInputActive && !shouldShowMatchError;
</script>

<div class="relative">
	<label for={id} class="mt-8 relative block font-bold">
		<span>{title}</span>
		{#if type === "password"}
			<TextButton
				className="absolute right-0 bottom-0 text-sm px-1 rounded-md"
				action={changeInputType}
				text={$_("input.showOrHide")}
			/>
		{/if}
	</label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		class="mt-4 p-2 w-full rounded-md shadow border-2 border-active focus:outline-0 transition-colors duration-100"
		class:bg-active={isValid}
		class:text-white={isValid}
		class:border-error={isError}
		type={shouldShowPassword ? "text" : type}
		id={id}
		autocomplete={id}
		on:blur={onBlur}
		on:input={onInput}
		bind:this={ref}
		{ autofocus }
		{ maxlength }
	>

	<span
		class="w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-14 opacity-0 bg-active transition-opacity duration-200 delay-100"
		class:opacity-100={isError}
		class:bg-error={isError}
	></span>
	<span
		class="w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-14 opacity-0 bg-active transition-opacity duration-200 delay-100"
		class:opacity-100={isError}
		class:bg-error={isError}
	></span>

	<span class="absolute right-0 -bottom-6 text-sm">
        {#if !isInputValid && !isInputActive}
            {#if type === "email"}
	            {$_("input.emailError")}
            {:else if type === "password"}
	            {$_("input.passwordError")}
            {/if}
        {/if}

		{#if shouldShowMatchError}
            {$_("input.passwordsShouldMatch")}
        {/if}
    </span>
</div>

<style>
	input:focus + span {
		opacity: 1;
	}

	input:focus + span + span {
		opacity: 1;
	}

	input:-webkit-autofill {
		--bg-color-inp: var(--active-color);
		box-shadow: 0 0 0 30px var(--bg-color-inp) inset !important;
		-webkit-text-fill-color: var(--side-bg-color);
	}
</style>
