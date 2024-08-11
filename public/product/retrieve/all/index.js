// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem("token");

//     fetch('/products', {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (body) {
//             if (body.error) throw new Error(body.error);
//             const products = body.products;
//             const tbody = document.querySelector("#product-tbody");
//             products.forEach(function (product) {
//                 const row = document.createElement("tr");
//                 row.classList.add("product");
//                 const nameCell = document.createElement("td");
//                 const descriptionCell = document.createElement("td");
//                 const unitPriceCell = document.createElement("td");
//                 const countryCell = document.createElement("td");
//                 const productTypeCell = document.createElement("td");
//                 const imageUrlCell = document.createElement("td");
//                 const manufacturedOnCell = document.createElement("td");
//                 const viewProductCell = document.createElement("td");
//                 const addFavouriteCell = document.createElement("td");
//                 const addToCartCell = document.createElement("td");
                
//                 nameCell.textContent = product.name
//                 descriptionCell.textContent = product.description;
//                 unitPriceCell.textContent = product.unitPrice;
//                 countryCell.textContent = product.country;
//                 productTypeCell.textContent = product.productType;
//                 imageUrlCell.innerHTML = `<img src="${product.imageUrl}" alt="Product Image">`;
//                 manufacturedOnCell.textContent = new Date(product.manufacturedOn).toLocaleString();


//                 const viewProductButton = document.createElement("button");
//                 viewProductButton.textContent = "View Product";
//                 viewProductButton.addEventListener('click', function () {
//                     localStorage.setItem("productId", product.id);
//                     window.location.href = `/product/retrieve`;
//                 });

//                 viewProductCell.appendChild(viewProductButton);
//                 const addFavouriteButton = document.createElement("button");
//                 addFavouriteButton.textContent = "Add To Favourite";
//                 addFavouriteButton.addEventListener('click', async function (e) {
//                     e.preventDefault();
//                     localStorage.setItem("favouriteProductId", product.id);
//                     window.location.href = `/favourite/create`;
//                     try {
//                     const response = await fetch('/', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                             'Authorization': `Bearer ${token}`
//                         },
//                         body: JSON.stringify({ productId: product.id })
//                     });
//                     if (!response.ok) {
//                         throw new Error('Failed to add favourite');
//                     }
                
//                 } catch (error) {
//                     console.error(error);
//                     // Handle error appropriately, e.g., show an error message to the user
//                 }
//             });

//                 addFavouriteCell.appendChild(addFavouriteButton);
//                 const addToCartButton = document.createElement("button");
//                 addToCartButton.textContent = "Add to Cart";
//                 addToCartButton.addEventListener('click', function () {
//                     localStorage.setItem("cartProductId", product.id);
//                     window.location.href = `/cart/create`;
//                 });

            

//                 addToCartCell.appendChild(addToCartButton);
//                 row.appendChild(nameCell);
//                 row.appendChild(descriptionCell);
//                 row.appendChild(unitPriceCell);
//                 row.appendChild(countryCell);
//                 row.appendChild(productTypeCell);
//                 row.appendChild(imageUrlCell);
//                 row.appendChild(manufacturedOnCell);
//                 row.appendChild(viewProductCell);
//                 row.appendChild(addFavouriteCell);
//                 row.appendChild(addToCartCell);
//                 tbody.appendChild(row);
//             });
//         })
//         .catch(function (error) {
//             console.error(error);
//         });
// });

// ------------------------------------
window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    // Fetch and display products
    fetch('/products', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (body) {
        if (body.error) throw new Error(body.error);
        const products = body.products;
        const tbody = document.querySelector("#product-tbody");
        tbody.innerHTML = ''; // Clear existing items

        products.forEach(function (product) {
            const row = document.createElement("tr");
            row.classList.add("product");

            const checkboxCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("select-product-item");
            checkboxCell.appendChild(checkbox);

            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const unitPriceCell = document.createElement("td");
            const countryCell = document.createElement("td");
            const productTypeCell = document.createElement("td");
            const imageUrlCell = document.createElement("td");
            const manufacturedOnCell = document.createElement("td");
            const viewProductCell = document.createElement("td");
            const addFavouriteCell = document.createElement("td");
            const addToCartCell = document.createElement("td");

            nameCell.textContent = product.name;
            descriptionCell.textContent = product.description;
            unitPriceCell.textContent = product.unitPrice;
            countryCell.textContent = product.country;
            productTypeCell.textContent = product.productType;
            imageUrlCell.innerHTML = `<img src="${product.imageUrl}" alt="Product Image">`;
            manufacturedOnCell.textContent = new Date(product.manufacturedOn).toLocaleString();

            const viewProductButton = document.createElement("button");
            viewProductButton.textContent = "View Product";
            viewProductButton.addEventListener('click', function () {
                localStorage.setItem("productId", product.id);
                window.location.href = `/product/retrieve`;
            });

            viewProductCell.appendChild(viewProductButton);

            const addFavouriteButton = document.createElement("button");
            addFavouriteButton.textContent = "Add To Favourite";
            addFavouriteButton.addEventListener('click', async function (e) {
                e.preventDefault();
                localStorage.setItem("favouriteProductId", product.id);
                window.location.href = `/favourite/create`;
                try {
                    const response = await fetch('/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ productId: product.id })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to add favourite');
                    }
                
                } catch (error) {
                    console.error(error);
                }
            });

            addFavouriteCell.appendChild(addFavouriteButton);

            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener('click', function () {
                localStorage.setItem("cartProductId", product.id);
                window.location.href = `/cart/create`;
            });

            addToCartCell.appendChild(addToCartButton);

            row.appendChild(checkboxCell);
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(unitPriceCell);
            row.appendChild(countryCell);
            row.appendChild(productTypeCell);
            row.appendChild(imageUrlCell);
            row.appendChild(manufacturedOnCell);
            row.appendChild(viewProductCell);
            row.appendChild(addFavouriteCell);
            row.appendChild(addToCartCell);
            tbody.appendChild(row);
        });

        // Add "Select All" functionality
        const selectAllCheckbox = document.getElementById("selectAll");
        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".select-product-item");
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        });
    })
    .catch(function (error) {
        console.error(error);
    });
});

// // -------------------------bulk add to cart-------
window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("member_id"); // Make sure memberId is stored in localStorage

    fetch('/products', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (body) {
        if (body.error) throw new Error(body.error);
        const products = body.products;
        const tbody = document.querySelector("#product-tbody");

        products.forEach(function (product) {
            const row = document.createElement("tr");
            row.classList.add("product");
            row.dataset.productId = product.id;

            const checkboxCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("select-product-item");

            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const unitPriceCell = document.createElement("td");
            const countryCell = document.createElement("td");
            const productTypeCell = document.createElement("td");
            const imageUrlCell = document.createElement("td");
            const manufacturedOnCell = document.createElement("td");
            const viewProductCell = document.createElement("td");
            const addFavouriteCell = document.createElement("td");
            const addToCartCell = document.createElement("td");

            nameCell.textContent = product.name;
            descriptionCell.textContent = product.description;
            unitPriceCell.textContent = product.unitPrice;
            countryCell.textContent = product.country;
            productTypeCell.textContent = product.productType;
            imageUrlCell.innerHTML = `<img src="${product.imageUrl}" alt="Product Image">`;
            manufacturedOnCell.textContent = new Date(product.manufacturedOn).toLocaleString();

            const viewProductButton = document.createElement("button");
            viewProductButton.textContent = "View Product";
            viewProductButton.addEventListener('click', function () {
                localStorage.setItem("productId", product.id);
                window.location.href = `/product/retrieve`;
            });

            viewProductCell.appendChild(viewProductButton);

            const addFavouriteButton = document.createElement("button");
            addFavouriteButton.textContent = "Add To Favourite";
            addFavouriteButton.addEventListener('click', async function (e) {
                e.preventDefault();
                localStorage.setItem("favouriteProductId", product.id);
                window.location.href = `/favourite/create`;
            });

            addFavouriteCell.appendChild(addFavouriteButton);

            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener('click', function () {
                localStorage.setItem("cartProductId", product.id);
                window.location.href = `/cart/create`;
            });

            addToCartCell.appendChild(addToCartButton);
            checkboxCell.appendChild(checkbox);

            row.appendChild(checkboxCell);
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(unitPriceCell);
            row.appendChild(countryCell);
            row.appendChild(productTypeCell);
            row.appendChild(imageUrlCell);
            row.appendChild(manufacturedOnCell);
            row.appendChild(viewProductCell);
            row.appendChild(addFavouriteCell);
            row.appendChild(addToCartCell);

            tbody.appendChild(row);
        });

        // Handle Select All functionality
        document.getElementById('selectAll').addEventListener('change', function () {
            const checkboxes = document.querySelectorAll(".select-product-item");
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        });

        // Handle Bulk Add to Cart
        const bulkAddToCartButton = document.createElement("button");
        bulkAddToCartButton.textContent = "Bulk Add to Cart";
        bulkAddToCartButton.addEventListener('click', function () {
            const selectedItems = Array.from(document.querySelectorAll(".select-product-item:checked"))
                .map(checkbox => {
                    const row = checkbox.closest("tr");
                    return {
                        productId: row.dataset.productId,
                        quantity: 1 // Setting the quantity to 1 for all items in bulk add
                    };
                });

            if (selectedItems.length === 0) {
                alert("Please select at least one product to add to cart.");
                return;
            }

            fetch('carts/bulk', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    memberId, // Include memberId in the request
                    products: selectedItems
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        alert('Error adding products to cart: ' + result.error);
                    } else {
                        alert("Selected products have been added to the cart.");
                    }
                })
                .catch(error => {
                    console.error('Error adding products to cart:', error);
                });
        });

        // Add the Bulk Add to Cart button to the page
        const section = document.querySelector('section');
        section.appendChild(bulkAddToCartButton);
    })
    .catch(function (error) {
        console.error(error);
    });
});

// --------------------------------