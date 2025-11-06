export class Product {
    constructor(data = {}) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
    }

    toJson() { 
        return {
            id: this.id,
            title: this.title,
            description: this.description,
        }
    }
}
