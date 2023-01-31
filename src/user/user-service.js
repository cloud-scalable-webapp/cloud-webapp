const bcrypt = require('bcryptjs');
const db = require('../utils/database');

module.exports = {
    authenticate,
    getById,
    create,
    update,
};

async function authenticate({ username, password, id}) {

    const user = await db.User.scope('withPassword').findByPk(id);
    //console.log(user)
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

async function getById(userId) {
    return await getUser(userId);
}

async function create(params, res) {
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already registered, please pick a different username';
    }

    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!params.username.trim().match(regexEmail)){
        throw 'Invalid username, enter a valid email address';
   }
   
   let date_ob = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  params.account_created = date_ob;
  params.account_updated = date_ob;

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }
    //creating a record in the database using the create library (sequalize)
    const user = await db.User.create(params);
    return omitPassword(user.get());
}

async function update(userId, params) {
    //we get this user object from the db
    const user = await getUser(userId);
    //if changing the password this is to encrypt the new password
    if(user){
        if(params.username !== user.dataValues.username) {
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
    await user.save();
    //To omit password in the response 
    return omitPassword(user.get());
}

async function getUser(userId) {
    const user = await db.User.findByPk(userId);
    if (!user) throw 'User is not present in the database';
    return user;
}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}