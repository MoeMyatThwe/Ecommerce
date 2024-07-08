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

// Update a review
module.exports.updateReview = async function (req, res) {
    try {
        const { review_id, rating, review_text } = req.body;

        // Update the review
        await reviewsModel.updateReview(review_id, rating, review_text);

        // Respond with 200 OK
        return res.status(200).send({ message: "Review updated successfully" });
    } catch (error) {
        console.error('Error updating review:', error);
        return res.status(500).send(error);
    }
};

 // Get a review by ID
// module.exports.getReviewById = async function (req, res) {
//     try {
//         const { id } = req.params;

//         const review = await getReviewById(id);

//         if (!review) {
//             return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Review not found.' });
//         }

//         return res.status(HTTP_STATUS_CODES.OK).json(review);
//     } catch (error) {
//         console.error('Error getting review:', error);
//         return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({ error: error.message });
//     }
// };



// // Delete a review
// module.exports.deleteReview = async function (req, res) {
//     try {
//         const { id } = req.params;

//         await deleteReview(id);

//         return res.sendStatus(HTTP_STATUS_CODES.OK);
//     } catch (error) {
//         console.error('Error deleting review:', error);
//         return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({ error: error.message });
//     }
// };
