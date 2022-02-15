# To do:

- fix focus states
- set up colors in tailwind config
- new secret feature
  - comments (limit number of comments)
  - add POIs to nearby popup
  - show my POIs
  - delete POI
- karma
  - save list of ids of whom you endorse
  - on every like/dislike comment or POI add/remove user karma
  - every 5 karma adds/removes 1 action point
  - every +20 karma gains one token
- fix issue with fetch data when click on comments
- registerAction('POIs');
- https://waqi.info/#/c/53.83/27.602/11z
- https://aqicn.org/map/world

### Pre release

- check links community page
- mention most active members of community
- limit API uses to website only (block all requests except from static cloudflare page IP)
- check if rate limiter doesn't block based in IP (cloudflare)
- update preview image and create a few for a blog pages
- regenerate api keys, delete old ones
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
- Rename support to the ministry of complaints

# With the next release

- Update db (temporarily.js):
- adjust user.model.js after db update (remove two fields)
- add link to measureland in github
- write to wiki with questions about development and monetization.
- add measureland to my projects in portfolio

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
