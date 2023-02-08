const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate');
const authorize = require('../middleware/basic-auth')
const productService = require('./product-service');

// routes
router.post('/product', authorize, registerProduct, register);
router.get('/product/:productId', getById);
router.put('/product/:productId', authorize, updateProduct, update);
router.patch('/product/:productId', authorize, patchProduct, patch);
router.delete('/product/:productId', authorize, deleteProduct);
router.delete('/product/', authorize, deleteProductNull);
router.put('/product/', authorize, updateProductNull);
router.patch('/product/', authorize, patchProductNull);
router.post('/product/:productId', authorize, registerProductNull);
router.get('/product/', getByIdNull);

function deleteProductNull(req,res){
    res.status(400).send("No product ID entered");
}

function updateProductNull(req,res){
    res.status(400).send("No product ID entered");
}

function patchProductNull(req,res){
    res.status(400).send("No product ID entered");
}

function getByIdNull(req,res){
    res.status(400).send("No product ID entered");
}

function registerProductNull(req,res){
    res.status(400).send("Bad request");
}

module.exports = router;
//To validate our req.body 
function registerProduct(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        sku: Joi.string().required(),
        manufacturer: Joi.string().required(),
        quantity: Joi.string().required()
    });
    validateRequest(req, res, next, schema);
    next();
}

function register(req, res, next) {
    productService.create(req.body,req,res)
        .then(user => res.status(201).json(user))
        .catch(next);
}

function updateProduct(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        description: Joi.string().empty(''),
        sku: Joi.string().empty(''),
        manufacturer: Joi.string().empty(''),
        quantity: Joi.string().empty('')
    });
    
    validateRequest(req, res, next, schema);
    next();
}

function update(req, res, next) {
    productService.update(req.params.productId, req.body,req,res)
        .then(product => res.status(204).json(product))
        .catch(next);
}

function getById(req, res, next) {
    productService.getById(req.params.productId, req, req.body)
        .then(product => res.json(product))
        .catch(next);
}

function deleteProduct(req, res, next) {
    productService.deleteProduct(req.params.productId, req, req.body)
        .then(product => res.status(204).json(product))
        .catch(next);
}

function patchProduct(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        description: Joi.string().empty(''),
        sku: Joi.string().empty(''),
        manufacturer: Joi.string().empty(''),
        quantity: Joi.string().empty('')
    });
    
    validateRequest(req, res, next, schema);
    next();
}

function patch(req, res, next) {
    productService.patch(req.params.productId, req.body,req,res)
        .then(product => res.status(204).json(product))
        .catch(next);
}