const userModel = require("../models/users-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getCartWithProducts = require("../utils/getCart");

module.exports.UserRegister = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    dob,
    phone1,
    phone2,
    whatsapp,
    email,
    house_number,
    street,
    area,
    colony,
    landmark,
    city,
    state,
    pincode,
    country,
    gender,
    password,
    profile_pic,
    father_name,
    mother_name,
    father_phone,
    mother_phone,
    occupation,
    company,
    work_city,
  } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "User already exists. Please login.");
      return res.redirect("/login");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = await userModel.create({
      first_name,
      middle_name,
      last_name,
      dob,
      phone1,
      phone2,
      whatsapp,
      email,
      house_number,
      street,
      area,
      colony,
      landmark,
      city,
      state,
      pincode,
      country,
      gender,
      password: hash,
      profile_pic,
      occupation,
      company,
      work_city,
    });

    req.flash("success", "User registered successfully");
    res.redirect("/login");
  } catch (error) {
    console.error("Error in registering user", error);
    req.flash("error", "Error in registering user");
    res.redirect("/register");
  }
};

module.exports.UserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Email or password is incorrect");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Email or password is incorrect");
      return res.redirect("/login");
    }

    const token = jwt.sign({ userid: user._id, email }, "LOGIN_KEY", {
      expiresIn: "1h",
    });
    res.cookie("UserToken", token, {
      httpOnly: true,
      secure: true,
    });
    req.flash("success", "Login successful");
    res.redirect("/products");
  } catch (err) {
    console.error("Error in user login", err);
    req.flash("error", "Error in user login");
    res.redirect("/login");
  }
};

module.exports.UserLoggedOut = async (req, res) => {
  try {
    res.clearCookie("UserToken");
    req.flash("success", "Logged out successfully");
    res.redirect("/login");
  } catch (err) {
    console.error("Error in logging out", err);
    req.flash("error", "Error in logging out");
    res.redirect("/logout");
  }
};

module.exports.UserProfileUpdate = async (req, res) => {
  try {
    
    const user = await userModel.findById(req.user._id);

    const cart = await getCartWithProducts(req.user._id);
          const cartcount = cart.length;
  
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/users/profile");
    }
    res.render("./UsersFiles/Update-Profile", { user,cartcount,isLogged:true });
  } catch (err) {
    console.error("Error in user profile update", err);
    req.flash("error", "Error in user profile update");
    res.redirect("/users/profile");
  }
};



module.exports.UserProfileUpdatePost = async (req, res) => {
  try {
    const id = req.params.id;
  
    if(id=== req.user._id.toString()){

  
    const user = await userModel.findById(id);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/users/profile");
    }

    // Destructure profile update fields from the request body
    const {
      first_name,
      middle_name,
      last_name,
      dob,
      phone1,
      phone2,
      whatsapp,
      email,
      house_number,
      street,
      area,
      colony,
      landmark,
      city,
      state,
      pincode,
      country,
      gender,
      occupation,
      company,
      work_city,
    } = req.body;

    let profilePicture;

    // Check if a file was uploaded and convert it to base64
    if (req.file) {
      profilePicture = req.file.buffer.toString('base64');
      console.log("File uploaded:", req.file);
    }

    // Update the user in the database
    await userModel.findByIdAndUpdate(
      id,
      {
        first_name,
        middle_name,
        last_name,
        dob,
        phone1,
        phone2,
        whatsapp,
        email,
        house_number,
        street,
        area,
        colony,
        landmark,
        city,
        state,
        pincode,
        country,
        gender,
        profile_pic: profilePicture,
        occupation,
        company,
        work_city,
      },
      { new: true }
    );

    req.flash("success", "Profile updated successfully.");
    res.redirect("/users/profile");
  }
  else {
    req.flash("error", "Invalid request.");
    res.redirect("/users/profile");

  }

  } catch (err) {
    console.error("Error in user profile update post:", err.message);
    console.error(err.stack);
    req.flash("error", "Profile update failed due to an error.");
    res.redirect("/users/profile");
  }
};

