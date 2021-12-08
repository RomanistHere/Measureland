---
slug: support
title: Measureland Advisory. How to find and get support.
firstDate: 2021-04-02
date: 2021-12-03
description: Questions and answers.
tags: [starters]
layout: article
author: Roman Smunyov
---

<script>
    import TextLink from "$lib/components/ui-elements/TextLink.svelte";
    import TextButton from "$lib/components/ui-elements/TextButton.svelte";
    import { openAnotherOverlay } from '$lib/utilities/helpers.js';
</script>

### How to contact us.
If you want to tell us a story, submit a suggestion, share a bug or ask a quesiton there are a few ways to do it:
- via email: <TextLink href="mailto:support@measureland.org" text="support@measureland.org" />
- create an issue on GitGub: <TextLink href="https://github.com/RomanistHere/Measureland" blank={true} text="https://github.com/RomanistHere/Measureland" />
- write to our Telegram bot: <TextLink href="https://t.me/MeasurelandBot" blank={true} text="https://t.me/MeasurelandBot" />
- <TextButton text="fill a special form" action={() => { openAnotherOverlay('feedbackPopup') }} /> (should be registered)

But before you do, please check the section just below.

### Bugs and errors.
- **"Too many attempts"** and **"You rate too often"** - <TextLink href="../how-to-become-citizen/" text="how to resolve" />.
- **"Nearby place is already rated by you"** - happens when you try to rate the place within a short distance from one already measured by you.
- **I can’t register because I don't get verification email or the service is unavailable/slow** - Measureland is in a sort of beta testing stage right now, means we don’t expect everything to work perfectly and stable. Some of the third-party providers (DigitalOcean, MailGun, etc.) are not configured for handling a lot of people, we're working on it. Don’t forget that all the work is mostly done by a single guy at this stage.
- **Something specific isn’t working, like map is not moving or zooming, register popup is not opening and so on** - to be extremely useful your report should include key points like:

    - **your browser and OS** (example: *“Firefox, Windows laptop”*);
    - **description of the problem** (example: *“Can't open register popup”*);
    - **if the problem persists (after reload), what are the steps to reproduce it** - ideally with screenshots or video (example: *“click on the login button → nothing happens”*)

### FAQ.
- **How Measureland protected from spam and abuse?** - we have a few levels of protection, including <TextLink href="../how-to-become-citizen/" text="different limitations" />, server-side hardware detections, manual moderation and possibility to report not plausible ratings. We are still working on this part, it's important to be as trustworthy as possible.
- **Do you plan to add new features?** - we most certainly do! We have great plans for our service. <TextLink href="https://t.me/measureland" blank={true} text="Follow the news" /> to keep your finger on the pulse.
- **You claim yourself non-commercial, non-profit-oriented - how did you come up with it and why are there paid options?** - there are too much "commerce" in this world right now. <TextLink href="https://stallman.org/facebook.html" blank={true} text="Most popular services" /> in the world are oriented to get maximum profit from everything even if it <TextLink href="https://www.thesocialdilemma.com/" blank={true} text="can harm its users" />. We do literally hate to see it. Measureland is designed as a counterweight to this. We would like an opportunity to hire designers and developers, get faster servers. That's why we launched Measureland at the <TextLink href="https://opencollective.com/measureland" blank={true} text="Open Collective" /> - everyone can check what we spend money on and help us with out mission.
- **How can I help?** - there are numerous ways to do it, here are some important ones (<TextLink href="mailto:support@measureland.org" text="support@measureland.org" /> - don't hesitate to ask us about or clarify anything via email):

    - <TextLink href="https://github.com/RomanistHere/Measureland" blank={true} text="contribute" />
    - partner up
    - tell about us to your friends
    - <TextLink href="https://opencollective.com/measureland" blank={true} text="donate" />
    - send us "Thank you"
    - rate and <TextLink href="../write-a-guide/" text="write articles" /> for us
