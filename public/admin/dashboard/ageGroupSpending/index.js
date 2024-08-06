//done age group spending public  index.js 
window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    fetchAgeGroupSpending(); // Fetch default data on page load

    const form = document.querySelector(".search");
    const button = document.querySelector("button[type='submit']");

    function fetchAgeGroupSpending(queryParams = "") {
        fetch(`/dashboard/age-group-spending?${queryParams}`, {
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
            const spendings = data.spendings;
            const tbody = document.querySelector("#spending-tbody");
            tbody.innerHTML = '';
            spendings.forEach(spending => {
                const row = document.createElement("tr");

                const ageGroupCell = document.createElement("td");
                ageGroupCell.textContent = spending.ageGroup;

                const totalSpendingCell = document.createElement("td");
                totalSpendingCell.textContent = spending.totalSpending.toFixed(2);

                const numberOfMembersCell = document.createElement("td");
                numberOfMembersCell.textContent = spending.memberCount;

                row.appendChild(ageGroupCell);
                row.appendChild(totalSpendingCell);
                row.appendChild(numberOfMembersCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle error: Display a message to the user or log it for debugging
        });
    }

    function handleFormSubmission(event) {
        event.preventDefault();

        const gender = form.elements.gender.value;
        const minTotalSpending = form.elements.minTotalSpending.value || 0;
        const minMemberTotalSpending = form.elements.minMemberTotalSpending.value || 0;

        let queryParams = '';
        if (gender || minTotalSpending || minMemberTotalSpending) {
            queryParams = new URLSearchParams({
                gender: gender || undefined,
                minTotalSpending,
                minMemberTotalSpending
            }).toString();
        }

        fetchAgeGroupSpending(queryParams);
    }

    form.addEventListener("submit", handleFormSubmission);
});
