const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");
const ErrorHandler = require('../utils/errorHandler');
//create a new order
exports.newOrder = async (req, res, next) => {
    try {
        console.log("im in new order");
        console.log("userId", req.user.id);
        const { itemsPrice, taxPrice, shippingPrice, totalPrice, orderItems, ShippingInfo, paymentInfo } = req.body;
        const order = await Order.create({
            orderItems,
            ShippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user.id
        })

        console.log("order response", order);
        res.status(200).json({ success: true, order });
    } catch (err) {
        console.log("error", err);
        res.send({ error: err });
    }
}

//get single order
exports.getSingleOrder = async (req, res, next) => {
    console.log("im in sinle order");
    console.log(req.params.id);
    try {
        // const order = await Order.findById(req.params.id).populate( { path: "user"});
        const order = await Order.findById(req.params.id).populate('user', 'name email')
        // const order = await Order.findById(req.params.id);
        console.log("order", order);
        if (order == null) {
            res.send({ msg: "No Order found with this id" })
        }
        res.status(200).json({
            success: true,
            order
        })
    } catch (err) {
        res.send({ error: err });
    }
}

//get loged in users order
exports.getOrders = async (req, res, next) => {
    console.log("im in getOrders");
    try {
        console.log("userId", req.user.id);
        var orders = await Order.find({ User: req.user.id });
        console.log("orders", orders);
        res.status(200).json({
            success: true,
            orders
        })
    } catch (err) {
        res.send({ error: err })
    }
}

//get all orders
exports.allOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        let total_amount = 0;
        orders.forEach(order => {
            total_amount += order.totalPrice;
        })
        res.status(200).json({
            success: true,
            orders,
            total_amount
        })
    } catch (err) {
        res.send({ error: err });
    }
}

//update order-admin
exports.updateOrder = async (req, res, next) => {
    console.log("im in update order")
    console.log("body", req.body);
    try {
        var order = await Order.findById(req.params.id);
        console.log("update_order", order);
        if (order.orderStatus == "delivered") {
            return next(new ErrorHandler('you have already delivered this order', 401));
        }
        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity);
        })
        order.orderStatus = req.body.status;
        order.deliveredAt = Date.now();
        await order.save();
        res.status(200).json({
            success: true,

        })
    } catch (err) {
        res.send(err);
    }
}
async function updateStock(id, quantity) {
    try {
        console.log("id", id);
        console.log("quantity", quantity);
        const product = await Product.findById(id);
        console.log("product", product);
        product.stock = product.stock - quantity;
        await product.save();
    } catch (err) {
        console.log("error", err);
    }
}
//delete order-admin
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order == null) {
            return next(new ErrorHandler('no order found with this order id', 401));

        }
        await order.remove();
        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.send({ error: err });
    }
}