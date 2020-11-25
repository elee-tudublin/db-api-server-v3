
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_a_constructor_function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/default_parameters

function Product(id = 0, cat = 0, name, desc, stock, price) {

    this.ProductId = id;
    this.CategoryId = cat;
    this.ProductName = name;
    this.ProductDescription = desc;
    this.ProductStock = stock;
    this.ProductPrice = price;
}

module.exports = Product;

