using myapp from '../db/schema';

service ProductService {
    entity Products as projection on myapp.Products;
}