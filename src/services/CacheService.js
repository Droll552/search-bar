import { LRUCache } from 'lru-cache';
import { SearchQueryDto } from '../dtos/SearchQueryDto.js';

/**
 * LRU Cache for search results
 * Bonus feature: Cache top 10 most frequent queries
 */
export class CacheService {
    constructor() {
        this.cache = new LRUCache({
            max: 10, // Store top 10 queries
            ttl: 1000 * 60 * 5, // 5 minutes TTL
        });
    }

    /**
     * Get cached result
     * @param {string} key 
     * @returns {Object|null}
     */
    get(key) {
        return this.cache.get(key) || null;
    }

    /**
     * Set cache entry
     * @param {string} key 
     * @param {Object} value 
     */
    set(key, value) {
        this.cache.set(key, value);
    }

    /**
     * Generate cache key from query parameters
     * @param {SearchQueryDto} queryDto 
     * @returns {string}
     */
    generateKey(queryDto) {
        return `${queryDto.query}:${queryDto.limit}:${queryDto.offset}:${queryDto.fuzzy}`;
    }

    /**
     * Get cache stats
     * @returns {Object}
     */
    getStats() {
        return {
            size: this.cache.size,
            max: this.cache.max
        };
    }
}