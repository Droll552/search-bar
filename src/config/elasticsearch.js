import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
});

export const INDEX_NAME = 'products';

/**
 * Create index if it doesn't exist
 */
export async function setupIndex() {
    try {
        const exists = await esClient.indices.exists({ index: INDEX_NAME });
        
        if (!exists) {
            await esClient.indices.create({
                index: INDEX_NAME,
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        title: { 
                            type: 'text',
                            fields: {
                                keyword: { type: 'keyword' }
                            }
                        },
                        description: { type: 'text' }
                    }
                }
            });
            console.log('Index created: ' + INDEX_NAME);
        } else {
            console.log('Index already exists: ' + INDEX_NAME);
        }
    } catch (error) {
        console.error('Error creating index:', error.message);
        throw error;
    }
}

/**
 * Check Elasticsearch connection
 */
export async function checkConnection() {
    try {
        await esClient.ping();
        console.log('Connected to Elasticsearch');
        return true;
    } catch (error) {
        console.error('Elasticsearch connection failed:', error.message);
        return false;
    }
}