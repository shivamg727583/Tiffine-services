const vendorModel = require('../models/vender-model'); // Ensure the model name is correct
const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser');

module.exports.vendorLoggedIn = async (req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies.VendorToken;
        
        if (!token) {
            req.flash('error',"You should have to login first")
            return res.redirect('/vendors/login');
        }

        // Verify the token
        const decoded = jwt.verify(token, 'VENDOR_KEY');

        // Fetch the vendor details excluding the password
        const vendor = await vendorModel.findById(decoded.vendorid).select('-password');

        if (!vendor) {
            req.flash('error',"You should have to login first")
            return res.redirect('/vendors/login');
        }

        // Attach vendor to the request object
        req.vendor = vendor;
        
        // Continue to the next middleware or route handler
        next(); 
    } catch (err) {
        console.log("Error in authentication:", err);
        req.flash('error',"Error in authentication")
        res.redirect('/vendors/login');
    }
};

module.exports.Vendordatacheck = (req, res)=>{
    // console.log(req.cookies.UserToken);
    if(req.cookies.VendorToken){
        return true

    }else{
        return false
       
    }
    
}