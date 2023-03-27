const userService = require('../../src/user/user-service');
module.exports = authorize;

async function authorize(req, res, next) {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.error("Missing Authorization Header");
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    const  user = await userService.authenticate({ username, password});
  
    if (!user) {
        logger.error("Invalid Authentication Credentials");
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    req.auth = {};
    req.auth.user = user;
    // console.log(req.auth.user,9898);
    // req.product = product
    // console.log(user);
    // console.log(user.dataValues.id+"lokesh");
    next();

}