const Razorpay = require("razorpay");
const shortId = require("shortid");
const crypto = require("crypto");
var pdf = require("html-pdf");
const pdfTemplate = require("../invoice/invoice");
const Payment = require("../models/payment");
const User = require("../models/users");
const Customer = require("../models/customer");

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

module.exports.getPayments = async (req, res, next) => {
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

module.exports.postGenerateInvoice = async (req, res, next) => {
  try {
    const paymentObj = await Payment.findOne({ paymentId: req.body.receiptId });

    if (!paymentObj) {
      return res.status(404).json({ msg: "Unable to find the invoice" });
    }

    const customerObj = await Customer.findOne({ email: paymentObj.email });

    if (!customerObj) {
      return res.status(404).json({ msg: "Unable to find the user" });
    }

    const isUpdate = await Payment.updateOne(
      { paymentId: req.body.receiptId },
      { $set: { customerId: customerObj._id } }
    );

    if (!isUpdate) {
      return res.status(500).json({ msg: "Unable to update the invoice" });
    }

    pdf.create(pdfTemplate(req.body), {}).toStream((err, stream) => {
      if (err) {
        return res.status(500).send("internal server error");
      }
      res.setHeader("Content-type", "application/pdf");
      res.setHeader("Content-disposition", "attachment; filename=invoice.pdf"); // Remove this if you don't want direct download
      res.setHeader("Content-Length", "" + stream.length);
      stream.pipe(res);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message, err });
  }
};

// get a single payment according to the email id of the customer
module.exports.getPaymentDetails = async (req, res, next) => {
  try {
    const email = req.query.email;
    const paymentObj = await Payment.findOne({ email: email });
    if (!paymentObj) {
      return res.status(404).json({ msg: "Unable to find the invoice" });
    }
    res.status(200).json(paymentObj);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message, error });
  }
};
