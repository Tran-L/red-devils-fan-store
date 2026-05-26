const express = require("express");
const {
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser
} = require("../controllers/userController");
const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getAllUsers);
router.get("/:id", authenticateToken, requireAdmin, getUserById);
router.put("/:id", authenticateToken, requireAdmin, updateUser);
router.delete("/:id", authenticateToken, requireAdmin, deactivateUser);

module.exports = router;