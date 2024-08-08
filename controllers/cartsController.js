const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR } = require('../errors');
const cartsModel = require('../models/carts');

// create 
module.exports.createCartItem = function(req, res) {
    const { memberId, productId, quantity } = req.body;

    if (quantity <= 0 || !Number.isInteger(quantity) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Quantity must be a positive integer.' });
    }

    return cartsModel.createOrUpdateCartItem(memberId, productId, quantity)
        .then(function (cartItem) {
            return res.status(201).json(cartItem);
        })
        .catch(function (error) {
            console.error('Error creating/updating cart item:', error);
            return res.status(500).json({ error: error.message });
        });
};

// retrieveAll
module.exports.retrieveAll = function (req, res) {
    const memberId = res.locals.member_id; // Use member_id from res.locals
    return cartsModel.retrieveAll(memberId)
        .then(function (cartItems) {
            return res.json({ cartItems: cartItems });
        })
        .catch(function (error) {
            console.error('Error retrieving all cart items:', error);
            return res.status(500).json({ error: error.message });
        });
};

// retrive single
module.exports.retrieveCartItem = function (req, res) {
    const { memberId, productId } = req.query;

    if (!memberId || !productId) {
        return res.status(400).json({ error: 'Member ID and Product ID are required' });
    }

    return cartsModel.retrieveByProductAndMember(memberId, productId)
        .then(function (cartItem) {
            return res.json({ cartItem: cartItem });
        })
        .catch(function (error) {
            console.error('Error retrieving cart item:', error);
            return res.status(500).json({ error: error.message });
        });
};

// update
module.exports.updateCartItem = function (req, res) {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0 || !Number.isInteger(quantity) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Quantity must be a positive integer.' });
    }

    return cartsModel.updateCartItem(cartItemId, quantity)
        .then(function (cartItem) {
            return res.status(200).json(cartItem);
        })
        .catch(function (error) {
            console.error('Error updating cart item:', error);
            return res.status(500).json({ error: error.message });
        });
};

// delete
module.exports.deleteCartItem = function (req, res) {
    const { cartItemId } = req.params;

    return cartsModel.deleteCartItem(cartItemId)
        .then(function () {
            return res.status(200).json({ message: 'Cart item deleted successfully.' });
        })
        .catch(function (error) {
            console.error('Error deleting cart item:', error);
            return res.status(500).json({ error: error.message });
        });
};

module.exports.retrieveCartSummary = function (req, res) {
    const memberId = res.locals.member_id; // Use member_id from res.locals

    return cartsModel.retrieveSummary(memberId)
        .then(function (cartSummary) {
            return res.json({ cartSummary: cartSummary });
        })
        .catch(function (error) {
            console.error('Error retrieving cart summary:', error);
            return res.status(500).json({ error: error.message });
        });
};