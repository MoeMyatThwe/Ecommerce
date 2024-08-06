const express = require('express');
const favouritesController = require('../controllers/favouritesController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();
router.use(jwtMiddleware.verifyToken);
router.post('/', favouritesController.addFavourite);
router.get('/:productId',favouritesController.getSingleFavourite);
router.get('/all', favouritesController.getAllFavourites);
// router.delete('/remove/:favourite_id', favouritesController.removeFavourite);


module.exports = router;
