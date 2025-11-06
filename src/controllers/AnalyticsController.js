import { SearchService } from '../services/SearchService.js';

export class AnalyticsController {
    /**
     * GET /analytics
     */
    async getAnalytics(request, response, next) {
        try {
            const analytics = SearchService.getAnalytics();
            const cache = SearchService.getCache();

            const analyticsStats = analytics.getStats();
            const cacheStats = cache.getStats();

            response.json({
                analytics: analyticsStats,
                cache: cacheStats
            });
        } catch (error) {
            next(error);
        }
    }
}