<<<<<<< HEAD
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

// Retrieve all reviews by member ID
module.exports.getAllReviewsByMemberId = async function (member_id) {
    const sql = `
       select * from get_all_reviews($1)
    `;

    try {
        const result = await query(sql, [member_id]);
        console.log(result)
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// // Update a review
////kinda work but memberId is undefined
module.exports.updateReview = async function (review_id, member_id, rating, review_text) {
    const sql = `
        CALL update_review($1, $2, $3, $4)
    `;

    try {
        await query(sql, [review_id, member_id, rating, review_text]);
        console.log('Review updated successfully');
    } catch (error) {
        throw error;
    }
};

//////////////////
/////update all null
// module.exports.updateReview = async function (review_id, member_id, rating, review_text) {
//     const sql = `
//         CALL update_review($1, $2, $3, $4)
//     `;

//     try {
//         await query(sql, [review_id, member_id, rating, review_text]);
//         console.log('Review updated successfully');
//     } catch (error) {
//         console.error('Error updating review:', error);
//         throw error;
//     }
// };


// DELETE a review by reviewId
exports.deleteReviewById = async (reviewId) => {
    const queryText = 'DELETE FROM reviews WHERE id = $1';
    const values = [reviewId];
    const result = await query(queryText, values);
    return result.rowCount; // Return the number of rows affected (should be 1 if deleted successfully)
=======
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

// Retrieve all reviews by member ID
module.exports.getAllReviewsByMemberId = async function (member_id) {
    const sql = `
       select * from get_all_reviews($1)
    `;

    try {
        const result = await query(sql, [member_id]);
        console.log(result)
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// // Update a review
////kinda work but memberId is undefined
module.exports.updateReview = async function (review_id, member_id, rating, review_text) {
    const sql = `
        CALL update_review($1, $2, $3, $4)
    `;

    try {
        await query(sql, [review_id, member_id, rating, review_text]);
        console.log('Review updated successfully');
    } catch (error) {
        throw error;
    }
};

//////////////////
/////update all null
// module.exports.updateReview = async function (review_id, member_id, rating, review_text) {
//     const sql = `
//         CALL update_review($1, $2, $3, $4)
//     `;

//     try {
//         await query(sql, [review_id, member_id, rating, review_text]);
//         console.log('Review updated successfully');
//     } catch (error) {
//         console.error('Error updating review:', error);
//         throw error;
//     }
// };


// DELETE a review by reviewId
exports.deleteReviewById = async (reviewId) => {
    const queryText = 'DELETE FROM reviews WHERE id = $1';
    const values = [reviewId];
    const result = await query(queryText, values);
    return result.rowCount; // Return the number of rows affected (should be 1 if deleted successfully)
>>>>>>> 35f9920c60ad16ad4185fe5d6e7cbec7f03c1cef
};