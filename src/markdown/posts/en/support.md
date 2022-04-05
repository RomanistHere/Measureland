---
slug: support
title: Measureland Advisory. How to find and get support.
firstDate: 2021-04-02
date: 2022-04-02
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
If you want to tell us a story, submit a suggestion, share a bug or ask a question there are a few ways to do it:
- via email: <TextLink href="mailto:support@measureland.org" text="support@measureland.org" />
- create an issue on GitGub: <TextLink href="https://github.com/RomanistHere/Measureland" blank={true} text="https://github.com/RomanistHere/Measureland" />
- write to our Telegram bot: <TextLink href="https://t.me/MeasurelandBot" blank={true} text="https://t.me/MeasurelandBot" />
- <TextButton text="fill a special form" action={() => { openAnotherOverlay('feedbackPopup') }} /> (should be registered)

You can also ask other members of community in our <TextLink href="https://t.me/joinchat/sw16jwDFfJxhZGVi" blank={true} text="Telegram" /> and <TextLink href="https://discord.gg/PBrXUhqJhC" blank={true} text="Discord" /> chats.

But before you do, please check the section just below.

### Bugs and errors.
- **"Too many attempts"** and **"You rate too often"** - <TextLink href="../how-to-become-citizen/" text="how to resolve" />.
- **"Nearby place is already rated by you"** - happens when you try to rate the place within a short distance from one already measured by you.
- **I can’t register because I don't get verification email or the service is unavailable/slow** - Measureland is in an early growth stage right now, means we don’t expect everything to work perfectly and stable. Some third-party providers (DigitalOcean, MailGun, etc.) are not configured for handling a lot of people, buy we're working on it. Don’t forget that all the work is mostly done by a single guy at this stage.
- **Something specific isn’t working, like map is not moving or zooming, register popup is not opening and so on** - to be extremely useful your report should include key points like:

    - **your browser and OS** (example: *“Firefox, Windows laptop”*);
    - **description of the problem** (example: *“Can't open register popup”*);
    - **if the problem persists (after reload), what are the steps to reproduce it** - ideally with screenshots or video (example: *“click on the login button → nothing happens”*)

<h3 id="faq">FAQ.</h3>

- **Why should I rate something?** - well, the current state of search for accommodation doesn't fit 21st century. We're giving it a bit of a push to evolve into something more contemporary. Your honest rating will be: 1) a potential **contribution to your own time and mental health** - and in the end - **to your happiness** (pick the neighborhood based on what's important for you); 2) **an endowment into the future**. Measureland's growth will eventually make some real estate related professions adapt and then evolve, progress.

    There are other reasons, like detecting problem areas within the city (with bad water and air quality) or "honesting" of real estate prices - but it's going to be a topic for a separate article in the future.
- **How do you plan to handle real estate workers trying to abuse your service?** - we plan to separate profit oriented users (like agencies) from other Measuremen with a different reputation system. With the growth of our service **agencies will be more interested in their record here rather than in pursuing one-time deal**. User trust will lead them to making more money. Thus, **we will turn chase for money into what's the best for our users**. And I remind you that not everyone puts money over honesty.
- **Why do you think Google/Airbnb didn't create it yet? It means it's not needed.** - no it doesn't. Big business pursuit big money. They pick an area, create a business plan, estimate profit and only then decide if they want to brainstorm (or "adapt") ideas. Measureland started as an idea. **It's hard for business to sell people's opinion**, because it's hardly provable. Company will have hard times selling something unprovable - they are going to be responsible for it. **We in Measureland sell nothing**. We're building service to help people asking nothing in return.
- **How is Measureland protected from spam and abuse?** - we have a few levels of protection, including <TextLink href="../how-to-become-citizen/" text="different limitations" />, server-side hardware detections, manual moderation, reputation system and possibility to report not plausible ratings. We are still working on this part, it's important to be as trustworthy as possible.
- **Do you plan to add new features?** - we most certainly do! We have great plans for our service. <TextLink href="https://t.me/measureland" blank={true} text="Follow the news" /> to keep your finger on the pulse.
- **You claim yourself non-commercial, non-profit-oriented - how did you come up with it and why are there paid options?** - there are too much "commerce" in this world right now. <TextLink href="https://stallman.org/facebook.html" blank={true} text="Most popular services" /> in the world are oriented to get maximum profit from everything even if it <TextLink href="https://www.thesocialdilemma.com/" blank={true} text="can harm its users" />. We do literally hate to see it. Measureland is designed as a counterweight to this. Nevertheless, we would like an opportunity to hire designers and developers, get faster servers. That's why we launched Measureland at the <TextLink href="https://opencollective.com/measureland" blank={true} text="Open Collective" /> - everyone can check what we spend money on and help us with out mission.
- **How can I help?** - there are numerous ways to do it, here are some important ones (<TextLink href="mailto:support@measureland.org" text="support@measureland.org" /> - don't hesitate to ask us about or clarify anything via email):

    - <TextLink href="https://github.com/RomanistHere/Measureland" blank={true} text="contribute" />
    - partner up
    - tell about us to your friends
    - <TextLink href="https://opencollective.com/measureland" blank={true} text="donate" />
    - send us "Thank you"
    - rate and <TextLink href="../write-a-guide/" text="write articles" /> for us
