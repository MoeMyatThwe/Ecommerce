<<<<<<< HEAD

// function fetchUserReviews() {
// 	const token = localStorage.getItem("token");

// 	return fetch(`/reviews`, {
// 		headers: {
// 			Authorization: `Bearer ${token}`
// 		}
// 	})
// 		.then(function (response) {
// 			return response.json();
// 		})
// 		.then(function (body) {

// 			if (body.error) throw new Error(body.error);
// 			const reviews = body.reviews;
// 			const reviewContainerDiv = document.querySelector('#review-container');
			
// 			reviews.forEach(function (review) {
// 				const reviewDiv = document.createElement('div');
// 				reviewDiv.classList.add('review-row');

// 				let ratingStars = '';
// 				for (let i = 0; i < review.rating; i++) {
// 					ratingStars += '⭐';
// 				}

// 				reviewDiv.innerHTML = `
// 					<h3>Review ID: ${review.reviewId}</h3>
// 					<p>Product Name: ${review.name}</p>
// 					<p>Rating: ${ratingStars}</p>
// 					<p>Review Text: ${review.reviewText}</p>
// 					<p>Review Date: ${review.reviewDate ? review.reviewDate.slice(0, 10) : ""}</p>
// 					<button class="update-button">Update</button>
// 					<button class="delete-button">Delete</button>
// 				`;

// 				reviewDiv.querySelector('.update-button').addEventListener('click', function() {
// 					localStorage.setItem("reviewId", review.id);
// 					window.location.href = `/review/update`;
// 				});

// 				reviewDiv.querySelector('.delete-button').addEventListener('click', function() {
// 					localStorage.setItem("reviewId", review.id);
// 					window.location.href = `/review/delete`;
// 				});

// 				reviewContainerDiv.appendChild(reviewDiv);
// 			});
// 		})
// 		.catch(function (error) {
// 			console.error(error);
// 		});
// }

// document.addEventListener('DOMContentLoaded', function () {
// 	fetchUserReviews()
// 		.catch(function (error) {
// 			// Handle error
// 			console.error(error);
// 		});
// });

/////////////////////////////////////

//code works for retrieving reviews
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

//////////////////////////////////////////

// //////All NULL for updating review
// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem("token");
//     const memberId = localStorage.getItem("member_id");

//     if (!memberId) {
//         console.error("Member ID not found in local storage.");
//         return;
//     }

//     fetch(`/reviews/${memberId}`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to retrieve reviews.');
//         }
//         return response.json();
//     })
//     .then(body => {
//         const reviews = body.reviews;
//         const reviewContainerDiv = document.querySelector('#review-container');

//         reviews.forEach(review => {
//             const reviewDiv = document.createElement('div');
//             reviewDiv.classList.add('review-row');

//             let ratingStars = '';
//             for (let i = 0; i < review.rating; i++) {
//                 ratingStars += '⭐';
//             }

//             reviewDiv.innerHTML = `
//                 <h3>Review ID: ${review.reviewId}</h3>
//                 <p>Product Name: ${review.productName}</p>
//                 <p>Rating: ${ratingStars}</p>
//                 <p>Review Text: ${review.reviewText}</p>
//                 <p>Review Date: ${review.reviewDate ? review.reviewDate.slice(0, 10) : ""}</p>
//                 <button class="update-button" data-review-id="${review.reviewId}">Update</button>
//                 <button class="delete-button" data-review-id="${review.reviewId}">Delete</button>
//             `;

//             reviewDiv.querySelector('.update-button').addEventListener('click', function () {
//                 const reviewId = this.getAttribute('data-review-id');
//                 console.log('Storing review ID:', reviewId); // Add log
//                 localStorage.setItem("reviewId", reviewId);
//                 window.location.href = `/review/update`;
//             });

//             reviewDiv.querySelector('.delete-button').addEventListener('click', function () {
//                 const reviewId = this.getAttribute('data-review-id');
//                 localStorage.setItem("reviewId", reviewId);
//                 window.location.href = `/review/delete`;
//             });

//             reviewContainerDiv.appendChild(reviewDiv);
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching reviews:', error); // Add log
//     });
// });
=======

// function fetchUserReviews() {
// 	const token = localStorage.getItem("token");

// 	return fetch(`/reviews`, {
// 		headers: {
// 			Authorization: `Bearer ${token}`
// 		}
// 	})
// 		.then(function (response) {
// 			return response.json();
// 		})
// 		.then(function (body) {

// 			if (body.error) throw new Error(body.error);
// 			const reviews = body.reviews;
// 			const reviewContainerDiv = document.querySelector('#review-container');
			
// 			reviews.forEach(function (review) {
// 				const reviewDiv = document.createElement('div');
// 				reviewDiv.classList.add('review-row');

// 				let ratingStars = '';
// 				for (let i = 0; i < review.rating; i++) {
// 					ratingStars += '⭐';
// 				}

// 				reviewDiv.innerHTML = `
// 					<h3>Review ID: ${review.reviewId}</h3>
// 					<p>Product Name: ${review.name}</p>
// 					<p>Rating: ${ratingStars}</p>
// 					<p>Review Text: ${review.reviewText}</p>
// 					<p>Review Date: ${review.reviewDate ? review.reviewDate.slice(0, 10) : ""}</p>
// 					<button class="update-button">Update</button>
// 					<button class="delete-button">Delete</button>
// 				`;

// 				reviewDiv.querySelector('.update-button').addEventListener('click', function() {
// 					localStorage.setItem("reviewId", review.id);
// 					window.location.href = `/review/update`;
// 				});

// 				reviewDiv.querySelector('.delete-button').addEventListener('click', function() {
// 					localStorage.setItem("reviewId", review.id);
// 					window.location.href = `/review/delete`;
// 				});

// 				reviewContainerDiv.appendChild(reviewDiv);
// 			});
// 		})
// 		.catch(function (error) {
// 			console.error(error);
// 		});
// }

// document.addEventListener('DOMContentLoaded', function () {
// 	fetchUserReviews()
// 		.catch(function (error) {
// 			// Handle error
// 			console.error(error);
// 		});
// });

/////////////////////////////////////

//code works for retrieving reviews
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

//////////////////////////////////////////

// //////All NULL for updating review
// window.addEventListener('DOMContentLoaded', function () {
//     const token = localStorage.getItem("token");
//     const memberId = localStorage.getItem("member_id");

//     if (!memberId) {
//         console.error("Member ID not found in local storage.");
//         return;
//     }

//     fetch(`/reviews/${memberId}`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to retrieve reviews.');
//         }
//         return response.json();
//     })
//     .then(body => {
//         const reviews = body.reviews;
//         const reviewContainerDiv = document.querySelector('#review-container');

//         reviews.forEach(review => {
//             const reviewDiv = document.createElement('div');
//             reviewDiv.classList.add('review-row');

//             let ratingStars = '';
//             for (let i = 0; i < review.rating; i++) {
//                 ratingStars += '⭐';
//             }

//             reviewDiv.innerHTML = `
//                 <h3>Review ID: ${review.reviewId}</h3>
//                 <p>Product Name: ${review.productName}</p>
//                 <p>Rating: ${ratingStars}</p>
//                 <p>Review Text: ${review.reviewText}</p>
//                 <p>Review Date: ${review.reviewDate ? review.reviewDate.slice(0, 10) : ""}</p>
//                 <button class="update-button" data-review-id="${review.reviewId}">Update</button>
//                 <button class="delete-button" data-review-id="${review.reviewId}">Delete</button>
//             `;

//             reviewDiv.querySelector('.update-button').addEventListener('click', function () {
//                 const reviewId = this.getAttribute('data-review-id');
//                 console.log('Storing review ID:', reviewId); // Add log
//                 localStorage.setItem("reviewId", reviewId);
//                 window.location.href = `/review/update`;
//             });

//             reviewDiv.querySelector('.delete-button').addEventListener('click', function () {
//                 const reviewId = this.getAttribute('data-review-id');
//                 localStorage.setItem("reviewId", reviewId);
//                 window.location.href = `/review/delete`;
//             });

//             reviewContainerDiv.appendChild(reviewDiv);
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching reviews:', error); // Add log
//     });
// });
>>>>>>> 35f9920c60ad16ad4185fe5d6e7cbec7f03c1cef
