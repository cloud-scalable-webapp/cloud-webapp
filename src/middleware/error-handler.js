module.exports = errorHandler;

function errorHandler(err, res, res, next) {
    console.log(err)
    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().includes('not found');
            const isUserAlreadyPresent = err.toLowerCase().includes('is already registered');
            const userForbidden = err.toLowerCase().includes('change username');
            const bad = err.toLowerCase().includes('bad');
            const email = err.toLowerCase().includes('enter a valid email');
            const productDeleteNotFound = err.includes('Product is not present in the database');
            const productDeleteNotAvailable = err.includes('You cannot delete this product');
            const productUpdateNotAvailable = err.includes('You are forbidden to update this product');
            const notValidQuantity = err.includes('Enter a valid quantity');
            const skuExists = err.includes('enter a different SKU');
            const noData = err.includes('required fields');
            const forbidden = err.includes('Forbidden');
            let statusCode;
            if(is404 || productDeleteNotFound ) {
                statusCode = 404;
            } else if (isUserAlreadyPresent || bad || email || notValidQuantity || skuExists || noData ) {
                statusCode = 400;
            }else if(userForbidden | productDeleteNotAvailable | productUpdateNotAvailable | forbidden ){
                statusCode = 403;
            }      
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
}