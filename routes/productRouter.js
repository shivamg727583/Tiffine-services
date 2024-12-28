const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/IsLoggedIn');
const FoodModel = require('../models/foods-model');
const UserModel = require('../models/users-model');
const  getCartWithProducts  = require('../utils/getCart');


router.get('/', isLoggedIn, async (req, res) => {
    try {
        const productsData = await FoodModel.find().populate('vendorId');
        const cart = await getCartWithProducts(req.user._id);
        const cartcount = cart.length;

        res.render('products', {
            isLogged: true,
            products: productsData,
            error: req.flash('error'), 
            success: req.flash('success'),
            user: req.user,
            cartcount: cartcount
         
        });
    } catch (error) {
        console.error('Error in loading products page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/foods', isLoggedIn, async (req, res) => {
    try {
        const cart = await getCartWithProducts(req.user._id);
          const cartcount = cart.length;
  
        const foods = await FoodModel.find().populate('vendorId');
        res.render('./UsersFiles/ShowAllFoods', {
            isLogged: true,
            foods,
            error: req.flash('error'), 
            success: req.flash('success') ,
            cartcount
        });
    } catch (error) {
        console.error('Error in loading foods page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/filter', isLoggedIn, async (req, res) => {
    try {
        const { category, price, cuisine_type, mealType, preferredVendors, userLocation ,all} = req.query;
        let filterQuery = {};

        if (category) {
            filterQuery.category = category; 
        }

        if (cuisine_type) {
            filterQuery.cuisine_type = { $in: cuisine_type.split(',') }; 
        }

        if (mealType) {
            filterQuery.mealType = { $in: mealType.split(',') };
        }
        if(all){
            filterQuery = {}
            
        }

        if (preferredVendors) {
            if (preferredVendors.includes('Top Rated')) {
                filterQuery['vendorId.rating'] = { $gte: 4 }; 
            }
            if (preferredVendors.includes('Nearby') && userLocation) {
                filterQuery['vendorId.location'] = { 
                    $near: { 
                        $geometry: { 
                            type: "Point", 
                            coordinates: [userLocation.longitude, userLocation.latitude] 
                        }, 
                        $maxDistance: 5000 
                    } 
                };
            }
        }

        let sortOrder = {};
        if (price === 'asc') {
            sortOrder.price = 1; // Ascending order
        } else if (price === 'desc') {
            sortOrder.price = -1; // Descending order
        }

        const foods = await FoodModel.find(filterQuery).sort(sortOrder).populate('vendorId'); 
        const cart = await getCartWithProducts(req.user._id);

        const cartcount = cart.length;

        res.render('filteredPage', { 
            foods,
            isLogged: true,
            error: req.flash('error'), 
            success: req.flash('success'),  
            user: req.user ,
            cartcount: cartcount
        });
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
