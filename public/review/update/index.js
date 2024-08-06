
window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const reviewId = parseInt(localStorage.getItem('reviewId'), 10);
    const memberId = localStorage.getItem('member_id');

    console.log('Parsed reviewId:', reviewId); // Add log
    console.log('Parsed memberId:', memberId); // Add log

    if (!token || isNaN(reviewId) || !memberId) {
        alert("Token, review ID, or member ID not found.");
        return;
    }

    const form = document.querySelector('form');

    // Fetch the specific review details
    fetch(`/reviews/${memberId}`, {
        method: 'GET',
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
        console.log('Fetched reviews:', data); // Add log
        if (data.error) {
            throw new Error(data.error);
        }

        const review = data.reviews.find(r => r.reviewId === reviewId);
        console.log('Matching review:', review); // Add log
        if (!review) {
            throw new Error("Review not found");
        }

        form.querySelector('input[name=rating]').value = review.rating;
        form.querySelector('textarea[name=reviewText]').value = review.reviewText;
    })
    .catch(error => {
        console.error('Error fetching review details:', error); // Add log
        alert('Error fetching review details: ' + error.message);
    });

    form.onsubmit = function (e) {
        e.preventDefault();

        const rating = form.querySelector('input[name=rating]').value;
        const reviewText = form.querySelector('textarea[name=reviewText]').value;

        if (!rating || !reviewText) {
            alert("All fields are required.");
            return;
        }

        fetch(`/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rating: rating,
                review_text: reviewText
            }),
        })
        .then(response => {
            if (response.ok) {
                alert(`Review updated!`);
                // Redirect back to the reviews page or clear form
                window.location.href = '/review/retrieve/all/';
            } else {
                response.json().then(data => {
                    alert(`Error updating review - ${data.error}`);
                });
            }
        })
        .catch(error => {
            alert(`Error updating review`);
            console.error('Error updating review:', error); // Add log
        });
    };
});

