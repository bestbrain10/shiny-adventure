const express = require('express');
const app = express();

const validatorMiddleware = require('./validator');





const port = 3000;
app.listen(port, () => {
    console.log(`app on port ${port}`);
});
