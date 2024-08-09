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

    if (memberUsername) {
        whereClause.member = {
            username: { contains: memberUsername, mode: 'insensitive' }
        };
    }

    if (minMemberDob || maxMemberDob) {
        whereClause.member = {
            ...whereClause.member,
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
