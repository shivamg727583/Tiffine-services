const TiffinSchedule = require('../models/schedule-model');
const FoodItem = require('../models/foods-model');  // Assuming you have a FoodItem model

// Add weekly schedule
exports.addWeeklySchedule = async (req, res) => {
    try {
        const { week_start_date, weekly_schedule } = req.body;
        const vendorId = req.vendor._id;

        const schedule = new TiffinSchedule({
            vendorId,
            week_start_date,
            weekly_schedule
        });

        await schedule.save();
        req.flash('success',"Tiffine schedule Added successfully")
        res.redirect('/vendors/tiffin-schedule/weekly');
    } catch (error) {
       req.flash('error',"Error in adding tiffin Schedule")
        res.redirect('/vendors/tiffin-schedule/weekly');
    }
};

// View weekly schedules
exports.viewWeeklySchedules = async (req, res) => {
    try {
        const vendorId = req.vendor._id;
        const schedules = await TiffinSchedule.find({ vendorId }).populate('weekly_schedule.menu');
        const foods = await FoodItem.find({ vendorId }); // Fetch the foods for the vendor

        res.render('./Tiffine_Schedule/tiffineSchedule', {
             schedules, foods ,
             error: req.flash('error'), 
             success: req.flash('success') ,
             isVendorLogged:true,
             
            });
    } catch (error) {
        req.flash("error","Error in view Schedule")
        res.redirect('/vendors/tiffin-schedule/weekly');
    }
};
