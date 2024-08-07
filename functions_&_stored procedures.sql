--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-07-12 17:02:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 252 (class 1255 OID 18234)
-- Name: add_favourite(integer, integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.add_favourite(IN p_member_id integer, IN p_product_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM favourite
        WHERE member_id = p_member_id
          AND product_id = p_product_id
    ) THEN
        RAISE EXCEPTION 'Product is already in favourites for this member';
    ELSE
        INSERT INTO favourite (member_id, product_id, name, description, unit_price, country, product_type, image_url, manufactured_on)
        SELECT p_member_id, id, name, description, unit_price, country, product_type, image_url, manufactured_on
        FROM product
        WHERE id = p_product_id;
    END IF;
END;
$$;


--
-- TOC entry 247 (class 1255 OID 18161)
-- Name: compute_customer_lifetime_value(); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.compute_customer_lifetime_value()
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_customer_id INT;
    v_first_order_date TIMESTAMP;
    v_last_order_date TIMESTAMP;
    v_total_amount_spent NUMERIC;
    v_total_orders INT;
    v_average_purchase_value NUMERIC;
    v_purchase_frequency NUMERIC;
    v_retention_period NUMERIC := 2; -- Assumed retention period in years
    v_clv NUMERIC;
    v_customer_lifetime NUMERIC;
BEGIN
    -- Loop through each member
    FOR v_customer_id IN (SELECT id FROM member)
    LOOP
        -- Reset variables for each member
        v_total_amount_spent := 0;
        v_total_orders := 0;
        v_average_purchase_value := NULL;
        v_purchase_frequency := NULL;
        v_clv := NULL;
        
        -- Get the first and last order dates for the customer
        SELECT MIN(so.order_datetime), MAX(so.order_datetime)
        INTO v_first_order_date, v_last_order_date
        FROM sale_order so
        WHERE so.member_id = v_customer_id
        AND so.status = 'COMPLETED'; -- Ensure only completed orders are considered
        
        -- Calculate total amount spent and total number of orders
        SELECT COALESCE(SUM(soi.quantity * p.unit_price), 0), COUNT(so.id)
        INTO v_total_amount_spent, v_total_orders
        FROM sale_order so
        JOIN sale_order_item soi ON so.id = soi.sale_order_id
        JOIN product p ON soi.product_id = p.id
        WHERE so.member_id = v_customer_id
        AND so.status = 'COMPLETED'; -- Ensure only completed orders are considered

        -- Calculate average purchase value
        IF v_total_orders > 1 THEN
            v_average_purchase_value := v_total_amount_spent / v_total_orders;
        ELSE
            v_average_purchase_value := NULL; -- Handle case where fewer than 2 orders
        END IF;

        -- Calculate customer lifetime in years
        IF v_last_order_date IS NOT NULL AND v_first_order_date IS NOT NULL THEN
            v_customer_lifetime := ROUND(EXTRACT(EPOCH FROM v_last_order_date - v_first_order_date)/31536000.0, 2);
        ELSE
            v_customer_lifetime := NULL; -- Handle case where dates are NULL
        END IF;

        -- Calculate purchase frequency
        IF v_customer_lifetime IS NOT NULL AND v_customer_lifetime > 0 THEN
            v_purchase_frequency := v_total_orders / v_customer_lifetime;
        ELSE
            v_purchase_frequency := NULL; -- Handle case where customer lifetime is NULL or zero
        END IF;

        -- Calculate CLV
        IF v_average_purchase_value IS NOT NULL AND v_purchase_frequency IS NOT NULL THEN
            v_clv := v_average_purchase_value * v_purchase_frequency * v_retention_period;
        ELSE
            v_clv := NULL; -- Handle case where either metric is NULL
        END IF;

        -- Update CLV for the current customer
        UPDATE member
        SET clv = v_clv
        WHERE id = v_customer_id;
    END LOOP;
END;
$$;


--
-- TOC entry 245 (class 1255 OID 18154)
-- Name: compute_running_total_spending(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.compute_running_total_spending() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Update running_total_spending for recently active members
  UPDATE member
  SET running_total_spending = (
    SELECT COALESCE(SUM(soi.quantity * p.unit_price), 0)
    FROM sale_order_item soi
    JOIN sale_order so ON soi.sale_order_id = so.id
    JOIN product p ON soi.product_id = p.id
    WHERE so.member_id = member.id
    AND so.status = 'COMPLETED'
  )
  WHERE last_login_on >= NOW() - INTERVAL '6 months';

  -- Set running_total_spending to NULL for inactive members
  UPDATE member
  SET running_total_spending = NULL
  WHERE last_login_on < NOW() - INTERVAL '6 months';
END;
$$;


--
-- TOC entry 231 (class 1255 OID 18100)
-- Name: create_review(integer, integer, integer, integer, text); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.create_review(IN p_sale_order_id integer, IN p_member_id integer, IN p_product_id integer, IN p_rating integer, IN p_review_text text)
    LANGUAGE plpgsql
    AS $$ BEGIN -- Check if  if a member attempts to add review for a product on which he/she has no completed order status = 'COMPLETED'
    IF NOT EXISTS (
        SELECT 1
        FROM sale_order so
            JOIN sale_order_item soi ON so.id = soi.sale_order_id
        WHERE so.id = p_sale_order_id
            AND so.member_id = p_member_id
            AND soi.product_id = p_product_id
            AND so.status = 'COMPLETED'
    ) THEN RAISE EXCEPTION 'Sale order is not completed or the member does not belong to the sale order or product';
END IF;
-- Check if the review the member can add exactly one review for a product for specific order
IF EXISTS (
    SELECT *
    FROM reviews
    WHERE sale_order_id = p_sale_order_id
        AND member_id = p_member_id
        AND product_id = p_product_id
) THEN RAISE EXCEPTION 'A review already exists for this sale order and product';
END IF;

-- Insert the review
INSERT INTO reviews
    (sale_order_id, member_id, product_id, rating, review_text)
VALUES
    (p_sale_order_id, p_member_id, p_product_id, p_rating, p_review_text);
END $$;


--
-- TOC entry 244 (class 1255 OID 18148)
-- Name: delete_review(integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.delete_review(IN p_review_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM reviews WHERE id = p_review_id;
END;
$$;


--
-- TOC entry 248 (class 1255 OID 18196)
-- Name: get_age_group_spending(character varying, numeric, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_age_group_spending(p_gender character varying, p_min_total_spending numeric, p_min_member_total_spending numeric) RETURNS TABLE(age_group character varying, total_spending numeric, member_count integer, avg_total_spending numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH age_spending AS (
        SELECT 
            CAST(
                CASE
                    WHEN EXTRACT(YEAR FROM AGE(current_date, m.dob)) BETWEEN 18 AND 29 THEN '18-29'
                    WHEN EXTRACT(YEAR FROM AGE(current_date, m.dob)) BETWEEN 30 AND 39 THEN '30-39'
                    WHEN EXTRACT(YEAR FROM AGE(current_date, m.dob)) BETWEEN 40 AND 49 THEN '40-49'
                    WHEN EXTRACT(YEAR FROM AGE(current_date, m.dob)) BETWEEN 50 AND 59 THEN '50-59'
                    WHEN EXTRACT(YEAR FROM AGE(current_date, m.dob)) >= 60 THEN '60+'
                    ELSE 'Unknown'
                END AS VARCHAR
            ) AS age_group_col,
            COALESCE(SUM(soi.quantity * p.unit_price), 0) AS total_spending_col,
            COUNT(DISTINCT m.id)::INTEGER AS member_count_col
        FROM 
            member m
            JOIN sale_order so ON m.id = so.member_id
            JOIN sale_order_item soi ON so.id = soi.sale_order_id
            JOIN product p ON soi.product_id = p.id
        WHERE 
            (p_gender IS NULL OR m.gender = p_gender)
        GROUP BY 
            age_group_col
        HAVING 
            COALESCE(SUM(soi.quantity * p.unit_price), 0) >= p_min_member_total_spending
    )
    SELECT 
        age_group_col AS age_group, 
        total_spending_col AS total_spending, 
        member_count_col AS member_count,
		(total_spending_col/member_count_col)::NUMERIC AS avg_total_spending
    FROM 
        age_spending
	WHERE (total_spending_col/member_count_col)::NUMERIC >= p_min_total_spending;
END;
$$;


--
-- TOC entry 251 (class 1255 OID 18291)
-- Name: get_all_favourites(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_all_favourites(p_member_id integer) RETURNS TABLE(favourite_id integer, product_id integer, name character varying, description text, unit_price numeric, country character varying, product_type character varying, image_url character varying, manufactured_on timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT f.favourite_id AS favourite_id, p.id AS product_id, p.name, p.description, p.unit_price, p.country, p.product_type, p.image_url, p.manufactured_on
    FROM favourite f
    JOIN product p ON f.product_id = p.id
    WHERE f.member_id = p_member_id;
END $$;


--
-- TOC entry 246 (class 1255 OID 18143)
-- Name: get_all_reviews(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_all_reviews(p_member_id integer) RETURNS TABLE(review_id integer, product_id integer, product_name character varying, rating integer, review_text text, review_date date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.product_id, p.name,r.rating,r.review_text, r.review_date
    FROM reviews r
    JOIN product p ON r.product_id = p.id
    WHERE r.member_id = p_member_id
    order by r.id;
END $$;


--
-- TOC entry 250 (class 1255 OID 18290)
-- Name: get_favourite_by_id(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_favourite_by_id(p_favourite_id integer) RETURNS TABLE(favourite_id integer, product_id integer, name character varying, description text, unit_price numeric, country character varying, product_type character varying, image_url character varying, manufactured_on timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT f.favourite_id, f.product_id, p.name, p.description, p.unit_price, p.country, p.product_type, p.image_url, p.manufactured_on
    FROM favourite f
    JOIN product p ON f.product_id = p.id
    WHERE f.favourite_id = p_favourite_id;
END $$;


--
-- TOC entry 253 (class 1255 OID 18343)
-- Name: get_popular_favourites(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_popular_favourites() RETURNS TABLE(product_name character varying, description text, unit_price numeric, favourite_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT p.name, p.description, p.unit_price, COUNT(*)::INTEGER AS favourite_count
    FROM favourite f
    JOIN product p ON f.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY favourite_count DESC
	LIMIT 5;
END;
$$;


--
-- TOC entry 249 (class 1255 OID 18236)
-- Name: remove_favourite(integer); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.remove_favourite(IN p_product_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM favourite
    WHERE product_id = p_product_id;
END;
$$;


--
-- TOC entry 243 (class 1255 OID 18145)
-- Name: update_review(integer, integer, integer, text); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.update_review(IN p_review_id integer, IN p_member_id integer, IN p_rating integer, IN p_review_text text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure the member is updating their own review
    IF NOT EXISTS (
        SELECT 1
        FROM reviews
        WHERE id = p_review_id AND member_id = p_member_id
    ) THEN
        RAISE EXCEPTION 'Review not found or you do not have permission to update this review';
    END IF;

    -- Update the review
    UPDATE reviews
    SET rating = p_rating, review_text = p_review_text, review_date = CURRENT_DATE
    WHERE id = p_review_id AND member_id = p_member_id;
END $$;


--
-- TOC entry 228 (class 1259 OID 18271)
-- Name: favourite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favourite (
    favourite_id integer NOT NULL,
    member_id integer NOT NULL,
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    unit_price numeric(10,2) NOT NULL,
    country character varying(255),
    product_type character varying(255),
    image_url text,
    manufactured_on timestamp without time zone
);


--
-- TOC entry 227 (class 1259 OID 18270)
-- Name: favourite_favourite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favourite_favourite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 227
-- Name: favourite_favourite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favourite_favourite_id_seq OWNED BY public.favourite.favourite_id;


--
-- TOC entry 217 (class 1259 OID 16739)
-- Name: member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    dob date NOT NULL,
    password character varying(255) NOT NULL,
    role integer NOT NULL,
    gender character(1) NOT NULL,
    last_login_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    clv numeric(10,3),
    running_total_spending numeric(10,3)
);


--
-- TOC entry 218 (class 1259 OID 16743)
-- Name: member_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 218
-- Name: member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.member_id_seq OWNED BY public.member.id;


--
-- TOC entry 219 (class 1259 OID 16744)
-- Name: member_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member_role (
    id integer NOT NULL,
    name character varying(25)
);


--
-- TOC entry 220 (class 1259 OID 16747)
-- Name: member_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.member_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 220
-- Name: member_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.member_role_id_seq OWNED BY public.member_role.id;


--
-- TOC entry 221 (class 1259 OID 16748)
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(255),
    description text,
    unit_price numeric NOT NULL,
    stock_quantity numeric DEFAULT 0 NOT NULL,
    country character varying(100),
    product_type character varying(50),
    image_url character varying(255) DEFAULT '/images/product.png'::character varying,
    manufactured_on timestamp without time zone
);


--
-- TOC entry 222 (class 1259 OID 16755)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 222
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 230 (class 1259 OID 18318)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    sale_order_id integer NOT NULL,
    member_id integer NOT NULL,
    product_id integer NOT NULL,
    rating integer NOT NULL,
    review_text text NOT NULL,
    review_date date DEFAULT CURRENT_DATE
);


--
-- TOC entry 229 (class 1259 OID 18317)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 229
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 223 (class 1259 OID 16756)
-- Name: sale_order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_order (
    id integer NOT NULL,
    member_id integer,
    order_datetime timestamp without time zone NOT NULL,
    status character varying(10)
);


--
-- TOC entry 224 (class 1259 OID 16759)
-- Name: sale_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sale_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 224
-- Name: sale_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sale_order_id_seq OWNED BY public.sale_order.id;


--
-- TOC entry 225 (class 1259 OID 16760)
-- Name: sale_order_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_order_item (
    id integer NOT NULL,
    sale_order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity numeric NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16765)
-- Name: sale_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sale_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 226
-- Name: sale_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sale_order_item_id_seq OWNED BY public.sale_order_item.id;


--
-- TOC entry 4740 (class 2604 OID 18274)
-- Name: favourite favourite_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite ALTER COLUMN favourite_id SET DEFAULT nextval('public.favourite_favourite_id_seq'::regclass);


--
-- TOC entry 4732 (class 2604 OID 16766)
-- Name: member id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member ALTER COLUMN id SET DEFAULT nextval('public.member_id_seq'::regclass);


--
-- TOC entry 4734 (class 2604 OID 16767)
-- Name: member_role id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_role ALTER COLUMN id SET DEFAULT nextval('public.member_role_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 16768)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 4741 (class 2604 OID 18321)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 16769)
-- Name: sale_order id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order ALTER COLUMN id SET DEFAULT nextval('public.sale_order_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 16770)
-- Name: sale_order_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order_item ALTER COLUMN id SET DEFAULT nextval('public.sale_order_item_id_seq'::regclass);


--
-- TOC entry 4758 (class 2606 OID 18278)
-- Name: favourite favourite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT favourite_pkey PRIMARY KEY (favourite_id);


--
-- TOC entry 4744 (class 2606 OID 16772)
-- Name: member member_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_email_key UNIQUE (email);


--
-- TOC entry 4746 (class 2606 OID 16774)
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- TOC entry 4750 (class 2606 OID 16776)
-- Name: member_role member_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member_role
    ADD CONSTRAINT member_role_pkey PRIMARY KEY (id);


--
-- TOC entry 4748 (class 2606 OID 16778)
-- Name: member member_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_username_key UNIQUE (username);


--
-- TOC entry 4752 (class 2606 OID 16780)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 18326)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 16782)
-- Name: sale_order_item sale_order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order_item
    ADD CONSTRAINT sale_order_item_pkey PRIMARY KEY (id);


--
-- TOC entry 4754 (class 2606 OID 16784)
-- Name: sale_order sale_order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order
    ADD CONSTRAINT sale_order_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 18279)
-- Name: favourite fk_member; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES public.member(id);


--
-- TOC entry 4761 (class 2606 OID 16785)
-- Name: member fk_member_role_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT fk_member_role_id FOREIGN KEY (role) REFERENCES public.member_role(id);


--
-- TOC entry 4766 (class 2606 OID 18284)
-- Name: favourite fk_product; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favourite
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- TOC entry 4763 (class 2606 OID 16790)
-- Name: sale_order_item fk_sale_order_item_product; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order_item
    ADD CONSTRAINT fk_sale_order_item_product FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- TOC entry 4764 (class 2606 OID 16795)
-- Name: sale_order_item fk_sale_order_item_sale_order; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order_item
    ADD CONSTRAINT fk_sale_order_item_sale_order FOREIGN KEY (sale_order_id) REFERENCES public.sale_order(id);


--
-- TOC entry 4762 (class 2606 OID 16800)
-- Name: sale_order fk_sale_order_member; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_order
    ADD CONSTRAINT fk_sale_order_member FOREIGN KEY (member_id) REFERENCES public.member(id);


--
-- TOC entry 4767 (class 2606 OID 18332)
-- Name: reviews reviews_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.member(id);


--
-- TOC entry 4768 (class 2606 OID 18337)
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- TOC entry 4769 (class 2606 OID 18327)
-- Name: reviews reviews_sale_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_sale_order_id_fkey FOREIGN KEY (sale_order_id) REFERENCES public.sale_order(id);


-- Completed on 2024-07-12 17:02:13

--
-- PostgreSQL database dump complete
--
