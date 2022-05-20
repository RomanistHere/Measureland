<script context="module">
    import { getArrays } from "../../../markdown/prepareMarkdown.js";

    // eslint-disable-next-line func-style
    export function load ({ page }) {
    	const { lang } = page.params;
    	const { postsArray, guidesArray } = getArrays(lang);

    	if (!postsArray) {
    		return {
    			error: "No posts found. Try switching to another language",
    			status: 404,
    		};
    	}

    	return {
    		props: {
    			postsArray,
    			guidesArray,
    			lang,
    		},
    	};
    }
</script>

<script>
    import { _ } from "svelte-i18n";
    import "/static/styles/general.css";

    import SEO from "../../../lib/components/SEO/SEO.svelte";
    import Overlay from "../../../lib/components/Overlay/Overlay.svelte";
    import GlassGroup from "../../../lib/components/ui-elements/GlassGroup/GlassGroup.svelte";

    export let postsArray;
    export let guidesArray;
    export let lang;

    const addLinkToObj = arrOfObjects => {
    	for (let i = 0; i < arrOfObjects.length; i++) {
    		const { description, slug } = arrOfObjects[i];
    		arrOfObjects[i] = {
    			...arrOfObjects[i],
    			link: `/${lang}/blog/${slug}/`,
    			text: description,
    		};

    		delete arrOfObjects[i]["slug"];
    		delete arrOfObjects[i]["tags"];
    		delete arrOfObjects[i]["layout"];
    		delete arrOfObjects[i]["description"];
    		delete arrOfObjects[i]["author"];
    		delete arrOfObjects[i]["isGuide"];
    	}

    	return arrOfObjects;
    };
</script>

<SEO
    pageTitle={$_("blog.title")}
	description={$_("blog.descriptionSEO")}
/>

<section class="fixed-grad-bg"></section>

<main class="relative page">
	<div class="flex justify-center -lg:block -md:mt-4">
		<div class="w-1/3 mx-4 -lg:w-auto">
			<GlassGroup
				title={$_("blog.guidesTitle")}
				list={addLinkToObj(guidesArray)}
                isSearchAvailable={true}
			/>
		</div>

		<div class="w-1/3 mx-4 -lg:w-auto">
			<GlassGroup
				title={$_("blog.blogTitle")}
				list={addLinkToObj(postsArray)}
			/>
		</div>
	</div>

	<a href="../" class="hidden -lg:block text-xl underline text-right mx-4 pb-4">
		{$_("commuinty.linkBack")}
	</a>
</main>

<Overlay
	mainScreen={false}
	hiddenLoading={true}
/>

<style>
	main {
        top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        main {
            top: 0;
        }
    }
</style>
