const { query } = require('../database');
const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR } = require('../errors');

// Create a review // done
module.exports.createReview = async function (sale_order_id, member_id, product_id, rating, review_text) {
    const sql = `
        INSERT INTO reviews (sale_order_id, member_id, product_id, rating, review_text)
        VALUES ($1, $2, $3, $4, $5)
    `;

    try {
        await query(sql, [sale_order_id, member_id, product_id, rating, review_text]);
        console.log('Review created successfully');
    } catch (error) {
        if (error.code === UNIQUE_VIOLATION_ERROR) {
            throw new Error('Review already exists.');
        }
        throw error;
    }
};

// Update a review
// module.exports.updateReview = async function (review_id, rating, review_text) {
//     const sql = `
//         UPDATE reviews
//         SET rating = $1, review_text = $2
//         WHERE review_id = $3
//     `;

//     try {
//         await query(sql, [rating, review_text, review_id]);
//         console.log('Review updated successfully');
//     } catch (error) {
//         throw error;
//     }
// };

// Get a review by ID
// module.exports.getReviewById = async function (id) {
//     const sql = `
//         SELECT * FROM reviews
//         WHERE id = $1
//     `;

//     try {
//         const result = await query(sql, [id]);
//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };



// // Delete a review
// module.exports.deleteReview = async function (id) {
//     const sql = `
//         DELETE FROM reviews
//         WHERE id = $1
//     `;

//     try {
//         await query(sql, [id]);
//         console.log('Review deleted successfully');
//     } catch (error) {
//         throw error;
//     }
// };