<script>
	import { _ } from 'svelte-i18n';
	import '/static/styles/general.css';

	import SEO from '../../../lib/components/SEO/SEO.svelte';
	import Overlay from '../../../lib/components/Overlay/Overlay.svelte';
	import GlassGroup from '../../../lib/components/ui-elements/GlassGroup/GlassGroup.svelte';

	const newsArray = [{
		title: 'City guides contest',
		text: 'Share experience of finding appartment in your city. Prize pool: 1st place - 100$, 2nd place - 50$, 3rd place - 25$',
		link: '/en/blog/city-guides-contest/',
	}, {
		title: 'Open collective launch',
		text: 'Transparent finance handling platform. Check where the money comes from and what are spent on.',
		link: 'https://opencollective.com/measureland',
	}, {
		title: 'Community page launch',
		text: 'Why do we need it and what are planes on it?',
		link: '/en/blog/community-launch/',
	}];

	const communitiesArray = [{
		text: 'News in Telegram',
		link: 'https://t.me/measureland',
	}, {
		text: 'Group in Telegram',
		link: 'https://t.me/measureland',
	}, {
		text: 'Discord',
		link: 'https://t.me/measureland',
	}, {
		text: 'Open collective',
		link: 'https://opencollective.com/measureland',
	}, {
		text: 'LinkedIn company profile',
		link: 'https://linkedin.com/company/74987928/',
	}];

	const membersArray = [{
		title: 'Roman Smunyov (RomanistHere)',
		text: 'Creator',
		link: 'https://romanisthere.github.io/',
	}, {
		title: 'Igor Denisevich',
	}, {
		title: 'Polina Kasterova',
		text: 'Inspiration, help with promoting',
	}, {
		title: 'Alex Starinsky and Co',
		text: 'Design ideas and help',
	}];

	const tasksArray = [{
		title: 'Sign in and sign up with Telegram',
		text: "We don't trust other platforms with our users data.",
		id: '1',
	}, {
		title: 'Dark mode',
		id: '2',
	}, {
		title: 'External API',
		text: 'Get data from the Measureland server via coordinates.',
		id: '3',
	}, {
		title: 'Redesign the blog page',
		id: '4',
	}, {
		title: 'Create a profile page',
		text: 'A possibility to change personal info and check stats.',
		id: '5',
	}, {
		title: 'Redesign the map',
		text: "We're on our way to find our visual style.",
		id: '6',
	}];
</script>

<SEO
    pageTitle='Measureland community.'
    description="It's about us."
    imageSrc='https://measureland.org/images/PWA-icon-512x512.png'
	imageAltText={$_('SEO.imageAltText')}
    isApp={false}
/>

<section></section>

<div class="relative page">
    <h1 class="text-center pt-4 pb-8 px-4 text-5xl font-bold -md:text-4xl -md:pt-8">
        This page is about you guys! 😎
    </h1>

	<h2 class="pb-8 text-xl text-center px-60 -lg:px-4 -md:text-lg -md:pb-4">
		Measureland is absolutely community driven. We want to be as 🧊 transparent as possible. You can find here <strong>information about everything</strong>: our code, funding, tasks, social life - and most important - <strong>influence&nbsp;that</strong> ⚖️. Meet the members of our community - and become one!
	</h2>

	<div class="flex justify-between -lg:block">
		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title="What we've been up to lately 👩‍🚀"
				list={newsArray}
			/>

			<GlassGroup
				title="Most active members 🏆"
				list={membersArray}
			/>
		</div>

		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title="What we're working on 💻"
				list={tasksArray}
				type='vote'
			/>
		</div>

		<div class="w-1/3 m-4 -lg:w-auto">
			<GlassGroup
				title="Meet together 📅"
				list={communitiesArray}
			/>
		</div>
	</div>

	<a href="../" class="hidden -lg:block underline text-right mx-4 pb-4">
		Back to Measureland
	</a>
</div>

<Overlay
	mainScreen={false}
	hiddenLoading={true}
/>

<style>
	:global(#svelte),
	:global(body),
	:global(html) {
		overflow: unset;
	}

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
        top: var(--distance-top);
    }

    @media screen and (max-width: 766px) {
        .page {
            top: 0;
        }
    }
</style>
