namespace myapp;

entity Products {
    key ID       : Integer;
    name         : String(100);
    category     : String;
    price        : Decimal(10,2);
    stock        : Integer;
}