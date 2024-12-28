const express = require("express");
const router = express.Router();
const foodModel = require("../models/foods-model");
const { RenderMethods } = require("../services/renderMethods");
const Vendor = require("../models/vender-model");
const { isLoggedIn } = require("../middlewares/IsLoggedIn");
const getCartWithProducts = require("../utils/getCart");
const cartModel = require('../models/cart-model')

const twilio = require("twilio");
const venderModel = require("../models/vender-model");

router.get("/", (req, res) => {
  RenderMethods(req, res, "index", {});
});

router.get("/login", (req, res) => {
  RenderMethods(req, res, "login", {});
});

router.get("/menu", async (req, res) => {
  try {
    const foods = await foodModel.find().populate("vendorId");
    const menuData = { title: "Menu", foods };
    RenderMethods(req, res, "menu", menuData);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).send("Error fetching menu.");
  }
});

router.get("/contacts", (req, res) => {
  RenderMethods(req, res, "Contacts", {});
});

router.get("/search-vendors", async (req, res) => {
  const { pincode } = req.query;

  try {
    const vendors = await Vendor.find({ pincode: pincode });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vendors" });
  }
});

// Route to handle displaying a specific vendor's page
router.get("/vendor/:id", async (req, res) => {
 
  const { id } = req.params;

  try {
    const vendor = await Vendor.findById(id).populate("foodItems");
RenderMethods(req,res,"SearchedVendor", {vendor} )
    
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vendor details" });
  }
});

router.get("/checkout", isLoggedIn, async (req, res) => {
  const cart = await getCartWithProducts(req.user._id);

  const cartcount = cart.length;
  // Calculate total price
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.productId.price * item.quantity;
  });

 

  res.render("./CheckOutPage/checkOut", {
    isLogged: true,
    user: req.user,
    cart: cart,
    cartcount: cartcount,
    totalPrice: totalPrice,
  });
});


const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = twilio(accountSid, authToken);

router.post('/checkout', isLoggedIn,async (req, res) => {
  try {
    const { whatsapp } = req.body;
console.log("whatsapp ",whatsapp)
    // Fetch the user's cart
    const cart = await cartModel.findOne({ userId: req.user._id }).populate('products.productId');


    // Calculate total price
    let totalPrice = 0;
    cart.products.forEach(item => {
      totalPrice += item.productId.price * item.quantity;
    });

    console.log('total ',totalPrice)
    // Get vendor contact details for each product in the cart
    const vendorContacts = await Promise.all(cart.products.map(async (item) => {
      const vendor = await venderModel.findById(item.productId.vendorId).select('phone');
      return vendor;
    }));

    console.log("cantact :",vendorContacts)

    // Create the receipt text
    let receiptText = `Order Receipt:\n\n`;
    cart.products.forEach(item => {
      receiptText += `${item.productId.food_name} (x${item.quantity}) - $${(item.productId.price * item.quantity).toFixed(2)}\n`;
    });
    receiptText += `\nTotal: $${totalPrice.toFixed(2)}`;
    receiptText += `\n\nCustomer WhatsApp: ${whatsapp}`;

    console.log("recepit ready")

    // Send the WhatsApp message to the user
    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio WhatsApp number
      to: `whatsapp:${whatsapp}`, // User's WhatsApp number
      body: `Thank you for your order! Here is your receipt:\n\n${receiptText}`
    });
    console.log("clien send ")

    // Send a WhatsApp message to each vendor
    // await Promise.all(vendorContacts.map(async (vendor) => {
    //   if (vendor && vendor.phone) {
    //     console.log("phoen : ",vendor.phone)
       
    //   }
    // }));

    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:7054467583`, // Vendor's WhatsApp number
      body: `New Order Received! Here are the details:\n\n${receiptText}`
    });
console.log("done")
    // Send a confirmation response to the user
    req.flash('success', 'Order confirmed and receipt sent to your WhatsApp');
    res.redirect('/users/cart');
  } catch (error) {
    console.log('Error:', error);
    req.flash('error', 'Order confirmation failed');
    res.redirect('/checkout');
  }
});
module.exports = router;
