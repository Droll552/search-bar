import { esClient, INDEX_NAME } from "../config/elasticsearch.js";
import { Product } from "../models/Product.js";

export class ProductRepository {
    async save(product) {
        const response = await esClient.index({
            index: INDEX_NAME,
            id: product.id,
            body: product.toJson(),  // ← 'body' not 'document'
            refresh: 'wait_for'
        });

        return response;
    }

    async saveMany(products) {
        const operations = products.flatMap(product => [
            { index: { _index: INDEX_NAME, _id: product.id } },
            product.toJson()
        ]);

        const response = await esClient.bulk({
            refresh: 'wait_for',
            body: operations  // ← 'body' not 'operations'
        });

        return response;
    }
    
    async search(searchQuery) {
        const { query, limit, offset, fuzzy } = searchQuery;

        const esQuery = {
            bool: {
                should: [
                    {
                        match: {
                            title: {
                                query,
                                boost: 2,
                                fuzziness: fuzzy ? 'AUTO' : 0
                            }
                        }
                    },
                    {
                        match: {
                            description: {
                                query,
                                boost: 1,
                                fuzziness: fuzzy ? 'AUTO' : 0
                            }
                        }
                    }
                ],
                minimum_should_match: 1
            }
        };

        const response = await esClient.search({
            index: INDEX_NAME,
            body: {
                query: esQuery,
                from: offset,
                size: limit
            }
        });

        // Map to Product instances with scores
        return response.body.hits.hits.map(hit => ({
            product: new Product(hit._source),
            score: hit._score
        }));
    }

    async findById(id) {
        try {
            const response = await esClient.get({
                index: INDEX_NAME,
                id
            });
            // OpenSearch returns data in response.body
            return new Product(response.body._source);
        } catch (error) {
            if (error.meta?.statusCode === 404) {
                return null;
            }
            throw error;
        }
    }

    async delete(id) {
        await esClient.delete({
            index: INDEX_NAME,
            id,
            refresh: 'wait_for'
        });
    }

    async count() {
        const response = await esClient.count({
            index: INDEX_NAME
        });
        return response.body.count;  // ← response.body.count
    }
}