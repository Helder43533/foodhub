const express = require("express");

const {
  createRestaurant,
  listRestaurants,
  getRestaurantById,
  updateRestaurantStatus
} = require("../controllers/restaurant.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", listRestaurants);

router.get("/:id", getRestaurantById);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("RESTAURANTE"),
  createRestaurant
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateRestaurantStatus
);

module.exports = router;