require('rootpath')();
const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/healthz", (req, res) => {
    res.status(200).send({"statusCode":200, "message":"Health check successful!"});
});

app.use('/v1', require('./user/user-controller'));
app.use('/v1', require('./product/product-controller'));

app.use(errorHandler);

module.exports = app;