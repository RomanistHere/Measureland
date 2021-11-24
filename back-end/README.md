## How to run back-end (with MongoDB) server locally

- download and install mongoDB: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- `npm install` within the back-end folder
- run mongodb
- rename .env-example file to .env
- set up path to your DB, env-example contains the default one
- (optional) [import ready-made samples](https://github.com/RomanistHere/Measureland/tree/master/back-end/db%20samples)
- run app.js (`node app.js` or `npm start`)
- to make emailing work, acquire Mailgun account and use your sandbox credentials

#### Important to do
- https://docs.mongodb.com/manual/core/2dsphere/ "db.places.createIndex( { loc : "2dsphere" } )" - add 2dsphere

Read how to run front-end: https://github.com/RomanistHere/Measureland/wiki/How-to-run-the-project
