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


// --------------------------------
// ----------------------------------------------------
// nearly work but still not successful
// const { PrismaClient } = require('@prisma/client');
// const { EMPTY_RESULT_ERROR } = require('../errors');

// const prisma = new PrismaClient();

// module.exports.retrieveAll = function retrieveAll(memberId, filters = {}) {
//     const {
//         status,
//         minOrderDatetime,
//         maxOrderDatetime,
//         minItemQuantity,
//         maxItemQuantity,
//         productDescription,
//         minUnitPrice,
//         maxUnitPrice,
//         memberUsername,
//         minMemberDob,
//         maxMemberDob,
//         sortOrder
//     } = filters;

//     const whereClause = {
//         AND: []
//     };

//     if (memberId) {
//         whereClause.AND.push({ memberId: memberId });
//     }

//     if (status) {
//         whereClause.AND.push({ status: { in: status.split(',') } });
//     }

//     if (minOrderDatetime) {
//         whereClause.AND.push({ orderDatetime: { gte: new Date(minOrderDatetime) } });
//     }

//     if (maxOrderDatetime) {
//         whereClause.AND.push({ orderDatetime: { lte: new Date(maxOrderDatetime) } });
//     }

//     if (minItemQuantity || maxItemQuantity || productDescription || minUnitPrice || maxUnitPrice) {
//         const saleOrderItemFilters = {};

//         if (minItemQuantity) {
//             saleOrderItemFilters.quantity = { gte: parseInt(minItemQuantity, 10) };
//         }

//         if (maxItemQuantity) {
//             saleOrderItemFilters.quantity = {
//                 ...(saleOrderItemFilters.quantity || {}),
//                 lte: parseInt(maxItemQuantity, 10)
//             };
//         }

//         if (productDescription) {
//             saleOrderItemFilters.product = {
//                 description: { contains: productDescription, mode: 'insensitive' }
//             };
//         }

//         if (minUnitPrice) {
//             saleOrderItemFilters.product = {
//                 ...saleOrderItemFilters.product,
//                 unitPrice: { gte: parseFloat(minUnitPrice) }
//             };
//         }

//         if (maxUnitPrice) {
//             saleOrderItemFilters.product = {
//                 ...saleOrderItemFilters.product,
//                 unitPrice: {
//                     ...(saleOrderItemFilters.product?.unitPrice || {}),
//                     lte: parseFloat(maxUnitPrice)
//                 }
//             };
//         }

//         whereClause.AND.push({
//             saleOrderItem: {
//                 some: saleOrderItemFilters
//             }
//         });
//     }

//     if (memberUsername) {
//         whereClause.AND.push({
//             member: { username: { contains: memberUsername, mode: 'insensitive' } }
//         });
//     }

//     if (minMemberDob) {
//         whereClause.AND.push({
//             member: { dob: { gte: new Date(minMemberDob) } }
//         });
//     }

//     if (maxMemberDob) {
//         whereClause.AND.push({
//             member: {
//                 ...(whereClause.AND[whereClause.AND.length - 1]?.member || {}),
//                 dob: { lte: new Date(maxMemberDob) }
//             }
//         });
//     }

//     return prisma.saleOrder.findMany({
//         where: whereClause,
//         include: {
//             saleOrderItem: {
//                 include: {
//                     product: true
//                 }
//             },
//             member: true
//         },
//         orderBy: {
//             orderDatetime: sortOrder === 'Order Datetime - Earliest First' ? 'asc' : 'desc'
//         }
//     })
//     .then(saleOrders => {
//         if (saleOrders.length === 0) {
//             throw new EMPTY_RESULT_ERROR(`Sale Order not found!`);
//         }

//         return saleOrders;
//     })
//     .catch(error => {
//         console.error('Error retrieving sale orders:', error);
//         throw new Error('Failed to retrieve sale orders');
//     });
// };
 
// ----------------------
// const { PrismaClient } = require('@prisma/client');
// const { EMPTY_RESULT_ERROR } = require('../errors');

// const prisma = new PrismaClient();

// module.exports.retrieveAll = function retrieveAll(memberId, filters = {}) {
//     const {
//         status,
//         minOrderDatetime,
//         maxOrderDatetime,
//         minItemQuantity,
//         maxItemQuantity,
//         productDescription,
//         minUnitPrice,
//         maxUnitPrice,
//         memberUsername,
//         minMemberDob,
//         maxMemberDob,
//         sortOrder
//     } = filters;

//     const whereClause = {};

//     if (memberId) {
//         whereClause.memberId = memberId;
//     }

//     if (status) {
//         whereClause.status = { in: status.split(',') };
//     }

//     if (minOrderDatetime) {
//         whereClause.orderDatetime = { gte: new Date(minOrderDatetime) };
//     }

//     if (maxOrderDatetime) {
//         whereClause.orderDatetime = {
//             ...(whereClause.orderDatetime || {}),
//             lte: new Date(maxOrderDatetime)
//         };
//     }

//     if (memberUsername) {
//         whereClause.member = {
//             username: { contains: memberUsername, mode: 'insensitive' }
//         };
//     }

//     if (minMemberDob || maxMemberDob) {
//         whereClause.member = {
//             ...whereClause.member,
//             ...(minMemberDob && { dob: { gte: new Date(minMemberDob) } }),
//             ...(maxMemberDob && { dob: { lte: new Date(maxMemberDob) } }),
//         };
//     }

//     // Apply filtering to saleOrderItem
//     whereClause.saleOrderItem = {
//         some: {
//             ...(minItemQuantity && { quantity: { gte: parseInt(minItemQuantity, 10) } }),
//             ...(maxItemQuantity && { quantity: { lte: parseInt(maxItemQuantity, 10) } }),
//             ...(productDescription && {
//                 product: {
//                     description: { contains: productDescription, mode: 'insensitive' }
//                 }
//             }),
//             ...(minUnitPrice && { product: { unitPrice: { gte: parseFloat(minUnitPrice) } } }),
//             ...(maxUnitPrice && { product: { unitPrice: { lte: parseFloat(maxUnitPrice) } } }),
//         }
//     };

//     return prisma.saleOrder.findMany({
//         where: whereClause,
//         include: {
//             saleOrderItem: {
//                 include: {
//                     product: true
//                 }
//             },
//             member: true
//         },
//         orderBy: {
//             orderDatetime: sortOrder === 'Order Datetime - Earliest First' ? 'asc' : 'desc'
//         }
//     })
//     .then(saleOrders => {
//         if (saleOrders.length === 0) {
//             throw new EMPTY_RESULT_ERROR(`Sale Order not found!`);
//         }

//         return saleOrders;
//     })
//     .catch(error => {
//         console.error('Error retrieving sale orders:', error);
//         throw new Error('Failed to retrieve sale orders');
//     });
// };

// -------------------------------

// const { PrismaClient } = require('@prisma/client');
// const { EMPTY_RESULT_ERROR } = require('../errors');

// const prisma = new PrismaClient();

// module.exports.retrieveAll = function retrieveAll(memberId, filters = {}) {
//     const {
//         minUnitPrice,
//     } = filters;

//     const whereClause = {};

//     if (memberId) {
//         whereClause.memberId = memberId;
//     }

//     // Apply only the minUnitPrice filter for now
//     if (minUnitPrice) {
//         whereClause.saleOrderItem = {
//             some: {
//                 product: { unitPrice: { gte: parseFloat(minUnitPrice) } }
//             }
//         };
//     }

//     return prisma.saleOrder.findMany({
//         where: whereClause,
//         include: {
//             saleOrderItem: {
//                 include: {
//                     product: true
//                 }
//             },
//             member: true
//         },
//         orderBy: {
//             orderDatetime: 'asc' // Simplify sort order for now
//         }
//     })
//     .then(saleOrders => {
//         if (saleOrders.length === 0) {
//             throw new EMPTY_RESULT_ERROR(`Sale Order not found!`);
//         }

//         return saleOrders;
//     })
//     .catch(error => {
//         console.error('Error retrieving sale orders:', error);
//         throw new Error('Failed to retrieve sale orders');
//     });
// };


// ---------------------------------------