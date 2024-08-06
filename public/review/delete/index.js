
window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const reviewId = localStorage.getItem('reviewId');

    const form = document.querySelector('form');
    form.querySelector('input[name=reviewId]').value = reviewId;

    form.onsubmit = function (e) {
        e.preventDefault();

        fetch(`/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(function (response) {
            if (response.ok) {
                alert('Review deleted successfully!');
                // Optionally redirect or update UI after deletion
            } else {
                response.json().then(function (data) {
                    alert(`Error deleting review: ${data.error}`);
                });
            }
        })
        .catch(function (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review.');
        });
    };
});
