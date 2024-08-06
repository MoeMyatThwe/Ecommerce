const favouriteModel = require('../models/favourites');

module.exports.addFavourite = function (req, res) {
    const memberId = res.locals.member_id;
    const productId = req.body.productId;

    return favouriteModel
        .addFavourite(memberId, productId)
        .then(() => {
            return res.json({ message: 'Favourite added successfully' });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};

// module.exports.removeFavourite = async function (req, res) {
//     const productId = req.body.productId;

//     try {
//         await favouriteModel.removeFavourite(productId);
//         return res.status(200).json({ message: 'Product removed from favourites' });
//     } catch (error) {
//         console.error('Error removing favourite:', error);
//         return res.status(500).json({ error: error.message });
//     }
// };

// Get details of a specific favourite product
module.exports.getSingleFavourite = async function (req, res) {
    const memberId = res.locals.member_id;
    const productId = req.params.productId;

    return favouriteModel
        .getFavouriteById(memberId, productId)
        .then(function (favourite) {
            return res.json({ favourite: favourite });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        });
};


// // Get all favourite products for a member
// module.exports.getAllFavourites = async function (req, res) {
//     const memberId = res.locals.member_id;

//     try {
//         const favourites = await favouriteModel.getAllFavourites(memberId);
//         return res.json({ favourites: favourites });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message });
//     }
// };

// Retrieve all favourites for a member
// module.exports.getAllFavourites = async function (req, res) {
//     const memberId = res.locals.member_id;  // Assuming member ID is available in res.locals
  
//     try {
//       const favourites = await favouriteModel.findAll({
//         where: { member_id: memberId },
//         // Include other attributes if needed
//       });
//       return res.status(200).json({ favourites });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: error.message });
//     }
//   };

// Retrieve all favourite products for a member
// module.exports.getAllFavourites = async function (req, res) {
//     const memberId = res.locals.member_id; // Assuming member ID is available in res.locals
  
//     try {
//         const favourites = await favouriteModel.getAllFavourites(memberId);
//         console.log(favourites);
//         return res.status(200).json({ favourites });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message });
//     }
// };

module.exports.getAllFavourites = async function (req, res) { 
    const memberId = res.locals.member_id;
    return favouriteModel
        .getAllFavourites(memberId)
        .then(function (favourite) {
            return res.json({ 
                favourites: favourite });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
});
}
