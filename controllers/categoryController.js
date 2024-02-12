import { CategoryModel } from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(401)
        .send({ success: false, message: "Name is required" });
    }
    //check if category name exist
    const existCategory = await CategoryModel.findOne({ name });
    if (existCategory) {
      return res
        .status(200)
        .send({ success: false, message: "Same Category Alredy Exists" });
    }

    const category = await new CategoryModel({
      name: name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "something went wrong", error });
  }
};
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updateCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name: name, slug: slugify(name) },
      { new: true }
    );

    res.status(201).send({
      success: true,
      message: "Update Category Successfully",
      updateCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while updateing category",
      error,
    });
  }
};
export const getCategoryController = async (req, res) => {
  try {
    const getCategory = await CategoryModel.find({});
    res.status(201).send({
      success: true,
      message: "Get Category Successfully",
      getCategory,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in getting Categoires", error });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const singleCategory = await CategoryModel.findOne({ _id: req.params.id });
    res.status(201).send({
      success: true,
      message: "Single Category ",
      singleCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in getting single category",
      error,
    });
  }
};
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await CategoryModel.findByIdAndDelete(id);
    res.status(201).send({
      success: true,
      message: "Delete Category Successfully",
      deleteCategory,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "error in deleleting Category", error });
  }
};
