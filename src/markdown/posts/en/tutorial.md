---
slug: tutorial
title: Measureland Advisory. Our guidebook (tutorial).
firstDate: 2021-05-19
date: 2022-05-03
description: The article is going to cover everything you want to know about Measureland.
tags: [starters]
layout: article
author: Roman Smunyov
imageSrc: https://measureland.org/images/preview/tutorial_en_150.jpg
---

<script>
    import TextLink from "$lib/components/ui-elements/TextLink.svelte";
    import TextButton from "$lib/components/ui-elements/TextButton.svelte";
    import { openAnotherOverlay } from '$lib/utilities/helpers.js';
    import Summary from "$lib/components/Article/Summary.svelte";
    import Image from "$lib/components/Article/Image.svelte";

    const feedbackPopupName = 'feedbackPopup';
    const textButton = 'submit a special form';
</script>

This article is going to cover everything you want to know about Measureland.

<Summary
    text="Register and verify your email to measure land. Evaluate every point in the quiz, it's important. Comments can be extremely useful. You can filter ratings. Points of Interest (POIs) are valuable places to live next to."
/>

### So you want to rate a place

<Image src="tutorial_gif-en.gif" caption="All inputs on the image are completely random." alt="Animated example. Rating a place in Measureland." />

To do so you need to be registered and logged in. Once you're ready, find the area you want to measure and click it. There is no need to be super accurate, there is no goal to rate every building in the world. More like to get a general vision of every neighborhood, block and district.

There are 11 points you need to measure in order to submit your rating. It's important to rate every one of them even if you're not sure. <TextLink href="https://en.wikipedia.org/wiki/Wisdom_of_the_crowd" blank={true} text="Take a wild guess!" />

The last three points are marked as additional. They aren't that significant and have lower value in the final rating. But some of us are going to find it useful, so evaluate it as well.

Comments are not necessary but can be extremely useful. We plan to reward the most helpful comments in the future.

### I can't!

<Image src="tutorial_error-en.jpg" caption="You can mouseover the yellow icon to get additional information." alt="Screenshot of error." />

There are a few reasons you can't rate a place. There should be an error indicating what's wrong. For example:

- **"Too many attempts"** or **"You rate too often"** are about exceeding the limits of usage. See <TextLink href="../how-to-become-citizen/" text="how to resolve" /> these issues.
- **"Nearby place is already rated by you"** happens when you try to rate the place within a short distance from one already measured by you.
- **In other cases it's most likely our bad.** We're sorry. Read the error description, try to reload the page, check it later or <TextButton text={textButton} action={() => { openAnotherOverlay(feedbackPopupName) }} />.

### Exclamation marks? Points of Interest!

<Image src="tutorial_gif_poi-en.gif" caption="All inputs on the image are completely random." alt="Animated example. Creating new Point of Interest." />

There is a new set of objects on the map introduced in version 2.0.0 - Points of Interest (POIs). Those are marks you want to put on the places important in terms of searching for accommodation. It can be something negative, like some noisy construction site or an air polluting factory or positive, like a quiet and clean alley or a beach. It can also be something in the middle. Something bad for some people, which can be considered good for others: multi-level parking lot, playground or enormous hypermarket. It's hard to underestimate the value of such objects when looking for a home, isn't it?

To add Point of Interest, the first thing is to find it on the map. Next, click the approximate place and choose *"Add Point of Interest"*. Now, pick the best title possible, let it be short and clean, so everyone can understand what it is without looking into the description. And for description, put there relevant information: cons, pros, radius of affecting and so on. Facts are the best! Tags can be useful too.

If you hesitate about whether the object is good enough to be marked as POI on the map, think **how often do you use or pay attention to it, what feelings/emotions does it arouse in you?** If you used to not pay attention to it, or you don't feel anything special about the place - probably it's not the best candidate.

### Connecting Ratings and POIs

After clicking the existing rating you'll be able to "see what's nearby". Click the button, and it'll show the closest rating's stats and POIs.

<Image src="poi_rating_connection-en.gif" caption="See pros and cons right away." alt="Animated example. Open Rating and see POIs nearby." />

You'll be able to change the radius of "nearby" in this modal. The 10 km option is not supposed to show stats and POIs, only average rating.

### Edit or delete

Right now you can only edit the relevance of your rating. To achieve it, click your profile on the right top side of a screen, choose "My actions" and click on the year next to the needed rating in the newly opened window. If you want to edit a comment or change rating for certain criteria - the best way to do so would be deleting the current rating or POI and adding a new one. Another option would be writing to <TextLink href="../support/" blank={false} text="support" />. Works only on <TextLink href="../../" blank={false} text="the main page" />.

### Share it

You can easily get the link to the rating by clicking "Share this rating" or copying the URL. URL will always depend on the location you see on the screen. Points of Interest can be shared via copying URL as well.

### Filters

To open filters you need to click burger-menu on the right top side of a screen and pick "filters" in features. Now you can remove not relevant to you areas. 

<Image src="minsk_water-en.gif" caption="Water quality filter removes problem areas from the map." alt="Animated example. Part of Minsk's ratings disappear after applying filters." />

It allows you to set any range, so you can see what are the worst areas by setting filters to 1-3, for example.

### Drawing tools

<Image src="tutorial_draw-en.jpg" caption="Highlighted areas will persist after reload." alt="Screenshot of highlighted areas." />

Since the 1.1.0 version it's possible to draw shapes on the map and then share results. There are three types of shapes right now: polygon, rectangle and circle. You can find it at the right bottom corner of the screen (three top buttons respectively). You'll find the tips on how to draw once you click any of it. There are two more buttons below: edit and delete.

After every action your URL is going to change, so if you reload your page, shapes will remain - you can copy your address and share it with someone, he's going to see exactly the same view as you do. For now, it can be very big and ugly, but we're working on it.

There is a limit for URLs, 2000 characters, so once you achieve it, you will see a message that will ask you to remove some shapes in order to be able to share it. You can continue to draw, though. But all changes after the error won't be saved.

### Endorsements, reports and reputation system
We introduced a reputation system a-ka Karma in 2.0.0. It's hidden from users but is allowing us to have more understanding over what certain users are up to. The system is simple right now, every endorsement adds points and every report removes.

Useful to understand that adding a reason while reporting gives it more value, so pick (or draft) one. Thanks :) <span id="data-collection"></span>

### Usage and error data collection

By default, we're anonymously collecting some information about what features you use and errors you may encounter. This data collection is connected to the session, not to your account. To disable it, open the sidebar, find "Send anonymous error and usage reports" and press it to toggle.

<Image src="tutorial_data_collection-en.jpg" caption="How to open sidebar and disable data collection" alt="Sidebar screenshot." />

You can check a <TextLink href="https://github.com/RomanistHere/Measureland/blob/master/src/configs/flow.js" blank={true} text="full list" /> of actions we collect, and verify "anonymity" of your data: <TextLink href="https://github.com/RomanistHere/Measureland/blob/master/src/stores/state.js#L14" blank={true} text="random id generation" />, <TextLink href="https://github.com/RomanistHere/Measureland/blob/master/src/lib/components/EventsHandler.svelte#L32" blank={true} text="usage" /> and <TextLink href="https://github.com/RomanistHere/Measureland/blob/master/src/lib/components/ErrorHandler.svelte#L15" blank={true} text="error data" />, sent to server, processing <TextLink href="https://github.com/RomanistHere/Measureland/blob/master/back-end/controllers/flow.controller.js" blank={true} text="on the server" /> - there is no info that can disclose our users.

### How to participate or suggest something?
Visit our <TextLink href="../../community/" blank={false} text="community page" />. You'll find there our current tasks and instruments to influence it, forms to suggest your ideas and much more!
