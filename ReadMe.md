# Validation API

A nodeJS api that accepts the JSON payload below on the route `POST /`.

```js
    {
    "user_id" : 1234,
    "title" : "My title",
    "tags" : ["tag1", "tag2"]
    }
```

## Database

Application uses mysql database. The credentials for the database can be configured from the `knexfile.js`
If your database don't have the tables and structure required to run the application run

```bash
    npm run migrate:run
```


## Starting the Application

```bash
    npm start
```

Application runs on port `3000`. Goto `http://localhost:3000` to access it locally


## Testing

```bash
    npm test
```