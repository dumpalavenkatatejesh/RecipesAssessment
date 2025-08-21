import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// GET /api/recipes?page=&limit=
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const total = await Recipe.countDocuments({});
    const recipes = await Recipe.find({})
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ page, limit, total, data: recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: parse comparator string (e.g. >=4.5, <=400)
function parseComparator(input) {
  if (!input) return null;
  const match = input.match(/^(<=|>=|=|<|>)(\s*)?([0-9.]+)$/);
  if (!match) return null;
  return { op: match[1], value: parseFloat(match[3]) };
}

// GET /api/recipes/search
router.get('/search', async (req, res) => {
  try {
    const { title, cuisine, calories, total_time, rating } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };

    if (total_time) {
      const c = parseComparator(total_time);
      if (c) filter.total_time = { [opMap(c.op)]: c.value };
    }

    if (rating) {
      const c = parseComparator(rating);
      if (c) filter.rating = { [opMap(c.op)]: c.value };
    }

    if (calories) {
      const c = parseComparator(calories);
      if (c) {
        filter['nutrients.calories'] = {
          [opMap(c.op)]: c.value
        };
      }
    }

    const recipes = await Recipe.find(filter).sort({ rating: -1 });
    res.json({ data: recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// map SQL-style ops to Mongo operators
function opMap(op) {
  return {
    '>': '$gt',
    '<': '$lt',
    '>=': '$gte',
    '<=': '$lte',
    '=': '$eq'
  }[op];
}

export default router;
