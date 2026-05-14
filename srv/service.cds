using myapp from '../db/schema';

service ProductService {
    entity Products as projection on myapp.Products;
    entity Orders   as projection on myapp.Orders;

    // Custom action — like a named POST route
    action placeOrder(
        productID : Integer,
        quantity  : Integer,
        customer  : String
    ) returns {
        orderID    : Integer;
        totalPrice : Decimal;
        message    : String;
    };
}