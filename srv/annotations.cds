using ProductService from './service';

annotate ProductService.Products with @(
    UI.LineItem: [
        { Value: ID, Label: 'ID' },
        { Value: name, Label: 'Product Name' },
        { Value: category, Label: 'Category' },
        { Value: price, Label: 'Price (₹)' },
        { Value: stock, Label: 'Stock' },
        { Value: stockStatus, Label: 'Status' }
    ],
    UI.HeaderInfo: {
        TypeName: 'Product',
        TypeNamePlural: 'Products',
        Title: { Value: name }
    }
);

annotate ProductService.Orders with @(
    UI.LineItem: [
        { Value: ID, Label: 'Order ID' },
        { Value: customer, Label: 'Customer' },
        { Value: quantity, Label: 'Quantity' },
        { Value: totalPrice, Label: 'Total Price (₹)' },
        { Value: orderDate, Label: 'Order Date' }
    ],
    UI.HeaderInfo: {
        TypeName: 'Order',
        TypeNamePlural: 'Orders',
        Title: { Value: customer }
    }
);
