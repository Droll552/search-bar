import { Product } from '../../models/Product.js';

describe('Product Model', () => {
  test('should create product with all fields', () => {
    const data = {
      id: 'prod_1',
      title: 'Test Product',
      description: 'Test description'
    };

    const product = new Product(data);

    expect(product.id).toBe('prod_1');
    expect(product.title).toBe('Test Product');
    expect(product.description).toBe('Test description');
  });

  test('should create product with empty data', () => {
    const product = new Product();

    expect(product.id).toBeUndefined();
    expect(product.title).toBeUndefined();
    expect(product.description).toBeUndefined();
  });

  test('should serialize to JSON correctly', () => {
    const data = {
      id: 'prod_1',
      title: 'Test Product',
      description: 'Test description'
    };

    const product = new Product(data);
    const json = product.toJson();

    expect(json).toEqual({
      id: 'prod_1',
      title: 'Test Product',
      description: 'Test description'
    });
  });

  test('toJson should return a plain object', () => {
    const product = new Product({
      id: 'prod_1',
      title: 'Test Product'
    });

    const json = product.toJson();

    expect(json.constructor).toBe(Object);
    expect(json instanceof Product).toBe(false);
  });
});