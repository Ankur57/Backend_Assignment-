import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const { name, price } = req.body;

  const product = await Product.create({
    name,
    price,
    createdBy: req.user.id
  });

  res.json(product);
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};