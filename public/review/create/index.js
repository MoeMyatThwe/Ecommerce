
window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    let sale_order_id;

    fetch('/saleOrders', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            if (body.error) throw new Error(body.error);
            const saleOrders = body.saleOrders;
            const tbody = document.querySelector("#product-tbody");
            saleOrders.forEach(function (saleOrder) {
                const row = document.createElement("tr");
                row.classList.add("product");
                const nameCell = document.createElement("td");
                const descriptionCell = document.createElement("td");
                const unitPriceCell = document.createElement("td");
                const quantityCell = document.createElement("td");
                const countryCell = document.createElement("td");
                const imageUrlCell = document.createElement("td");
                const orderId = document.createElement("td");
                const orderDatetimeCell = document.createElement("td");
                const statusCell = document.createElement("td");
                const createReviewCell = document.createElement("td");
                
                nameCell.textContent = saleOrder.name;
                descriptionCell.textContent = saleOrder.description;
                unitPriceCell.textContent = saleOrder.unitPrice;
                quantityCell.textContent = saleOrder.quantity;
                countryCell.textContent = saleOrder.country;
                imageUrlCell.innerHTML = `<img src="${saleOrder.imageUrl}" alt="Product Image">`;
                orderId.textContent = saleOrder.saleOrderId;
                orderDatetimeCell.textContent = new Date(saleOrder.orderDatetime).toLocaleString();            
                statusCell.textContent = saleOrder.status;
                const viewProductButton = document.createElement("button");
                viewProductButton.textContent = "Create Review";
                viewProductButton.addEventListener('click', function () {
                    const reviewProductSpan = document.querySelector("#review-product-id");
                    reviewProductSpan.innerHTML = saleOrder.name;
                    const productIdInput = document.querySelector("input[name='product_id']");
                    productIdInput.value = saleOrder.productId;
                
                    sale_order_id = saleOrder.saleOrderId;
                    
                });
                createReviewCell.appendChild(viewProductButton);

                row.appendChild(nameCell);
                row.appendChild(descriptionCell);
                row.appendChild(imageUrlCell);                
                row.appendChild(unitPriceCell);
                row.appendChild(quantityCell);
                row.appendChild(countryCell);
                row.appendChild(orderId);
                row.appendChild(orderDatetimeCell);
                row.appendChild(statusCell);
                row.appendChild(createReviewCell);
                tbody.appendChild(row);                
            });
        })
        .catch(function (error) {
            console.error(error);
        });

    const form = document.querySelector('form');
    form.onsubmit = function (e) {
        e.preventDefault();
         const memberId = localStorage.getItem('member_id');
        const productId = form.querySelector('input[name=product_id]').value;
        const rating = form.querySelector('select[name=rating]').value;
        const reviewText = form.querySelector('textarea[name=review_text]').value;

        console.log("saleOrderId:", sale_order_id);
        console.log("memberId:", memberId);
        console.log("productId:", productId);
        console.log("rating:", rating);
        console.log("reviewText:", reviewText);

        if (!memberId || !productId || !rating || !reviewText) {
            alert("All fields are required.");
            return;
        }

        const allInput = form.querySelectorAll('input, textarea, button[type=submit]');
        allInput.forEach((input) => {
            input.disabled = true;
        });

        fetch('/reviews', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sale_order_id,
                member_id: memberId,
                product_id: productId,
                rating: rating,
                review_text: reviewText,
            }),
        })
        .then(function (response) {
            console.log('fetched');
            console.log('response: ', response);
            if (response.status !== 201) return response.json();
            allInput.forEach((input) => {
                if (input.type !== 'submit') input.value = '';
            });
            alert(`Review for product created!`);
            return null;
        })
        .then(function (body) {
            if (body) alert(body.error);
        })
        .finally(function () {
            allInput.forEach((input) => {
                input.disabled = false;
            });
        });
    };
});
