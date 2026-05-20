const express = require("express");

const {
  createDish,
  listDishes,
  getDishById,
  listDishesByRestaurant,
  updateDish,
  deleteDish
} = require("../controllers/dish.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", listDishes);

router.get("/restaurant/:restaurantId", listDishesByRestaurant);

router.get("/:id", getDishById);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("RESTAURANTE"),
  createDish
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("RESTAURANTE"),
  updateDish
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("RESTAURANTE"),
  deleteDish
);

module.exports = router;