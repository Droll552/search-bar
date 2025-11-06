import { Client } from '@elastic/elasticsearch';

const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

export const esClient = new Client({
    node: esUrl,
    // Bonsai uses HTTPS, so we need to handle TLS
    tls: {
        rejectUnauthorized: false // For Bonsai's self-signed certs
    }

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