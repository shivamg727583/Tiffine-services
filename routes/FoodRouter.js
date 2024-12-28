const express = require('express');
const Food = require('../models/foods-model');
const upload = require('../config/multer-config');
const router = express.Router();
const Vendor = require('../models/vender-model'); // Ensure the model name is correct
const {vendorLoggedIn} = require('../middlewares/vendorLoggedIn');





// Route to add new food
router.post('/addFoods', vendorLoggedIn, upload.single('food_image'), async (req, res) => {
    try {
        // Ensure file is uploaded
        if (!req.file) {
            req.flash("error", "Error in file uploading");
            return res.redirect('/vendors/dashboard');
        }

        // Destructure the required fields from the request body
        const { food_name, food_description, cuisine_type, price, category, mealType } = req.body;

        // Convert image buffer to base64 string
        const food_image = req.file.buffer.toString('base64');

        // Retrieve vendor details from request
        const vendor = req.vendor;

        // Create a new food item with the updated model fields
        const newFood = new Food({
            food_name,
            food_description,
            cuisine_type,
            price,
            category,         // Include category field
            mealType,         // Include mealType field
            food_image,
            vendorId: vendor._id // Link food to the vendor
        });

        // Save the new food item to the database
        await newFood.save();

        // Update the vendor's foodItems array with the new food item's ID
        vendor.foodItems.push(newFood._id);
        await vendor.save();

        // Provide success feedback to the user
        req.flash('success', "Food Added Successfully 🎉🎉");
        res.redirect('/vendors/dashboard');
    } catch (error) {
        // Provide error feedback to the user
        console.error('Error adding food:', error);
        req.flash("error", "Adding Food Failed");
        res.redirect('/vendors/dashboard');
    }
});




router.get('/food/edit/:id', vendorLoggedIn, async (req,res)=>{
    const id=req.params.id;
   const food = await Food.findById(id);
   res.render('./VendorFiles/editFoods', { food , error: req.flash('error'), 
    isVendorLogged:true,
    success: req.flash('success') });
})

// Route to edit a food item
router.post('/food/edit/:id', vendorLoggedIn, upload.single('food_image'), async (req, res) => {
    try {
        // Find the food item by ID
        const food = await Food.findById(req.params.id);

        // Check if the food item exists
        if (!food) {
            req.flash("error", "Food item doesn't exist");
            return res.redirect('/vendors/dashboard');
        }

        // Update food details conditionally
        if (req.body.food_name) {
            food.food_name = req.body.food_name;
        }
        if (req.body.food_description) {
            food.food_description = req.body.food_description;
        }
        if (req.body.cuisine_type) {
            food.cuisine_type = req.body.cuisine_type;
        }
        if (req.body.price) {
            food.price = req.body.price;
        }
        if (req.body.category) {
            food.category = req.body.category;  // Update category if provided
        }
        if (req.body.mealType) {
            food.mealType = req.body.mealType;  // Update mealType if provided
        }

        // Check if a new image is uploaded
        if (req.file) {
            // Convert the new image buffer to base64 and update food_image
            food.food_image = req.file.buffer.toString('base64');
        }

        // Save the updated food item to the database
        await food.save();

        // Flash success message and redirect
        req.flash("success", "Item updated successfully 🎉🎉");
        res.redirect('/vendors/dashboard');
    } catch (error) {
        // Flash error message and redirect
        console.error('Error updating food item:', error);
        req.flash('error', "Error in item updation");
        res.redirect('/vendors/dashboard');
    }
});



router.get('/food/delete/:id',vendorLoggedIn, async (req,res)=>{
    const id=req.params.id;
   try {
    const food = await Food.findById(id);
    if (!food) {
        req.flash("error","items doesn't exists")
        return res.redirect('/vendors/dashboard');
        }

        await Food.findByIdAndDelete(id);

        req.flash("success","item deleted successfully🎉")
        res.redirect('/vendors/dashboard');
   } catch (error) {
   req.flash('error','Error in item deletion')
    res.redirect('/vendors/dashboard');
   }
        })



    
        router.get('/dashboard/manageFoods',vendorLoggedIn,async (req,res)=>{
            try {
               const foods = await Food.find({vendorId:req.vendor._id}).populate('vendorId')
                res.render('./VendorFiles/allFoods', {foods: foods, error: req.flash('error'), 
                    success: req.flash('success') , isVendorLogged:true});
                } catch (error) {
                   req.flash("error","Something error in fetching data")
                    res.redirect('/vendors/dashboard');
                    }
                    })





module.exports = router;


