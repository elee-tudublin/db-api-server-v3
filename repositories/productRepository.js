
// Dependencies

// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// models
const Product = require('../models/product.js');
const Category = require('../models/category.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM Product ORDER BY ProductName ASC for json path;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM Product WHERE ProductId = @id for json path, without_array_wrapper;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_CATID = 'SELECT * FROM Product WHERE CategoryId = @id ORDER BY ProductName ASC for json path;';

// Second statement (Select...) returns inserted record identified by ProductId = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO Product (CategoryId, ProductName, ProductDescription, ProductStock, ProductPrice) VALUES (@categoryId, @productName, @productDescription, @ProductStock, @ProductPrice); SELECT * from dbo.Product WHERE ProductId = SCOPE_IDENTITY();';
const SQL_UPDATE = 'UPDATE Product SET CategoryId = @categoryId, ProductName = @productName, ProductDescription = @productDescription, ProductStock = @ProductStock, ProductPrice = @ProductPrice WHERE ProductId = @id; SELECT * FROM dbo.Product WHERE ProductId = @id;';
const SQL_DELETE = 'DELETE FROM Product WHERE ProductId = @id;';


// Get all products
// This is an async function named getProducts defined using ES6 => syntax
let getProducts = async () => {

    // define variable to store products
    let products;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);
        
        // first element of the recordset contains products
        products = result.recordset[0];

    // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all products: ', err.message);
    }

    // return products
    return products;
};

// get product by id
// This is an async function named getProductById defined using ES6 => syntax
let getProductById = async (productId) => {

    let product;

    // returns a single product with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, productId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        product = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get product by id: ', err.message);
        }
        
        // return the product
        return product;
};

// Get products by category
let getProductByCatId = async (categoryId) => {

    let products;

    // returns products with matching category id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            .input('id', sql.Int, categoryId)
            // execute query
            .query(SQL_SELECT_BY_CATID);

        // Send response with JSON result    
        products = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get product by category id: ', err.message);
        }

    return products;
};


// insert/ create a new product
// parameter: a validated product model object
let createProduct = async (product) => {

    // Declare constants and variables
    let insertedProduct;

    // Insert a new product
    // Note: no Product yet
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()

            // set named parameter(s) in query
            // checks for potential sql injection
            .input('categoryId', sql.Int, product.CategoryId)    
            .input('productName', sql.NVarChar, product.ProductName)
            .input('productDescription', sql.NVarChar, product.ProductDescription)
            .input('productStock', sql.Int,  product.ProductStock)
            .input('productPrice', sql.Decimal, product.ProductPrice)

            // Execute Query
            .query(SQL_INSERT);      

        // The newly inserted product is returned by the query    
        insertedProduct = result.recordset[0];

        // catch and log DB errors
        } catch (err) {
            console.log('DB Error - error inserting a new product: ', err.message);
        }

        // Return the product data
        return insertedProduct;
};

// update an existing product
let updateProduct = async (product) => {

   // Declare constanrs and variables
   let updatedProduct;

   // Insert a new product
   // Note: no Product yet
   try {
       // Get a DB connection and execute SQL
       const pool = await dbConnPoolPromise
       const result = await pool.request()

           // set named parameter(s) in query
           // checks for potential sql injection
           .input('id', sql.Int, product.ProductId)  
           .input('categoryId', sql.Int, product.CategoryId)    
           .input('productName', sql.NVarChar, product.ProductName)
           .input('productDescription', sql.NVarChar, product.ProductDescription)
           .input('productStock', sql.Int,  product.ProductStock)
           .input('productPrice', sql.Decimal, product.ProductPrice)

           // Execute Query
           .query(SQL_UPDATE);      

       // The newly inserted product is returned by the query    
       updatedProduct = result.recordset[0];

       // catch and log DB errors
       } catch (err) {
           console.log('DB Error - error updating product: ', err.message);
       }

       // Return the product data
       return updatedProduct;
};

// delete a product
let deleteProduct = async (productId) => {

    // record how many rows were deleted  > 0 = success
    let rowsAffected;

    // returns a single product with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, productId)
            // execute query
            .query(SQL_DELETE);

        // Was the product deleted?    
        rowsAffected = Number(result.rowsAffected);     

        } catch (err) {
            console.log('DB Error - get product by id: ', err.message);
        }
        // Nothing deleted
        if (rowsAffected === 0)
            return false;
        // successful delete
        return true;    
};

// Export 
module.exports = {
    getProducts,
    getProductById,
    getProductByCatId,
    createProduct,
    updateProduct,
    deleteProduct
};
