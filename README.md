# 1. Install dependencies
npm install

# 2. Start Elasticsearch. 
It starts Elasticsearch on http://localhost:9200 (just create .env and copypaste .env.example without changing anything)
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

##

### Basic search

curl "http://localhost:3000/search?q=laptop"

### Expected: Returns results with relevanceScore

### Empty query validation

curl "http://localhost:3000/search"

### Expected: 400 error "query parameter 'q' is required"

### Pagination works

curl "http://localhost:3000/search?q=laptop&limit=5&offset=0"

curl "http://localhost:3000/search?q=laptop&limit=5&offset=5"

### Expected: Different results on each page

### Limit validation
curl "http://localhost:3000/search?q=laptop&limit=150"

### Expected: 400 error "limit must be between 1 and 100"

### Relevance scoring

curl "http://localhost:3000/search?q=Dell+laptop"

### Expected: Products with "Dell" AND "laptop" in title rank higher

curl "http://localhost:3000/search?q=laptop" 

### Create single product

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_1",
    "title": "Test Product",
    "description": "Test description"
  }'

### Expected: 201, returns product object

### Create bulk products

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '[
    {"id": "bulk_1", "title": "Product 1", "description": "Desc 1"},
    {"id": "bulk_2", "title": "Product 2", "description": "Desc 2"}
  ]'
  
### Expected: 201, returns count: 2

### Validation: Missing ID

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"title": "Product", "description": "Desc"}'
  
### Expected: 400, "id is required"

### Validation: Missing title

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"id": "test_2", "description": "Desc"}'
  
### Expected: 400, "title is required"

### Validation: Title too long

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"test_3\", \"title\": \"$(printf 'a%.0s' {1..201})\", \"description\": \"Desc\"}"
  
### Expected: 400, "title must be less than 200 characters"

### Optional description

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"id": "test_4", "title": "Product Without Description"}'
  
### Expected: 201, works fine

curl "http://localhost:3000/analytics"


I ve used my knowledges for SOLID and DRY principles, so to make code more extendable and easy to maintain and write more tests. 
