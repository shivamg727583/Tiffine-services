const { datacheck } = require('../middlewares/IsLoggedIn');
const { Vendordatacheck } = require('../middlewares/vendorLoggedIn');
const {verifyToken} =require('../services/VerifyToken');

const  getCartWithProducts   = require('../utils/getCart')

module.exports.RenderMethods = async (req, res, render, data = {}) => {
    if (datacheck(req, res)) {
      const token = req.cookies.UserToken;
      verifyToken(token)
        .then(async (val) => {
        const cart = await getCartWithProducts(val._id);
       
          const cartcount = cart.length;
  
          return res.render(render, {
            ...data,  // Spread operator to include route-specific data
            isLogged: true,
            error: req.flash("error"),
            success: req.flash("success"),
            cartcount: cartcount
          });
        })
        .catch((err) => {
          console.log(err);
  
          // Render on error or token verification failure
          return res.render(render, {
            ...data,  // Spread operator to include route-specific data
            isLogged: true,
            error: req.flash("error"),
            success: req.flash("success"),
          });
        });
    }
    // Check if the vendor is logged in
    else if (Vendordatacheck(req, res)) {
      return res.render(render, {
        ...data,  // Spread operator to include route-specific data
        isVendorLogged: true,
        error: req.flash("error"),
        success: req.flash("success"),
      });
    }
    // Default case when no one is logged in
    else {
      return res.render(render, {
        ...data,  // Spread operator to include route-specific data
        error: req.flash("error"),
        success: req.flash("success"),
      });
    }
  };
  
