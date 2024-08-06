// document.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem('token');

//     fetch('/favourites', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.error) {
//             throw new Error(data.error);
//         }
//         const favourites = data.favourites;
//         const tbody = document.querySelector("#favourite-tbody");

//         favourites.forEach(favourite => {
//             const row = document.createElement("tr");

//             const favouriteIdCell = document.createElement("td");
//             const nameCell = document.createElement("td");
//             const descriptionCell = document.createElement("td");
//             const unitPriceCell = document.createElement("td");
//             const stockQuantityCell = document.createElement("td");
//             const countryCell = document.createElement("td");
//             const productTypeCell = document.createElement("td");
//             const imageUrlCell = document.createElement("td");
//             const manufacturedOnCell = document.createElement("td");

//             favouriteIdCell.textContent = favourite.favourite_id;
//             nameCell.textContent = favourite.name;
//             descriptionCell.textContent = favourite.description;
//             unitPriceCell.textContent = favourite.unit_price;
//             stockQuantityCell.textContent = favourite.stock_quantity;
//             countryCell.textContent = favourite.country;
//             productTypeCell.textContent = favourite.product_type;
//             imageUrlCell.innerHTML = `<img src="${favourite.image_url}" alt="Product Image">`;
//             manufacturedOnCell.textContent = new Date(favourite.manufactured_on).toLocaleDateString();

//             row.appendChild(favouriteIdCell);
//             row.appendChild(nameCell);
//             row.appendChild(descriptionCell);
//             row.appendChild(unitPriceCell);
//             row.appendChild(stockQuantityCell);
//             row.appendChild(countryCell);
//             row.appendChild(productTypeCell);
//             row.appendChild(imageUrlCell);
//             row.appendChild(manufacturedOnCell);

//             tbody.appendChild(row);
//         });
//     })
//     .catch(error => {
//         console.error('Error:', error.message);
//     });
// });

// //////////////
// document.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem('token');

//     fetch('/favourite/all', {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.error) {
//             throw new Error(data.error);
//         }
//         const favourites = data.favourites;
//         console.log(favourites);

//         const tbody = document.querySelector("#favourite-tbody");

//         favourites.forEach(favourite => {
//             const row = document.createElement("tr");

//             const favouriteIdCell = document.createElement("td");
//             const nameCell = document.createElement("td");
//             const descriptionCell = document.createElement("td");
//             const unitPriceCell = document.createElement("td");
//             const countryCell = document.createElement("td");
//             const productTypeCell = document.createElement("td");
//             const imageUrlCell = document.createElement("td");
//             const manufacturedOnCell = document.createElement("td");

//             favouriteIdCell.textContent = favourite.favourite_id;
//             nameCell.textContent = favourite.name;
//             descriptionCell.textContent = favourite.description;
//             unitPriceCell.textContent = favourite.unit_price;
//             countryCell.textContent = favourite.country;
//             productTypeCell.textContent = favourite.product_type;
//             imageUrlCell.innerHTML = `<img src="${favourite.image_url}" alt="Product Image">`;
//             manufacturedOnCell.textContent = new Date(favourite.manufactured_on).toLocaleDateString();

//             row.appendChild(favouriteIdCell);
//             row.appendChild(nameCell);
//             row.appendChild(descriptionCell);
//             row.appendChild(unitPriceCell);
//             row.appendChild(countryCell);
//             row.appendChild(productTypeCell);
//             row.appendChild(imageUrlCell);
//             row.appendChild(manufacturedOnCell);

//             tbody.appendChild(row);
//         });
//     })
//     .catch(error => {
//         console.error('Error:', error.message);
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    fetch('/favourites/all', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Received favourites:', data.favourites); // Check if data is received correctly
        const favourites = data.favourites;

        const tbody = document.querySelector("#favourite-tbody");
        tbody.innerHTML = ''; // Clear existing rows if any

        favourites.forEach(favourite => {
            const row = document.createElement("tr");

            const favouriteIdCell = document.createElement("td");
            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const unitPriceCell = document.createElement("td");
            const countryCell = document.createElement("td");
            const productTypeCell = document.createElement("td");
            const imageUrlCell = document.createElement("td");
            const manufacturedOnCell = document.createElement("td");

            favouriteIdCell.textContent = favourite.favourite_id;
            nameCell.textContent = favourite.name;
            descriptionCell.textContent = favourite.description;
            unitPriceCell.textContent = favourite.unit_price;
            countryCell.textContent = favourite.country;
            productTypeCell.textContent = favourite.product_type;
            imageUrlCell.innerHTML = `<img src="${favourite.image_url}" alt="Product Image">`;
            manufacturedOnCell.textContent = new Date(favourite.manufactured_on).toLocaleDateString();

            row.appendChild(favouriteIdCell);
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(unitPriceCell);
            row.appendChild(countryCell);
            row.appendChild(productTypeCell);
            row.appendChild(imageUrlCell);
            row.appendChild(manufacturedOnCell);

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching favourites:', error.message);
    });
});
