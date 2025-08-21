# 🍲 Recipe Data Collection and API Development

This project parses recipe data from a JSON file, stores it in a MongoDB database, exposes RESTful APIs with **Node.js + Express**, and provides a **React frontend** to view, search, and filter recipes.

---

## 📌 Features

### Backend (Node.js + Express + MongoDB)
- Parse JSON file (`US_recipes.json`) and import recipes into MongoDB.
- Handle `NaN` values for numeric fields by storing them as `null`.
- RESTful API endpoints:
  - **GET /api/recipes** → Paginated and sorted by rating (desc).
  - **GET /api/recipes/search** → Search by `title`, `cuisine`, `rating`, `total_time`, `calories`.
- Error handling for invalid requests.

### Frontend (React)
- Table view of recipes with:
  - Title (truncated)
  - Cuisine
  - Rating (stars)
  - Total time
  - Serves (people)
- Row click → Opens **drawer view** with details:
  - Description
  - Prep Time & Cook Time (expandable under Total Time)
  - Nutrients (calories, fat, protein, etc.)
- Field-level search filters connected to `/search` API.
- Pagination with customizable results per page (15–50).
- Fallback screens for "No Results" and "No Data".

---

## 🗄️ Database Schema (MongoDB)

```js
{
  cuisine: String,
  title: { type: String, required: true },
  rating: Number,
  prep_time: Number,
  cook_time: Number,
  total_time: Number,
  description: String,
  nutrients: Object,
  serves: String
}

Getting Started
1. Clone Repository
git clone https://github.com/<your-username>/securin-assignment.git
cd securin-assignment

2. Backend Setup
cd backend
npm install


Create a .env file in backend/:

MONGO_URI=mongodb://127.0.0.1:27017/recipesdb
PORT=3000
JSON_PATH=../US_recipes.json

Import Recipes
npm run import

Run Server
npm start


Backend runs at 👉 http://localhost:3000

3. Frontend Setup
cd frontend
npm install
npm start


Frontend runs at 👉 http://localhost:5173 (Vite) or http://localhost:3001 (CRA)

📡 API Endpoints
1. Get All Recipes (Paginated & Sorted)
GET /api/recipes?page=1&limit=10


Response:

{
  "page": 1,
  "limit": 10,
  "total": 8450,
  "data": [
    {
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "prep_time": 15,
      "cook_time": 100,
      "total_time": 115,
      "description": "Shared from a Southern recipe...",
      "nutrients": {
        "calories": "389 kcal",
        "proteinContent": "5 g",
        "fatContent": "21 g"
      },
      "serves": "8 servings"
    }
  ]
}

2. Search Recipes
GET /api/recipes/search?calories=<=400&title=pie&rating=>=4.5


Response:

{
  "data": [
    {
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "total_time": 115
    }
  ]
}

🧪 Testing

Use Postman or curl for API testing:

curl "http://localhost:3000/api/recipes?page=1&limit=5"
curl "http://localhost:3000/api/recipes/search?title=pie&rating=>=4.5"
