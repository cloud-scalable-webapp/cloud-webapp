const bcrypt = require('bcryptjs');
const db = require('../utils/database');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const env = process.env;
const bucketName = env.S3_BUCKET_NAME;
const logger = require('../mylog/logger');
module.exports = {
    authenticate,
    uploadImage,
    getAllImage,
    getImageById,
    deleteImage
};
global.logger=logger;
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

const s3 = (env.NODE_ENV == "development") ? 
    new AWS.S3({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })
    :
    new AWS.S3()

async function uploadImage(req,res) {
    logger.info("Checking if any other file type is being uploaded other than image");
const imgType = req.files.image.mimetype;
if (!imgType.includes("image")) {
    logger.error("Only images are allowed");
throw "Only images are allowed"
return;
}
logger.info("Checking if product exists in the database");
const productId = req.params.productId;
const product = (await db.Product.findOne({ where: { id: productId } }));
if(!product){
    logger.error("Product is not present in the database");
        throw 'Product is not present in the database';
          }
   let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
   logger.info("Checking if user is allowed to update the product");
   const userId = req.auth.user.dataValues.id;
  if(userId != product.dataValues.owner_user_id){
    logger.error("You are forbidden to update this product");
        throw 'You are forbidden to update this product';
    }  
req.date_created = date_ob;
	let myImage = req.files.image.name.split(".");
    const imageType = myImage[myImage.length - 1];
    const imageContent = Buffer.from(req.files.image.data, 'binary');
// const key = `${uuid()}`;
// const key2 = `${product.dataValues.owner_user_id}/${req.params.productId}/${req.files.image.name}`
const key = `${product.dataValues.owner_user_id}/${req.params.productId}/${uuid()}.${myImage[1]}`
const s3params = {
        Bucket: bucketName,
        Key: key,
        Body: imageContent
    }
    const path = "https://"+bucketName+".s3.amazonaws.com/"+key;
    //console.log(path);
    logger.info("Uploading image to S3");
    s3.upload(s3params, function(err, data) {
        if (err) {
            throw err;
        }
        //console.log(data);
    });

    var presignedGETURL = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: key,
        Expires: 1000*5 
    });
    const meta = {
        image_id: req.params.id,
        product_id: req.params.productId,
        file_name: req.files.image.name,
	date_created: req.date_created,
        s3_bucket_path: path
    }
    logger.info("Adding image to the database");
    const image =  await db.Image.create(meta);
}

async function getAllImage(req) {
const productId = req.params.productId;
logger.info("Getting all images associated with a product");
const product = (await db.Product.findOne({ where: { id: productId } }));
logger.info("Checking if the product exists in the database");
if(!product){
    logger.error("Product is not present in the database");
        throw 'Product is not present in the database';
          }
          logger.info("Checking if user is allowed to update the product");
const userId = req.auth.user.dataValues.id;
  if(userId != product.dataValues.owner_user_id){
    logger.error("You are forbidden to access this product");
        throw 'You are forbidden to access this product';
    }
const image = (await db.Image.findAll({ where: { product_id: productId } }));
    return image;
}

//async function getById(req, image_id) {
//    return await getImageById(req, image_id);
//}

async function getImageById(req, image_id) {
const productId = req.params.productId;
logger.info("Get image based on the image id");
const product = (await db.Product.findOne({ where: { id: productId } }));
logger.info("Checking if product exists in the database");
if(!product){
    logger.error("Product is not present in the database");
        throw 'Product is not present in the database';
          }
          logger.info("Checking if the user is allowed to access the product");
const userId = req.auth.user.dataValues.id;
  if(userId != product.dataValues.owner_user_id){
    logger.error("You are forbidden to access this product");
        throw 'You are forbidden to access this product';
    }
  const imageId = req.params.image_id;
  logger.info("Checking if image exists");
  const image = await db.Image.findOne({ where: { image_id: image_id } })
    if (!image) {
        logger.error("Image not found");
          throw 'Image not found';
          return;     
	}
if (imageId && productId != image.dataValues.product_id) {
    logger.error("Image not found");
                    throw 'Image not found';
                    return;
                }
    return image;
}

async function deleteImage(req, image_id){
const productId = req.params.productId;
logger.info("Checking if the image exists in the database");
const product = (await db.Product.findOne({ where: { id: productId } }));
if(!product){
    logger.error("Product is not present in the database");
        throw 'Product is not present in the database';
          }
const userId = req.auth.user.dataValues.id;
logger.info("Checking if the user is allowed to access the product");
  if(userId != product.dataValues.owner_user_id){
    logger.error("You are forbidden to access this product");
        throw 'You are forbidden to access this product';
    }
  const imageId = req.params.image_id;
  logger.info("Checking if the image exists");
  const image = await db.Image.findOne({ where: { image_id: image_id } })
    if (!image) {
        logger.error("Image not found");
          throw 'Image not found';
          return;     
        }
const path = image.dataValues.s3_bucket_path;
const pathparams = path.split("/");
const key = `${product.dataValues.owner_user_id}/${image.dataValues.product_id}/${pathparams[5]}` 
console.log(key);
console.log(image.dataValues); 
console.log(pathparams);
const params = {
        Bucket: bucketName,
//        Key: image.dataValues.image_id
	Key: key,
     };
     logger.info("Deleting the image from S3");
if (imageId && productId == image.dataValues.product_id) {
    logger.info("Deleting the image from the database");
	db.Image.destroy({ where: { image_id: image_id } })
    s3.deleteObject(params, function (err, data) {
        if (err) {
            logger.error("Bad Request");
            throw 'Bad Request';
        }
  })
}
else {
    logger.error("Image not found");
throw 'Image not found';
}
}
