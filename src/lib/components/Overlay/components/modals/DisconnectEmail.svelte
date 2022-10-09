<script>
	import { fade, fly } from "svelte/transition";
	import { focusTrap } from "svelte-focus-trap";

	import Arrow from "$lib/components/inline-images/Arrow.svelte";
	import Tooltip from "$lib/components/UI/Tooltip.svelte";
	import Input from "$lib/components/UI/Input.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";
	import PrimaryButton from "$lib/components/UI/PrimaryButton.svelte";
	import TextButton from "$lib/components/UI/TextButton.svelte";
	import ErrorBlock from "$lib/components/UI/ErrorBlock.svelte";

	import {
		blurCurrentInput,
		closeOverlay,
		debounce,
		getErrorType,
		logError,
		openAnotherOverlay,
		registerAction,
		showSomethingWrongNotification,
		showSuccessNotification,
	} from "$lib/utilities/helpers.js";
	import { appInfo } from "../../../../../configs/index.js";
	import { disconnectEmail } from "$lib/utilities/api.js";

	let isFirstOptionActive = false;
	let isSecondOptionActive = false;
	let isError = false;
	let errorType = null;
	let isLoading = false;
	let isSpam = null;
	let login = null;
	let password = null;
	let isLoginValid = true;
	let isPasswordValid = true;
	let loginInputRef = null;
	let passInputRef = null;

	const onFirstOptionClick = () => {
		if (isSecondOptionActive)
			isSecondOptionActive = false;

		isFirstOptionActive = true;
	};

	const onSecondOptionClick = () => {
		if (isFirstOptionActive)
			isFirstOptionActive = false;

		isSecondOptionActive = true;
	};

	const closeModal = e => {
		if (e.target !== e.currentTarget)
			return;

		closeOverlay("modal");
	};

	const openTelegramBot = () => {
		window.open(appInfo.telegramBot, "_blank");
	};

	const openFeedbackPopup = e => {
		e.preventDefault();
		closeOverlay("modal");
		openAnotherOverlay("feedbackPopup");
	};

	const submit = async () => {
		blurCurrentInput(document);

		isError = false;
		errorType = null;
		const isValuesNotEmpty = login && login.length > 0 && password.length > 0;
		if (!isValuesNotEmpty || !isLoginValid || !isPasswordValid) {
			isError = true;
			errorType = "fieldsError";

			if (!isLoginValid || login.length === 0)
				loginInputRef?.focus();
			else if (!isPasswordValid || password.length === 0)
				passInputRef?.focus();

			return;
		}

		isLoading = true;
		const { error } = await disconnectEmail(login, password);
		isLoading = false;

		if (error) {
			logError(error);
			isError = true;
			errorType = getErrorType(error);

			showSomethingWrongNotification();
			return;
		}

		showSuccessNotification();
	};

	const debouncedSubmit = debounce(() => {
		if (isSpam) {
			isError = true;
			errorType = "manyAttempts";
			clearTimeout(isSpam);
			isSpam = setTimeout(() => {
				clearTimeout(isSpam);
				isSpam = null;
				isError = false;
			}, 2000);
			return;
		}

		isSpam = setTimeout(() => {
			clearTimeout(isSpam);
			isSpam = null;
		}, 2000);

		submit();
	}, 200);
</script>

<div
	class="fixed z-10 inset-0 backdrop-blur-sm"
	on:click={closeModal}
	in:fade="{{ duration: 500 }}"
	out:fade="{{ duration: 500 }}"
>
	<form
		class="absolute absolute-centered rounded-3xl bg-white p-4"
		on:submit|preventDefault={debouncedSubmit}
		use:focusTrap
		in:fly="{{ y: 50, duration: 500 }}"
		out:fade="{{ duration: 500 }}"
	>
		<h1 class="font-semibold text-5xl my-4 tracking-tighter">
			Отвязать почту <span class="text-3xl opacity-80">[beta]</span>
		</h1>

		<ul class="bg-bg_gray p-3 pl-8 mb-6 rounded-xl list-disc list-inside leading-5">
			<li>Данное действие обратимо</li>
			<li>В случае утечки данных ничто не укажет на тебя</li>
			<li>Восстановить аккаунт через почту будет нельзя</li>
		</ul>

		<div class="flex mb-4">
			<div class="w-60 mr-4">
				<button
					class="bg-bg_gray p-2 text-left relative w-full"
					class:pointer-events-none={isFirstOptionActive}
					on:click|preventDefault={onFirstOptionClick}
				>
					<span class="block my-8 mx-5 text-3xl font-semibold">бесплатно</span>
					<span class="flex justify-between items-center px-5 py-3 bg-[#EFF1F4] mb-4">
					<span>
						<span class="text-2xl font-semibold block tracking-tight">
							отвязать
						</span>
							<span class="block text-sm -mt-1">
							почту от аккаунта
						</span>
					</span>
					<span
						class="arrow transition-transform"
						class:rotate-90={isFirstOptionActive}
					>
						<Arrow fill="#DADCE1"/>
					</span>
				</span>

					<Tooltip
						isDark={true}
						class="absolute top-4 right-4 text-white"
						description="Переместим почту в отдельный обезличенный список, не связанный с аккаунтом и его данными. Вместо почты будет логин."
					/>
				</button>

				<p
					class="text-sm pr-4 text-txt_secondary max-h-0 overflow-hidden transition-all duration-300"
					class:max-h-16={isFirstOptionActive}
					class:mt-3={isFirstOptionActive}
				>
					Осталось придумать логин, чтобы войти в аккаунт в следующий раз.
				</p>
			</div>

			<div class="w-60">
				<button
					class="bg-main p-2 w-full text-left rounded-2xl text-white"
					class:pointer-events-none={isSecondOptionActive}
					on:click|preventDefault={onSecondOptionClick}
				>
					<span class="block my-8 mx-5 text-3xl font-semibold text-center">$50</span>
					<span class="flex justify-between items-center px-5 py-3 bg-main-active rounded-xl mb-4">
						<span>
							<span class="text-2xl font-semibold block tracking-tight">
								удалить
							</span>
								<span class="block text-sm -mt-1">
								почту полностью
							</span>
						</span>
						<span
							class="arrow transition-transform"
							class:rotate-90={isSecondOptionActive}
						>
							<Arrow fill="#fff"/>
						</span>
					</span>
				</button>

				<p
					class="text-sm text-txt_secondary max-h-0 overflow-hidden transition-all duration-300"
					class:max-h-16={isSecondOptionActive}
					class:mt-3={isSecondOptionActive}
				>
					Отправь заявку нашему телеграм боту или
					<TextButton
						text="используй форму на сайте"
						class="underline"
						on:click={openFeedbackPopup}
					/>
					и мы свяжемся с тобой
				</p>
			</div>
		</div>

		<ErrorBlock
			class="max-w-[31rem] px-28"
			{errorType}
		/>

		<div
			class="max-h-0 overflow-hidden transition-all duration-300"
			class:max-h-80={isFirstOptionActive}
		>
			<Input
				title="придумай логин, который будет использоваться вместо почты"
				type="login"
				id="new-login"
				placeholder="Измерянин94"
				maxlength={64}
				bind:value={login}
				bind:isInputValid={isLoginValid}
				bind:this={loginInputRef}
			/>

			<Input
				title="текущий пароль"
				type="password"
				id="current-password"
				placeholder="*******"
				maxlength={128}
				bind:value={password}
				bind:isInputValid={isPasswordValid}
				bind:this={passInputRef}
			/>

			<PrimaryButton
				text="Отвязать почту"
				class="w-full mt-10 mb-2 py-3"
				on:click={debouncedSubmit}
			/>
		</div>

		<div
			class="max-h-0 overflow-hidden transition-all duration-300"
			class:max-h-80={isSecondOptionActive}
		>

			<PrimaryButton
				text="Написать боту"
				class="w-full mt-4 mb-2 py-3"
				on:click={openTelegramBot}
			/>
		</div>

		<CloseButton
			overlayType="modal"
			class="top-2 right-2"
		/>
	</form>
</div>

<style>
	button:hover .arrow {
		transform:translateX(-6px);
	}
</style>