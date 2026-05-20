const express = require("express");
const {
  createCategory,
  listCategories
} = require("../controllers/category.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", listCategories);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createCategory
);

module.exports = router;