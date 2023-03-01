const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate');
const authorize = require('../middleware/basic-auth')
const imageService = require('./image-service');

// routes
router.post('/product/:productId/image', authorize, imageValidation, uploadImage);
router.get('/product/:productId/image', authorize, getAllImage);
router.get('/product/:productId/image/:image_id', authorize, getImageById);
router.delete('/product/:productId/image/:image_id', authorize, deleteImage);
router.post('/product/:productId/image/:image_id', authorize, uploadNull);

function uploadNull(req,res){
    res.status(400).send("Incorrect URL, remove the image ID");
}

module.exports = router;

function imageValidation(req, res, next) {
    if(!req.files){
        res.status(400).send({
            message: 'No image uploaded'
        });
    }
    next();
}

function uploadImage(req, res, next) {
    imageService.uploadImage(req,res)
        .then(data => res.status(201).json(data))
        .catch(next);
}

function getAllImage(req, res, next) {
    imageService.getAllImage(req)
        .then(data => res.status(200).json(data))
        .catch(next);
}

function getImageById(req, res, next) {
    imageService.getImageById(req, req.params.image_id)
        .then(user => res.json(user))
        .catch(next);
}

function deleteImage(req, res, next) {
    imageService.deleteImage(req, req.params.image_id)
        .then(user => res.status(204).json(user))
        .catch(next);
}
