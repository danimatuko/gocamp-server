import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const addOrderItems = asyncHandler(async (req, res) => {
	const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } =
		req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No order Items");
	} else {
		const order = new Order({
			user: req.user.id,
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice
		});

		const createdOrder = await order.save();

		res.status(201).json(createdOrder);
	}
});

const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"first_name last_name email"
	);

	if (order) {
		res.json(order);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address
		};
		const updateOrder = await order.save();

		res.json(updateOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();
		const updateOrder = await order.save();

		res.json(updateOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

const getUserOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user.id });
	if (!orders) throw new Error("No orders found");

	res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({});
	if (!orders) throw new Error("No orders found");

	res.json(orders);
});

export {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	getUserOrders,
	getAllOrders,
	updateOrderToDelivered
};
