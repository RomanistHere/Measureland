<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { _, json } from 'svelte-i18n';
	
	import Tag from './Tag.svelte';
	
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
		class="add_input rounded-md px-2 py-0.5 text-sm mb-2 block relative z-5 mr-2"
		on:click|preventDefault={showAllTags}
	>
		add a tag
	</a>
	
	{#if isExpanded}
		<div
			class="tags_picker rounded-md w-96 absolute z-5 p-2 font-normal flex flex-wrap -top-2 left-0"
			in:fly="{{ y: 10, duration: 200 }}"
			out:fly="{{ y: -10, duration: 200 }}"
			on:mouseleave={handleMouseleave}
		>
			{#each Object.keys($json('tags')) as tagKey}
				<Tag
					key={tagKey}
					clickable={true}
					on:click={() => { addTag(tagKey) }}
				/>
			{/each}
			
			<p class="text-sm">
				Current number of tags is not big. If you think we need more, use our feedback form to suggest it.
			</p>
		</div>
	{/if}
</div>

<style>
	.add_input {
		background-color: var(--active-color);
		color: var(--side-bg-color);
	}
	
	.tags_picker {
		background-color: var(--side-bg-color);
		border: 2px solid var(--active-color);
	}

	@media (hover: hover) and (pointer: fine) {
		.add_input:hover {
			background-color: var(--suc-color);
		}
	}
</style>
