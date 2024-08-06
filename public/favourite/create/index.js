
//for main favourite page
document.addEventListener('DOMContentLoaded', function () {
    
    const productId = localStorage.getItem('favouriteProductId');
    const token = localStorage.getItem('token');

    fetch(`/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        const product = data.product;
        console.log(product);
        const tbody = document.querySelector("#product-tbody");

        const row = document.createElement("tr");

        const favouriteIdCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const descriptionCell = document.createElement("td");
        const unitPriceCell = document.createElement("td");
        const countryCell = document.createElement("td");
        const productTypeCell = document.createElement("td");
        const imageUrlCell = document.createElement("td");
        const manufacturedOnCell = document.createElement("td");

        favouriteIdCell.textContent = product.id; // No favourite ID needed here
        nameCell.textContent = product.name;
        descriptionCell.textContent = product.description;
        unitPriceCell.textContent = product.unitPrice;
        countryCell.textContent = product.country;
        productTypeCell.textContent = product.productType;
        imageUrlCell.innerHTML = `<img src="${product.imageUrl}" alt="Product Image">`;
        manufacturedOnCell.textContent = new Date(product.manufacturedOn).toLocaleDateString();

        row.appendChild(favouriteIdCell);
        row.appendChild(nameCell);
        row.appendChild(descriptionCell);
        row.appendChild(unitPriceCell);
        row.appendChild(countryCell);
        row.appendChild(productTypeCell);
        row.appendChild(imageUrlCell);
        row.appendChild(manufacturedOnCell);
        
        tbody.appendChild(row);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
});

