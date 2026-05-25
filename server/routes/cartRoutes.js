const express = require("express");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getCart);
router.post("/", authenticateToken, addToCart);
router.put("/:id", authenticateToken, updateCartItem);
router.delete("/:id", authenticateToken, removeCartItem);
router.delete("/", authenticateToken, clearCart);

module.exports = router;