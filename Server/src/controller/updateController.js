import UpdateRequest from "../models/UpdateRequest.js";
import Product from "../models/Product.js";

export const createUpdateRequest = async (req, res) => {
  const { productId, newName, newPrice } = req.body;

  const request = await UpdateRequest.create({
    productId,
    newName,
    newPrice,
    createdBy: req.user.id
  });

  res.json(request);
};

export const approveUpdate = async (req, res) => {
  const request = await UpdateRequest.findById(req.params.id);

  const product = await Product.findById(request.productId);

  // apply update
  if (request.newName) product.name = request.newName;
  if (request.newPrice) product.price = request.newPrice;

  await product.save();

  request.status = "APPROVED";
  await request.save();

  res.json({ message: "Product updated", product });
};

export const rejectUpdate = async (req, res) => {
  const request = await UpdateRequest.findById(req.params.id);

  request.status = "REJECTED";
  await request.save();

  res.json({ message: "Update rejected" });
};

export const getRequests = async (req, res) => {
  const requests = await UpdateRequest.find().populate("productId");
  res.json(requests);
};