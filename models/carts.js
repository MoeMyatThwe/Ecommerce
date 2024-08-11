
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

// Retrieve Single Cart Item by Member ID and Product ID
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

module.exports.createOrUpdateCartItem = async function createOrUpdateCartItem(memberId, productId, quantity) {
    const parsedMemberId = parseInt(memberId, 10);
    const parsedProductId = parseInt(productId, 10);
    console.log(`Creating or updating cart item for memberId: ${parsedMemberId}, productId: ${parsedProductId}, quantity: ${quantity}`);

    try {
        // Validate quantity
        if (quantity <= 0 || !Number.isInteger(quantity)) {
            const message = 'Quantity must be a positive integer.';
            return { success: false, message };
        }
        // Retrieve the existing cart item
        const existingCartItem = await module.exports.retrieveByProductAndMember(parsedMemberId, parsedProductId);

        // Retrieve the product to get the stock quantity
        const product = await prisma.product.findUnique({
            where: {
                id: parsedProductId
            }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Calculate the total quantity
        let newQuantity = quantity;
        if (existingCartItem) {
            newQuantity += existingCartItem.quantity;
        }

        // Check if the total quantity exceeds the available stock
        if (newQuantity > product.stockQuantity) {
            // Return the error message with the available stock quantity
            const message = `We only have ${product.stockQuantity} units available for this product. Your total requested quantity exceeds our stock.`;
            return { success: false, message };
        }

        // If the item exists, update it; otherwise, create a new item
        if (existingCartItem) {
            const updatedItem = await prisma.cartItem.update({
                where: {
                    cartItemId: existingCartItem.cartItemId
                },
                data: {
                    quantity: newQuantity
                }
            });
            return { success: true, cartItem: updatedItem };
        } else {
            const newItem = await prisma.cartItem.create({
                data: {
                    memberId: parsedMemberId,
                    productId: parsedProductId,
                    quantity: quantity
                }
            });
            return { success: true, cartItem: newItem };
        }
    } catch (error) {
        console.error('Error creating/updating cart item:', error);
        throw new Error('Failed to create/update cart item');
    }
};


// retrieve All
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
    })
    .then(function (cartItems) { 
        console.log('All cart items retrieved:', cartItems);
        return cartItems; 
    }).catch(function (error) {
        console.error('Error retrieving all cart items:', error);
        throw new Error('Failed to retrieve cart items');
    });
};


// Update Cart Item
module.exports.updateCartItem = function updateCartItem(cartItemId, quantity) {
    return prisma.cartItem.findUnique({
        where: {
            cartItemId: parseInt(cartItemId, 10)
        },
        include: {
            product: true,
        }
    }).then(function(cartItem) {
        if (!cartItem) {
            throw new Error (`No cart item found with cartItemId: ${cartItemId}`);
        }

        const newQuantity = quantity;

        if (cartItem.product.stockQuantity < newQuantity) {
            throw new Error(`The total quantity you want (${newQuantity}) exceeds the available stock (${cartItem.product.stockQuantity}).`);
        }
    
    return prisma.cartItem.update({
        where: {
            cartItemId: parseInt(cartItemId, 10)
        },
        data: {
            quantity: newQuantity
        }
    }).then(function (updatedCartItem) {
        console.log('Cart item updated:', updatedCartItem);
        return updatedCartItem;
    });
    }).catch(function (error) {
        console.error('Error updating cart item:', error);
        // if (error instanceof Prisma.PrismaClientKnownRequestError) {
        //    if (error.code === 'P2025') {
        //        throw new Error(`No cart item found with cartItemId: ${cartItemId}`);
        //    }
        // }
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


// Bulk update cart items
module.exports.bulkUpdateCartItems = async function bulkUpdateCartItems(updates) {
    try {
        const updatedItems = [];
        for (let update of updates) {
            const updatedItem = await prisma.cartItem.update({
                where: {
                    cartItemId: update.cartItemId
                },
                data: {
                    quantity: update.quantity
                }
            });
            updatedItems.push(updatedItem);
        }
        return updatedItems;
    } catch (error) {
        console.error('Error updating cart items:', error);
        throw new Error('Failed to update cart items.');
    }
};

// Bulk delete cart items
module.exports.bulkDeleteCartItems = async function bulkDeleteCartItems(cartItemIds) {
    try {
        const deletedItems = [];
        for (let cartItemId of cartItemIds) {
            const deletedItem = await prisma.cartItem.delete({
                where: {
                    cartItemId: cartItemId
                }
            });
            deletedItems.push(deletedItem);
        }
        return deletedItems;
    } catch (error) {
        console.error('Error deleting cart items:', error);
        throw new Error('Failed to delete cart items.');
    }
};
