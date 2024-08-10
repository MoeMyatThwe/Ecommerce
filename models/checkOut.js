const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports.processCheckout = async function (memberId) {
    const outOfStockItems = [];
    const cartItems = await prisma.cartItem.findMany({
        where: { memberId },
        include: { product: true }
    });

    const saleOrder = await prisma.saleOrder.create({
        data: {
            memberId: memberId,
            orderDatetime: new Date(),
            status: 'PACKING'
        }
    });

    for (const item of cartItems) {
        const availableStock = parseInt(item.product.stockQuantity);
        const requestedQuantity = parseInt(item.quantity);

        if (requestedQuantity > availableStock) {
            outOfStockItems.push(item.product.name);
            continue;
        }

        await prisma.product.update({
            where: { id: item.productId },
            data: { stockQuantity: availableStock - requestedQuantity }
        });

        await prisma.saleOrderItem.create({
            data: {
                saleOrderId: saleOrder.id,
                productId: item.productId,
                quantity: requestedQuantity
            }
        });

        await prisma.cartItem.delete({
            where: { cartItemId: item.cartItemId }
        });
    }

    return { outOfStockItems };
};
