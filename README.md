# 1. Install dependencies
npm install

# 2. Start Elasticsearch. It starts Elasticsearch on http://localhost:9200 (just create .env and copypaste .env.example without changing anything)
docker-compose up -d
you can verify if it works: curl http://localhost:9200
# 3. Seed 1,000 products
npm run seed

# 4. Start the server
npm start

# 5. Check health
curl http://localhost:3000/health

response should be: {"status":"ok"}%                            
# 6. Create product for testing
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_laptop_1",
    "title": "laptop",
    "description": "foobar"
  }'

bulk creation:

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '[
    {"id": "bulk_1", "title": "Product 1", "description": "Desc 1"},
    {"id": "bulk_2", "title": "Product 2", "description": "Desc 2"}
  ]'


# 7. Test it works
curl "http://localhost:3000/search?q=laptop" cahce will be false, once you hit agaian it will be cached.

# 8. Run tests
npm test

Search products
/search?q={query}&limit={limit}&offset={offset}&fuzzy={boolean}
Query Parameters:
    query - Search query
    limit - Results per page (1-100)
    offset - Pagination offset
    fuzzy - Enable typo tolerance (enabled by default)

curl "http://localhost:3000/search?q=laptop" 


I ve used my knowledges for SOLID and DRY principles, so to make code more extendable and easy to maintain and write more tests. 