<script>
	import { _ } from 'svelte-i18n';

	import TextButton from './TextButton.svelte';

	export let title = 'Email';
	export let type = 'email';
	export let id = 'current-email';
	export let value = '';
	export let isInputValid = true;
	export let autofocus = false;
	export let shouldShowMatchError = false;

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

		if (type === 'email') {
			value = value.toLowerCase();
			isInputValid = validateEmail(value);
		} else if (type === 'password') {
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
</script>

<div class="relative">
	<label for={id} class="mt-8 relative block font-bold">
		<span>{title}</span>
		{#if type === 'password'}
			<TextButton
				className="absolute right-0 bottom-0 text-sm px-1 rounded-md"
				action={changeInputType}
				text={$_('input.showOrHide')}
			/>
		{/if}
	</label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		class="mt-4 p-2 w-full rounded-md shadow"
		class:input-valid={isInputValid && hasTypingStarted && !isInputActive && !shouldShowMatchError}
		type={shouldShowPassword ? 'text' : type}
		id={id}
		autocomplete={id}
		on:blur={onBlur}
		on:input={onInput}
		bind:this={ref}
		{ autofocus }
	>

	<span
		class="dot w-3 h-3 rounded-full absolute -left-6 -md:-left-4 top-14 opacity-0"
		class:dot-error={(!isInputValid && !isInputActive) || shouldShowMatchError}
	></span>
	<span
		class="dot w-3 h-3 rounded-full absolute -right-6 -md:-right-4 top-14 opacity-0"
		class:dot-error={(!isInputValid && !isInputActive) || shouldShowMatchError}
	></span>

	<span class="absolute right-0 -bottom-6 text-sm">
        {#if !isInputValid && !isInputActive}
            {#if type === 'email'}
	            {$_('input.emailError')}
            {:else if type === 'password'}
	            {$_('input.passwordError')}
            {/if}
        {/if}

		{#if shouldShowMatchError}
            {$_('input.passwordsShouldMatch')}
        {/if}
    </span>
</div>

<style>
	input {
		border: 2px solid var(--active-color);
		transition: background-color .1s;
	}

	input:focus {
		outline: none;
	}

	.dot {
		background-color: var(--active-color);
		transition: opacity .2s .1s;
	}

	.dot-error {
		opacity: 1;
		background-color: var(--error-color);
	}

	input:focus + .dot {
		opacity: 1;
	}

	input:focus + .dot + .dot {
		opacity: 1;
	}

	.input-valid {
		background-color: var(--active-color);
		color: var(--side-bg-color);
	}

	input:-webkit-autofill {
		--bg-color-inp: var(--active-color);
		box-shadow: 0 0 0 30px var(--bg-color-inp) inset !important;
		-webkit-text-fill-color: var(--side-bg-color);
	}
</style>
