### Samples to import in database (with MongoDB Compass)

- after you have [installed MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/), download and install MongoDB Compass
- [launch the back-end server](../README.md) to form database by path in [your .env file (DEV_DB_PATH)](../.env-example)
- connect with Compass to your local database
- find the needed collection (comments, geos, ratings, users)
- click big green button "ADD DATA" and then "import file"
- import the samples accordingly

Now if you did everything correctly, after launching front-end server you will be have some ratings already. As well as three available users (email/password) to login:

- example1@email.com/1234567
- example2@email.com/1234567
- example3@email.com/1234567
