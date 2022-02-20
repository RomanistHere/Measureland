<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { _, json } from 'svelte-i18n';
	
	import Tag from './Tag.svelte';
	import TextButton from "$lib/components/ui-elements/TextButton.svelte";
	import { isDesktop } from "../../../stores/state.js";
	import { closeOverlay, openAnotherOverlay } from "$lib/utilities/helpers.js";
	
	const dispatch = createEventDispatcher();

	export let listOfTags = [];
	
	let isExpanded = false;
	
	const showAllTags = () => {
		isExpanded = true;
	};
	
	const handleMouseleave = () => {
		isExpanded = false;
	};
	
	const addTag = tagKey => {
		dispatch('addNewTag', tagKey);
		isExpanded = false;
	};
	
	const removeTag = tagKey => {
		dispatch('removeTag', tagKey);
	};

	const openFeedbackPopup = () => {
		if (!$isDesktop)
			closeOverlay('popup');
		openAnotherOverlay('feedbackPopup');
	};
</script>

<div class="flex mt-4 flex-wrap relative">
	{#each listOfTags as tagKey}
		<Tag key={tagKey} />
		<a
			href={"#"}
			class="mr-3"
			on:click|preventDefault={() => { removeTag(tagKey) }}
		>
			x
		</a>
	{/each}

	<a
		href={"#"}
		class="bg-active hover:bg-success text-white rounded-md px-2 py-0.5 text-sm mb-2 block relative z-5 mr-2"
		on:click|preventDefault={showAllTags}
	>
		{$_('tagsInput.title')}
	</a>
	
	{#if isExpanded}
		<div
			class="bg-white border-2 border-active rounded-md w-96 absolute z-5 p-2 font-normal flex flex-wrap -top-2 left-0"
			in:fly="{{ y: 10, duration: 200 }}"
			out:fly="{{ y: -10, duration: 200 }}"
			on:mouseleave={handleMouseleave}
		>
			{#each Object.keys($json('tags')) as tagKey}
				{#if tagKey !== 'own'}
					<Tag
						key={tagKey}
						clickable={true}
						on:click={() => { addTag(tagKey) }}
					/>
				{/if}
			{/each}
			
			<p class="text-sm">
				{$_('tagsInput.description')}
				<TextButton
					text={$_('tagsInput.buttonText')}
					action={openFeedbackPopup}
				/>
			</p>
		</div>
	{/if}
</div>
