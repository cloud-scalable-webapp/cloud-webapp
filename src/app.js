require('rootpath')();
const express = require('express');
const fileUpload = require('express-fileupload');
const statsdClient= require("../src/utils/statsdUtil.js");
require('dotenv').config();
const env = process.env;

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error-handler');

app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/healthz", (req, res) => {
    logger.info("Health check successful");
    statsdClient.increment('get_/healthz');
    res.status(200).send({"statusCode":200, "message":"Health check successful"});
});

app.get("/check", (req, res) => {
    logger.info("Health check successful!");
    statsdClient.increment('get_/check');
    res.status(200).send({"statusCode":200, "message":"Health check successful!"});
});

app.use('/v2', require('./user/user-controller'));
app.use('/v2', require('./product/product-controller'));
app.use('/v2', require('./image/image-controller'));

app.use(errorHandler);

module.exports = app;
