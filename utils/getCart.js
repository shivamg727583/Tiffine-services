
const Cart = require('../models/cart-model'); 
const Food = require('../models/foods-model'); 

async function getCartWithProducts(userId) {
  try {
    const cart = await Cart.findOne({ userId: userId })
      .populate({
        path: 'products.productId', 
        select: 'food_name food_description cuisine_type category price food_image vendorId' 
      })
      .exec();

     
    return cart.products;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error; 
  }
}

module.exports = getCartWithProducts; 