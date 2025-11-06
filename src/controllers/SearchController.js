import { SearchService } from '../services/SearchService.js';
import { SearchQueryDto } from '../dtos/SearchQueryDto.js';

export class SearchController {
    constructor() {
        this.service = new SearchService();
    }

    /**
     * GET /search?q=...
     */
    async search(request, response, next) {
        try {
            const queryDto = new SearchQueryDto(request.query);
            const results = await this.service.search(queryDto);
            
            response.json(results);
        } catch (error) {
            next(error);
        }
    }
}