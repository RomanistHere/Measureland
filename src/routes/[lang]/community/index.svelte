<script>
	import { _ } from 'svelte-i18n';
	import '/static/styles/general.css';

	import SEO from '../../../lib/components/SEO/SEO.svelte';
	import Overlay from '../../../lib/components/Overlay/Overlay.svelte';
	import GlassGroup from '../../../lib/components/ui-elements/GlassGroup.svelte';
</script>

<SEO
    pageTitle='Measureland community.'
    description="It's about us."
    imageSrc='https://measureland.org/images/PWA-icon-512x512.png'
	imageAltText={$_('SEO.imageAltText')}
    isApp={false}
/>

<section></section>

<div class="relative page p-4 flex flex-wrap justify-between">
    <h1 class="text-center pt-4 pb-8 text-5xl font-bold w-full">
        This page is about you guys! 😎
    </h1>

	<h2 class="w-full pb-8 text-xl text-center px-60">
		Measureland is absolutely community driven. We want to be as 🧊 transparent as we can. You can find here <strong>information about everything</strong>: our funding, code, third-party tools we use, what we're working on - and most important - <strong>influence that</strong> ⚖️. Meet the members of our community - become one!
	</h2>

	<GlassGroup title="What you've been up to lately 👩‍🚀" />

	<GlassGroup title="What we're working on 💻" />

	<GlassGroup title="Meet together 📅" />

	<GlassGroup title="Most active members 🏆" />
</div>

<Overlay mainScreen={false} />

<style>
    section {
		position: fixed;
        background:
			radial-gradient(22.66% 33.75% at 74.36% 14.26%, rgba(255, 240, 160, 0.85) 0%, rgba(212, 239, 245, 0) 100%),
			radial-gradient(41.2% 43.79% at 13.52% 54%, #FFE0FA 0%, rgba(255, 254, 254, 0) 100%),
			radial-gradient(33.57% 49.54% at 50.03% 94.11%, #FFD8D8 0%, rgba(212, 239, 245, 0) 100%),
			radial-gradient(26.63% 48.46% at 81.36% 69.46%, #D0CFFF 0%, rgba(212, 239, 245, 0) 100%),
			radial-gradient(23.18% 29.66% at 33.76% 31.67%, #C9FFC8 0%, #D4EFF5 100%);
        height: 100%;
        width: 100%;
		top: 0;
		left: 0;
    }

	.page {
        /* background-color: var(--bg-color-add-non-transparent);
        top: var(--navbar-height); */
        top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        .page {
            top: 0;
        }
    }
</style>
