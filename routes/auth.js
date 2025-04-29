const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/hospitals');
    } else {
        res.redirect('/login');
    }
});


router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { name, isPatient, age, address, email, password } = req.body;
        
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/register');
        }

        
        const newUser = new User({
            name,
            isPatient,
            age,
            address,
            email,
            password
        });

        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error registering user');
        res.redirect('/register');
    }
});


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/hospitals',
    failureRedirect: '/login',
    failureFlash: true
}));


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

module.exports = router; 