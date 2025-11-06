import { Client } from '@opensearch-project/opensearch';

const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

export const esClient = new Client({
    node: esUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

export const INDEX_NAME = 'products';

// Rest stays the same
export async function checkConnection() {
    try {
        await esClient.ping();
        console.log('Connected to OpenSearch');
        return true;
    } catch (error) {
        console.error('OpenSearch connection failed:', error.message);
        return false;
    }
}

export async function setupIndex() {
    try {
        const exists = await esClient.indices.exists({ index: INDEX_NAME });
        
        if (!exists) {
            await esClient.indices.create({
                index: INDEX_NAME,
                body: {
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
                }
            });
            console.log(`Index '${INDEX_NAME}' created`);
        } else {
            console.log(`ℹIndex '${INDEX_NAME}' already exists`);
        }
    } catch (error) {
        console.error('Error setting up index:', error.message);
        throw error;
    }
}