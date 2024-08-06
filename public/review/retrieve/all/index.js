
//retrieve all reviews done
function fetchUserReviews() {
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("member_id");

    if (!memberId) {
        console.error("Member ID not found in local storage.");
        return;
    }

    return fetch(`/reviews/${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to retrieve reviews.');
        }
        return response.json();
    })
    .then(function(body) {
        const reviews = body.reviews;
        const reviewContainerDiv = document.querySelector('#review-container');

        reviews.forEach(function(review) {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review-row');

            let ratingStars = '';
            for (let i = 0; i < review.rating; i++) {
                ratingStars += '⭐';
            }

            reviewDiv.innerHTML = `
                <h3>Review ID: ${review.reviewId}</h3>
                <p>Product Name: ${review.productName}</p>
                <p>Rating: ${ratingStars}</p>
                <p>Review Text: ${review.reviewText}</p>
                <p>Review Date: ${review.reviewDate ? review.reviewDate.slice(0, 10) : ""}</p>
                <button class="update-button">Update</button>
                <button class="delete-button">Delete</button>
            `;

            reviewDiv.querySelector('.update-button').addEventListener('click', function() {
                localStorage.setItem("reviewId", review.reviewId);
                window.location.href = `/review/update`;
            });

            reviewDiv.querySelector('.delete-button').addEventListener('click', function() {
                localStorage.setItem("reviewId", review.reviewId);
                window.location.href = `/review/delete`;
            });

            reviewContainerDiv.appendChild(reviewDiv);
        });
    })
    .catch(function(error) {
        console.error('Error fetching reviews:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchUserReviews()
        .catch(function(error) {
            console.error('Error fetching user reviews:', error);
        });
});

