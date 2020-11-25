// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');

// models
const Product = require('../models/Product.js');

// Validate id field
let validateId = (id) => {

    // check if number is numeric
    if (validator.isNumeric(id + '', { no_symbols: true, allow_negatives: false })) {
        return true;
    }
    else {
        console.log("Product validator: invalid id parameter");
    }
    // validation failed
    return false;
}


// Validate the body data, sent by the client, for a new product
// formProduct represents the data filled in a form
// It needs to be validated before using in gthe application
let validateNewProduct = (formProduct) => {

    // Declare constants and variables
    let validatedProduct;

    // debug to console - if no data
    if (formProduct === null) {
        console.log("validateNewProduct(): Parameter is null");
    }

    // Validate form data for new product fields
    // Creating a product does not need a product id
    // Adding '' to the numeric values makes them strings for validation purposes ()
    // appending + '' to numbers as the validator only works with strings
    if (
        validator.isNumeric(formProduct.CategoryId + '', { no_symbols: true, allow_negatives: false }) && 
        !validator.isEmpty(formProduct.ProductName) && 
        !validator.isEmpty(formProduct.ProductDescription) && 
        validator.isNumeric(formProduct.ProductStock + '', { no_symbols: true, allow_negatives: false }) && 
        validator.isCurrency(formProduct.ProductPrice + '', { no_symbols: true, allow_negatives: false }))
    {
        // Validation passed
        // create a new Product instance based on Product model object
        // no value for product id (passed as null)
        validatedProduct = new Product(
                null,
                formProduct.CategoryId,
                // escape is to sanitize - it removes/ encodes any html tags
                validator.escape(formProduct.ProductName),
                validator.escape(formProduct.ProductDescription),
                formProduct.ProductStock,
                formProduct.ProductPrice
            );
    } else {
        // debug
        console.log("validateNewProduct(): Validation failed");
    }

    // return new validated product object
    return validatedProduct;
}

// Validate the body data, sent by the client, for a new product
// formProduct represents the data filled in a form
// It needs to be validated before using in gthe application
let validateUpdateProduct = (formProduct) => {

    // Declare constants and variables
    let validatedProduct;

    // debug to console - if no data
    if (formProduct === null) {
        console.log("validateNewProduct(): Parameter is null");
    }

    // Validate form data for new product fields
    // Creating a product does not need a product id
    // Adding '' to the numeric values makes them strings for validation purposes ()
    // appending + '' to numbers as the validator only works with strings
    if (
        validator.isNumeric(formProduct.ProductId + '', { no_symbols: true, allow_negatives: false }) &&
        validator.isNumeric(formProduct.CategoryId + '', { no_symbols: true, allow_negatives: false }) && 
        !validator.isEmpty(formProduct.ProductName) && 
        !validator.isEmpty(formProduct.ProductDescription) && 
        validator.isNumeric(formProduct.ProductStock + '', { no_symbols: true, allow_negatives: false }) && 
        validator.isCurrency(formProduct.ProductPrice + '', { no_symbols: true, allow_negatives: false }))
    {
        // Validation passed
        // create a new Product instance based on Product model object
        // no value for product id (passed as null)
        validatedProduct = new Product(
                formProduct.ProductId,
                formProduct.CategoryId,

                // escape is to sanitize - it removes/ encodes any html tags
                validator.escape(formProduct.ProductName),
                validator.escape(formProduct.ProductDescription),
                formProduct.ProductStock,
                formProduct.ProductPrice
            );
    } else {
        // debug
        console.log("validateUpdateProduct(): Validation failed");
    }

    // return new validated product object
    return validatedProduct;
}

// Module exports
// expose these functions
module.exports = {
    validateId,
    validateNewProduct,
    validateUpdateProduct
}