import { SearchQueryDto } from "../dtos/SearchQueryDto.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { AnalyticsService } from "./AnalyticsService.js";
import { CacheService } from "./CacheService.js";

const cacheService = new CacheService();
const analyticsService = new AnalyticsService();

export class SearchService {
    constructor() {
        this.repository = new ProductRepository();
        this.cache = cacheService;
        this.analytics = analyticsService;
    }

    /**
     * Search products with caching and analytics
     * @param {SearchQueryDto} queryDto 
     */
    async search(queryDto) {
        const startTime = Date.now();

        // Validate
        const validation = queryDto.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        // Check cache
        const cacheKey = this.cache.generateKey(queryDto);
        const cached = this.cache.get(cacheKey);
        
        if (cached) {
            const responseTime = Date.now() - startTime;
            this.analytics.trackQuery(queryDto.query, responseTime, true);
            
            return {
                ...cached,
                cached: true,
                responseTime: `${responseTime}ms`
            };
        }

        // Search via repository
        const hits = await this.repository.search(queryDto);

        const result = {
            query: queryDto.query,
            total: hits.length,
            results: hits.map(hit => ({
                ...hit.product.toJson(),
                relevanceScore: hit.score
            })),
            options: {
                limit: queryDto.limit,
                offset: queryDto.offset,
                fuzzy: queryDto.fuzzy
            }
        };

        // Cache the result
        this.cache.set(cacheKey, result);

        // Track analytics
        const responseTime = Date.now() - startTime;
        this.analytics.trackQuery(queryDto.query, responseTime, false);

        return {
            ...result,
            cached: false,
            responseTime: `${responseTime}ms`
        };
    }

    /**
     * Get shared analytics instance
     */
    static getAnalytics() {
        return analyticsService;
    }

    /**
     * Get shared cache instance
     */
    static getCache() {
        return cacheService;
    }
}