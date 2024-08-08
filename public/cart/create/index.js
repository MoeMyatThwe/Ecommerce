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


//         //  -------------------for updating quantity for adding same item into cart
            
//         // Check if the cart item already exists
//         fetch(`/carts?memberId=${memberId}&productId=${productId}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization' : `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             }
//         })
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (body) {
//             if (body.error) throw new Error (body.error);
//             const existingCartItem = body.cartItem;

//             if (existingCartItem) {
//                 // If the cart item exists, update its quantity
//                 const newQuantity = existingCartItem.quantity + quantity;
//                 return fetch(`/carts`, {
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
        
//         return fetch('/carts', {
//             method: 'POST',
//             headers: {
//                 'Authorization' : `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 memberId: memberId,
//                 productId: productId,
//                 quantity: quantity,
//             }),
//         });
//     }
// })
// .then(function (response) {
//     if (response.status !== 201 && response.status !== 200) return response.json(); // parse body as JSON string

//     // Clear inputs
//     allInput.forEach((input) => {
//         if (input.type !== 'submit') input.value = '';
//     });

//     alert(`Cart item added/updated!`);

//     return null;
// })
// .then(function (body) {
//     if (!body) return;
//     alert(body.error);
// })
// .finally(function () {
//     // Enable inputs
//     allInput.forEach((input) => {
//         input.disabled = false;
//     });
// })
// .catch(function (error) {
//     console.error(error);
//     alert('Error adding/updating cart item');
// });
// };
// });


// --------------------------------------
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
                return response.json().then((error) => {
                    throw new Error(`Failed to retrieve cart item: ${error.error}`);
                });
            }
            return response.json();
        })
        .then(function (body) {
            const existingCartItem = body.cartItem;

            if (existingCartItem) {
                // If the cart item exists, update its quantity
                const newQuantity = existingCartItem.quantity + quantity;
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
            } else {
                // If the cart item does not exist, create a new one
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
            }
        })
        .then(function (response) {
            if (response.status !== 201 && response.status !== 200) return response.json(); // parse body as JSON string

            // Clear inputs
            allInput.forEach((input) => {
                if (input.type !== 'submit') input.value = '';
            });

            alert(`Cart item added/updated!`);

            return null;
        })
        .then(function (body) {
            if (!body) return;
            alert(body.error);
        })
        .finally(function () {
            // Enable inputs
            allInput.forEach((input) => {
                input.disabled = false;
            });
        })
        .catch(function (error) {
            console.error('Error adding/updating cart item:', error);
            alert('Error adding/updating cart item');
        });
    };
});
