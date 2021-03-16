const Razorpay = require("razorpay");
const shortId = require("shortid");
const crypto = require("crypto");
var pdf = require("html-pdf");
const pdfTemplate = require("../invoice/invoice");
const Payment = require("../models/payment");

require("dotenv").config();

const razorpayObj = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET,
});

module.exports.getPaymentOrder = async (req, res, next) => {
  const amount = 100;
  const currency = "INR";

  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: shortId.generate(),
    payment_capture: true,
  };
  try {
    const paymentResponse = await razorpayObj.orders.create(options);
    if (!paymentResponse) {
      return res.status(500).send("internal server error");
    }
    res.status(200).json({
      id: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports.postVerifyPayment = (req, res, next) => {
  const secret = process.env.WEBHOOK_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (digest === req.headers["x-razorpay-signature"]) {
    const paymentObj = new Payment({
      paymentId: req.body.payload.payment.entity.id,
      email: req.body.payload.payment.entity.email,
      amount: req.body.payload.payment.entity.amount,
      type: req.body.payload.payment.entity.method,
    });
    paymentObj
      .save()
      .then((dbRes) => {
        res.json({ status: "ok" });
      })
      .catch((err) => {
        return res.status(500).json("internal server error");
      });
  } else {
    res.status(403).json({ msg: "invalid payment" });
  }
};

module.exports.getPayment = async (req, res, next) => {
  try {
    const payments = await Payment.find({});
    if (!payments) {
      return res.status(404).json({ msg: "payments not found !!! " });
    }
    return res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports.postGenerateInvoice = (req, res, next) => {
  pdf.create(pdfTemplate(req.body), {}).toStream((err, stream) => {
    if (err) {
      console.log("error: ", err);
      return res.status(500).send("internal server error");
    }
    res.setHeader("Content-type", "application/pdf");
    res.setHeader("Content-disposition", "attachment; filename=invoice.pdf"); // Remove this if you don't want direct download
    res.setHeader("Content-Length", "" + stream.length);
    stream.pipe(res);
  });
};
