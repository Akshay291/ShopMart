// pages/api/products.js
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    if (req.query?.id) {
      try {
        const product = await Product.findOne({ _id: req.query.id });
        res.json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Error fetching product" });
      }
    } else {
      try {
        const products = await Product.find();
        res.json(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Error fetching products" });
      }
    }
  }

  if (method === 'POST') {
    const { title, description, price, images, category, properties } = req.body;
    try {
      const productDoc = await Product.create({
        title, description, price, images, category, properties,
      });
      res.json(productDoc);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Error creating product" });
    }
  }

  if (method === 'PUT') {
    const { _id, title, description, price, images, category, properties } = req.body;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(_id, { title, description, price, images, category, properties }, { new: true });
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    }
  }
  if (method === 'DELETE') {
    if (req.query?.id) {
      try {
        await Product.deleteOne({ _id: req.query?.id });
        res.json(true);
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Error deleting product" });
      }
    }
  }
}
