/**
 * Analytics Service
 * Bonus feature: Track query frequency and response times
 */
export class AnalyticsService {
    constructor() {
        this.queryStats = new Map(); // query -> { count, totalTime, avgTime, cached }
        this.totalQueries = 0;
    }

    /**
     * Track a search query
     * @param {string} query 
     * @param {number} responseTime 
     * @param {boolean} wasCached 
     */
    trackQuery(query, responseTime, wasCached) {
        this.totalQueries++;

        if (!this.queryStats.has(query)) {
            this.queryStats.set(query, {
                count: 0,
                totalTime: 0,
                avgTime: 0,
                cachedHits: 0
            });
        }

        const stats = this.queryStats.get(query);
        stats.count++;
        stats.totalTime += responseTime;
        stats.avgTime = stats.totalTime / stats.count;
        
        if (wasCached) {
            stats.cachedHits++;
        }
    }

    /**
     * Get analytics summary
     * @returns {Object}
     */
    getStats() {
        const topQueries = Array.from(this.queryStats.entries())
            .map(([query, stats]) => ({
                query,
                ...stats,
                cacheHitRate: stats.count > 0 ? (stats.cachedHits / stats.count * 100).toFixed(2) + '%' : '0%'
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return {
            totalQueries: this.totalQueries,
            uniqueQueries: this.queryStats.size,
            topQueries
        };
    }

    /**
     * Reset all analytics
     */
    reset() {
        this.queryStats.clear();
        this.totalQueries = 0;
    }
}