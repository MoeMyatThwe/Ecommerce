const express = require('express');
const cartController = require('../controllers/cartsController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

// All routes in this file will use the jwtMiddleware to verify the token and check if the user is an admin.
// Here the jwtMiddleware is applied at the router level to apply to all routes in this file
// But you can also apply the jwtMiddleware to individual routes
// router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

router.use(jwtMiddleware.verifyToken);
router.post('/',cartController.createCartItem);// Create a cart item
router.get('/item', cartController.retrieveCartItem);
router.get('/',cartController.retrieveAll);// Retrieve all cart items
router.put('/:cartItemId',cartController.updateCartItem);// Update a specific cart item
router.delete('/:cartItemId', cartController.deleteCartItem);// Delete a specific cart item
router.get('/summary', cartController.retrieveCartSummary);
router.post('/bulk', cartController.bulkAddToCart);
router.post('/bulk-update', cartController.bulkUpdateCartItems);
router.post('/bulk-delete', cartController.bulkDeleteCartItems);


module.exports = router;