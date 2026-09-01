const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.get('/request/:workerId', authController.isAuthenticated, bookingController.getRequestForm);
router.post('/request/:workerId', authController.isAuthenticated, bookingController.postRequest);

router.get('/my-bookings', authController.isAuthenticated, bookingController.getMyBookings);

router.get('/worker-requests', authController.isAuthenticated, bookingController.getWorkerRequests);
router.post('/accept/:bookingId', authController.isAuthenticated, bookingController.acceptRequest);
router.post('/reject/:bookingId', authController.isAuthenticated, bookingController.rejectRequest);

router.post('/mark-complete/:bookingId', authController.isAuthenticated, bookingController.markComplete);
router.post('/submit-rating', authController.isAuthenticated, bookingController.submitRating);

module.exports = router;