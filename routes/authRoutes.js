const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup routes
router.get('/signup', authController.getSignup);
const upload = require('../config/multer');

router.post('/signup', upload.single('photo'), authController.postSignup);

// Signin routes
router.get('/signin', authController.getSignin);
router.post('/signin', authController.postSignin);

// Logout route
router.get('/logout', authController.logout);

// Dashboard route (protected)
router.get('/dashboard', authController.getDashboard);

router.get('/profile', authController.isAuthenticated, authController.getProfile);
router.post('/profile', authController.isAuthenticated, upload.single('photo'), authController.updateProfile);


module.exports = router;