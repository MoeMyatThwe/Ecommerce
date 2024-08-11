-- T1
BEGIN;

-- Read the total quantity of items in a specific sale order
SELECT SUM(quantity) FROM sale_order_item WHERE sale_order_id = 1;

-- simulate delay
SELECT pg_sleep(20);

-- Read the total quantity of items again
SELECT SUM(quantity) FROM sale_order_item WHERE sale_order_id = 1;


