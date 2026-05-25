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

const formatCartItem = (item) => ({
    id: item.id,
    userId: item.user_id,
    productId: item.product_id,
    quantity: item.quantity,
    productName: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    stock: item.stock,
    imageUrl: item.image_url,
    subtotal: Number((item.price * item.quantity).toFixed(2))
});

const getCart = async (req, res, next) => {
    try {
        const cartItems = await allQuery(
            `
      SELECT 
        cart_items.id,
        cart_items.user_id,
        cart_items.product_id,
        cart_items.quantity,
        products.name,
        products.category,
        products.description,
        products.price,
        products.stock,
        products.image_url
      FROM cart_items
      INNER JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ? AND products.is_active = 1
      ORDER BY cart_items.created_at DESC
      `,
            [req.user.id]
        );

        const formattedItems = cartItems.map(formatCartItem);
        const totalAmount = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);

        return res.status(200).json({
            cartItems: formattedItems,
            totalAmount: Number(totalAmount.toFixed(2))
        });
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required."
            });
        }

        const numericQuantity = Number(quantity);

        if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number."
            });
        }

        const product = await getQuery(
            `
      SELECT id, name, stock, is_active
      FROM products
      WHERE id = ?
      `,
            [productId]
        );

        if (!product || !product.is_active) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        if (product.stock <= 0) {
            return res.status(400).json({
                message: "This product is currently out of stock."
            });
        }

        const existingCartItem = await getQuery(
            `
      SELECT id, quantity
      FROM cart_items
      WHERE user_id = ? AND product_id = ?
      `,
            [req.user.id, productId]
        );

        const newQuantity = existingCartItem
            ? existingCartItem.quantity + numericQuantity
            : numericQuantity;

        if (newQuantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} item(s) are available in stock.`
            });
        }

        if (existingCartItem) {
            await runQuery(
                `
        UPDATE cart_items
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
                [newQuantity, existingCartItem.id]
            );
        } else {
            await runQuery(
                `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        `,
                [req.user.id, productId, numericQuantity]
            );
        }

        return res.status(200).json({
            message: "Product added to cart successfully."
        });
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const cartItemId = req.params.id;
        const { quantity } = req.body;

        const numericQuantity = Number(quantity);

        if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number."
            });
        }

        const cartItem = await getQuery(
            `
      SELECT 
        cart_items.id,
        cart_items.user_id,
        cart_items.product_id,
        products.stock,
        products.is_active
      FROM cart_items
      INNER JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.id = ? AND cart_items.user_id = ?
      `,
            [cartItemId, req.user.id]
        );

        if (!cartItem || !cartItem.is_active) {
            return res.status(404).json({
                message: "Cart item not found."
            });
        }

        if (numericQuantity > cartItem.stock) {
            return res.status(400).json({
                message: `Only ${cartItem.stock} item(s) are available in stock.`
            });
        }

        await runQuery(
            `
      UPDATE cart_items
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
      `,
            [numericQuantity, cartItemId, req.user.id]
        );

        return res.status(200).json({
            message: "Cart item updated successfully."
        });
    } catch (error) {
        next(error);
    }
};

const removeCartItem = async (req, res, next) => {
    try {
        const cartItemId = req.params.id;

        const result = await runQuery(
            `
      DELETE FROM cart_items
      WHERE id = ? AND user_id = ?
      `,
            [cartItemId, req.user.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Cart item not found."
            });
        }

        return res.status(200).json({
            message: "Cart item removed successfully."
        });
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        await runQuery(
            `
      DELETE FROM cart_items
      WHERE user_id = ?
      `,
            [req.user.id]
        );

        return res.status(200).json({
            message: "Cart cleared successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};