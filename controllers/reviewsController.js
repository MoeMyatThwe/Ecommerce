const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR, DUPLICATE_TABLE_ERROR } = require('../errors');
const reviewsModel = require('../models/reviews');

// Create a review //done
module.exports.createReview = async function (req, res) {
    try {
        const { sale_order_id, member_id, product_id, rating, review_text } = req.body;

        // Create the review
        await reviewsModel.createReview(sale_order_id, member_id, product_id, rating, review_text);

        // Respond with 201 Created
      return res.status(201)
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).send(error);
    }
};


 // Get a review by ID
// Retrieve all reviews by member ID
module.exports.retrieveAllReviewsByMemberId = async function (req, res) {
    const member_id = req.params.memberId; 

    try {
        const reviews = await reviewsModel.getAllReviewsByMemberId(member_id);
        return res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ error: 'Failed to retrieve reviews.' });
    }
};

// Update a review


module.exports.updateReview = async function (req, res) {
    const reviewId = req.params.reviewId;
    const memberId = res.locals.member_id; 
    const { rating, review_text} = req.body;

    try {
        await reviewsModel.updateReview(reviewId, memberId, rating, review_text);
        return res.status(200).send();
    } catch (error) {
        console.error('Error updating review:', error);
        return res.status(500).json({ error: 'Failed to update review.' });
    }
};

// DELETE a review by reviewId
exports.deleteReviewById = async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        const result = await reviewsModel.deleteReviewById(reviewId);
        res.status(204).send(); // Respond with 204 No Content on success
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review.' });
    }
};


