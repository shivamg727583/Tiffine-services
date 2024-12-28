
const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin-model'); 

module.exports.adminLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.AdminToken;
        if (!token) {
            console.log('token not same');
            req.flash('error',"You should have to login first")
            return res.redirect('/admin/login');
        }

        const decoded = jwt.verify(token, 'JWT_SECRET'); 
        const user = await adminModel.findById(decoded.id).select('-password');

        if (!user) {
            console.log("not found")
            req.flash('error',"You should have to login first");
            return res.redirect('/admin/login');
        }

        req.user = user; 
      
        next();
    } catch (err) {
        console.log("err",err);
        req.flash('error',"You should have to login first");
        res.redirect('/admin/login');
    }
};

