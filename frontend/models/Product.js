import mongoose, { model, Schema } from "mongoose";

// Clear existing Product model to prevent OverwriteModelError
if (mongoose.models && mongoose.models.Product) {
  delete mongoose.models.Product;
}

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  properties: { type: Object },
}, {
  timestamps: true,
});

export const Product = model('Product', ProductSchema);
