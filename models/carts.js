
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

// Retrieve Cart Item by Member ID and Product ID
module.exports.retrieveByProductAndMember = function retrieveByProductAndMember(memberId, productId) {
    const parsedMemberId = parseInt(memberId, 10);
    const parsedProductId = parseInt(productId, 10);
    console.log(`Retrieving cart item for memberId: ${parsedMemberId}, productId: ${parsedProductId}`);
    return prisma.cartItem.findFirst({
        where: {
            memberId: parsedMemberId,
            productId: parsedProductId
        }
    }).then(function (cartItem) {
        console.log('Cart item retrieved:', cartItem);
        return cartItem;
    }).catch(function (error) {
        console.error('Error retrieving cart item:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`No cart item found for memberId: ${parsedMemberId} and productId: ${parsedProductId}`);
            }
        }
        throw new Error('Failed to retrieve cart item');
    });
};


// Create or Update Cart Item
module.exports.createOrUpdateCartItem = function createOrUpdateCartItem(memberId, productId, quantity) {
    const parsedMemberId = parseInt(memberId, 10);
    const parsedProductId = parseInt(productId, 10);
    console.log(`Creating or updating cart item for memberId: ${parsedMemberId}, productId: ${parsedProductId}, quantity: ${quantity}`);
    return module.exports.retrieveByProductAndMember(parsedMemberId, parsedProductId)
        .then(function (existingCartItem) {
            if (existingCartItem) {
                const newQuantity = existingCartItem.quantity + quantity;
                console.log(`Updating cart item with new quantity: ${newQuantity}`);
                return prisma.cartItem.update({
                    where: {
                        cartItemId: existingCartItem.cartItemId
                    },
                    data: {
                        quantity: newQuantity
                    }
                });
            } else {
                console.log('Creating new cart item');
                return prisma.cartItem.create({
                    data: {
                        memberId: parsedMemberId,
                        productId: parsedProductId,
                        quantity: quantity
                    }
                });
            }
        }).catch(function (error) {
            console.error('Error creating/updating cart item:', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error(`A cart item with the same memberId: ${parsedMemberId} and productId: ${parsedProductId} already exists`);
                }
            }
            throw new Error('Failed to create/update cart item');
        });
};


// retrieve All
module.exports.retrieveAll = function retrieveAll(memberId) { 
    return prisma.cartItem.findMany({
        where: {
            memberId: memberId
        },
        include: {
            product: true
        }
    })
    .then(function (cartItems) { 
        return cartItems; 
    }).catch(function (error) {
        console.error('Error retrieving all cart items:', error);
        throw new Error('Failed to retrieve cart items');
    });
};


// Update Cart Item
module.exports.updateCartItem = function updateCartItem(cartItemId, quantity) {
    console.log(`Updating cart item ${cartItemId} with quantity ${quantity}`);
    return prisma.cartItem.update({
        where: {
            cartItemId: parseInt(cartItemId, 10)
        },
        data: {
            quantity: quantity
        }
    }).then(function (cartItem) {
        console.log('Cart item updated:', cartItem);
        return cartItem;
    }).catch(function (error) {
        console.error('Error updating cart item:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`No cart item found with cartItemId: ${cartItemId}`);
            }
        }
        throw new Error('Failed to update cart item');
    });
};

// Delete Cart Item
module.exports.deleteCartItem = function deleteCartItem(cartItemId) {
    console.log(`Deleting cart item ${cartItemId}`);
    return prisma.cartItem.delete({
        where: {
            cartItemId: parseInt(cartItemId, 10)
        }
    }).then(function () {
        console.log('Cart item deleted');
    }).catch(function (error) {
        console.error('Error deleting cart item:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new Error(`No cart item found with cartItemId: ${cartItemId}`);
            }
        }
        throw new Error('Failed to delete cart item');
    });
};

// Retrieve All Cart Items for a Specific Member
module.exports.retrieveAll = function retrieveAll(memberId) {
    const parsedMemberId = parseInt(memberId, 10);
    console.log(`Retrieving all cart items for memberId: ${parsedMemberId}`);
    return prisma.cartItem.findMany({
        where: {
            memberId: parsedMemberId
        },
        include: {
            product: true,
        },
    }).then(function (cartItems) {
        console.log('All cart items retrieved:', cartItems);
        return cartItems;
    }).catch(function (error) {
        console.error('Error retrieving all cart items:', error);
        throw new Error('Failed to retrieve cart items');
    });
};

// Retrieve Cart Summary for a Specific Member
module.exports.retrieveSummary = function retrieveSummary(memberId) {
    const parsedMemberId = parseInt(memberId, 10);
    console.log(`Retrieving cart summary for memberId: ${parsedMemberId}`);
    return prisma.cartItem.findMany({
        where: {
            memberId: parsedMemberId
        },
        include: {
            product: true,
        },
    }).then(function (cartItems) {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.product.unitPrice, 0);
        const totalProduct = cartItems.length;

        const cartSummary = {
            totalQuantity,
            totalPrice,
            totalProduct
        };

        console.log('Cart summary retrieved:', cartSummary);
        return cartSummary;
    }).catch(function (error) {
        console.error('Error retrieving cart summary:', error);
        throw new Error('Failed to retrieve cart summary');
    });
};