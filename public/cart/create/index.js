// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem("token");
//     const cartProductId = localStorage.getItem("cartProductId");
//     const memberId = parseInt(localStorage.getItem("member_id"), 10);

//     if (!token) {
//         alert('Token is missing or invalid in localStorage');
//         return;
//     }

//     const productIdInput = document.querySelector("input[name='productId']");
//     productIdInput.value = cartProductId;

//     const form = document.querySelector('form');
//     form.onsubmit = function (e) {
//         e.preventDefault(); // prevent using the default behavior

//         const productId = parseInt(form.querySelector('input[name=productId]').value, 10);
//         const quantity = parseInt(form.querySelector('input[name=quantity]').value, 10);

//         const allInput = form.querySelectorAll('input, button[type=submit]');

//         // Disable inputs
//         allInput.forEach((input) => {
//             input.disabled = true;
//         });

//         // Check if the cart item already exists
//         fetch(`/carts/item?memberId=${memberId}&productId=${productId}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             }
//         })
//         .then(function (response) {
//             if (!response.ok) {
//                 return response.json().then((error) => {
//                     throw new Error(`Failed to retrieve cart item: ${error.error}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(function (body) {
//             const existingCartItem = body.cartItem;

//             if (existingCartItem) {
//                 // If the cart item exists, update its quantity
//                 const newQuantity = existingCartItem.quantity + quantity;
//                 return fetch(`/carts/${existingCartItem.cartItemId}`, {
//                     method: 'PUT',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         memberId: memberId,
//                         productId: productId,
//                         quantity: newQuantity,
//                     }),
//                 });
//             } else {
//                 // If the cart item does not exist, create a new one
//                 return fetch('/carts', {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         memberId: memberId,
//                         productId: productId,
//                         quantity: quantity,
//                     }),
//                 });
//             }
//         })
//         .then(function (response) {
//             return response.json(); // parse body as JSON string
//         })
//         .then(function (body) {
//             if (body.success === false && body.message) {
//                 // This is our specific case where the quantity exceeds stock
//                 alert(body.message);
//             } else {
//                 alert(`Cart item added/updated!`);
//                 // Clear inputs
//                 allInput.forEach((input) => {
//                     if (input.type !== 'submit') input.value = '';
//                 });
//             }
//         })
//         .finally(function () {
//             // Enable inputs
//             allInput.forEach((input) => {
//                 input.disabled = false;
//             });
//         })
//         .catch(function (error) {
//             console.error('Error adding/updating cart item:', error);
//             alert('An unexpected error occurred.');
//         });
//     };
// });


// ----------------------------------------------

window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const cartProductId = localStorage.getItem("cartProductId");
    const memberId = parseInt(localStorage.getItem("member_id"), 10);

    if (!token) {
        alert('Token is missing or invalid in localStorage');
        return;
    }

    const productIdInput = document.querySelector("input[name='productId']");
    productIdInput.value = cartProductId;

    const form = document.querySelector('form');
    form.onsubmit = function (e) {
        e.preventDefault(); // prevent using the default behavior

        const productId = parseInt(form.querySelector('input[name=productId]').value, 10);
        const quantity = parseInt(form.querySelector('input[name=quantity]').value, 10);

        const allInput = form.querySelectorAll('input, button[type=submit]');

        // Disable inputs
        allInput.forEach((input) => {
            input.disabled = true;
        });

        // Check if the cart item already exists
        fetch(`/carts/item?memberId=${memberId}&productId=${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            if (!response.ok) {
                return response.json().then(body => {
                    throw new Error(body.error);
                });
            }
            return response.json();
        })
        .then(function (body) {
            const existingCartItem = body.cartItem;

            if (existingCartItem) {
                // Calculate the new total quantity
                const newQuantity = existingCartItem.quantity + quantity;

                // Make a request to the server to check stock before updating the cart item
                return fetch(`/products/${productId}/check-stock`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                })
                .then(function (response) {
                    if (!response.ok) {
                        return response.json().then(body => {
                            throw new Error(body.error);
                        });
                    }
                    // If stock check passes, update the cart item
                    return fetch(`/carts/${existingCartItem.cartItemId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            memberId: memberId,
                            productId: productId,
                            quantity: newQuantity,
                        }),
                    });
                });
            } else {
                // If the cart item does not exist, create a new one after checking stock
                return fetch(`/products/${productId}/check-stock`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity })
                })
                .then(function (response) {
                    if (!response.ok) {
                        return response.json().then(body => {
                            throw new Error(body.error);
                        });
                    }
                    // If stock check passes, create the cart item
                    return fetch('/carts', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            memberId: memberId,
                            productId: productId,
                            quantity: quantity,
                        }),
                    });
                });
            }
        })
        .then(function (response) {
            if (!response.ok) {
                return response.json().then(body => {
                    throw new Error(body.error);
                });
            }

            return response.json();
        })
        .then(function (body) {
            // Clear inputs only if the operation was successful
            allInput.forEach((input) => {
                if (input.type !== 'submit') input.value = '';
            });

            alert('Cart item added/updated!');
        })
        .catch(function (error) {
            console.error('Error adding/updating cart item:', error);

            // Show a user-friendly error message if the quantity exceeds the stock
            if (error.message.includes('exceeds the available stock')) {
                alert(`Failed to add/update cart item: ${error.message}`);
            } else {
                alert('An error occurred while adding/updating the cart item.');
            }
        })
        .finally(function () {
            // Enable inputs regardless of success or failure
            allInput.forEach((input) => {
                input.disabled = false;
            });
        });
    };
});
