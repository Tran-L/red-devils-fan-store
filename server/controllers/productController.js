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

const getProducts = async (req, res, next) => {
    try {
        const { search = "", category = "" } = req.query;

        const conditions = ["is_active = 1"];
        const params = [];

        if (search.trim()) {
            conditions.push("(LOWER(name) LIKE ? OR LOWER(description) LIKE ?)");
            params.push(`%${search.trim().toLowerCase()}%`);
            params.push(`%${search.trim().toLowerCase()}%`);
        }

        if (category.trim()) {
            conditions.push("LOWER(category) = ?");
            params.push(category.trim().toLowerCase());
        }

        const products = await allQuery(
            `
      SELECT id, name, category, description, price, stock, image_url, is_active, created_at, updated_at
      FROM products
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
      `,
            params
        );

        return res.status(200).json({
            products: products.map((product) => ({
                id: product.id,
                name: product.name,
                category: product.category,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.image_url,
                isActive: Boolean(product.is_active),
                createdAt: product.created_at,
                updatedAt: product.updated_at
            }))
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await getQuery(
            `
      SELECT id, name, category, description, price, stock, image_url, is_active, created_at, updated_at
      FROM products
      WHERE id = ? AND is_active = 1
      `,
            [req.params.id]
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.status(200).json({
            product: {
                id: product.id,
                name: product.name,
                category: product.category,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.image_url,
                isActive: Boolean(product.is_active),
                createdAt: product.created_at,
                updatedAt: product.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, category, description, price, stock, imageUrl } = req.body;

        if (!name || !category || !description || price === undefined || stock === undefined || !imageUrl) {
            return res.status(400).json({
                message: "Name, category, description, price, stock, and image URL are required."
            });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (Number.isNaN(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "Price must be a valid positive number."
            });
        }

        if (!Number.isInteger(numericStock) || numericStock < 0) {
            return res.status(400).json({
                message: "Stock must be a valid whole number."
            });
        }

        const result = await runQuery(
            `
      INSERT INTO products (name, category, description, price, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
            [
                name.trim(),
                category.trim(),
                description.trim(),
                numericPrice,
                numericStock,
                imageUrl.trim()
            ]
        );

        const newProduct = await getQuery(
            `
      SELECT id, name, category, description, price, stock, image_url, is_active, created_at, updated_at
      FROM products
      WHERE id = ?
      `,
            [result.lastID]
        );

        return res.status(201).json({
            message: "Product created successfully.",
            product: {
                id: newProduct.id,
                name: newProduct.name,
                category: newProduct.category,
                description: newProduct.description,
                price: newProduct.price,
                stock: newProduct.stock,
                imageUrl: newProduct.image_url,
                isActive: Boolean(newProduct.is_active),
                createdAt: newProduct.created_at,
                updatedAt: newProduct.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { name, category, description, price, stock, imageUrl, isActive } = req.body;
        const productId = req.params.id;

        const existingProduct = await getQuery(
            `
      SELECT id
      FROM products
      WHERE id = ?
      `,
            [productId]
        );

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        if (!name || !category || !description || price === undefined || stock === undefined || !imageUrl) {
            return res.status(400).json({
                message: "Name, category, description, price, stock, and image URL are required."
            });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (Number.isNaN(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "Price must be a valid positive number."
            });
        }

        if (!Number.isInteger(numericStock) || numericStock < 0) {
            return res.status(400).json({
                message: "Stock must be a valid whole number."
            });
        }

        await runQuery(
            `
      UPDATE products
      SET name = ?, category = ?, description = ?, price = ?, stock = ?, image_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
            [
                name.trim(),
                category.trim(),
                description.trim(),
                numericPrice,
                numericStock,
                imageUrl.trim(),
                isActive === false ? 0 : 1,
                productId
            ]
        );

        const updatedProduct = await getQuery(
            `
      SELECT id, name, category, description, price, stock, image_url, is_active, created_at, updated_at
      FROM products
      WHERE id = ?
      `,
            [productId]
        );

        return res.status(200).json({
            message: "Product updated successfully.",
            product: {
                id: updatedProduct.id,
                name: updatedProduct.name,
                category: updatedProduct.category,
                description: updatedProduct.description,
                price: updatedProduct.price,
                stock: updatedProduct.stock,
                imageUrl: updatedProduct.image_url,
                isActive: Boolean(updatedProduct.is_active),
                createdAt: updatedProduct.created_at,
                updatedAt: updatedProduct.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const existingProduct = await getQuery(
            `
      SELECT id
      FROM products
      WHERE id = ?
      `,
            [productId]
        );

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        await runQuery(
            `
      UPDATE products
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
            [productId]
        );

        return res.status(200).json({
            message: "Product deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};