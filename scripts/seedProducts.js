import { faker } from '@faker-js/faker';
import { esClient, INDEX_NAME, setupIndex, checkConnection } from '../src/config/elasticsearch.js';

/**
 * Generate synthetic product data
 */
function generateProduct(id) {
    const category = faker.commerce.department();
    const productName = faker.commerce.productName();
    
    return {
        id: `product_${id}`,
        title: `${productName} - ${category}`,
        description: faker.commerce.productDescription()
    };
}

/**
 * Bulk index products to Elasticsearch
 */
async function bulkIndexProducts(products) {
    const operations = products.flatMap(product => [
        { index: { _index: INDEX_NAME, _id: product.id } },
        product
    ]);

    const response = await esClient.bulk({
        refresh: true,
        operations
    });

    if (response.errors) {
        const erroredDocuments = [];
        response.items.forEach((action, i) => {
            const operation = Object.keys(action)[0];
            if (action[operation].error) {
                erroredDocuments.push({
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: operations[i * 2],
                    document: operations[i * 2 + 1]
                });
            }
        });
        console.error('Errors occurred during bulk indexing:', erroredDocuments);
    }

    return response;
}

/**
 * Main seeding function
 */
async function seedProducts() {
    const TOTAL_PRODUCTS = 1000;
    const BATCH_SIZE = 100;

    console.log('Starting product seeding...\n');

    try {
        // Check connection
        console.log('Checking Elasticsearch connection...');
        const connected = await checkConnection();
        
        if (!connected) {
            console.error('Failed to connect to Elasticsearch');
            console.error('Make sure Elasticsearch is running on http://localhost:9200');
            process.exit(1);
        }

        // Setup index
        console.log('Setting up index...');
        await setupIndex();

        // Generate and index products in batches
        console.log(`Generating ${TOTAL_PRODUCTS} products...\n`);
        
        for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
            const batchProducts = [];
            const batchEnd = Math.min(i + BATCH_SIZE, TOTAL_PRODUCTS);
            
            for (let j = i; j < batchEnd; j++) {
                batchProducts.push(generateProduct(j + 1));
            }

            await bulkIndexProducts(batchProducts);
            
            const progress = ((batchEnd / TOTAL_PRODUCTS) * 100).toFixed(1);
            console.log(`Indexed ${batchEnd}/${TOTAL_PRODUCTS} products (${progress}%)`);
        }

        // Verify count
        const count = await esClient.count({ index: INDEX_NAME });
        console.log(`\n Seeding complete! Total products in index: ${count.count}`);
        
    } catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
}

// Run seeding
seedProducts();