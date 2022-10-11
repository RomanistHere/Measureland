<script>
	import { fade, fly } from "svelte/transition";

	import CopyString from "$lib/components/UI/CopyString.svelte";
	import PrimaryButton from "$lib/components/UI/PrimaryButton.svelte";
	import CloseButton from "$lib/components/UI/CloseButton.svelte";

	import { closeOverlay } from "$lib/utilities/helpers.js";

	export let modalData;

	const closeModal = e => {
		if (e.target !== e.currentTarget)
			return;

		closeOverlay("modal");
	};
</script>

<div
	class="fixed z-10 inset-0 backdrop-blur-sm"
	on:click={closeModal}
	in:fade="{{ duration: 500 }}"
	out:fade="{{ duration: 500 }}"
>
	<div
		class="w-[33rem] absolute absolute-centered rounded-3xl bg-white p-4"
		in:fly="{{ y: 50, duration: 500 }}"
		out:fade="{{ duration: 500 }}"
	>
		<h1 class="font-semibold text-5xl my-6 tracking-tighter">
			Почта отвязана
		</h1>

		<div class="bg-bg_green text-on-green rounded-md">
			<p class="pl-8 pt-2">
				Аккаунт и почта теперь не связаны.
			</p>

			<ul class="bg-bg_gray p-3 pl-8 mb-6 rounded-xl list-disc list-inside leading-5">
				<li>В случае утечки данных ничто не укажет на тебя</li>
				<li>Восстановить аккаунт через почту нельзя</li>
			</ul>
		</div>

		<CopyString
			label="Чтобы войти в аккаунт в следующий раз, сохрани логин:"
			text={modalData.login}
		/>

		<CopyString
			label="Чтобы восстановить почту в будущем, сохрани код ниже:"
			text={modalData.code}
			class="my-4"
		/>

		<PrimaryButton
			text="Отлично, спасибо"
			class="w-full mt-4 mb-2 py-3"
			on:click={closeModal}
		/>

		<CloseButton
			overlayType="modal"
			class="top-2 right-2"
		/>
	</div>
</div>