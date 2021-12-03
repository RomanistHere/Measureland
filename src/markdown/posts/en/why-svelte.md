---
slug: why-svelte
title: Why we picked Svelte over React, Angular, Vue?
date: 2021-11-29
description: I compare popular "frameworks" (React, Angular and Svelte) with the building tools and explain why we picked Svelte. Programming knowledge is not required.
tags: [technology]
layout: article
author: Roman Smunyov
---

Programming knowledge is not required. Explanation is in English and by metaphor.

### What are "frameworks" (Svelte, React, Preact, etc.) anyway?

Building an app is not so different from building a house. So imagine us (me and you, my reader) going to build it. That would be my analogy. Logs, planks and other stuff we're going to do it with are HTML and CSS. Frameworks are our sets of tools. Let's see how they differ from this point of view. 

#### Angular.

It's a complete set of instruments to make almost anything in the world. So complete that there is a different hammer for every nail size. There are also tools we didn't know exist. But the price is we need to understand how to use them, where to store them all and so on.

We could learn and use only part of them, but it's a bit ridiculous to have almost any tool possible and use only a hammer. Manuals are clear (even a hammer has one) but can be long and complex. Sometimes we need to nail with a pile driver to make the construction more robust. Don't worry, it's in the manual.

It all would be likely helpful if we were building a skyscraper and had a team of professionals. But we're building a home, and it's an obvious overkill.

By the way, if there were other skyscrapers around, chances are that ours wouldn't be the best one. Visitors would get stuck in elevators from time to time and wouldn't be happy about it. <a href="https://cscalfani.medium.com/goodbye-object-oriented-programming-a59cda4c0e53" class="article__link" target="_blank" rel="noopener">Sorry, OOP</a>.

#### React/Preact.

Imagine if <s>Apple</s> Facebook made construction tools. All the instruments would look sexy. We'd have a nice small starter pack with "everything we need" to build a home. Everything would look super professional and easy to begin with. We would start to <s>touch</s> show it to our neighbors.

Ok, we got it. Now let's start to build. After a few hours/days it will appear that part of our instruments (almost all, really) lacks something. We will need to return to the store to buy different nails, bigger hammer, right drills and so on. For most of these things we would need to go to other stores, because the official one lacks it. Of course after we have found them - by asking neighbors. Luckily, a lot of them used React too. Some of them started to sell their own tools to guys like us.

But the worst thing is, if no one checks on us, the chance of messing up is increasing with every new thing we do. It won't be necessarily noticeable from the start, but be sure, we're gonna pay for this later.

#### Vue.

I know much less of Vue, so pardon me for missing it - though, you can send me your vision, I'll add it - and let's get to know Svelte.

#### Svelte.

There is a starter pack as well. But it looks different. After us trying to make a building with React and Angular it looks promising. There is a "help" vibe rather than "sell" one across the shop. It's a different one - it doesn't look like it's owned by some corporation. In fact, it's not very big, and we can see the owner himself on the sales floor. He explains to customers like us how they created these tools and how to not mess up. Sounds pretty simple.

But we're not that trusting anymore!

"We want to see how many types of drills are in the box!"

Our assistant smiles. We open the box and there are a few - well, actually there are more than in React and less than in Angular. Assistant tells us that these are universal drills - it will be enough to do 80% of work. 

"Why not 100%?" - we ask in unison.

"We would need to increase the size of this box to a small room in this case. We try to calibrate the number based on our observations and feedback. It's still in progress - you see, we started this shop not so long ago. Try it, and if you're unsatisfied with the process, get back to us, we'll try to adjust it."

"Sounds reasonable" - we think...

#### ... After finishing our home...

Well, it looks okay. There are a few things to fix later, when new instruments arrive. Some tools weren't very handy or comfortable to use - we decide to contact the store about it. But otherwise... It felt really nice. Especially for such a small tools-store and for the first experience.

"So, what do you say?" - you ask me.

"It was rather enjoyable. We can stick to this Svelte for now, what do you think?" - I reply. Now, what is your answer? :)

### JavaScript vs TypeScript.

I hope you understand that I didn't intend to offend anyone. My explanation should help you to understand how these "frameworks" differ in a simple way. Well, let's expand this pun a bit. Let me know if you like it, I can do CSS, Tailwind and more...

#### What is JavaScript in the metaphor?

Our hands. We can build everything with but our bare hands. We did it through history. We can make a hummer or use a rock - everything is up to us. It's possible to make a building this way, though not advisable for an average person.

#### And TypeScript...

Augmented Reality headset and gloves connected to each other. This system recognizes what we're doing right now and makes sure we don't make "mistakes". For example, we don't hammer wood nails into anything but wood. Or that we don't saw off a piece of wood with a metal hacksaw. It would be so wrong!

So sometimes instead of making some elegant and fast solution we find ourselves searching for the right instrument to do the job. Like the manual says. Works best with Angular.

It also checks whether our structure matches the blueprints (we should draw it too). Good if we have accurate drawings. Not so good if our blueprints exist only for show. Having an accurate blueprint, however, is always a good idea if we're building something, doesn't matter Type- or JavaScript.

Generally, it can be both helpful and harmful. It's obvious that a system that complex can't be without-the-delay fast and sometimes fails. TypeScript's goal is to limit us in use of our tools, limit our imagination. Is it good or bad - only for you to decide.

### More technical details. Why Svelte.

#### Performance.

<a href="https://krausest.github.io/js-framework-benchmark/current.html" class="article__link" target="_blank" rel="noopener">Benchmarks</a>. Svelte is not the fastest one. <a href="https://www.solidjs.com/" class="article__link" target="_blank" rel="noopener">Solid</a>, for example, follows the similar methodology and beats it in most tests. But Svelte is generally fast enough to not care about it. Faster than the most. Hi <a href="https://svelte.dev/blog/virtual-dom-is-pure-overhead" class="article__link" target="_blank" rel="noopener">Virtual DOM</a>!

#### Out-of-box instruments.

SvelteKit: Static site generation and server side rendering, routing, back-end simulation (endpoints). <a href="https://preactjs.com/" class="article__link" target="_blank" rel="noopener">Preact</a> has it as well, though. 

Svelte: Nice and handy transitions and animations. CSS and scopes. Cross-component state managing (stores). True reactivity. Compiling to JavaScript.

#### What else did we like.

JS-in-HTML feels much more convenient and "not heavy" in comparison to the HTML-in-JS scheme. Generally, writing CSS, JS, HTML in the same file feels old-school and modern (with all the features) at the same time. 

#### What did we not like.

Not much. It was a bit hard at the start to use let instead of const to achieve reactivity. You should also remember that SvelteKit is not released yet. So there can be bugs. Some features are not implemented, like i18n and there are holes in content-security-policy.

#### Community.

Small (means there are not many answers at Stack Overflow), but active (means you can ask questions in the Discord and they will be answered).  Just like Measureland, Svelte is community-first, means creators value us and our trust most.

#### Transparency.

Yes. <a href="https://github.com/sveltejs/svelte" class="article__link" target="_blank" rel="noopener">Open-source</a> and <a href="https://opencollective.com/svelte" class="article__link" target="_blank" rel="noopener">non-commercial</a>. Just as I like.

#### Conclusion.

We managed to make this site with Svelte/SvelteKit and are happy about it. I enjoyed the process and am looking towards working with it in the future.

Is Svelte the future of the web? I don't know. But it surely is the present for me.
