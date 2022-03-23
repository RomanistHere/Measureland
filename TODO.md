# To do:

- move "L" to store so it won't be undefined
- telegram bot
- "why report" modal with a few options to chose from
- fix:
  - https://app.snyk.io/org/romanisthere/project/81819901-f54c-44c2-8ed5-39dc0dbb52ff
  - https://github.com/RomanistHere/Measureland/security/code-scanning

### Pre release

- Test with https://github.com/nolanlawson/fuite
- Check https://developers.google.com/search/docs/advanced/appearance/title-link
- Rename support to the ministry of complaints
- check links community page
- mention most active members of community
- limit API uses to website only (block all requests except from static cloudflare page IP)
- check if rate limiter doesn't block based in IP (cloudflare)
- update preview image and create a few for a blog pages
- regenerate api keys, move to env, move old ones into env example
- links to documentation:
  - https://github.com/mapbox/supercluster
  - https://svelte.dev/
  - https://leafletjs.com/
  - https://tailwindcss.com/
  - https://refreshless.com/nouislider/
  - https://swiperjs.com/svelte
  - https://github.com/velipso/polybooljs
  - https://github.com/kaisermann/svelte-i18n

# Later

- more badges
- share nearby API public
- login via Telegram
- fix workers (?)
- ask users to highlight areas in the city with something nice, like best quality of water

# Org stuff

- pull request template: https://www.chakshunyu.com/blog/6-concrete-tips-that-will-make-your-react-pull-requests-easier-to-review/

# Articles

- city-guides contest
- community page launch
- before the release: update technical documentation (github wiki)

# Stuff to remember and check later

- Content security policy. Svelte should introduce something to remove script and css 'unsafe-inline' property with the release.

# With the next release

- Update db (temporarily.js):
- adjust user.model.js after db update (remove two fields)
- add link to measureland in github
- write to wiki with questions about development and monetization.
- add measureland to my projects in portfolio
- write to everyone!
- link communities based on city/country

# Updates description

- Major design update
- Add timeline to the rating for more precise results
- See nearby rating average with stats and badges
- New community page
- Feedback popup
- Moving to Svelte
- Open collective launch
- City-guides contest
- Possibility to edit year of the rating
- Possibility to remove ratings
- Possibility to check / report / endorse a single rating
- Add point of interest
- Add measurements to the ratings (from external APIs)
