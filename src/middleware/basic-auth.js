const userService = require('../../src/user/user-service');
module.exports = authorize;

async function authorize(req, res, next) {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials =  req.headers.authorization.split(' ')[1];
    //console.log(base64Credentials);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    //console.log(credentials)
    const [username, password] = credentials.split(':');
    //console.log(req.url); 
    let pattern = /\d+/g; //
    const idArray = req.url.match(pattern)
    //console.log(idArray);
    if(idArray !== null){
        id = idArray[0];
    }  
    
    const  user = await userService.authenticate({ username, password, id});
  
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    req.user = user
    next();

}