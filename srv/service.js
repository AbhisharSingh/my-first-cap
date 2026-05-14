module.exports = (srv) => {

    // Runs BEFORE creating a product
    srv.before('CREATE', 'Products', (req) => {
        if (req.data.price < 0) {
            req.reject(400, 'Price cannot be negative!')
        }
    })

    // Runs AFTER reading products
    srv.after('READ', 'Products', (products) => {
        products.forEach(product => {
            product.stockStatus = product.stock > 0
                ? 'In Stock'
                : 'Out of Stock'
        })
    })
}