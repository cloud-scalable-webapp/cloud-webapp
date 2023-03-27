const bcrypt = require('bcryptjs');
const db = require('../utils/database');
const logger=require('../mylog/logger.js');
module.exports = {
    authenticate,
    getById,
    create,
    update,
};

async function authenticate({ username, password}) {
    const user = await db.User.scope('withPassword').findOne({ where: { username: username } })
    let usernameValidation = false;
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

async function getById(accountId, req) {
    return await getUser(accountId, req);
}

async function create(params, req, res) {
    // console.log(req.body);
    logger.info("Checking if all required fields have been entered");
    if (Object.keys(req.body).length > 4){
        logger.error("Enter all the required fields");
        throw 'Enter all the required fields';
        return;
    }
    if (!(req.body.hasOwnProperty('first_name')) || !(req.body.hasOwnProperty('last_name')) || !(req.body.hasOwnProperty('username')) || !(req.body.hasOwnProperty('password'))){
        logger.error("Enter all the required fields");
        throw 'Enter all the required fields';
        return;
    }
    logger.info("Checking if any required fields are empty");
    if (((((params.first_name).length == 0) || (params.last_name).length == 0) || (params.username).length == 0) || (params.password).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }
    logger.info("Looking if user with that username already exists");
    if (await db.User.findOne({ where: { username: params.username } })) {
        logger.error("Username already exists");
        throw 'Username "' + params.username + '" is already registered, please enter a different username';
    }
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    logger.info("Checking if email entered is valid");
    if(!params.username.trim().match(regexEmail)){
        logger.error("Invalid username, enter a valid email address");
        throw 'Invalid username, enter a valid email address';
   }
    let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    params.account_created = date_ob;
    params.account_updated = date_ob;
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    //creating a record in the database using the create library (sequalize)
    logger.info("Creating a user record in the database");
    const user = await db.User.create(params);
    return omitPassword(user.get());
}

async function update(accountId,req,  params, res) {
    //we get this user object from the db
    logger.info("Getting this user from the database");
    const user = await getUser(accountId,req);
    logger.info("Checking if all required fields have been entered");
    if (Object.keys(req.body).length > 4){
        logger.error("Enter all the required fields");
        throw 'Enter all the required fields';
        return;
    }
    if (!(req.body.hasOwnProperty('first_name')) || !(req.body.hasOwnProperty('last_name')) || !(req.body.hasOwnProperty('username')) || !(req.body.hasOwnProperty('password'))){
        logger.error("Enter all the required fields");
        throw 'Enter all the required fields';
        return;
    }
    logger.info("Checking if any required fields are empty");
    if (((((params.first_name).length == 0) || (params.last_name).length == 0) || (params.username).length == 0) || (params.password).length == 0) {
        logger.error("Required field is empty");
        throw 'Required field is empty';
     }
    //if changing the password this is to encrypt the new password
    logger.info("Checking if username exists in the database");
    if(user){
        if(params.username !== user.dataValues.username) {
            logger.error("Prohibited to change username");
            throw 'Prohibited to change username';
        }
    }else {
        throw 'not found';
    }

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    params.account_updated = date_ob

    Object.assign(user, params);
    //saving the user object to the db
    logger.info("Saving the new user data to the database");
    await user.save();
    //To omit password in the response 
    return omitPassword(user.get());
}

async function getUser(accountId, req) {
    const user = await db.User.findByPk(accountId);
    logger.info("Finding the user using ID in the database");
    if (!user) throw 'User not found in the database';
    if(user.dataValues.id != req.auth.user.dataValues.id){
        logger.error("Forbidden");
        throw 'Forbidden'
    }
    logger.error("User is present");
    return user;
}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}