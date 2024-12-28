const express = require("express");
const router = express.Router();
const FoodModel = require("../models/foods-model");
const userModel = require("../models/users-model");
const  getCartWithProducts  = require("../utils/getCart");
const cartModel = require("../models/cart-model");




// Route to add an item to the cart
router.get("/addToCart/:id", async (req, res) => {
  try {
    const user = req.user;
    const foodId = req.params.id;

    if (!user || !foodId) {
      req.flash("error", "Invalid user or item ID");
      return res.redirect("/menu");
    }

    const preuser = await cartModel.findOne({ userId: user._id });

    if (preuser) {
      const products = preuser.products;
      const product = products.find( (product) => product.productId.toString() === foodId);
      if (product) {
        product.quantity += 1;
        await preuser.save();
      }
      else {
        products.push({ productId: foodId, quantity: 1 });
        await preuser.save();
        }
    
    }

      else {
        const cart = await cartModel.create({
          userId: user._id,
          products: [{ productId: foodId }],
        });

        await cart.save();
      }
    
    req.flash("success", "Added to cart");
    res.redirect("/menu");
  } catch (err) {
    console.error("Error adding to cart:", err);
    req.flash("error", "Failed to add to cart");
    res.redirect("/menu");
  }
});

router.get("/cart", async (req, res) => {
    try {
     
      const user = await userModel.findOne({ email: req.user.email });
      
      if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/menu"); 
      }
     
    const cart = await getCartWithProducts(user._id);
      
      if (!cart) {
        req.flash("error", "Cart not found");
        return res.redirect("/menu"); 
      }


      res.render("./UsersFiles/carts", {
        isLogged: true, 
        error: req.flash("error"), 
        success: req.flash("success"), 
        user: req.user,
        cart: cart, 
        cartcount: cart.length, 
      });
    } catch (err) {
      // Catch any errors and flash an error message, then redirect to the menu page
      console.error("Error fetching cart:", err);
      req.flash("error", "Failed to load cart");
      res.redirect("/menu");
    }
  });
  

  router.post("/cart/remove/:id", async (req, res) => {
    try {
      const id = req.params.id; // The ID of the product to remove
      const user = await userModel.findOne({ email: req.user.email });
  
      if (!user) {
        req.flash("error", "Please login");
        return res.status(404).redirect("/users/cart");
      }
  
      let cartItem = await cartModel.findOne({ userId: req.user._id });
  
      if (!cartItem) {
        req.flash("error", "Cart item not found");
        return res.status(404).redirect("/users/cart");
      }
  
      // Filter out the product based on productId, not _id
      cartItem.products = cartItem.products.filter((item) => item.productId.toString() !== id);
  
      // Save the updated cart document
      await cartItem.save();
  console.log(cartItem)
      req.flash("success", "Removed item from cart");
      return res.status(201).redirect("/users/cart");
    } catch (error) {
      console.log("err", error);
      req.flash("error", "Cart removal failed");
      return res.redirect("/users/cart");
    }
  });
  
  

router.post("/cart/update", async (req, res) => {
  const { productId, quantity } = req.body;

  console.log("Id - ", productId);

  if (!req.user) {
    return res.status(400).json({ success: false, message: "Cart not found" });
  }

  // Fetch cart items (including products) for the user
  const cartItem = await getCartWithProducts(req.user._id);

  if (!cartItem) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  }

  // Filter to find the specific product in the cart
  const filtered = cartItem.filter((e) => {
    return e.productId._id.toString() === productId.toString();
  });

  if (filtered.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  }

  // Update the quantity of the product
  filtered[0].quantity = quantity;

  // Save updated cart item back to the database
  await cartModel.updateOne(
    { userId: req.user._id, "products.productId": productId },
    { $set: { "products.$.quantity": quantity } }
  );
  console.log('updated')

  req.flash("success", "Quantity updated");

  // Calculate the new total
  let cartTotal = 0;
  cartItem.forEach((item) => {
    cartTotal += item.productId.price * item.quantity;
  });

  return res.json({ success: true, cartTotal });
});


module.exports = router;
