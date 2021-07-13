const express = require('express');
const app = express();

app.use(express.json());

const validatorMiddleware = require('./validator');
const storeDataMiddleware = require('./store-data');


app.post('/', validatorMiddleware, storeDataMiddleware);


const port = 3000;
app.listen(port, () => {
    console.log(`app on port ${port}`);
});
