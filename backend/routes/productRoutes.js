const express = require("express");

const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController.js");
const { productSchema } = require("../validation/productSchema.js");
const { joiValidateSchema } = require('../middleware/validators/joiValidateSchema.js')

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/createProd", joiValidateSchema(productSchema), createProduct);
router.put("/updateProd/:id", joiValidateSchema(productSchema), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

