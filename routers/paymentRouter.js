const express = require("express");
const paymentController = require("../controllers/paymentController");
const payment = require("../models/payment");
const router = express.Router();

router.get("/payment", paymentController.getPaymentOrder);

// http://localhost:8080/api/verify-payment
router.post("/verify-payment", paymentController.postVerifyPayment);

// http://localhost:8080/api/payments
router.get("/payments", paymentController.getPayment);

module.exports = router;
