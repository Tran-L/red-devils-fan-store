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

const formatOrder = (order, items = []) => ({
    id: order.id,
    userId: order.user_id,
    userEmail: order.email || null,
    customerName: order.customer_name,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
    status: order.status,
    totalAmount: order.total_amount,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        subtotal: item.subtotal
    }))
});

const checkout = async (req, res, next) => {
    try {
        const { customerName, shippingAddress, paymentMethod } = req.body;

        if (!customerName || !shippingAddress || !paymentMethod) {
            return res.status(400).json({
                message: "Customer name, shipping address, and payment method are required."
            });
        }

        const cartItems = await allQuery(
            `
      SELECT 
        cart_items.id,
        cart_items.product_id,
        cart_items.quantity,
        products.name,
        products.price,
        products.stock,
        products.is_active
      FROM cart_items
      INNER JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ?
      `,
            [req.user.id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty."
            });
        }

        for (const item of cartItems) {
            if (!item.is_active) {
                return res.status(400).json({
                    message: `${item.name} is no longer available.`
                });
            }

            if (item.quantity > item.stock) {
                return res.status(400).json({
                    message: `Only ${item.stock} item(s) of ${item.name} are available.`
                });
            }
        }

        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await runQuery("BEGIN TRANSACTION");

        try {
            const orderResult = await runQuery(
                `
        INSERT INTO orders (
          user_id,
          total_amount,
          status,
          customer_name,
          shipping_address,
          payment_method
        )
        VALUES (?, ?, 'Paid', ?, ?, ?)
        `,
                [
                    req.user.id,
                    Number(totalAmount.toFixed(2)),
                    customerName.trim(),
                    shippingAddress.trim(),
                    paymentMethod.trim()
                ]
            );

            const orderId = orderResult.lastID;

            for (const item of cartItems) {
                const subtotal = Number((item.price * item.quantity).toFixed(2));

                await runQuery(
                    `
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            unit_price,
            quantity,
            subtotal
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
                    [
                        orderId,
                        item.product_id,
                        item.name,
                        item.price,
                        item.quantity,
                        subtotal
                    ]
                );

                await runQuery(
                    `
          UPDATE products
          SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
                    [item.quantity, item.product_id]
                );
            }

            await runQuery(
                `
        DELETE FROM cart_items
        WHERE user_id = ?
        `,
                [req.user.id]
            );

            await runQuery("COMMIT");

            const order = await getQuery(
                `
        SELECT id, user_id, total_amount, status, customer_name, shipping_address, payment_method, created_at, updated_at
        FROM orders
        WHERE id = ?
        `,
                [orderId]
            );

            const orderItems = await allQuery(
                `
        SELECT id, order_id, product_id, product_name, unit_price, quantity, subtotal
        FROM order_items
        WHERE order_id = ?
        `,
                [orderId]
            );

            return res.status(201).json({
                message: "Checkout completed successfully.",
                order: formatOrder(order, orderItems)
            });
        } catch (error) {
            await runQuery("ROLLBACK");
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await allQuery(
            `
      SELECT id, user_id, total_amount, status, customer_name, shipping_address, payment_method, created_at, updated_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
            [req.user.id]
        );

        const formattedOrders = [];

        for (const order of orders) {
            const items = await allQuery(
                `
        SELECT id, order_id, product_id, product_name, unit_price, quantity, subtotal
        FROM order_items
        WHERE order_id = ?
        `,
                [order.id]
            );

            formattedOrders.push(formatOrder(order, items));
        }

        return res.status(200).json({
            orders: formattedOrders
        });
    } catch (error) {
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await allQuery(
            `
      SELECT 
        orders.id,
        orders.user_id,
        users.email,
        orders.total_amount,
        orders.status,
        orders.customer_name,
        orders.shipping_address,
        orders.payment_method,
        orders.created_at,
        orders.updated_at
      FROM orders
      INNER JOIN users ON orders.user_id = users.id
      ORDER BY orders.created_at DESC
      `
        );

        const formattedOrders = [];

        for (const order of orders) {
            const items = await allQuery(
                `
        SELECT id, order_id, product_id, product_name, unit_price, quantity, subtotal
        FROM order_items
        WHERE order_id = ?
        `,
                [order.id]
            );

            formattedOrders.push(formatOrder(order, items));
        }

        return res.status(200).json({
            orders: formattedOrders
        });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const orderId = req.params.id;

        const query =
            req.user.role === "admin"
                ? `
          SELECT 
            orders.id,
            orders.user_id,
            users.email,
            orders.total_amount,
            orders.status,
            orders.customer_name,
            orders.shipping_address,
            orders.payment_method,
            orders.created_at,
            orders.updated_at
          FROM orders
          INNER JOIN users ON orders.user_id = users.id
          WHERE orders.id = ?
          `
                : `
          SELECT id, user_id, total_amount, status, customer_name, shipping_address, payment_method, created_at, updated_at
          FROM orders
          WHERE id = ? AND user_id = ?
          `;

        const params =
            req.user.role === "admin" ? [orderId] : [orderId, req.user.id];

        const order = await getQuery(query, params);

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        const items = await allQuery(
            `
      SELECT id, order_id, product_id, product_name, unit_price, quantity, subtotal
      FROM order_items
      WHERE order_id = ?
      `,
            [orderId]
        );

        return res.status(200).json({
            order: formatOrder(order, items)
        });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status."
            });
        }

        const existingOrder = await getQuery(
            `
      SELECT id
      FROM orders
      WHERE id = ?
      `,
            [orderId]
        );

        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        await runQuery(
            `
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
            [status, orderId]
        );

        return res.status(200).json({
            message: "Order status updated successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkout,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};