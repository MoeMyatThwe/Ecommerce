
function fetchCartItems(token) {
    return fetch('/carts', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            if (body.error) throw new Error(body.error);
            const cartItems = body.cartItems;
            const tbody = document.querySelector("#cart-items-tbody");
            tbody.innerHTML = ''; // Clear existing items
            cartItems.forEach(function (cartItem) {
                const row = document.createElement("tr");
                row.classList.add("product");
                row.dataset.cartItemId = cartItem.cartItemId; // Store cartItemId
                row.dataset.productId = cartItem.product.id;  // Store productId

                const descriptionCell = document.createElement("td");
                const countryCell = document.createElement("td");
                const quantityCell = document.createElement("td");
                const unitPriceCell = document.createElement("td");
                const subTotalCell = document.createElement("td");
                const updateButtonCell = document.createElement("td");
                const deleteButtonCell = document.createElement("td");
                const checkboxCell = document.createElement("td");
                const updateButton = document.createElement("button");
                const deleteButton = document.createElement("button");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("select-cart-item");

                descriptionCell.textContent = cartItem.product.description;
                countryCell.textContent = cartItem.product.country;
                unitPriceCell.textContent = cartItem.product.unitPrice;
                updateButtonCell.appendChild(updateButton);
                deleteButtonCell.appendChild(deleteButton);
                checkboxCell.appendChild(checkbox);

                // Make quantityCell an editable input field
                const quantityInput = document.createElement("input");
                quantityInput.type = "number";
                quantityInput.value = cartItem.quantity;
                quantityInput.addEventListener("input", function () {
                    // Only allow numeric values
                    this.value = this.value.replace(/[^0-9]/g, "");
                });
                quantityCell.appendChild(quantityInput);
                subTotalCell.textContent = cartItem.product.unitPrice * cartItem.quantity;

                updateButton.textContent = "Update";
                deleteButton.textContent = "Delete";

                // Add event listener to updateButton
                updateButton.addEventListener("click", function () {
                    const updatedQuantity = quantityInput.value;
                    const updatedCartItem = {
                        quantity: Number(updatedQuantity),
                        productId: cartItem.productId // Add the missing value for 'productId'
                    };

                    fetch(`/carts/${cartItem.cartItemId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedCartItem)
                    })
                        .then(function (response) {
                            if (!response.ok) throw new Error('Failed to update cart item');
                            location.reload();
                        })
                        .catch(function (error) {
                            console.error('Error updating cart item:', error);
                        });
                });

                // Add event listener to deleteButton
                deleteButton.addEventListener("click", function () {
                    fetch(`/carts/${cartItem.cartItemId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(function (response) {
                            if (!response.ok) throw new Error('Failed to delete cart item');
                            location.reload();
                        })
                        .catch(function (error) {
                            console.error('Error deleting cart item:', error);
                        });
                });

                row.appendChild(checkboxCell);
                row.appendChild(descriptionCell);
                row.appendChild(countryCell);
                row.appendChild(subTotalCell);
                row.appendChild(unitPriceCell);
                row.appendChild(quantityCell);
                row.appendChild(updateButtonCell);
                row.appendChild(deleteButtonCell);

                tbody.appendChild(row);
            });
        })
        .catch(function (error) {
            console.error('Error retrieving cart items:', error);
        });
}

function fetchCartSummary(token) {
    return fetch('/carts/summary', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            if (body.error) throw new Error(body.error);
            const cartSummary = body.cartSummary;
            const cartSummaryDiv = document.querySelector("#cart-summary");
            cartSummaryDiv.innerHTML = ''; // Clear existing summary
            const cartSummaryLabel1 = document.createElement("label");
            cartSummaryLabel1.textContent = "Total Quantity: ";
            cartSummaryLabel1.classList.add("label");
            const cartSummaryValue1 = document.createElement("span");
            cartSummaryValue1.textContent = cartSummary.totalQuantity;
            cartSummaryValue1.classList.add("value");
            const cartSummaryLabel2 = document.createElement("label");
            cartSummaryLabel2.textContent = "Total Checkout Price: ";
            cartSummaryLabel2.classList.add("label");
            const cartSummaryValue2 = document.createElement("span");
            cartSummaryValue2.textContent = cartSummary.totalPrice;
            cartSummaryValue2.classList.add("value");
            const cartSummaryLabel3 = document.createElement("label");
            cartSummaryLabel3.textContent = "Total Unique Products: ";
            cartSummaryLabel3.classList.add("label");
            const cartSummaryValue3 = document.createElement("span");
            cartSummaryValue3.textContent = cartSummary.totalProduct;
            cartSummaryValue3.classList.add("value");

            cartSummaryDiv.appendChild(cartSummaryLabel1);
            cartSummaryDiv.appendChild(cartSummaryValue1);
            cartSummaryDiv.appendChild(document.createElement("br"));
            cartSummaryDiv.appendChild(cartSummaryLabel2);
            cartSummaryDiv.appendChild(cartSummaryValue2);
            cartSummaryDiv.appendChild(document.createElement("br"));
            cartSummaryDiv.appendChild(cartSummaryLabel3);
            cartSummaryDiv.appendChild(cartSummaryValue3);
        })
        .catch(function (error) {
            console.error('Error retrieving cart summary:', error);
        });
}

// function bulkUpdate(token) {
//     const checkboxes = document.querySelectorAll(".select-cart-item:checked");
//     const updates = [];

//     checkboxes.forEach(function (checkbox) {
//         const row = checkbox.closest("tr");
//         const cartItemId = row.dataset.cartItemId;
//         const quantity = row.querySelector("input[type='number']").value;

//         updates.push({
//             cartItemId: Number(cartItemId),
//             quantity: Number(quantity)
//         });
//     });

//     Promise.all(
//         updates.map(update => 
//             fetch(`/carts/${update.cartItemId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({ quantity: update.quantity })
//             })
//         )
//     )
//     .then(() => {
//         location.reload();
//     })
//     .catch(error => {
//         console.error('Error updating cart items:', error);
//     });
// }

// function bulkDelete(token) {
//     const checkboxes = document.querySelectorAll(".select-cart-item:checked");
//     const deletions = [];

//     checkboxes.forEach(function (checkbox) {
//         const row = checkbox.closest("tr");
//         const cartItemId = row.dataset.cartItemId;

//         deletions.push(cartItemId);
//     });

//     Promise.all(
//         deletions.map(cartItemId =>
//             fetch(`/carts/${cartItemId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//         )
//     )
//     .then(() => {
//         location.reload();
//     })
//     .catch(error => {
//         console.error('Error deleting cart items:', error);
//     });
// }

function bulkUpdate(token) {
    const checkboxes = document.querySelectorAll(".select-cart-item:checked");
    const updates = [];

    checkboxes.forEach(function (checkbox) {
        const row = checkbox.closest("tr");
        const cartItemId = row.dataset.cartItemId;
        const quantity = row.querySelector("input[type='number']").value;

        updates.push({
            cartItemId: Number(cartItemId),
            quantity: Number(quantity)
        });
    });

    fetch('/carts/bulk-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ updates: updates })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error updating cart items:', data.error);
            alert('Failed to update cart items.');
        } else {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error updating cart items:', error);
        alert('Failed to update cart items.');
    });
}

function bulkDelete(token) {
    const checkboxes = document.querySelectorAll(".select-cart-item:checked");
    const deletions = [];

    checkboxes.forEach(function (checkbox) {
        const row = checkbox.closest("tr");
        const cartItemId = row.dataset.cartItemId;

        deletions.push(Number(cartItemId));
    });

    fetch('/carts/bulk-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartItemIds: deletions })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error deleting cart items:', data.error);
            alert('Failed to delete cart items.');
        } else {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error deleting cart items:', error);
        alert('Failed to delete cart items.');
    });
}


window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    fetchCartItems(token)
        .then(function () {
            return fetchCartSummary(token);
        });

    document.querySelector("#bulk-update").addEventListener("click", () => bulkUpdate(token));
    document.querySelector("#bulk-delete").addEventListener("click", () => bulkDelete(token));

    document.querySelector("#selectAll").addEventListener("change", function() {
        const checkboxes = document.querySelectorAll(".select-cart-item");
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
    });
});

// ----------------- Cart Page: for Checkout Process -----------------
document.getElementById('checkout-button').addEventListener('click', function() {
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("member_id");

    if (!token || !memberId) {
        alert('Please log in before checking out.');
        return;
    }

    const selectedItems = Array.from(document.querySelectorAll(".select-cart-item:checked"))
        .map(checkbox => {
            const row = checkbox.closest("tr");
            return {
                cartItemId: row.dataset.cartItemId,
                productId: row.dataset.productId,
                quantity: row.querySelector("input[type='number']").value,
                unitPrice: parseFloat(row.querySelector("td:nth-child(5)").textContent.trim()) 
            };
        });

    if (selectedItems.length === 0) {
        alert("Please select at least one item to checkout.");
        return;
    }

    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));

    window.location.href = '/checkout/index.html';
});

// // //-------------------------------------------------------------------
// // // -----------------------------------------------------

