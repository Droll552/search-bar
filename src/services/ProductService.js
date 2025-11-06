import { Product } from "../models/Product.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { CreateProductDto } from "../dtos/CreateProductDto.js";
import { ValidationError } from "../errors/ValidationError.js";

export class ProductService { 
    constructor() {
        this.repository = new ProductRepository()
    }

    /**
     * Create and index a single product
     * @param {CreateProductDto} dto 
     */
    async createProduct(dto) {
        // Validate DTO
        const validation = dto.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        // Convert DTO to domain model
        const product = new Product({
            id: dto.id,
            title: dto.title,
            description: dto.description
        });

        // Save via repository
        await this.repository.save(product);

        return product;
    }

    /**
     * Create and index multiple products
     * @param {CreateProductDto[]} dtos 
     */
    async createProducts(dtos) {
        // Validate all
        for (const dto of dtos) {
            const validation = dto.validate();
            if (!validation.isValid) {
                throw new ValidationError(validation.errors);
            }
        }

        // Convert to domain models
        const products = dtos.map(dto => new Product({
            id: dto.id,
            title: dto.title,
            description: dto.description
        }));

        // Bulk save
        await this.repository.saveMany(products);

        return products;
    }
}