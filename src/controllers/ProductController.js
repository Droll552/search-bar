import { ProductService } from '../services/ProductService.js';
import { CreateProductDto } from '../dtos/CreateProductDto.js';

export class ProductController {
    constructor() {
        this.service = new ProductService();
    }

    /**
     * POST /products
     */
    async createProduct(request, response, next) {
        try {
            const data = request.body;

            if (Array.isArray(data)) {
                const dtos = data.map(item => new CreateProductDto(item));
                const products = await this.service.createProducts(dtos);
                
                return response.status(201).json({
                    success: true,
                    count: products.length,
                    products: products.map(p => p.toJson())
                });
            } else {
                const dto = new CreateProductDto(data);
                const product = await this.service.createProduct(dto);
                
                return response.status(201).json({
                    success: true,
                    product: product.toJson()
                });
            }
        } catch (error) {
            next(error);
        }
    }
}