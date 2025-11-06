import { esClient, INDEX_NAME } from "../config/elasticsearch.js";
import { Product } from "../models/Product.js";

export class ProductRepository {
    /**
     * Index a single product
     * @param {Product} product 
     */
    async save(product) {
        const response = await esClient.index({
            index: INDEX_NAME,
            id: product.id,
            document: product.toJson(),
            refresh: 'wait_for'
        });

        return response;
    }

    /**
     * Bulk index multiple products
     * @param {Product[]} products 
     */
    async saveMany(products) {
        const operations = products.flatMap(product => [
            { index: { _index: INDEX_NAME, _id: product.id } },
            product.toJson()
        ]);

        const response = await esClient.bulk({
            refresh: 'wait_for',
            operations
        });

        return response;
    }
    
    /**
     * Search products
     * @param {Object} searchQuery 
     */
    async search(searchQuery) {
        const { query, limit, offset, fuzzy } = searchQuery;

        const response = await esClient.search({
            index: INDEX_NAME,
            query: {
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
            },
            from: offset,
            size: limit
        });

        return response.hits.hits.map(hit => ({
            product: new Product(hit._source),
            score: hit._score
        }));
    }
}