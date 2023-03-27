const { INTEGER } = require('sequelize');
const db = require('../utils/database');
const env = process.env;
const bucketName = env.S3_BUCKET_NAME;
const AWS = require('aws-sdk');
const logger=require('../mylog/logger.js');

module.exports = {
    authenticate,
    getById,
    create,
    update,
    patch,
    deleteProduct
};

const s3 = (env.NODE_ENV == "development") ? 
    new AWS.S3({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })
    :
    new AWS.S3()

let xx;
async function authenticate({ username, password}) {
    const user = await db.User.scope('withPassword').findOne({ where: { username: username } })
    let usernameValidation = false;
    xx=user.dataValues.id;
    if(user){
        if(username === user.dataValues.username){
            usernameValidation = true;
        }
        const compare = await comparePassword(password, user.dataValues.password);
        if (user && compare && usernameValidation) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword; //returning the user object without password
        }
    }
}

async function comparePassword(password, hash) {
    const result =  await bcrypt.compare(password, hash);
    return result;
}

async function getById(productId) {
    return await getProduct(productId);
}

async function create(params, req, res) {
//     if (await db.User.findOne({ where: { username: params.username } })) {
//         throw 'Username "' + params.username + '" is already registered, please pick a different username';
//     }

//     var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

//     if(!params.username.trim().match(regexEmail)){
//         throw 'Invalid username, enter a valid email address';
//    }

// console.log(req.body);
logger.info("Checking if all required fields have been entered");
if (Object.keys(req.body).length > 5){
    logger.error("Enter all the required fields");
    throw 'Enter all the required fields'; 
    return;
}
if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
    logger.error("Enter all the required fields");
    throw 'Enter all the required fields';
    return;
}
logger.info("Checking if any required fields are empty");
if ((((((params.name).length == 0) || (params.description).length == 0) || (params.sku).length == 0) || (params.manufacturer).length == 0) || (params.quantity).length == 0) {
    logger.error("Required field is empty");
   throw 'Required field is empty';
}
logger.info("Looking if product with that sku already exists");
if (await db.Product.findOne({ where: { sku: params.sku } })) {
    logger.error("SKU already exists");
             throw 'SKU "' + params.sku + '" already exists, please enter a different SKU';
         }

const userId = req.auth.user.dataValues.id;
   let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  params.date_added = date_ob;
  params.date_last_updated = date_ob;
params.owner_user_id = userId;

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    logger.info("Checking if quantity is within limits");
    if (!(Number.isInteger(params.quantity) && params.quantity >= 0 && params.quantity <=100)){
        logger.error("Enter a valid quantity between 0 and 100");
        throw 'Enter a valid quantity between 0 and 100';
    }

    //creating a record in the database using the create library (sequalize)
    logger.info("Creating a product record in the database");
    const product = await db.Product.create(params);
    return (product.get());
}

async function update(productId, params, req, res) {
    //we get this user object from the db
    logger.info("Getting this product from the database");
    const product = await getProduct(productId);

    // if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
    //     throw 'Enter all the required fields';
    //     return;
    // }

    //if changing the password this is to encrypt the new password
    // if(product){
    //     if(params.owner_user_id !== product.dataValues.owner_user_id) {
    //         throw 'Prohibited to change username';
    //     }
    // }else {
    //     throw 'not found';
    // }
    logger.info("Checking if all required fields have been entered");
    if (Object.keys(req.body).length > 5){
        logger.error("Enter all the required fields");
        throw 'Enter all the required fields';
        return;
    }
    if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
        logger.error("Enter all the required fields");
        throw 'Enter all the required fields';
        return;
    }
    logger.info("Checking if any required fields are empty");
    if ((((((params.name).length == 0) || (params.description).length == 0) || (params.sku).length == 0) || (params.manufacturer).length == 0) || (params.quantity).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
     params.date_last_updated = date_ob
     const userId = req.auth.user.dataValues.id;
    logger.info("Checking if user is allowed to update the product");
    if(userId != product.dataValues.owner_user_id){
        logger.error("You are forbidden to update this product");
        throw 'You are forbidden to update this product';
    }
    logger.info("Checking if quantity is within limits");
    if (!(Number.isInteger(params.quantity) && params.quantity >= 0 && params.quantity <=100)){
        logger.error("Enter a valid quantity between 0 and 100");
        throw 'Enter a valid quantity between 0 and 100';
    }
    // console.log(req.params.productId);
    const new_data = await db.Product.findOne({ where: { id: req.params.productId } });
    // console.log(new_data.dataValues.sku);
    logger.info("Looking if product with that sku already exists");
    if(new_data.dataValues.sku != params.sku){
    if (await db.Product.findOne({ where: { sku: params.sku } })) {
        logger.error("SKU already exists");
        throw 'SKU "' + params.sku + '" already exists, please enter a different SKU';
    }
    }

    Object.assign(product, params);
    //saving the user object to the db
    logger.info("Updating product record in the database");
    await product.save();
    //To omit password in the response 
    return (product.get());
}

async function getProduct(productId, req) {
    logger.info("Finding the product using ID in the database");
    const product = await db.Product.findByPk(productId);
    if (!product)  logger.error("Product doesn't exist in the database"); throw 'Product is not present in the database';
    // if(product.dataValues.userId != req.auth.user.dataValues.id){
    //     throw 'You cannot delete this product!'
    // }
    return product;
}

async function deleteProduct(productId, req) {
    console.log(productId);
    logger.info("Finding the product using ID in the database");
    const product = await db.Product.findByPk(productId);
    if (!product) throw 'Product is not present in the database';
    // if(user.dataValues.id != req.auth.user.dataValues.id){
    //     throw 'Unauthorized'
    // }
    // if (Object.keys(req.body).length > 5){
    //     throw 'Enter all the required fields';
    //     return;
    // }
    // if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
    //     throw 'Enter all the required fields';
    //     return;
    // }
    logger.info("User not authorized to delete the product");
    const userId = req.auth.user.dataValues.id;
    if(userId != product.dataValues.owner_user_id){
        logger.error("You cannot delete this product!");
        throw 'You cannot delete this product!'
    } else {
const getAllImages = await db.Image.findAll({
        attributes: ['image_id', 'product_id', 'file_name', 'date_created', 's3_bucket_path'],
        where: {
            product_id: productId
        }
    });
    logger.info("Deleting all images associated with the product");
    if( getAllImages.length > 0){
    for (let i = 0; i < getAllImages.length; i++) {
        const image = getAllImages[i];
        const imageparams = image.dataValues.s3_bucket_path.split("/");
        const key = imageparams[3]+"/"+imageparams[4]+"/"+ imageparams[5];
        const imageId = image.dataValues.image_id;
        const params = {
        Bucket: bucketName,
	    Key: key,
     };
        db.Image.destroy({ where: { image_id: imageId } })
        s3.deleteObject(params, function (err, data) {
        if (err) {
            logger.error("Bad Request");
            throw 'Bad Request';
        }
  })
    }
    logger.info("Deleting the product from the database");
    db.Product.destroy({ where: { id: productId } })
}
    return product;
}
}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function patch(productId, params, req, res) {
    //we get this user object from the db
    logger.info("Finding the product using ID in the database");
    const product = await getProduct(productId);
    logger.info("Checking if fields entered are valid");
    var fields = ['name','description','sku','manufacturer','quantity']
    var cnt = 0
    for(var i = 0; i < 5; i++){
        if(req.body.hasOwnProperty(fields[i])){
            cnt += 1
        }
    }
    if (Object.keys(req.body).length > cnt){
        logger.error("Enter a valid field");
        throw 'Enter a valid field';
        return;
    }
    // if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
    //     throw 'Enter a valid field';
    //     return;
    // }
    // if ((!req.body.hasOwnProperty('description'))){
    //     throw 'Enter all the required fields';
    //     return;
    // }
    // if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
    //     throw 'Enter all the required fields';
    //     return;
    // }

    //if changing the password this is to encrypt the new password
    // if(product){
    //     if(params.owner_user_id !== product.dataValues.owner_user_id) {
    //         throw 'Prohibited to change username';
    //     }
    // }else {
    //     throw 'not found';
    // }
    // if (Object.keys(req.body).length > 5){
    //     throw 'Enter all the required fields';
    //     return;
    // }
    // if (!(req.body.hasOwnProperty('name')) || !(req.body.hasOwnProperty('description')) || !(req.body.hasOwnProperty('sku')) || !(req.body.hasOwnProperty('manufacturer')) || !(req.body.hasOwnProperty('quantity'))){
    //     throw 'Enter all the required fields';
    //     return;
    // }
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    logger.info("Checking if the required field is empty");
    if(req.body.hasOwnProperty('name') && (params.name).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }
     logger.info("Checking if the required field is empty");
    if(req.body.hasOwnProperty('description') && (params.description).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }
     logger.info("Checking if the required field is empty");
    if(req.body.hasOwnProperty('sku') && (params.sku).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }
     logger.info("Checking if the required field is empty");
    if(req.body.hasOwnProperty('manufacturer') && (params.manufacturer).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }
     logger.info("Checking if the required field is empty");
    if(req.body.hasOwnProperty('quantity') && (params.quantity).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }

    let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
     params.date_last_updated = date_ob
     logger.info("Checking user is authorized to update the product");
     const userId = req.auth.user.dataValues.id;
    if(userId != product.dataValues.owner_user_id){
        logger.error("You are forbidden to update this product");
        throw 'You are forbidden to update this product';
    }
    logger.info("Checking if the quantity entered is valid");
    if (req.body.hasOwnProperty('quantity')){
        if (!(Number.isInteger(params.quantity) && params.quantity >= 0 && params.quantity <=100)){
            logger.error("Enter a valid quantity between 0 and 100");
            throw 'Enter a valid quantity between 0 and 100';
        }
}
    // console.log(req.params.productId);
    logger.info("Checking if sku already exists in the database");
    if (req.body.hasOwnProperty('sku')){
    const new_data = await db.Product.findOne({ where: { id: req.params.productId } });
    // console.log(new_data.dataValues.sku);
    if(new_data.dataValues.sku != params.sku){
    if (await db.Product.findOne({ where: { sku: params.sku } })) {
        logger.error("SKU already exists");
        throw 'SKU "' + params.sku + '" already exists, please enter a different SKU';
    }
}
}
    Object.assign(product, params);
    //saving the user object to the db
    await product.save();
    logger.info("Updating the product in the database");
    //To omit password in the response 
    return (product.get());
}