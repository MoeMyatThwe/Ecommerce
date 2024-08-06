
const { query } = require('../database');
// Add a favourite product
module.exports.addFavourite = async function (memberId, productId) {
    const sql = 'CALL add_favourite($1, $2)';
    const values = [memberId, productId];

    try {
        await query(sql, values);
        console.log(`Product ${productId} added to favourites for member ${memberId}`);
    } catch (error) {
        throw error;
    }
};


// Retrieve a single favourite by ID
module.exports.getFavouriteById = async function (favouriteId) {
    const sql = 'SELECT * FROM get_favourite_by_id($1)';
    const values = [favouriteId];

    try {
        const result = await query(sql, values);
        return result.rows[0]; // Assuming favourite_id is unique, return the first row
    } catch (error) {
        throw error;
    }
};

// Retrieve all favourites for a member
module.exports.getAllFavourites = async function (memberId) {
    const sql = `
        SELECT * FROM get_all_favourites($1);
    `;
    const values = [memberId];

    try {
        const result = await query(sql, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// module.exports.getAllFavourites = async function (member_id) {
//     const sql = `
//        select * from get_all_favourites($1)
//     `;

//     try {
//         const result = await query(sql, [member_id]);
//         console.log(result)
//         return result.rows;
//     } catch (error) {
//         throw error;
//     }
// };

// // Remove a favourite product
// module.exports.removeFavourite = async function (productId) {
//     const sql = 'CALL remove_favourite($1)';
//     const values = [productId];

//     try {
//         await query(sql, values);
//         console.log(`Product ${productId} removed from favourites`);
//     } catch (error) {
//         throw error;
//     }
// };
