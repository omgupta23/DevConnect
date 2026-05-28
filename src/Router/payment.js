const express = require("express");
const crypto = require("crypto");
const { Authanticate } = require("../Middleware/auth");
const paymentrouter = express.Router();

const razorpayInstance = require("../utils/razorpay");

const User = require("../model/user");

paymentrouter.post("/create-order", Authanticate, async (req, res) => {
  try {
    const options = {
      amount: 49900,
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

paymentrouter.post("/verify-payment", Authanticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await User.findByIdAndUpdate(req.user._id, {
        isPremium: true,
      });

      return res.status(200).json({
        success: true,
        message: "Payment successful",
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment failed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = paymentrouter;
