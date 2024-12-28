// middlewares/IsLoggedIn.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/users-model'); // Replace with your actual user model path

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.UserToken;
        if (!token) {
            req.flash('error',"You should have to login first")
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, 'LOGIN_KEY'); // Ensure 'LOGIN_KEY' matches your secret key
        const user = await userModel.findById(decoded.userid).select('-password');

        if (!user) {
            req.flash('error',"You should have to login first")
            return res.redirect('/login');
        }

        req.user = user; 
        req.isVendor = user.role === 'vendor'; // Assuming you have a 'role' field to distinguish users
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

module.exports.datacheck = (req, res)=>{
    const token =req.cookies.UserToken;

    if(token){
        return true;

    }else{
        return false
       
    }
    
}
