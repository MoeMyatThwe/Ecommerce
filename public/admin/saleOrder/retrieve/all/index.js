window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    
    fetchSaleOrders();

    const form = document.querySelector("form");
    const button = document.querySelector("button");

   

    function fetchSaleOrders(queryParams = "") {
        fetch(`/saleOrders?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (body) {
                const tbody = document.querySelector("#product-tbody");
                tbody.innerHTML = "";

                if (body.error) {
                    // Handle the case where there's an error, such as "Sale Order not found!"
                    const noResultsRow = document.createElement("tr");
                    const noResultsCell = document.createElement("td");
                    noResultsCell.colSpan = 11; // Adjust the colspan to the number of columns in your table
                    noResultsCell.textContent = "No sale orders found.";
                    noResultsCell.style.textAlign = "center";
                    noResultsRow.appendChild(noResultsCell);
                    tbody.appendChild(noResultsRow);
                    console.error(body.error);
                    return;
                }

                const saleOrders = body.saleOrders;

                if (saleOrders.length === 0) {
                    const noResultsRow = document.createElement("tr");
                    const noResultsCell = document.createElement("td");
                    noResultsCell.colSpan = 11; // Adjust the colspan to the number of columns in your table
                    noResultsCell.textContent = "No sale orders found.";
                    noResultsCell.style.textAlign = "center";
                    noResultsRow.appendChild(noResultsCell);
                    tbody.appendChild(noResultsRow);
                    return;
                }

                saleOrders.forEach(function (saleOrder) {
                    saleOrder.saleOrderItem.forEach(function(item) {
                        const row = document.createElement("tr");
                        row.classList.add("product");

                        const nameCell = document.createElement("td");
                        const descriptionCell = document.createElement("td");
                        const unitPriceCell = document.createElement("td");
                        const quantityCell = document.createElement("td");
                        const countryCell = document.createElement("td");
                        const imageUrlCell = document.createElement("td");
                        const orderIdCell = document.createElement("td");
                        const orderDatetimeCell = document.createElement("td");
                        const statusCell = document.createElement("td");
                        const productTypeCell = document.createElement("td");
                        const memberUsernameCell = document.createElement("td");

                        nameCell.textContent = item.product.name;
                        descriptionCell.textContent = item.product.description;
                        unitPriceCell.textContent = item.product.unitPrice;
                        quantityCell.textContent = item.quantity;
                        countryCell.textContent = item.product.country;
                        imageUrlCell.innerHTML = `<img src="${item.product.imageUrl}" alt="Product Image">`;
                        orderIdCell.textContent = saleOrder.id;
                        orderDatetimeCell.textContent = new Date(saleOrder.orderDatetime).toLocaleString();
                        statusCell.textContent = saleOrder.status;
                        productTypeCell.textContent = item.product.productType;
                        memberUsernameCell.textContent = saleOrder.member.username;

                        row.appendChild(nameCell);
                        row.appendChild(descriptionCell);
                        row.appendChild(imageUrlCell);
                        row.appendChild(unitPriceCell);
                        row.appendChild(quantityCell);
                        row.appendChild(countryCell);
                        row.appendChild(orderIdCell);
                        row.appendChild(orderDatetimeCell);
                        row.appendChild(statusCell);
                        row.appendChild(productTypeCell);
                        row.appendChild(memberUsernameCell);

                        tbody.appendChild(row);
                    });
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    }

//     function handleFormSubmission(event) {
//         event.preventDefault();

//         const formElements = Array.from(form.elements);
//         const formValues = formElements.reduce(function (values, element) {
//             if (element.type !== "submit") {
//                 values[element.name] = element.value;
//             }
//             return values;
//         }, {});

//         const status = Array.from(form.elements.status.options)
//             .filter(function (option) {
//                 return option.selected;
//             })
//             .map(function (option) {
//                 return option.value;
//             });

//         const queryParams = new URLSearchParams({ ...formValues, status: status.join(',') }).toString();

//         console.log('Query Parameters: ', queryParams);
//         fetchSaleOrders(queryParams);
//     }

//     button.addEventListener("click", handleFormSubmission);
// });

function handleFormSubmission(event) {
    event.preventDefault();

    const formElements = Array.from(form.elements);
    const formValues = formElements.reduce(function (values, element) {
        if (element.type !== "submit" && element.value) {
            values[element.name] = element.value;
        }
        return values;
    }, {});

    const status = Array.from(form.elements.status.options)
        .filter(function (option) {
            return option.selected;
        })
        .map(function (option) {
            return option.value;
        });

    if (status.length > 0) {
        formValues.status = status.join(',');
    }

    const queryParams = new URLSearchParams(formValues).toString();

    console.log('Query Parameters: ', queryParams);
    fetchSaleOrders(queryParams);
}
button.addEventListener("click", handleFormSubmission);
});

// -------------------------------------

// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem("token");

//     fetchSaleOrders();

//     const form = document.querySelector("form");
//     const button = document.querySelector("button");

//     function fetchSaleOrders(queryParams = "") {
//         fetch(`/saleOrders?${queryParams}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (body) {
//                 const tbody = document.querySelector("#product-tbody");
//                 tbody.innerHTML = "";

//                 if (body.error) {
//                     const noResultsRow = document.createElement("tr");
//                     const noResultsCell = document.createElement("td");
//                     noResultsCell.colSpan = 11;
//                     noResultsCell.textContent = "No sale orders found.";
//                     noResultsCell.style.textAlign = "center";
//                     noResultsRow.appendChild(noResultsCell);
//                     tbody.appendChild(noResultsRow);
//                     console.error(body.error);
//                     return;
//                 }

//                 const saleOrders = body.saleOrders;

//                 if (saleOrders.length === 0) {
//                     const noResultsRow = document.createElement("tr");
//                     const noResultsCell = document.createElement("td");
//                     noResultsCell.colSpan = 11;
//                     noResultsCell.textContent = "No sale orders found.";
//                     noResultsCell.style.textAlign = "center";
//                     noResultsRow.appendChild(noResultsCell);
//                     tbody.appendChild(noResultsRow);
//                     return;
//                 }

//                 saleOrders.forEach(function (saleOrder) {
//                     saleOrder.saleOrderItem.forEach(function(item) {
//                         const row = document.createElement("tr");
//                         row.classList.add("product");

//                         const nameCell = document.createElement("td");
//                         const descriptionCell = document.createElement("td");
//                         const unitPriceCell = document.createElement("td");
//                         const quantityCell = document.createElement("td");
//                         const countryCell = document.createElement("td");
//                         const imageUrlCell = document.createElement("td");
//                         const orderIdCell = document.createElement("td");
//                         const orderDatetimeCell = document.createElement("td");
//                         const statusCell = document.createElement("td");
//                         const productTypeCell = document.createElement("td");
//                         const memberUsernameCell = document.createElement("td");

//                         nameCell.textContent = item.product.name;
//                         descriptionCell.textContent = item.product.description;
//                         unitPriceCell.textContent = item.product.unitPrice;
//                         quantityCell.textContent = item.quantity;
//                         countryCell.textContent = item.product.country;
//                         imageUrlCell.innerHTML = `<img src="${item.product.imageUrl}" alt="Product Image">`;
//                         orderIdCell.textContent = saleOrder.id;
//                         orderDatetimeCell.textContent = new Date(saleOrder.orderDatetime).toLocaleString();
//                         statusCell.textContent = saleOrder.status;
//                         productTypeCell.textContent = item.product.productType;
//                         memberUsernameCell.textContent = saleOrder.member.username;

//                         row.appendChild(nameCell);
//                         row.appendChild(descriptionCell);
//                         row.appendChild(imageUrlCell);
//                         row.appendChild(unitPriceCell);
//                         row.appendChild(quantityCell);
//                         row.appendChild(countryCell);
//                         row.appendChild(orderIdCell);
//                         row.appendChild(orderDatetimeCell);
//                         row.appendChild(statusCell);
//                         row.appendChild(productTypeCell);
//                         row.appendChild(memberUsernameCell);

//                         tbody.appendChild(row);
//                     });
//                 });
//             })
//             .catch(function (error) {
//                 console.error(error);
//             });
//     }

//     function handleFormSubmission(event) {
//         event.preventDefault();

//         const formElements = Array.from(form.elements);
//         const formValues = formElements.reduce(function (values, element) {
//             if (element.type !== "submit") {
//                 values[element.name] = element.value;
//             }
//             return values;
//         }, {});

//         const status = Array.from(form.elements.status.options)
//             .filter(function (option) {
//                 return option.selected;
//             })
//             .map(function (option) {
//                 return option.value;
//             });

//         const queryParams = new URLSearchParams({ ...formValues, status: status.join(',') }).toString();

//         console.log('Query Parameters: ', queryParams);
//         fetchSaleOrders(queryParams);
//     }

//     button.addEventListener("click", handleFormSubmission);
// });
