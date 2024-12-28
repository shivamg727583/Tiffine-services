const express = require('express');
const route = express.Router();
const { VendorRegister, VendorLogin, VendorLogOut, VendorEditProfile } = require('../controllers/vendors-controller');
const { vendorLoggedIn } = require('../middlewares/vendorLoggedIn');
const FoodRouter = require('./FoodRouter');
const TiffineRouter = require('./tffineRouter');
const venderModel = require('../models/vender-model');
const upload = require('../config/multer-config');


route.get('/register', (req, res) => {
    res.render('register',{
        error: req.flash('error'), 
        success: req.flash('success') 
    });
});


route.post('/register', VendorRegister);


route.get('/login', (req, res) => {
    res.render('login',{
        error: req.flash('error'), 
        success: req.flash('success') 
    });
});


route.post('/login', VendorLogin);


route.get('/logout',VendorLogOut)


route.get('/dashboard', vendorLoggedIn,async (req, res) => {

    const vendor = await venderModel.findById(req.vendor._id).populate('foodItems');
    

    res.render('./VendorFiles/dashboard', {
        isVendorLogged: true,
          vendor ,
         error: req.flash('error'), 
         success: req.flash('success') 
        });
});


route.get('/addFood', vendorLoggedIn, (req, res) => {
    res.render('./VendorFiles/addFoods', {
        isVendorLogged:true,
         vendor: req.vendor ,
         error: req.flash('error'), 
        success: req.flash('success') 
    });
});


route.use('/', FoodRouter);

route.use('/',TiffineRouter);




route.get('/profile',vendorLoggedIn ,async (req,res)=>{
    const vendor = await venderModel.findById(req.vendor._id);
    res.render('./VendorFiles/vendorProfile', { vendor ,
        isVendorLogged:true,
        error: req.flash('error'), 
        success: req.flash('success') 
    });
})

route.get('/profile/edit',vendorLoggedIn, async (req,res)=>{
    const vendor = await venderModel.findById(req.vendor._id);
    res.render('./VendorFiles/editVendorProfile', {vendor,
        isVendorLogged:true,
        error: req.flash('error'), 
        success: req.flash('success') 
    })
})

route.post('/profile/edit',vendorLoggedIn ,upload.single('profilePicture'), VendorEditProfile)

module.exports = route;
