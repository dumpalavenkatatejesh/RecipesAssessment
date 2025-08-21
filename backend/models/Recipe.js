import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  cuisine: { type: String },
  title: { type: String },
  rating: { type: Number },
  prep_time: { type: Number },
  cook_time: { type: Number },
  total_time: { type: Number },
  description: { type: String },
  nutrients: { type: Object },
  serves: { type: String }
});

export default mongoose.model('Recipe', RecipeSchema);
