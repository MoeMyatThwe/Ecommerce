const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR } = require('../errors');
const checkOutModel = require('../models/checkOut');

// module.exports.checkout = async function (req, res) {
//     const memberId = req.body.memberId || res.locals.member_id; // Adjust based on how you're passing member_id

//     try {
//         const result = await checkOutModel.processCheckout(memberId);

//         if (result.outOfStockItems.length > 0) {
//             return res.status(200).json({
//                 message: 'Checkout completed with some items out of stock.',
//                 outOfStockItems: result.outOfStockItems
//             });
//         }

//         return res.status(200).json({ message: 'Checkout completed successfully.' });

//     } catch (error) {
//         console.error('Error processing checkout:', error);
//         return res.status(500).json({ error: error.message });
//     }
// };

// Existing checkout function
module.exports.checkout = async function (req, res) {
    const memberId = req.body.memberId || res.locals.member_id;

    try {
        const result = await checkOutModel.processCheckout(memberId);

        if (result.outOfStockItems.length > 0) {
            return res.status(200).json({
                message: 'Checkout completed with some items out of stock.',
                outOfStockItems: result.outOfStockItems
            });
        }

        return res.status(200).json({ message: 'Checkout completed successfully.' });

    } catch (error) {
        console.error('Error processing checkout:', error);
        return res.status(500).json({ error: error.message });
    }
};

// New confirmCheckout function
module.exports.confirmCheckout = async function (req, res) {
    const { items, memberId } = req.body;

    if (!memberId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Member ID and items are required for checkout.' });
    }

    try {
        const result = await checkOutModel.processConfirmCheckout(items, memberId);

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json({ message: 'Checkout confirmed and items cleared from cart.' });

    } catch (error) {
        console.error('Error during confirm checkout:', error);
        return res.status(500).json({ error: 'Failed to confirm checkout.' });
    }
};