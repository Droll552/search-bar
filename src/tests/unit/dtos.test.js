import { CreateProductDto } from '../../dtos/CreateProductDto.js';
import { SearchQueryDto } from '../../dtos/SearchQueryDto.js';

describe('CreateProductDto', () => {
  describe('validation', () => {
    test('should pass validation with valid data', () => {
      const dto = new CreateProductDto({
        id: 'prod_1',
        title: 'Test Product',
        description: 'Test description'
      });

      const result = dto.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should fail validation when id is missing', () => {
      const dto = new CreateProductDto({
        title: 'Test Product',
        description: 'Test description'
      });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('id is required');
    });

    test('should fail validation when title is missing', () => {
      const dto = new CreateProductDto({
        id: 'prod_1',
        description: 'Test description'
      });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('title is required');
    });

    test('should fail validation when title is empty string', () => {
      const dto = new CreateProductDto({
        id: 'prod_1',
        title: '   ',
        description: 'Test description'
      });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('title is required');
    });

    test('should fail validation when title is too long', () => {
      const dto = new CreateProductDto({
        id: 'prod_1',
        title: 'a'.repeat(201),
        description: 'Test description'
      });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('title must be less than 200 characters');
    });

    test('should allow description to be optional', () => {
      const dto = new CreateProductDto({
        id: 'prod_1',
        title: 'Test Product'
      });

      const result = dto.validate();

      expect(result.isValid).toBe(true);
    });
  });
});

describe('SearchQueryDto', () => {
  describe('validation', () => {
    test('should pass validation with valid query', () => {
      const dto = new SearchQueryDto({ q: 'laptop' });

      const result = dto.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should fail validation when query is missing', () => {
      const dto = new SearchQueryDto({});

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('query parameter "q" is required');
    });

    test('should fail validation when query is empty', () => {
      const dto = new SearchQueryDto({ q: '   ' });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('query parameter "q" is required');
    });

    test('should use default values for optional parameters', () => {
      const dto = new SearchQueryDto({ q: 'laptop' });

      expect(dto.limit).toBe(20);
      expect(dto.offset).toBe(0);
      expect(dto.fuzzy).toBe(true);
    });

    test('should parse limit and offset as integers', () => {
      const dto = new SearchQueryDto({ 
        q: 'laptop', 
        limit: '10', 
        offset: '5' 
      });

      expect(dto.limit).toBe(10);
      expect(dto.offset).toBe(5);
    });

    test('should fail validation when limit is too high', () => {
      const dto = new SearchQueryDto({ q: 'laptop', limit: '150' });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('limit must be between 1 and 100');
    });

    test('should fail validation when offset is negative', () => {
      const dto = new SearchQueryDto({ q: 'laptop', offset: '-5' });

      const result = dto.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('offset must be non-negative');
    });

    test('should handle fuzzy parameter correctly', () => {
      const dto1 = new SearchQueryDto({ q: 'laptop', fuzzy: 'true' });
      expect(dto1.fuzzy).toBe(true);

      const dto2 = new SearchQueryDto({ q: 'laptop', fuzzy: 'false' });
      expect(dto2.fuzzy).toBe(false);

      const dto3 = new SearchQueryDto({ q: 'laptop' });
      expect(dto3.fuzzy).toBe(true);
    });
  });
});