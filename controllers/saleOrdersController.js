const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR, DUPLICATE_TABLE_ERROR } = require('../errors');
const saleOrdersModel = require('../models/saleOrders');
const membersModel = require('../models/members');

module.exports.retrieveAll = function (req, res) {
    let memberId = res.locals.member_id;

    membersModel
        .isAdmin(memberId)
        .then(function (isAdmin) {
            if (isAdmin) {
                memberId = null;
            }

            // Get filters from request query
            const filters = {
                status: req.query.status,
                minOrderDatetime: req.query.minOrderDatetime,
                maxOrderDatetime: req.query.maxOrderDatetime,
                minItemQuantity: req.query.minItemQuantity,
                maxItemQuantity: req.query.maxItemQuantity,
                productDescription: req.query.productDescription,
                minUnitPrice: req.query.minUnitPrice,
                maxUnitPrice: req.query.maxUnitPrice,
                memberUsername: req.query.username, 
                minMemberDob: req.query.minDob,
                maxMemberDob: req.query.maxDob,
                sortOrder: req.query.sortOrder,
            };

            return saleOrdersModel.retrieveAll(memberId, filters);
        })
        .then(function (saleOrders) {
            return res.json({ saleOrders: saleOrders });
        })
        .catch(function (error) {
            console.error(error);

            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }

            if (error instanceof UNIQUE_VIOLATION_ERROR) {
                return res.status(409).json({ error: "A sale order with the same details already exists." });
            }

            if (error instanceof DUPLICATE_TABLE_ERROR) {
                return res.status(500).json({ error: "There was a conflict with an existing table." });
            }

            return res.status(500).json({ error: "An unexpected error occurred." });
        });
};
