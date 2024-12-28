document.addEventListener("DOMContentLoaded", function() {
    var messages = document.querySelectorAll(".notify");

    setTimeout(function() {
        messages.forEach(function(message) {
            if (message.style.display !== "none") {
                message.style.display = "none";
            }
        });
    }, 3000);
});



  document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
  });


  function updateQuantity(productId, action) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityElement.innerText);
  
   
    if (action === 'increment') {
      currentQuantity++;
    } else if (action === 'decrement' && currentQuantity > 1) {
      currentQuantity--;
    }
  
   
    quantityElement.innerText = currentQuantity;
  
   
    axios.post('/users/cart/update', {
        productId: productId,
        quantity: currentQuantity
      })
      .then(response => {
        const data = response.data;
        if (data.success) {
          updateCartTotal(data.cartTotal);
          location.reload()
        } else {
          alert('Failed to update cart');
        }
      })
      .catch(error => {
        console.error('Error updating cart:', error);
      });
  }
  
  function updateCartTotal(cartTotal) {
    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.innerText = `₹ ${cartTotal.toFixed(2)}`;
    location.reload()
  }
  