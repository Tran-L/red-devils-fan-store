const db = require("../db");

const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(this);
            }
        });
    });
};

const getQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(row);
            }
        });
    });
};

const allQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
};

const formatUser = (user) => ({
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.is_active),
    createdAt: user.created_at,
    updatedAt: user.updated_at
});

const getAllUsers = async (req, res, next) => {
    try {
        const users = await allQuery(
            `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
      `
        );

        return res.status(200).json({
            users: users.map(formatUser)
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await getQuery(
            `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
      `,
            [req.params.id]
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            user: formatUser(user)
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { fullName, role, isActive } = req.body;

        const existingUser = await getQuery(
            `
      SELECT id, role
      FROM users
      WHERE id = ?
      `,
            [userId]
        );

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (!fullName || !role || isActive === undefined) {
            return res.status(400).json({
                message: "Full name, role, and active status are required."
            });
        }

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Role must be either user or admin."
            });
        }

        if (Number(userId) === req.user.id && role !== "admin") {
            return res.status(400).json({
                message: "You cannot remove your own admin role."
            });
        }

        await runQuery(
            `
      UPDATE users
      SET full_name = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
            [fullName.trim(), role, isActive ? 1 : 0, userId]
        );

        const updatedUser = await getQuery(
            `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
      `,
            [userId]
        );

        return res.status(200).json({
            message: "User updated successfully.",
            user: formatUser(updatedUser)
        });
    } catch (error) {
        next(error);
    }
};

const deactivateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (Number(userId) === req.user.id) {
            return res.status(400).json({
                message: "You cannot deactivate your own account."
            });
        }

        const existingUser = await getQuery(
            `
      SELECT id
      FROM users
      WHERE id = ?
      `,
            [userId]
        );

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        await runQuery(
            `
      UPDATE users
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
            [userId]
        );

        return res.status(200).json({
            message: "User deactivated successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser
};