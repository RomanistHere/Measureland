#how to run locally

- download and install mongoDB
- `npm install` at the server folder
- run mongodb
- create an .ENV file with IS_PROD=0, DEV_DB_PATH=mongodb://127.0.0.1/, SESSION_SECRET=random_string_example, CORS_PATH_DEV and SITE_URL_DEV=localhost_address_example, SERVER_PORT, MAILGUN_DOMAIN and MAILGUN_API
- run app.js (`node app.js`)

#important to do
- https://docs.mongodb.com/manual/core/2dsphere/ "db.places.createIndex( { loc : "2dsphere" } )" - add 2dsphere
