const express = require("express");
const paymentController = require("../controllers/paymentController");
const payment = require("../models/payment");
const router = express.Router();

router.get("/payment", paymentController.getPaymentOrder);

// http://localhost:8080/api/verify-payment
router.post("/verify-payment", paymentController.postVerifyPayment);

// http://localhost:8080/api/payments
router.get("/payments", paymentController.getPayments);

// http://localhost:8080/api/generate-invoice
router.post("/generate-invoice", paymentController.postGenerateInvoice);

//http://localhost:8080/api/payment-details?email="test@test.com"
router.get("/payment-details", paymentController.getPaymentDetails);
module.exports = router;
