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
 * Bulk index products to OpenSearch
 */
async function bulkIndexProducts(products) {
    const operations = products.flatMap(product => [
        { index: { _index: INDEX_NAME, _id: product.id } },
        product
    ]);

    const response = await esClient.bulk({
        refresh: true,
        body: operations  // ← FIXED: 'body' not 'operations'
    });

    if (response.body.errors) {  // ← response.body.errors
        const erroredDocuments = [];
        response.body.items.forEach((action, i) => {
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
export async function seedProducts(count = 1000) {
    const BATCH_SIZE = 100;

    console.log(`Starting to seed ${count} products...\n`);

    try {
        // Check connection
        console.log('Checking OpenSearch connection...');
        const connected = await checkConnection();
        
        if (!connected) {
            throw new Error('Failed to connect to OpenSearch');
        }

        // Setup index
        console.log('Setting up index...');
        await setupIndex();

        // Generate and index products in batches
        console.log(`Generating ${count} products...\n`);
        
        for (let i = 0; i < count; i += BATCH_SIZE) {
            const batchProducts = [];
            const batchEnd = Math.min(i + BATCH_SIZE, count);
            
            for (let j = i; j < batchEnd; j++) {
                batchProducts.push(generateProduct(j + 1));
            }

            await bulkIndexProducts(batchProducts);
            
            const progress = ((batchEnd / count) * 100).toFixed(1);
            console.log(`Indexed ${batchEnd}/${count} products (${progress}%)`);
        }

        // Verify count
        const countResponse = await esClient.count({ index: INDEX_NAME });
        console.log(`\nSeeding complete! Total products: ${countResponse.body.count}`);
        
        return countResponse.body.count;
        
    } catch (error) {
        console.error('Error seeding products:', error.message);
        throw error;
    }
}
