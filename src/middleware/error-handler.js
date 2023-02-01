module.exports = errorHandler;

function errorHandler(err, res, res, next) {
    console.log(err)
    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const isUserAlreadyPresent = err.toLowerCase().includes('is already registered');
            const userForbidden = err.toLowerCase().includes('change username');
            const bad = err.toLowerCase().includes('bad');
            const email = err.toLowerCase().includes('enter a valid email');

            let statusCode;
            if(is404) {
                statusCode = 404;
            } else if (isUserAlreadyPresent || bad || email) {
                statusCode = 400;
            }else if(userForbidden){
                statusCode = 403;
            }
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
}