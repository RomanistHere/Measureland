---
slug: release-notes-2.0
title: Measureland 2.0 release notes.
firstDate: 2022-05-07
date: 2022-05-07
description: List of changes with description and explanation.
tags: [starters]
layout: article
author: Roman Smunyov
imageSrc: https://measureland.org/images/main_screen-en.jpg
---

<script>
    import Summary from "$lib/components/Article/Summary.svelte";
    import TextLink from "$lib/components/ui-elements/TextLink.svelte";
    import Image from "$lib/components/Article/Image.svelte";
</script>

We are so excited to show you all the features we've been working on for the last months!

<Summary
    text="New design, a lot of features. The coolest is Point of Interest (POI) - it's for places, which are important to live next to. Started a city-guide contest - money guaranteed for the first participants."
/>

#### UX/UI Design

<Image src="main_screen-en.jpg" caption="Brand new looks." alt="Screenshot of the main screen." />

Almost every single feature/button/screen was redesigned! We picked glassmorphism as a main theme for Measureland. Map itself looks the same, but we're working on customisation and shall add it in the future updates.

### "Engine"

We moved our web app to Svelte. Here's <TextLink href="../why-svelte/" text="an article" /> explaining the reasons behind through an alternative, so you don't need to be a technical person to understand why. In short: it's cool and community driven.

### Ratings

There are a lot of rating-related changes:
- Adding a year of relevance - could be changed in "my actions", assigned 2020 by default.
- "See what's nearby" button was added to rating's modal window.
- "Measurements and stats" tab was added to rating's modal window. It's in "testing" mode and is waiting your feedback!
- Possibility to check a single rating (if there is a group) and endorse or report it.
- Possibility to remove rating (from "my actions", top right corner - visible only on the main page)

<Image src="stats-en.jpg" caption="Measurements and stats" alt="Screenshot of the Netherlands' tab for stats." />

### Points of Interest (POIs)

Another type of marks on the map and... well, yeah... our killer feature :) These are for the objects that are important when you live near them. Objects that can influence you lifestyle. It can be something negative, like tobacco factory on the screenshot below, something positive, like a nice park with a lake, or neutral - big store is nice to have nearby in terms of groceries, but not that nice when it comes to air, noise and parking spaces.

<Image src="poi-en.jpg" caption="Example of negative Point of Interest" alt="Screenshot of the tobacco factory's POI." />

### See what's nearby

Window, connecting ratings and POIs. It also shows some stats from "around" and generates "wisdom's of the crowd" badges depending on it. Proximity radius is changeable, 10 km option will only display average rating.

<Image src="nearby-en.jpg" caption="Example of nearby modal with POIs, stats and badges" alt="Screenshot of a popup, displaying a few ratings and POIs." />

### New sidebar features

- Send feedback - built in modal for submitting bugs, errors or suggestion (logged-in users only).
- Display POIs - toggling to "OFF" will remove POIs from the map.
- Send Anonymous reports - sending anonymous data. <TextLink href="../tutorial/#data-collection" text="See how it's anonymized" />. Turn OFF to not send anything.
- I need more ratings - button to press when you spent all your current actions.

<Image src="sidebar-en.jpg" caption="Sidebar changes" alt="Screenshot of sidebar." />

### Content translation

Translate to English comments and POI's title and description if it's not recognized as English. Recognition: <TextLink href="https://github.com/wooorm/franc" blank={true} text="Franc" />, translation: <TextLink href="https://www.deepl.com/pro-api" blank={true} text="DeepL" />.

### Community related

- <TextLink href="../../community/" text="A very special page" /> for the members of our community. Page, where one can find all needed information to involve oneself and influence a priority of our current tasks. Read <TextLink href="../community-launch/" text="why we need it" />.
- Launch on <TextLink href="https://opencollective.com/measureland" blank={true} text="Open Collective" />. We picked it for transparency.

### City guide contest

Prize pool and guaranteed 10$ for the first 50 participants. <TextLink href="../guide-contest/" text="Learn more" />.

__

That makes it for Measureland 2.0. Try it on and let us know what you think!
