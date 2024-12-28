const vendorModel = require("../models/vender-model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Ensure this is used in your app


module.exports.VendorRegister = async (req, res) => {
  const {
    business_name,
    owner_name,
    phone,
    email,
    state,
    address,
    city,
    pincode,
    experience,
    cuisine,
    country,
    gst_number,
    business_license,
    password,
  } = req.body;

  try {
    // Check if vendor already exists
    let vendor = await vendorModel.findOne({ email });
    if (vendor) {
      req.flash('error',"Vendor already Exists")
      return res.redirect('/login');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new vendor
    vendor = await vendorModel.create({
      business_name,
      owner_name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      experience,
      cuisine,
      country,
      gst_number,
      business_license,
      password: hashedPassword,
    });

    console.log("Vendor registered successfully");
    req.flash('success',"Vendor registered successfully🎉🎉")
    res.redirect("/vendors/login");
  } catch (error) {
    
    req.flash('error',"Error registering vendor")
    res.redirect('/users/register');
  }
};

module.exports.VendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let vendor = await vendorModel.findOne({ email });
    if (!vendor) {
      req.flash('error',"email or password wrong")
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      req.flash('error',"Email or Password incorrect")
      return res.redirect('/login');
    }

    const token = jwt.sign({ vendorid: vendor._id, email: vendor.email }, "VENDOR_KEY", { expiresIn: '1h' });

    res.cookie('VendorToken', token, {
      httpOnly: true, // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
      maxAge: 3600000 // 1 hour
    });
req.flash("success","Vendor login successfully🎉")
    res.redirect('/vendors/dashboard');
  } catch (error) {
   req.flash("error","login error=Server error")
    res.redirect('/vendors/login?error=Server error');
  }
};




module.exports.VendorLogOut = (req,res)=>{
  req.flash("success","You are loggedOut")
  res.clearCookie('VendorToken');
  res.redirect('/vendors/login');
}


module.exports.VendorEditProfile = async (req, res) => {
  const {
      business_name,
      owner_name,
      phone,
      email,
      state,
      address,
      city,
      pincode,
      experience,
      cuisine,
      country,
      gst_number,
      business_license,
  } = req.body;

  let profilePicture;

  // Check if a file was uploaded and convert it to base64
  if (req.file) {
      profilePicture = req.file.buffer.toString('base64');
  }

  const vendorId = req.vendor._id;

  try {
      // Find the vendor by ID
      const vendor = await vendorModel.findById(vendorId);

      // Update only the fields that have new values
      if (!vendor) {
        req.flash("error","Failed in updation")
          return res.redirect('/vendors/profile');
      }

      vendor.business_name = business_name || vendor.business_name;
      vendor.owner_name = owner_name || vendor.owner_name;
      vendor.phone = phone || vendor.phone;
      vendor.email = email || vendor.email;
      vendor.state = state || vendor.state;
      vendor.address = address || vendor.address;
      vendor.city = city || vendor.city;
      vendor.pincode = pincode || vendor.pincode;
      vendor.experience = experience || vendor.experience;
      vendor.cuisine = cuisine || vendor.cuisine;
      vendor.country = country || vendor.country;
      vendor.gst_number = gst_number || vendor.gst_number;
      vendor.business_license = business_license || vendor.business_license;
      if (profilePicture) {
          vendor.profilePicture = profilePicture;
      }

      // Save the updated vendor document
      await vendor.save();
req.flash("success","Your profile updated successfully🎉")
      res.redirect('/vendors/profile');
  } catch (error) {
 req.flash("error","Error in profile updation")
      res.redirect('/vendors/profile')
  }
};

