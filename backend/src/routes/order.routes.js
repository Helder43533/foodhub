const express = require("express");

const {
  createOrder,
  listMyOrders,
  listRestaurantOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("CLIENTE"),
  createOrder
);

router.get(
  "/my-orders",
  authMiddleware,
  authorizeRoles("CLIENTE"),
  listMyOrders
);

router.get(
  "/restaurant",
  authMiddleware,
  authorizeRoles("RESTAURANTE"),
  listRestaurantOrders
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("RESTAURANTE"),
  updateOrderStatus
);

module.exports = router;