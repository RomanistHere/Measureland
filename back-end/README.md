#how to run locally

- download and install mongoDB: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- `npm install` within the server folder
- run mongodb
- rename .env-example file to .env
- set up path to your DB, env-example contains the default one
- run app.js (`node app.js` or `npm start`)
- to make emailing work, acquire an account at mailgun and use your sandbox credentials

#important to do
- https://docs.mongodb.com/manual/core/2dsphere/ "db.places.createIndex( { loc : "2dsphere" } )" - add 2dsphere
