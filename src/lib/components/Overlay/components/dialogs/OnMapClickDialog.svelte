<script>
	import PrimaryButton from '../../../ui-elements/PrimaryButton.svelte';

	import { closeOverlay, openAnotherOverlay } from "$lib/utilities/helpers.js";

	export let dialogData;

	const openPopup = item => {
		closeOverlay('dialog');
		openAnotherOverlay(item, dialogData);
	};
</script>

<h3 class="text-2xl -md:text-lg">
	Что ты собираешься сделать?
</h3>

<div class="flex -mx-1 mt-4">
	<a
		href={'#'}
		class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1"
		on:click|preventDefault|stopPropagation={() => { openPopup('quizPopup') }}
	>
		<div class="text-center">
			<img
				src="/images/rating_icon.svg"
				alt="Иконка оценки места"
				class="h-24 inline-block my-2"
			>
		</div>
		Оценить место для жизни (кач-во воды, воздуха и т.д.)
	</a>
	<a
		href={'#'}
		class="block w-1/2 text-center rounded-md border border-black p-2 px-4 mx-1"
		on:click|preventDefault|stopPropagation={() => { openPopup('attentionPlacesPopup') }}
	>
		<div class="text-center">
			<img
				src="/images/attention.svg"
				alt="Иконка примечательного места"
				class="h-24 inline-block my-2"
			>
		</div>
		Добавить примечательное место (парк, стройку и т.п.)
	</a>
</div>
