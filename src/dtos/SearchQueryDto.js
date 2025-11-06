export class SearchQueryDto {
    constructor(query) {
        this.query = query?.q || '';
        this.limit = parseInt(query?.limit) || 20;
        this.offset = parseInt(query?.offset) || 0;
        this.fuzzy = query?.fuzzy !== 'false'; 
    }

    validate() {
        const errors = [];

        if (!this.query || this.query.trim().length === 0) {
            errors.push('query parameter "q" is required');
        }

        if (this.limit < 1 || this.limit > 100) { 
            errors.push('limit must be between 1 and 100');
        }

        if (this.offset < 0) {
            errors.push('offset must be non-negative');
        }

        return { // ToDo: Create parent class aka abstract class to avoid duplication with CreateProductDto
            isValid: errors.length === 0,
            errors
        };

    }
}