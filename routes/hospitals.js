const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');


const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
};


router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.render('hospitals/index', { hospitals });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching hospitals');
        res.redirect('/');
    }
});


router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('hospitals/new');
});


router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const { hospitalName, location, numberOfDoctors, numberOfBed } = req.body;
        const newHospital = new Hospital({
            hospitalName,
            location,
            numberOfDoctors,
            numberOfBed
        });
        await newHospital.save();
        req.flash('success_msg', 'Hospital added successfully');
        res.redirect('/hospitals');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding hospital');
        res.redirect('/hospitals/new');
    }
});


router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            req.flash('error_msg', 'Hospital not found');
            return res.redirect('/hospitals');
        }
        res.render('hospitals/show', { hospital });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching hospital');
        res.redirect('/hospitals');
    }
});


router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            req.flash('error_msg', 'Hospital not found');
            return res.redirect('/hospitals');
        }
        res.render('hospitals/edit', { hospital });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching hospital');
        res.redirect('/hospitals');
    }
});


router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { location, numberOfDoctors, numberOfBed } = req.body;
        const hospital = await Hospital.findById(req.params.id);
        
        if (!hospital) {
            req.flash('error_msg', 'Hospital not found');
            return res.redirect('/hospitals');
        }

        hospital.location = location;
        hospital.numberOfDoctors = numberOfDoctors;
        hospital.numberOfBed = numberOfBed;
        
        await hospital.save();
        req.flash('success_msg', 'Hospital updated successfully');
        res.redirect('/hospitals');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating hospital');
        res.redirect(`/hospitals/${req.params.id}/edit`);
    }
});


router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Hospital.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Hospital deleted successfully');
        res.redirect('/hospitals');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting hospital');
        res.redirect('/hospitals');
    }
});

module.exports = router; 