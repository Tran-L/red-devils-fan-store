const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const createToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );
};

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(
            `
      SELECT id, full_name, email, password_hash, role, is_active, created_at
      FROM users
      WHERE email = ?
      `,
            [email],
            (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            }
        );
    });
};

const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            `
      SELECT id, full_name, email, role, is_active, created_at
      FROM users
      WHERE id = ?
      `,
            [id],
            (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            }
        );
    });
};

const createUser = ({ fullName, email, passwordHash }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (?, ?, ?, 'user')
      `,
            [fullName, email, passwordHash],
            function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        id: this.lastID,
                        full_name: fullName,
                        email,
                        role: "user"
                    });
                }
            }
        );
    });
};

const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Full name, email, and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long."
            });
        }

        const normalisedEmail = email.trim().toLowerCase();

        const existingUser = await findUserByEmail(normalisedEmail);

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await createUser({
            fullName: fullName.trim(),
            email: normalisedEmail,
            passwordHash
        });

        const token = createToken(user);

        return res.status(201).json({
            message: "Registration successful.",
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const normalisedEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(normalisedEmail);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: "This account has been disabled."
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                isActive: Boolean(user.is_active),
                createdAt: user.created_at
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};