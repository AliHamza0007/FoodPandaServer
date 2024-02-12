import { ProductModel } from "../models/productModel.js";
import { CategoryModel } from "../models/categoryModel.js";
import slugify from "slugify";
import fs from "fs";
export const createProductController = async (req, res) => {
  try {
    const { name, price, description, category, color, size, inStock } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
        break;
      case !price:
        return res.status(500).send({ message: "Price is required" });
        break;
      case !size:
        return res.status(500).send({ message: "Size is required" });
        break;
      case !color:
        return res.status(500).send({ message: "color is required" });
        break;
      case !inStock:
        return res.status(500).send({ message: "InStock is required" });
        break;
      case !description:
        return res.status(500).send({ message: "description is required" });
        break;

      case !photo && photo.size > 10000000:
        return res.status(500).send({ message: "photo is required" });
        break;
      case !category:
        return res.status(500).send({ message: "category is required" });
        break;
    }

    //fields saving in database
    const product = await new ProductModel({
      ...req.fields,
      slug: slugify(name),
    }).save();
    //photo saving //

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Products Created Successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in Adding Product", error });
  }
};

export const getProductController = async (req, res) => {
  try {
    let getProduct = await ProductModel.find({})
      .select("-photo")
      .sort({ createdAt: -1 });
    if (getProduct) {
      res.status(201).send({
        success: true,
        message: "Get Product Successfully",
        getProduct,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in getting product", error });
  }
};

export const filterProductController = async (req, res) => {
  try {
    const { checked, radio, color, size } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (color.length > 0) args.color = color;
    if (size.length > 0) args.size = size;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    let products = await ProductModel.find(args).sort({ createdAt: -1 });
    res.status(200).send({ success: true, products });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in searching product", error });
  }
};

// update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, size, inStock, color } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !size:
        return res.status(500).send({ error: "Size is Required" });
      case !inStock:
        return res.status(500).send({ error: "inStock is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !color:
        return res.status(500).send({ error: "Color is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update product",
      error,
    });
  }
};

//single product

export const singleProductController = async (req, res) => {
  try {
    const singleProduct = await ProductModel.findById(req.params.slug).select(
      "-photo"
    );
    // .populate("category");
    res.status(201).send({
      success: true,
      message: "Get Product Successfully",
      singleProduct,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting single product ",
      error,
    });
  }
};

///by id getting
export const singleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).select("-photo");
    res.status(201).send({
      success: true,
      message: "Get Product Successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting single product ",
      error,
    });
  }
};

//photo product
export const photoProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const photoProduct = await ProductModel.findById(pid).select("photo");
    if (photoProduct.photo.data) {
      res.set("contentType", photoProduct.photo.contentType);
      return res.status(201).send(photoProduct.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting photo product ",
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await ProductModel.findByIdAndDelete(id);
    res
      .status(201)
      .send({ success: true, message: "Delete Successfully", deleteProduct });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in deleting product", error });
  }
};

export const countProductController = async (req, res) => {
  try {
    let count = await ProductModel.find({}).estimatedDocumentCount();

    res.status(200).send({ success: true, message: "Total Count Get", count });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error, message: "Error in Count Product " });
  }
};
export const pageProductController = async (req, res) => {
  try {
    const PerPage = 12;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * PerPage)
      .limit(PerPage)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .send({ success: true, message: "Per Page Product Get", products });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error, message: "Error in  Page Product" });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const searchProducts = await ProductModel.find({
      $or: [
        { name: { $regex: keyword } },
        { description: { $regex: keyword } },
        { color: { $regex: keyword } },
        { slug: { $regex: keyword } },
        { size: { $regex: keyword } },
      ],
    })
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, searchProducts });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error, message: "Error in  Searching Product" });
  }
};
//similar product getting
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const relatedProduct = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(6)
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, relatedProduct });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error, message: "Error in  Searching Product" });
  }
};

//category wise product showing
export const categoryWiseProductController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    let result = await ProductModel.find({ category })
      .select("-photo")
      .sort({ createdAt: -1 });

    if (result) {
      res.status(200).send({
        success: true,
        message: "Find category Wise Product",
        result,
        category,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Category wise product",
      error,
    });
  }
};
