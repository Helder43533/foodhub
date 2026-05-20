const express = require("express");

const {
  listUsers,
  listAllOrders,
  getDashboardStats
} = require("../controllers/admin.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("ADMIN"));

router.get("/users", listUsers);
router.get("/orders", listAllOrders);
router.get("/stats", getDashboardStats);

module.exports = router;