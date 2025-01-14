// document.addEventListener('DOMContentLoaded', function () {
//     const selectedCartItems = JSON.parse(localStorage.getItem('selectedCartItems'));

//     if (!selectedCartItems || selectedCartItems.length === 0) {
//         document.getElementById('checkout-summary').innerHTML = '<p>No items selected for checkout.</p>';
//         return;
//     }

//     displaySelectedItems(selectedCartItems);

//     document.getElementById('confirm-checkout-button').addEventListener('click', function() {
//         confirmCheckout(selectedCartItems);
//     });
// });

// function displaySelectedItems(selectedCartItems) {
//     const checkoutTableBody = document.querySelector("#checkout-items-tbody");
//     checkoutTableBody.innerHTML = '';

//     let totalPrice = 0;
//     const promotionType = "Black Friday"; // Example promotion type
//     const discountRate = 0.10; // Example: 10% discount

//     selectedCartItems.forEach(item => {

//         const description = item.description;
//         const unitPrice = parseFloat(item.unitPrice);
//         const quantity = parseInt(item.quantity);
//         const discount = unitPrice * discountRate * quantity;
//         const subtotal = (unitPrice * quantity) - discount;
//         totalPrice += subtotal;

//         const row = `
//             <tr>
//                 <td>${description}</td>
//                 <td>$${unitPrice.toFixed(2)}</td>
//                 <td>${quantity}</td>
//                 <td>-$${discount.toFixed(2)}</td>
//                 <td>$${subtotal.toFixed(2)}</td>
//             </tr>
//         `;
//         checkoutTableBody.innerHTML += row;
//     });

//     const totalRow = `
//         <tr>
//             <td colspan="4"><strong>Total Price:</strong></td>
//             <td><strong>$${totalPrice.toFixed(2)}</strong></td>
//         </tr>
//     `;
//     checkoutTableBody.innerHTML += totalRow;
// }

// function confirmCheckout(selectedCartItems) {
//     const token = localStorage.getItem("token");

//     fetch('/checkout', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ items: selectedCartItems })
//     })
//     .then(function(response) {
//         if (!response.ok) {
//             return response.json().then(body => {
//                 throw new Error(body.error);
//             });
//         }
//         return response.json();
//     })
//     .then(function(data) {
//         if (data.outOfStockItems && data.outOfStockItems.length > 0) {
//             alert(`Checkout completed, but the following items were out of stock: ${data.outOfStockItems.join(', ')}`);
//         } else {
//             alert('Checkout completed successfully.');
//         }
//         // Redirect to confirmation or order history
//         window.location.href = '/checkout/confirmation.html';
//     })
//     .catch(function(error) {
//         console.error('Error during checkout:', error);
//         alert('An error occurred during checkout. Please try again.');
//     });
// }

// ---------------------------------------------------
function bulkDelete(token) {
    const deletions = [];
    const cartItemsString = localStorage.getItem('selectedCartItems');
    
    // Parse the string into an array
    const cartItems = JSON.parse(cartItemsString);
    
    console.log('cart items: ', cartItems);
    
    // Check if cartItems is an array
    if (Array.isArray(cartItems)) {
        cartItems.forEach(function (item) {
            const cartItemId = item.cartItemId;
            deletions.push(cartItemId);
        });

        return Promise.all(
            deletions.map(cartItemId =>
                fetch(`/carts/${cartItemId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            )
        )
        .then(() => {
            alert('Items deleted');
            return true;
        })
        .catch(error => {
            console.error('Error deleting cart items:', error);
            return false;
        });
    } else {
        console.error('Selected cart items is not an array');
        return Promise.resolve(false);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const selectedCartItems = JSON.parse(localStorage.getItem('selectedCartItems'));
    const token = localStorage.getItem("token");

    if (!selectedCartItems || selectedCartItems.length === 0) {
        document.getElementById('checkout-summary').innerHTML = '<p>No items selected for checkout.</p>';
        return;
    }

    fetchProductDetailsForSelectedItems(selectedCartItems)
        .then(function (itemsWithDetails) {
            displaySelectedItems(itemsWithDetails);
        });

    document.getElementById('confirm-checkout-button').addEventListener('click', function() {
        alert("Thank you for purchasing");
        
        bulkDelete(token).then(deletionSuccessful => {
            if (deletionSuccessful) {
                window.location.href = "/cart/retrieve/all/index.html";
            }
        });
    });
});





function fetchProductDetailsForSelectedItems(selectedCartItems) {
    return Promise.all(selectedCartItems.map(async item => {
        const token = localStorage.getItem("token");
        const productId = item.productId;

        const response = await fetch(`/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const body = await response.json();
        const product = body.product;

        return {
            ...item,
            product
        };
    }));
}

function displaySelectedItems(selectedCartItems) {
    const checkoutTableBody = document.querySelector("#checkout-items-tbody");
    checkoutTableBody.innerHTML = '';

    let totalPrice = 0;
    const promotionType = "Black Friday"; // Example promotion type
    const discountRate = 0.10; // Example: 10% discount

    selectedCartItems.forEach(item => {
        const product = item.product;

        if (!product) {
            console.error("Product details are missing for cart item:", item);
            return; // Skip this item if product details are missing
        }

        const description = product.description || "No description available";
        const unitPrice = parseFloat(product.unitPrice) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const discount = unitPrice * discountRate * quantity;
        const subtotal = (unitPrice * quantity) - discount;
        totalPrice += subtotal;

        const row = `
            <tr>
                <td>${description}</td>
                <td>$${unitPrice.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>-$${discount.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
        checkoutTableBody.innerHTML += row;
    });

    const totalRow = `
        <tr>
            <td colspan="4"><strong>Total Price:</strong></td>
            <td><strong>$${totalPrice.toFixed(2)}</strong></td>
        </tr>
    `;
    checkoutTableBody.innerHTML += totalRow;
}

// function confirmCheckout(selectedCartItems) {
//     const token = localStorage.getItem("token");

//     fetch('/checkout', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ items: selectedCartItems })
//     })
//     .then(function(response) {
//         if (!response.ok) {
//             return response.json().then(body => {
//                 throw new Error(body.error);
//             });
//         }
//         return response.json();
//     })
//     .then(function(data) {
//         if (data.outOfStockItems && data.outOfStockItems.length > 0) {
//             alert(`Checkout completed, but the following items were out of stock: ${data.outOfStockItems.join(', ')}`);
//         } else {
//             alert('Checkout completed successfully.');
//         }
//         window.location.href = '/checkout/confirmation.html';
//     })
//     .catch(function(error) {
//         console.error('Error during checkout:', error);
//         alert('An error occurred during checkout. Please try again.');
//     });
// }

function confirmCheckout(selectedCartItems) {
    const token = localStorage.getItem("token");

    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: selectedCartItems })
    })
    .then(function(response) {
        if (!response.ok) {
            return response.json().then(body => {
                throw new Error(body.error);
            });
        }
        return response.json();
    })
    .then(function(data) {
        if (data.outOfStockItems && data.outOfStockItems.length > 0) {
            alert(`Checkout completed, but the following items were out of stock: ${data.outOfStockItems.join(', ')}`);
        } else {
            alert('Checkout completed successfully.');
        }

        // Clear the items from the cart
        clearCartItems(selectedCartItems);
    })
    .catch(function(error) {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout. Please try again.');
    });
}

function clearCartItems(selectedCartItems) {
    const token = localStorage.getItem("token");

    Promise.all(selectedCartItems.map(item => {
        return fetch(`/carts/${item.cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }))
    .then(() => {
        alert('Cart cleared successfully!');
        window.location.href = '/cart/retrieve/all/index.html';  // Redirect back to the cart page
    })
    .catch(error => {
        console.error('Error clearing cart items:', error);
        alert('An error occurred while clearing the cart. Please try again.');
    });
}
