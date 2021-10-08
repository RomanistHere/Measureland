# To do:

- add question about timeline in quiz
- restyle filters
- move blog to svelte

# Org stuff

- write a contribution guide
- write an article about how awesome svelte is
- create Measureland discord and some community articles to get started

# Stuff to remember and check later

- Content security policy. Svelte should introduce something to remove script and css 'unsafe-inline' property with the release.

# With the next release

- Update db:
`
db.users.update(
  { 'properties.wantMoreRatings': { $exists: false }},
  { $set: { 'properties.wantMoreRatings': false }},
  { multi: true }
)

db.users.update(
  { 'properties.lastRatingsAdded': { $exists: false }},
  { $set: { 'properties.lastRatingsAdded': new Date() }},
  { multi: true }
)
`
