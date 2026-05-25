const express = require("express");
const {
    checkout,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} = require("../controllers/orderController");
const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/checkout", authenticateToken, checkout);
router.get("/my-orders", authenticateToken, getMyOrders);
router.get("/", authenticateToken, requireAdmin, getAllOrders);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/status", authenticateToken, requireAdmin, updateOrderStatus);

module.exports = router;