namespace myapp;

entity Products {
    key ID         : Integer;
    name           : String(100);
    category       : String;
    price          : Decimal(10,2);
    stock          : Integer;
    orders         : Composition of many Orders on orders.product = $self;
}

entity Orders {
    key ID         : Integer;
    quantity       : Integer;
    orderDate      : Date;
    customer       : String(100);
    totalPrice     : Decimal(10,2);
    product        : Association to Products;
}