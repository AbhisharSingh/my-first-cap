module.exports = (srv) => {

    // ─── PRODUCTS ───────────────────────────────────────

    srv.after('READ', 'Products', (products) => {
        products.forEach(product => {
            product.stockStatus = product.stock > 0
                ? 'In Stock'
                : 'Out of Stock'
        })
    })

    srv.before('CREATE', 'Products', (req) => {
        if (req.data.price < 0) {
            req.reject(400, 'Price cannot be negative!')
        }
        if (!req.data.name) {
            req.reject(400, 'Product name is required!')
        }
    })

    // ─── ORDERS ─────────────────────────────────────────

    srv.before('CREATE', 'Orders', async (req) => {
        const { quantity, product_ID } = req.data

        if (!quantity || quantity <= 0) {
            req.reject(400, 'Quantity must be greater than zero!')
        }

        const product = await SELECT.one.from('myapp.Products')
            .where({ ID: product_ID })

        if (!product) {
            req.reject(404, 'Product not found!')
        }

        if (quantity > product.stock) {
            req.reject(400, `Not enough stock! Only ${product.stock} available.`)
        }

        req.data.totalPrice = quantity * product.price
    })

    srv.after('CREATE', 'Orders', async (order) => {
        const product = await SELECT.one.from('myapp.Products')
            .where({ ID: order.product_ID })

        await UPDATE('myapp.Products')
            .set({ stock: product.stock - order.quantity })
            .where({ ID: order.product_ID })
    })

    // ─── CUSTOM ACTION ──────────────────────────────────

    srv.on('placeOrder', async (req) => {
        const { productID, quantity, customer } = req.data

        // Validate inputs
        if (!productID || !quantity || !customer) {
            req.reject(400, 'productID, quantity and customer are required!')
        }

        if (quantity <= 0) {
            req.reject(400, 'Quantity must be greater than zero!')
        }

        // Fetch product
        const product = await SELECT.one.from('myapp.Products')
            .where({ ID: productID })

        if (!product) {
            req.reject(404, `Product with ID ${productID} not found!`)
        }

        // Check stock
        if (quantity > product.stock) {
            req.reject(400, `Not enough stock! Only ${product.stock} available.`)
        }

        // Calculate total
        const totalPrice = quantity * product.price

        // Generate new order ID
        const lastOrder = await SELECT.one.from('myapp.Orders')
            .orderBy({ ID: 'desc' })
        const newID = lastOrder ? lastOrder.ID + 1 : 1

        // Create the order
        await INSERT.into('myapp.Orders').entries({
            ID         : newID,
            quantity   : quantity,
            orderDate  : new Date().toISOString().split('T')[0],
            customer   : customer,
            totalPrice : totalPrice,
            product_ID : productID
        })

        // Reduce stock
        await UPDATE('myapp.Products')
            .set({ stock: product.stock - quantity })
            .where({ ID: productID })

        // Return result
        return {
            orderID    : newID,
            totalPrice : totalPrice,
            message    : `Order placed! ${quantity}x ${product.name} for ₹${totalPrice}`
        }
    })
}