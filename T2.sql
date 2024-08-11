-- T2
BEGIN;

-- Insert a new item into the sale order
INSERT INTO sale_order_item(sale_order_id, product_id, quantity)
VALUES (1, 5, 10);

COMMIT;
