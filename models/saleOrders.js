// const { query } = require('../database');
// const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR } = require('../errors');

// module.exports.retrieveAll = function retrieveAll(memberId) {
//     let params = [];
//     let sql = `SELECT * FROM sale_order_item s JOIN sale_order o ON s.sale_order_id=o.id JOIN product p ON s.product_id=p.id JOIN member m ON o.member_id=m.id`;
//     if (memberId) {
//         sql += ` WHERE o.member_id = $1`
//         params.push(memberId);
//     }
//     return query(sql, params).then(function (result) {
//         const rows = result.rows;

//         if (rows.length === 0) {
//             throw new EMPTY_RESULT_ERROR(`Sale Order not found!`);
//         }

//         return rows;
//     });
// };

// ---------------------------------modified code--------------
const { PrismaClient } = require('@prisma/client');
const { EMPTY_RESULT_ERROR } = require('../errors');

const prisma = new PrismaClient();

module.exports.retrieveAll = function retrieveAll(memberId, filters = {}) {
    const {
        status,
        minOrderDatetime,
        maxOrderDatetime,
        minItemQuantity,
        maxItemQuantity,
        productDescription,
        minUnitPrice,
        maxUnitPrice,
        memberUsername,
        minMemberDob,
        maxMemberDob,
        sortOrder
    } = filters;

    // Build the query using Prisma
    const whereClause = {};

    if (memberId) {
        whereClause.memberId = memberId;
    }

    if (status) {
        whereClause.status = { in: status.split(',') };
    }

    if (minOrderDatetime) {
        whereClause.orderDatetime = { gte: new Date(minOrderDatetime) };
    }

    if (maxOrderDatetime) {
        whereClause.orderDatetime = {
            ...(whereClause.orderDatetime || {}),
            lte: new Date(maxOrderDatetime)
        };
    }

    if (minItemQuantity || maxItemQuantity || productDescription || minUnitPrice || maxUnitPrice) {
        whereClause.saleOrderItem = {
            some: {
                ...(minItemQuantity && { quantity: { gte: parseInt(minItemQuantity, 10) } }),
                ...(maxItemQuantity && { quantity: { lte: parseInt(maxItemQuantity, 10) } }),
                ...(productDescription && {
                    product: {
                        description: { contains: productDescription, mode: 'insensitive' }
                    }
                }),
                ...(minUnitPrice && { product: { unitPrice: { gte: parseFloat(minUnitPrice) } } }),
                ...(maxUnitPrice && { product: { unitPrice: { lte: parseFloat(maxUnitPrice) } } }),
            }
        };
    }

    if (memberUsername || minMemberDob || maxMemberDob) {
        whereClause.member = {
            ...(memberUsername && { username: { contains: memberUsername, mode: 'insensitive' } }),
            ...(minMemberDob && { dob: { gte: new Date(minMemberDob) } }),
            ...(maxMemberDob && { dob: { lte: new Date(maxMemberDob) } }),
        };
    }

    return prisma.saleOrder.findMany({
        where: whereClause,
        include: {
            saleOrderItem: {
                include: {
                    product: true
                }
            },
            member: true
        },
        orderBy: {
            orderDatetime: sortOrder === 'Order Datetime - Earliest First' ? 'asc' : 'desc'
        }
    })
    .then(saleOrders => {
        if (saleOrders.length === 0) {
            throw new EMPTY_RESULT_ERROR(`Sale Order not found!`);
        }

        return saleOrders;
    })
    .catch(error => {
        console.error('Error retrieving sale orders:', error);
        throw new Error('Failed to retrieve sale orders');
    });
};

// --------------------------------------------
