const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/admin-model");
const jwt = require("jsonwebtoken");
const { adminLoggedIn } = require("../middlewares/adminLogged");
const VendorModel = require('../models/vender-model');
const UserModel = require('../models/users-model');
const FoodModel = require('../models/foods-model')

router.get("/", adminLoggedIn,async (req, res) => {
  try {
  const admin = req.user;
  const vendors = await VendorModel.find().populate('foodItems');
  const users = await UserModel.find().populate('cart');

  res.render("./Admin/admin",{
    adminLogged:true,
    admin,
    vendors,
    users,
    success:req.flash('success'),
    error:req.flash('error'),
  });
  } catch (error) {
    console.log(error);
    req.flash("error","Server failed");
    res.redirect('/admin/login');
  }
});

router.get("/login", (req, res) => {
  res.render("./Admin/login", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});
router.get("/signup", (req, res) => {
  res.render("./Admin/signup", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

router.post("/signup-admin", async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      req.flash("error", "Admin already exists with this email");
      return res.redirect("/admin/signup");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new admin instance
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    // Save the new admin to the database
    await newAdmin.save();

    req.flash("success", "Admin register successfully");
    res.redirect("/admin/login");
  } catch (error) {
    console.error("Error during admin registration:", error);
    req.flash("error", "Admin register failed");
    res.redirect("/admin/signup");
  }
});

router.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      "JWT_SECRET",
      { expiresIn: "1h" } // Token valid for 1 hour
    );
    req.flash("success", "Admin Login successfully!");
    res.cookie("AdminToken", token);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "Admin Login failed");
    res.redirect("/admin/login");
  }
});

router.get('/manage-foods',adminLoggedIn,async (req,res)=>{
  const vendors = await VendorModel.find().populate('foodItems');

  res.render('./Admin/manage-foods',{
vendors,
adminLogged:true,
success:req.flash('success'),
error:req.flash('error'),
  });
})

router.get('/delete-food/:id',adminLoggedIn, async (req,res)=>{
 try{
  const id = req.params.id;
  await FoodModel.findByIdAndDelete(id);
  req.flash('success',"FoodItem delete successFully")
  res.redirect('/admin/manage-foods');
 }
 catch(err){
  console.log(err);
  req.flash('error',"Food deletion Failed")
  res.redirect('/admin/manage-foods')
 }

})

router.get('/manage-users',adminLoggedIn,async (req,res)=>{
  const users = await UserModel.find().populate('cart');

  res.render('./Admin/manage-users',{
users,
adminLogged:true,
success:req.flash('success'),
error:req.flash('error'),
  });
})

router.get('/delete-user/:id',adminLoggedIn, async (req,res)=>{
  try{
   const id = req.params.id;
   await UserModel.findByIdAndDelete(id);
   req.flash('success',"User delete successFully")
   res.redirect('/admin/manage-users');
  }
  catch(err){
   console.log(err);
   req.flash('error',"User deletion Failed")
   res.redirect('/admin/manage-users')
  }
 
 })
 

 router.get('/logout',(req,res)=>{
try {
 res.cookie('AdminToken','')
  req.flash('success',"Logged out Successfully");
  res.redirect('/');
} catch (error) {
  console.log(error);
  req.flash('error',"Logged out Failed");
  res.redirect('/admin');
}

 })

 router.get('/profile',adminLoggedIn,(req,res)=>{
  res.render('./Admin/admin-profile',{
    adminLogged:true,
    success:req.flash('success'),
    error:req.flash('error'),
    admin:req.user
 })
 });

module.exports = router;
