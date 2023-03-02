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
            const productFetchNotAvailable = err.includes('You are forbidden to access this product');
            const notValidQuantity = err.includes('Enter a valid quantity');
            const skuExists = err.includes('enter a different SKU');
            const noData = err.includes('required field');
            const forbidden = err.includes('Forbidden');
            const validField = err.includes('valid field');
            const fieldEmpty = err.includes('Required field is empty');
	    const noImage = err.includes('Image not found');
	    const wrongFile = err.includes('Only images are allowed');
            let statusCode;
            if(is404 || productDeleteNotFound || noImage) {
                statusCode = 404;
            } else if (isUserAlreadyPresent || bad || email || notValidQuantity || skuExists || noData || validField || fieldEmpty || wrongFile) {
                statusCode = 400;
            }else if(userForbidden | productDeleteNotAvailable | productFetchNotAvailable | productUpdateNotAvailable | forbidden ){
                statusCode = 403;
            }      
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
}
