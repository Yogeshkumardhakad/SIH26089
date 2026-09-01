const razorpay = require('../config/razorpay');
const Booking = require('../models/Booking');
const crypto = require('crypto');

// GET Payment page (Razorpay checkout dikhana)
exports.getPaymentPage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('worker');

    if (!booking || booking.status !== 'accepted') {
      return res.redirect('/my-bookings');
    }

    // Razorpay order banao (amount paise mein jaata hai, isliye x100)
    const order = await razorpay.orders.create({
      amount: booking.amount * 100,
      currency: 'INR',
      receipt: booking._id.toString()
    });

    res.render('pay', {
      booking,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error(error);
    res.redirect('/my-bookings');
  }
};

// POST Payment verify karna (Razorpay se response aane ke baad)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).send('Payment verification failed');
    }

    await Booking.findByIdAndUpdate(bookingId, { status: 'paid' });

    res.redirect('/my-bookings');

  } catch (error) {
    console.error(error);
    res.redirect('/my-bookings');
  }
};