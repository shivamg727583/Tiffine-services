const express = require('express');
const router = express.Router();
const { vendorLoggedIn } = require('../middlewares/vendorLoggedIn');
const TiffinSchedule = require('../models/schedule-model'); // Import TiffinSchedule model
const Vendor = require('../models/vender-model'); // Import Vendor model
const Food = require('../models/foods-model'); // Import Food model

// 1. GET Route - Display form to create a new Tiffin Schedule
router.get('/tiffin-schedule/new', async (req, res) => {
    try {
        const vendors = await Vendor.find(); // Fetch all vendors
        const foods = await Food.find(); // Fetch all food items for the menu
        res.render('./Tiffine_Schedule/tiffineSchedule', { vendors, foods }); // Render the form with vendors and foods
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. POST Route - Create a new Tiffin Schedule
router.post('/tiffin-schedule', async (req, res) => {
    try {
        const { vendorId, week_start_date, weekly_schedule } = req.body;

        // Create new Tiffin Schedule document
        const newSchedule = new TiffinSchedule({
            vendorId,
            week_start_date,
            weekly_schedule
        });

        await newSchedule.save(); // Save to the database
        res.redirect('vendors/tiffin-schedule'); // Redirect to the list page after creation
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 3. GET Route - Display list of Tiffin Schedules
router.get('/tiffin-schedule', async (req, res) => {
    try {
        // Populate vendor and menu fields in the schedule
        const tiffinSchedules = await TiffinSchedule.find()
            .populate('vendorId')  // Populating vendor details
            .populate('weekly_schedule.menu'); // Populating food menu items

        res.render('./Tiffine_Schedule/displayTiifne', { tiffinSchedules }); // Render the list page
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;



