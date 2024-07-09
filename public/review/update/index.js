////original code

// window.addEventListener('DOMContentLoaded', function () {

//     const token = localStorage.getItem('token');
//     const reviewId = localStorage.getItem('reviewId');


//     const form = document.querySelector('form'); // Only have 1 form in this HTML
//     form.querySelector('input[name=reviewId]').value = reviewId;
//     form.onsubmit = function (e) {
//         e.preventDefault(); // prevent using the default submit behavior

//         const rating = form.querySelector('input[name=rating]').value;
//         const reviewText = form.querySelector('input[name=reviewText]').value;

//         // update review details by reviewId using fetch API with method PUT
//         fetch(`/reviews/${reviewId}`, {
//             method: "PUT",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 rating: rating,
//                 reviewText: reviewText
//             }),
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     alert(`Review updated!`);
//                     // Clear the input field
//                     form.querySelector("input[name=rating]").value = "";
//                     form.querySelector("input[name=reviewText]").value = "";
//                 } else {
//                     // If fail, show the error message
//                     response.json().then(function (data) {
//                         alert(`Error updating review - ${data.error}`);
//                     });
//                 }
//             })
//             .catch(function (error) {
//                 alert(`Error updating review`);
//             });
//     };
// });
////////////////////////////////////////////////


// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem('token');
//     const reviewId = localStorage.getItem('reviewId');
//     const memberId = localStorage.getItem('member_id');

//     if (!token || !reviewId || !memberId) {
//         alert("Token, review ID, or member ID not found.");
//         return;
//     }

//     const form = document.querySelector('form');

//     // Fetch the specific review details
//     fetch(`/reviews/${memberId}`, {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Fetched reviews:', data);
//         if (data.error) {
//             throw new Error(data.error);
//         }

//         const review = data.reviews.find(r => r.review_id === parseInt(reviewId));
//         if (!review) {
//             throw new Error("Review not found");
//         }

//         form.querySelector('input[name=rating]').value = review.rating;
//         form.querySelector('textarea[name=reviewText]').value = review.review_text;
//     })
//     .catch(error => {
//         console.error('Error fetching review details:', error);
//         alert('Error fetching review details: ' + error.message);
//     });

//     form.onsubmit = function (e) {
//         e.preventDefault();

//         const rating = form.querySelector('input[name=rating]').value;
//         const reviewText = form.querySelector('textarea[name=reviewText]').value;

//         if (!rating || !reviewText) {
//             alert("All fields are required.");
//             return;
//         }

//         fetch(`/reviews/${reviewId}`, {
//             method: "PUT",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 rating: rating,
//                 review_text: reviewText
//             }),
//         })
//         .then(response => {
//             if (response.ok) {
//                 alert(`Review updated!`);
//             } else {
//                 response.json().then(data => {
//                     alert(`Error updating review - ${data.error}`);
//                 });
//             }
//         })
//         .catch(error => {
//             alert(`Error updating review`);
//             console.error('Error updating review:', error);
//         });
//     };
// });

////////////////////////////////////////////////////////


///////kinda work but member ID undefined
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


///////////////////////////////////

// // public/update/index.js//All NULL
// document.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem('token');
//     const reviewId = localStorage.getItem('reviewId');
//     const memberId = localStorage.getItem('member_id'); // Fetch the member ID

//     if (!memberId) {
//         alert('Member ID not found. Please log in again.');
//         return;
//     }

//     const form = document.querySelector('form');
//     const ratingInput = document.querySelector('input[name=rating]');
//     const reviewTextInput = document.querySelector('textarea[name=reviewText]');
//     const reviewIdInput = document.querySelector('input[name=reviewId]');

//     if (!form || !ratingInput || !reviewTextInput || !reviewIdInput) {
//         console.error('Form elements not found');
//         return;
//     }

//     reviewIdInput.value = reviewId;

//     form.onsubmit = function (e) {
//         e.preventDefault();

//         const rating = ratingInput.value;
//         const reviewText = reviewTextInput.value;

//         const payload = {
//             member_id: memberId,
//             rating: rating,
//             review_text: reviewText
//         };

//         console.log('Payload:', payload);

//         fetch(`/reviews/${reviewId}`, {
//             method: "PUT",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//         })
//         .then(function (response) {
//             if (response.ok) {
//                 alert('Review updated!');
//                 ratingInput.value = "";
//                 reviewTextInput.value = "";
//             } else {
//                 response.json().then(function (data) {
//                     alert(`Error updating review - ${data.error}`);
//                 });
//             }
//         })
//         .catch(function (error) {
//             alert('Error updating review');
//         });
//     };
// });

//////////////////////////////


// //////kinda work ,review ID not found
// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem("token");
//     const memberId = localStorage.getItem("member_id");

//     // Function to retrieve and populate review data
//     function populateReviewData(reviewId) {
//         fetch(`/reviews/${reviewId}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         .then(response => response.json())
//         .then(review => {
//             if (review.error) throw new Error(review.error);
//             document.querySelector('#rating').value = review.rating;
//             document.querySelector('#reviewText').value = review.reviewText;
//         })
//         .catch(error => {
//             console.error(error);
//             alert('Failed to load review data.');
//         });
//     }

//     // Extract review ID from URL query parameters (assuming review ID is passed as a query parameter)
//     const urlParams = new URLSearchParams(window.location.search);
//     const reviewId = urlParams.get('reviewId');
//     if (reviewId) {
//         populateReviewData(reviewId);
//     } else {
//         alert('Review ID not found.');
//         return;
//     }

//     // Form submission for updating the review
//     const form = document.querySelector('form');
//     form.onsubmit = function (e) {
//         e.preventDefault();

//         const rating = document.querySelector('#rating').value;
//         const reviewText = document.querySelector('#reviewText').value;

//         console.log("Review ID:", reviewId);
//         console.log("Member ID:", memberId);
//         console.log("Rating:", rating);
//         console.log("Review Text:", reviewText);

//         if (!rating || !reviewText) {
//             alert("All fields are required.");
//             return;
//         }

//         const allInput = form.querySelectorAll('input, textarea, button[type=submit]');
//         allInput.forEach(input => {
//             input.disabled = true;
//         });

//         fetch(`/reviews/${reviewId}`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 member_id: memberId,
//                 rating: rating,
//                 review_text: reviewText,
//             }),
//         })
//         .then(response => {
//             if (response.status !== 200) return response.json();
//             alert('Review updated successfully!');
//             return null;
//         })
//         .then(body => {
//             if (body) alert(body.error);
//         })
//         .finally(() => {
//             allInput.forEach(input => {
//                 input.disabled = false;
//             });
//         });
//     };
// });

///////////////////////////////////////

