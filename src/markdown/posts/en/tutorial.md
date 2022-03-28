---
slug: tutorial
title: Measureland Advisory. Our guide book (tutorial).
firstDate: 2021-05-19
date: 2022-03-28
description: The article is going to cover everything you want to know about Measureland.
tags: [starters]
layout: article
author: Roman Smunyov
---

<script>
    import TextLink from "$lib/components/ui-elements/TextLink.svelte";
    import TextButton from "$lib/components/ui-elements/TextButton.svelte";
    import { openAnotherOverlay } from '$lib/utilities/helpers.js';
    import Summary from "$lib/components/Article/Summary.svelte";

    const feedbackPopupName = 'feedbackPopup';
    const textButton = 'submit special form';
</script>

This article is going to cover everything you want to know about Measureland.

<Summary
    text="Register and verify your email to measure land. Evaluate every point in the quiz, it's important. Comments can be extremely useful."
/>

### So you want to rate a place
To do so you need to be registered and logged in. Once you're ready, find the area you want to measure and click it. There is no need to be super accurate, there is no goal to rate every building in the world. More like to get a general vision of every neighborhood, block and district.

There are 11 points you need to measure in order to submit your rating. It's important to rate every one of them even if you're not sure. <TextLink href="https://en.wikipedia.org/wiki/Wisdom_of_the_crowd" blank={true} text="Take a wild guess!" />

The last three points are marked as additional. They aren't that significant and have lower value in the final rating. But some of us are going to find it useful, so evaluate it as well.

Comments are not necessary but can be extremely useful. We plan to reward the most helpful comments in the future.

### I can't!
There are a few reasons you can't rate a place. There should be an error indicating what's wrong. For example:

- **"Too many attempts"** or **"You rate too often"** are about exceeding the limits of usage. See <TextLink href="../how-to-become-citizen/" text="how to resolve" /> these issues.
- **"Nearby place is already rated by you"** happens when you try to rate the place within a short distance from one already measured by you.
- **In other cases it's most likely our bad.** We're sorry. Read the error description, try to reload the page, check it later or <TextButton text={textButton} action={() => { openAnotherOverlay(feedbackPopupName) }} />.


### Share it
You can easily get the link to the rating by clicking "Share this rating" or copying the URL. URL will always depend on the location you see on the screen.

There is also a possibility to highlight and share areas on the map, more about it below.


### Drawing tools
Since the 1.1.0 version it's possible to draw shapes on the map and then share results. There are three types of shapes right now: polygon, rectangle and circle. You can find it at the right bottom corner of the screen (three top buttons respectively). You'll find the tips on how to draw once you click any of it. There are two more buttons below: edit and delete.

After every action your URL is going to change, so if you reload your page, shapes will remain - you can copy your address and share it with someone, he's going to see exactly the same view as you do. For now, it can be very big and ugly, but we're working on it.

There is a limit for URLs, 2000 characters, so once you achieve it, you will see a message that will ask you to remove some shapes in order to be able to share it. You can continue to draw, though. But all changes after the error won't be saved.

### Points of Interest
There is a new set of objects on map introduced in version 2.0.0 - POIs. Those are marks you want to put on the places important in terms of searching for accommodation. It can be something negative, like some noisy construction site or an air polluting factory or positive, like a quiet and clean alley or a beach. It can also be something in the middle. Something bad for part of people, which can be considered good for others: multi-level parking lot, playground or enormous hypermarket. It's hard to underestimate value of such objects when looking for a home, isn't it?

To add Point of Interest, first thing is to find it on map. Next, click the approximate place and chose *"Add Point of Interest"*. Now, pick the best title possible, let it be short and clean, so everyone can understand what is it without looking into description. And for description, put there relevant information: cons, pros, radius of affecting and so on. Facts are the best! Tags can be useful too.

### Endorsements, reports and reputation system
We introduced reputations system a-ka Karma in 2.0.0. It's hidden from users but is allowing us to have more understanding over what certain users are up to. The system is simple right now, every endorsement adds points and every report removes.

Useful to understand, that adding a reason while reporting gives it more value, so pick (or draft) one. Thanks :)

### How to participate or suggest something?
Visit our <TextLink href="../../community" blank={false} text="community page" />. You'll find there our current task, have instruments to influence it, suggest your ideas, find a platform to communicate with us and much more!
