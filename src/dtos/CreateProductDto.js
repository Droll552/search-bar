export class CreateProductDto {
    constructor(data = {}) {
        this.id = data.id,
        this.title = data.title,
        this.description = data.description
    }

    validate () {
        const errors = [];

        if (!this.id) {
            errors.push('id is required');
        }

        if (!this.title || this.title.trim().length === 0) {
            errors.push('title is required');
        }

        if (this.title && this.title.length > 200) {
            errors.push('title must be less than 200 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };

    }
}