const express = require('express');
const route = express.Router();
const { UserRegister, UserLogin, UserLoggedOut, UserProfileUpdate, UserProfileUpdatePost } = require('../controllers/users-controller');
const { isLoggedIn } = require('../middlewares/IsLoggedIn');
const upload = require('../config/multer-config');
const cartRouter = require('./cartRouter');
const getCartWithProducts = require('../utils/getCart');




route.get('/register', (req, res) => {
    res.render('register', { 
        error: req.flash('error'), 
        success: req.flash('success') 
    });
});


route.post('/register', UserRegister);


route.get('/login', (req, res) => {
    res.render('login', { 
        error: req.flash('error'), 
        success: req.flash('success') 
    });
});


route.post('/login', UserLogin);


route.get('/profile', isLoggedIn,async (req, res) => {
    const cart = await getCartWithProducts(req.user._id);
    const cartcount = cart.length;

    
    res.render('./UsersFiles/User-profile', {
        isLogged: true,
        error: req.flash('error'), 
        success: req.flash('success') ,
        user:req.user,
        cartcount
       
    });
});

route.get('/profile/update/:id',isLoggedIn,UserProfileUpdate);

route.post('/profile/update/:id',isLoggedIn,upload.single('profile_pic'),UserProfileUpdatePost)


route.get('/logout', UserLoggedOut);


route.use('/',isLoggedIn,cartRouter);















module.exports = route;
