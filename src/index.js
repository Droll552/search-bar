import express from 'express';
import productRoutes from './routes/productRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupIndex, checkConnection } from './config/elasticsearch.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/search', searchRoutes);
app.use('/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling (must be last)
app.use(errorHandler);

/**
 * Async startup function
 */
async function start() {
    try {
        // Check Elasticsearch connection
        console.log('🔍 Checking Elasticsearch connection...');
        const connected = await checkConnection();
        
        if (!connected) {
            console.error('Failed to connect to Elasticsearch');
            console.error('Make sure Elasticsearch is running on http://localhost:9200');
            process.exit(1);
        }

        // Create index if it doesn't exist
        console.log('🔧 Setting up Elasticsearch index...');
        await setupIndex();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`Search: http://localhost:${PORT}/search?q=your-query`);
            console.log(`Products: http://localhost:${PORT}/products`);
            console.log(`Analytics: http://localhost:${PORT}/analytics`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
start();