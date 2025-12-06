--
-- PostgreSQL database dump
--

\restrict Mtbd0eC2YJXPAI5s6JcMartXQee9JqDgWdflFoC1wGveFwJg2eHYkJpLgP0oCdx

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    active boolean DEFAULT true,
    client_name character varying(255) NOT NULL,
    gst_no character varying(50),
    street_address text,
    street_address_2 text,
    city character varying(100),
    state character varying(100),
    zip_code character varying(20),
    phone_number character varying(20),
    fax_number character varying(20),
    mobile_number character varying(20),
    email_address character varying(255),
    web_address character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: host_gst_numbers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.host_gst_numbers (
    gst_id integer NOT NULL,
    host_id integer NOT NULL,
    gst_number character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.host_gst_numbers OWNER TO postgres;

--
-- Name: host_gst_numbers_gst_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.host_gst_numbers_gst_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.host_gst_numbers_gst_id_seq OWNER TO postgres;

--
-- Name: host_gst_numbers_gst_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.host_gst_numbers_gst_id_seq OWNED BY public.host_gst_numbers.gst_id;


--
-- Name: host_information; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.host_information (
    host_id integer NOT NULL,
    host_name character varying(100) NOT NULL,
    host_pan_number character varying(20) NOT NULL,
    rating numeric(2,1),
    host_email character varying(100) NOT NULL,
    host_contact_number character varying(15) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    host_owner_name character varying(100),
    CONSTRAINT host_information_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.host_information OWNER TO postgres;

--
-- Name: host_information_host_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.host_information_host_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.host_information_host_id_seq OWNER TO postgres;

--
-- Name: host_information_host_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.host_information_host_id_seq OWNED BY public.host_information.host_id;


--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id bigint NOT NULL,
    invoice_id bigint NOT NULL,
    location character varying(255),
    description character varying(255),
    hsn_sac_code character varying(50),
    days integer DEFAULT 0,
    rate numeric(15,2) DEFAULT 0.00,
    tax_amount numeric(15,2) DEFAULT 0.00,
    total_amount numeric(15,2) DEFAULT 0.00,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_items_id_seq OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_items_id_seq OWNED BY public.invoice_items.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id bigint NOT NULL,
    invoice_number character varying(255),
    reservation_id bigint,
    invoice_date date,
    invoice_to character varying(255),
    state_for_billing character varying(255) DEFAULT 'Maharashtra'::character varying,
    pan_number character varying(50),
    status character varying(20) DEFAULT 'Draft'::character varying,
    payment_method character varying(50),
    currency character varying(10) DEFAULT 'INR'::character varying,
    conversion_rate numeric(10,4) DEFAULT 1.0000,
    sub_total numeric(15,2) DEFAULT 0.00,
    tax_total numeric(15,2) DEFAULT 0.00,
    grand_total numeric(15,2) DEFAULT 0.00,
    display_taxes character varying(50) DEFAULT 'SGST & CGST'::character varying,
    display_food_charge boolean DEFAULT true,
    extra_services boolean DEFAULT false,
    services_name character varying(255),
    services_amount numeric(15,2) DEFAULT 0.00,
    pdf_password character varying(255),
    page_break integer DEFAULT 5,
    guest_name_width numeric(5,2) DEFAULT 18.00,
    round_off_value numeric(5,2) DEFAULT 0.00,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT invoices_status_check CHECK (((status)::text = ANY ((ARRAY['Draft'::character varying, 'Sent'::character varying, 'Paid'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: pincodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pincodes (
    pincode_id integer NOT NULL,
    pincode integer NOT NULL,
    city character varying(100)
);


ALTER TABLE public.pincodes OWNER TO postgres;

--
-- Name: pincodes_pincode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pincodes_pincode_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pincodes_pincode_id_seq OWNER TO postgres;

--
-- Name: pincodes_pincode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pincodes_pincode_id_seq OWNED BY public.pincodes.pincode_id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    property_id integer NOT NULL,
    property_status character varying(50) NOT NULL,
    host_id integer NOT NULL,
    ivr_number character varying(50),
    pincode_id integer NOT NULL,
    manual_pincode character varying(10),
    city character varying(100),
    location character varying(255),
    post_id character varying(100),
    property_type character varying(50),
    manual_host_name character varying(255),
    contact_person character varying(100),
    contact_number character varying(15),
    email_id character varying(255),
    caretaker_name character varying(100),
    caretaker_number character varying(15),
    note text,
    check_in_time time without time zone,
    check_out_time time without time zone,
    master_bedroom integer,
    common_bedroom integer,
    landmark character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    address3 character varying(255),
    thumbnail text,
    property_url text,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- Name: properties_property_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.properties_property_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_property_id_seq OWNER TO postgres;

--
-- Name: properties_property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.properties_property_id_seq OWNED BY public.properties.property_id;


--
-- Name: property_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_rooms (
    id integer NOT NULL,
    property_id integer,
    room_type character varying(50) NOT NULL,
    room_name character varying(100),
    max_occupancy integer DEFAULT 2,
    is_active boolean DEFAULT true
);


ALTER TABLE public.property_rooms OWNER TO postgres;

--
-- Name: property_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_rooms_id_seq OWNER TO postgres;

--
-- Name: property_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_rooms_id_seq OWNED BY public.property_rooms.id;


--
-- Name: reservation_additional_guests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_additional_guests (
    id integer NOT NULL,
    reservation_id integer,
    guest_name character varying(255),
    cid date,
    cod date,
    room_type character varying(100),
    occupancy character varying(50),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reservation_additional_guests OWNER TO postgres;

--
-- Name: reservation_additional_guests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_additional_guests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservation_additional_guests_id_seq OWNER TO postgres;

--
-- Name: reservation_additional_guests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_additional_guests_id_seq OWNED BY public.reservation_additional_guests.id;


--
-- Name: reservation_additional_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_additional_info (
    id integer NOT NULL,
    reservation_id integer,
    host_name character varying(255),
    host_email character varying(255),
    host_base_rate numeric(10,2),
    host_taxes numeric(10,2),
    host_total_amount numeric(10,2),
    contact_person character varying(255),
    contact_number character varying(20),
    comments text,
    services jsonb,
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reservation_additional_info OWNER TO postgres;

--
-- Name: reservation_additional_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_additional_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservation_additional_info_id_seq OWNER TO postgres;

--
-- Name: reservation_additional_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_additional_info_id_seq OWNED BY public.reservation_additional_info.id;


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    reservation_no character varying(50) NOT NULL,
    client_id integer,
    property_id integer,
    guest_name character varying(255) NOT NULL,
    guest_email character varying(255),
    contact_number character varying(20),
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    check_in_time time without time zone DEFAULT '12:00:00'::time without time zone,
    check_out_time time without time zone DEFAULT '11:00:00'::time without time zone,
    occupancy integer,
    base_rate numeric(10,2),
    taxes numeric(10,2),
    total_tariff numeric(10,2),
    payment_mode character varying(50),
    tariff_type character varying(50),
    chargeable_days integer,
    admin_email character varying(255),
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_seq OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;


--
-- Name: room_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_bookings (
    id integer NOT NULL,
    reservation_id integer,
    room_type character varying(50) NOT NULL,
    property_id integer,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying
);


ALTER TABLE public.room_bookings OWNER TO postgres;

--
-- Name: room_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.room_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.room_bookings_id_seq OWNER TO postgres;

--
-- Name: room_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.room_bookings_id_seq OWNED BY public.room_bookings.id;


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: host_gst_numbers gst_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_gst_numbers ALTER COLUMN gst_id SET DEFAULT nextval('public.host_gst_numbers_gst_id_seq'::regclass);


--
-- Name: host_information host_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_information ALTER COLUMN host_id SET DEFAULT nextval('public.host_information_host_id_seq'::regclass);


--
-- Name: invoice_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items ALTER COLUMN id SET DEFAULT nextval('public.invoice_items_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: pincodes pincode_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pincodes ALTER COLUMN pincode_id SET DEFAULT nextval('public.pincodes_pincode_id_seq'::regclass);


--
-- Name: properties property_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties ALTER COLUMN property_id SET DEFAULT nextval('public.properties_property_id_seq'::regclass);


--
-- Name: property_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_rooms ALTER COLUMN id SET DEFAULT nextval('public.property_rooms_id_seq'::regclass);


--
-- Name: reservation_additional_guests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_additional_guests ALTER COLUMN id SET DEFAULT nextval('public.reservation_additional_guests_id_seq'::regclass);


--
-- Name: reservation_additional_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_additional_info ALTER COLUMN id SET DEFAULT nextval('public.reservation_additional_info_id_seq'::regclass);


--
-- Name: reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);


--
-- Name: room_bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_bookings ALTER COLUMN id SET DEFAULT nextval('public.room_bookings_id_seq'::regclass);


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, active, client_name, gst_no, street_address, street_address_2, city, state, zip_code, phone_number, fax_number, mobile_number, email_address, web_address, created_at, updated_at) FROM stdin;
2	t	Bright Future Ltd	GSTIN67890	45 Park Street	Opp. City Mall	Mumbai	Maharashtra	400001	0223344556	0226655443	9988776655	info@brightfuture.com	http://brightfuture.com	2025-09-11 12:49:19.981009	2025-09-11 12:49:19.981009
3	f	Green Energy Corp	GSTIN11122	78 Nehru Place	Tower B	Delhi	Delhi	110019	0112233445	0115566778	9123456780	sales@greenenergy.com	http://greenenergy.com	2025-09-11 12:49:19.981009	2025-09-11 12:49:19.981009
12	t	Green Earth Traders	27AAACT1234A1Z5	123 MG Road	Near Central Mall			560001	080-12345678	080-87654321	9876543210	infotact@greenearth.com	https://techsolutions.com	2025-09-11 16:18:29.161784	2025-09-11 16:18:29.161784
14	t	First Livingspaces Private Limited	27AABCF0036F1Z6	Raheja Platinum, Road, Off Andheri - Kurla Road, 	Andheri East Marol	Mumbai	Maharashtra	400059						2025-10-10 10:08:59.320037	2025-10-10 10:08:59.320037
7	f	Skyline Constructions	GSTIN99900	88 Builders Colony	Sector 9	Pune	Maharashtra	411001	0206677889	0209988776	9776655443	info@skylineconst.com	http://skylineconst.com	2025-09-11 12:49:19.981009	2025-12-05 01:11:00.478
8	t	ABC Pvt Ltd	29ABCDE1234F2Z5	123 MG Road	Near Central Mall	Bangalore	Karnataka	560001	08012345678	08087654321	9876543210	contact@abcpvtltd.com	https://www.abcpvtltd.com	2025-09-11 16:07:15.940785	2025-12-06 22:50:25.164
5	t	Blue Ocean Travels	GSTIN55566	21 Beach Road	Suite 4	Goa	Goa	403001	0832123456	0832654321	9556677889	support@blueocean.com	http://blueoceantravels.com	2025-09-11 12:49:19.981009	2025-12-06 22:53:33.731
10	t	Tech Solutions Pvt Ltd the	27AAACT1234A1Z5	123 MG Road	Near Central Mall	Bengaluru	Karnataka	560001	080-12345678	080-87654321	9876543210	info@techsolutions.com	https://techsolutions.com	2025-09-11 16:13:10.480534	2025-12-06 22:54:01.145
1	t	Tech Solutions Pvt Ltd	GSTIN12345	12 MG Road	Near Metro Station	Bangalore	Karnataka	560001	0801234567	0807654321	9876543210	contact@techsolutions.com	http://techsolutions.com	2025-09-11 12:49:19.981009	2025-12-06 22:54:16.027
\.


--
-- Data for Name: host_gst_numbers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.host_gst_numbers (gst_id, host_id, gst_number, created_at) FROM stdin;
9	18	27ABCDE1234F1Z5	2025-09-08 19:17:14.448819
10	18	29ABCDE1234F1Z7	2025-09-08 19:17:14.486137
13	21	27AAJCS4517L1ZY	2025-09-19 08:55:21.851444
16	26	27AAAAK0187B1Z2	2025-09-20 10:04:13.644697
17	27	27CKQPS1067M2ZB	2025-09-20 10:05:58.422065
18	28	27BOWPS5234R1ZO	2025-09-20 10:06:44.402763
19	29	27AAECO5441Q1ZW	2025-09-20 10:07:32.734831
20	30	27DAPPK6384F1Z6	2025-09-20 10:09:02.559288
21	34	27ANZPM5631K1Z7	2025-10-10 10:06:20.992877
\.


--
-- Data for Name: host_information; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.host_information (host_id, host_name, host_pan_number, rating, host_email, host_contact_number, created_at, host_owner_name) FROM stdin;
18	Green Stay Pvt Ltd	AGCDE1234F	4.5	greenstay@example.com	9455315007	2025-09-08 19:17:14.440757	Amit Sharma
20	harshit	ABCDE1234H	1.0	fajhfdklr@gamil.com	7482037594	2025-09-08 19:46:52.958343	poorent shukla
21	PAJASA	AAHCP7561R	3.0	paras@pajasa.com	7738777602	2025-09-19 08:55:21.693253	Paras Sangwan
26	Ashok Deluxe Apartment	AAAAK0187B	4.0	info@ashokdeluxe.com	9833787741	2025-09-20 10:04:13.488774	Heena Mam
23	Veridical Hospitality	AEZPC4308Q	4.0	booking@veridicalhospitality.com	9833168145	2025-09-19 17:23:22.809339	Anindita Mam
27	Staywood Business Accomodation Solution	CKQPS1067M	4.0	operations@staywood.in	9326845060	2025-09-20 10:05:58.262715	Megha Mam
28	Rely On Us	BOWPS5234R	4.0	prashant@relyonservices.in	9820736442	2025-09-20 10:06:44.246525	Prashant Sir
29	OSI Apartments Powai	AAECO5441Q	3.0	sales@osiapartments.in	9766693868	2025-09-20 10:07:32.576018	Prem Sir
30	Welcome Home & Service Apartments	DAPPK6384F	4.0	welcomehomeserviceapartments@gmail.com	7979762299	2025-09-20 10:09:02.401115	Shravan Sir
34	Divine Art House	ANZPM5631K	3.0	emehra00@gmail.com	8050890867	2025-10-10 10:06:20.83362	Eshan Mehra
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, invoice_id, location, description, hsn_sac_code, days, rate, tax_amount, total_amount, created_at, updated_at) FROM stdin;
1	1	Powai	0	0	2	4250.00	5.00	4462.50	2025-11-30 23:08:10.784271	2025-11-30 23:08:10.784271
2	2	Kalina	0	0	2	4000.00	5.00	4200.00	2025-11-30 23:10:24.927169	2025-11-30 23:10:24.927169
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_number, reservation_id, invoice_date, invoice_to, state_for_billing, pan_number, status, payment_method, currency, conversion_rate, sub_total, tax_total, grand_total, display_taxes, display_food_charge, extra_services, services_name, services_amount, pdf_password, page_break, guest_name_width, round_off_value, created_at, updated_at) FROM stdin;
1	RES1760091410056	5	2025-11-10	Jyoti	Maharashtra		Draft	Select the Payment Method	INR	1.0000	4250.00	5.00	4462.50	SGST & CGST	t	f		0.00		5	18.00	0.00	2025-11-30 23:08:10.784271	2025-11-30 23:08:10.784271
2	RES1760696589484	7	2025-10-18	Jyoti	Maharashtra		Draft	Select the Payment Method	INR	1.0000	4000.00	5.00	4200.00	SGST & CGST	t	f		0.00		5	18.00	0.00	2025-11-30 23:10:24.927169	2025-11-30 23:10:24.927169
\.


--
-- Data for Name: pincodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pincodes (pincode_id, pincode, city) FROM stdin;
2	400051	Mumbai
3	400076	Mumbai
4	400098	Mumbai
5	400028	Mumbai
6	411019	Pune
7	411057	Pune
8	110048	Delhi
9	110024	Delhi
10	560034	Bengaluru
11	500034	Hyderabad
12	500084	Hyderabad
13	500081	Hyderabad
14	122016	Gurugram
15	122009	Gurugram
16	700091	Kolkata
17	700014	Kolkata
18	600040	Chennai
19	600028	Chennai
20	380015	Ahmedabad
21	382213	Ahmedabad
23	400072	Mumbai
25	4000615	Thane
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (property_id, property_status, host_id, ivr_number, pincode_id, manual_pincode, city, location, post_id, property_type, manual_host_name, contact_person, contact_number, email_id, caretaker_name, caretaker_number, note, check_in_time, check_out_time, master_bedroom, common_bedroom, landmark, address1, address2, address3, thumbnail, property_url, updated_at) FROM stdin;
9	Inactive	20	IVR003	3	\N	Delhi	Connaught Place	POST003	Guest House	\N	Aman Verma	9001122334	aman@example.com	Ravi Singh	9334455667	In the heart of Delhi	13:00:00	09:00:00	4	1	Near Rajiv Chowk Metro	56 Janpath	Opp. Central Park	Block C	thumb3.jpg	http://example.com/property3	2025-12-06 23:39:42.061118
11	active	23		3	\N	Mumbai	powai		3 BHK	\N	Anindita Mam	9833168145	booking@veridicalhospitality.com	Anand	9867105819		11:27:00	10:29:00	1	1	iuoerur	dsfjkdjfdklsf					2025-12-06 23:39:42.061118
14	active	30		11	\N	Hyderabad				\N	Shravan Sir	7979762299	welcomehomeserviceapartments@gmail.com				\N	\N	0	0							2025-12-06 23:39:42.061118
16	active	27		17	\N	Kolkata				\N	Megha Mam	9326845060	operations@staywood.in				\N	\N	0	0							2025-12-06 23:39:42.061118
17	active	21		4	\N	Mumbai	Kalina		3 BHK	\N	Paras Sangwan	7738777602	paras@pajasa.com	Suresh	97692 14725		14:00:00	11:00:00	2	1	Opposite University Campus	B-903 Sanghvi Infenia Kalina,Vidyanagari Marg	Opposite University Campus, Kalina	Santacruz East, Mumbai - 400098			2025-12-06 23:39:42.061118
18	active	23		3	\N	Mumbai	Powai		3 BHK	\N	Anindita Mam	9833168145	booking@veridicalhospitality.com	Anand	98671 05819		14:00:00	11:00:00	3	0	Behind SM Shetty School Powa	504/505,5th Floor, Panch Smruti Tower	Chandivali Farm Road, Behind SM Shetty School 	Powai, Mumbai-400076		https://www.pajasaapartments.com/in/mumbai/powai/3-bhk-service-apartments-in-powai-mumbai/	2025-12-06 23:39:42.061118
19	active	27		4	\N	Mumbai	Santacruz		2 BHK	\N	Megha Mam	9326845060	operations@staywood.in				14:00:00	11:00:00	1	1	Next to Allcargo office	Sunshine Height, Flat No 1002,  Opp Golden Square	Sunder Nagar Road No.3, Next to Allcargo office	Santacruz  East Mumbai-400098			2025-12-06 23:39:42.061118
20	active	28		5	\N	Mumbai	Dadar		2 BHK	\N	Prashant Sir	9820736442	prashant@relyonservices.in				14:00:00	11:00:00	1	1		903,9th floor,Ram Swaroop Palai Towe	Dadar West, Baburao Parulekar Marg	Dadar West,Mumbai-400028			2025-12-06 23:39:42.061118
23	active	26		23	\N	Mumbai	Andheri		studio	\N	Heena Mam	9833787741	info@ashokdeluxe.com				14:00:00	11:00:00	1	0		Ashok Deluxe apartments, Ashok Nagar Bldg # 3,	Off Marol Military Road, Near Raj Oil Mill,	Marol, Andheri E, Mumbai-400072			2025-12-06 23:39:42.061118
22	active	29		23	\N	Mumbai	Powai		1 BHK	\N	Prem Sir	9766693868	sales@osiapartments.in				14:00:00	11:00:00	1	0		Aleta Residencies, Off, Saki Vihar Rd	Tunga Village, Chandivali, Powai, Mumbai - 400072				2025-12-06 23:40:01.742751
\.


--
-- Data for Name: property_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_rooms (id, property_id, room_type, room_name, max_occupancy, is_active) FROM stdin;
\.


--
-- Data for Name: reservation_additional_guests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_additional_guests (id, reservation_id, guest_name, cid, cod, room_type, occupancy, address, created_at) FROM stdin;
\.


--
-- Data for Name: reservation_additional_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_additional_info (id, reservation_id, host_name, host_email, host_base_rate, host_taxes, host_total_amount, contact_person, contact_number, comments, services, note, created_at) FROM stdin;
1	1			0.00	0.00	0.00				{"wifi": false, "vegLunch": false, "vegDinner": false, "nonVegLunch": false, "nonVegDinner": false, "morningBreakfast": false}		2025-09-27 07:15:17.468261
2	2			0.00	0.00	0.00				{"wifi": false, "vegLunch": false, "vegDinner": false, "nonVegLunch": false, "nonVegDinner": false, "morningBreakfast": false}		2025-09-27 08:26:51.075347
3	3			0.00	0.00	0.00				{"wifi": false, "vegLunch": false, "vegDinner": false, "nonVegLunch": false, "nonVegDinner": false, "morningBreakfast": false}		2025-09-27 08:28:38.742479
5	5		Ps@pajasaapartments.com	2500.00	5.00	2625.00	Anindita Mam	9833168145		{"wifi": true, "vegLunch": false, "vegDinner": false, "nonVegLunch": false, "nonVegDinner": true, "morningBreakfast": true}		2025-10-10 10:16:49.979182
6	6	Veridical Hospitalty	ps@pajasaapartments.com	2500.00	5.00	0.00	Anindita Mam	9833168145		{"wifi": true, "vegLunch": false, "vegDinner": false, "nonVegLunch": false, "nonVegDinner": false, "morningBreakfast": true}		2025-10-17 05:29:56.120022
7	7			2500.00	5.00	0.00	Paras Sangwan	7738777602		{"wifi": true, "vegLunch": false, "vegDinner": false, "nonVegLunch": false, "nonVegDinner": false, "morningBreakfast": true}		2025-10-17 10:23:09.405685
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, reservation_no, client_id, property_id, guest_name, guest_email, contact_number, check_in_date, check_out_date, check_in_time, check_out_time, occupancy, base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days, admin_email, status, created_at) FROM stdin;
1	RES1758957317373	1	17	gjfkjshdjfsa	Harshitshukl6388@gmail.com	34567896543	2025-09-24	2025-09-15	12:00:00	11:00:00	0	0.00	0.00	0.00			0	Harshitshukl6388@gmail.com	active	2025-09-27 07:15:15.539
2	RES1758961610875	2	17	harshit shula 	fdhsafja@gmail.com	46789765	2025-09-27	2025-10-01	12:00:00	11:00:00	0	0.00	0.00	0.00			0	fdhsafja@gmail.com	active	2025-09-27 08:26:49.343
3	RES1758961718544	1	17	harsitn shuka;	hfdsafhj@gamil.com	456765650987	2025-09-29	2025-10-10	12:00:00	11:00:00	0	0.00	0.00	0.00			0	hfdsafhj@gamil.com	active	2025-09-27 08:28:38.35
5	RES1760091410056	14	18	Jyoti	accounts@pajasaapartments.com	7506024682	2025-10-11	2025-10-13	14:00:00	11:00:00	1	4250.00	5.00	4462.50	BTC	As Per Contract	2	Ps@pajasaapartments.com	active	2025-10-10 10:16:48.656
6	RES1760678996198	14	18	Jyoti	accounts@pajasaapartments.com	7506024682	2025-10-18	2025-10-19	12:00:00	11:00:00	1	4250.00	5.00	0.00	BTC	As Per Contract	1		active	2025-10-17 05:29:53.656
7	RES1760696589484	14	17	Jyoti	accounts@pajasa	750622	2025-10-18	2025-10-20	12:00:00	11:00:00	2	4000.00	5.00	4200.00	BTC	As Per Contract	2		active	2025-10-17 10:23:05.594
\.


--
-- Data for Name: room_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_bookings (id, reservation_id, room_type, property_id, check_in_date, check_out_date, status) FROM stdin;
1	3	Master Bedroom-2	17	2025-09-29	2025-10-10	active
3	5	Master Bedroom-1	18	2025-10-11	2025-10-13	active
4	6	Master Bedroom-1	18	2025-10-18	2025-10-19	active
5	7	Master Bedroom-1	17	2025-10-18	2025-10-20	active
\.


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 14, true);


--
-- Name: host_gst_numbers_gst_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.host_gst_numbers_gst_id_seq', 21, true);


--
-- Name: host_information_host_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.host_information_host_id_seq', 34, true);


--
-- Name: invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_items_id_seq', 2, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 2, true);


--
-- Name: pincodes_pincode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pincodes_pincode_id_seq', 26, true);


--
-- Name: properties_property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.properties_property_id_seq', 23, true);


--
-- Name: property_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_rooms_id_seq', 1, false);


--
-- Name: reservation_additional_guests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_additional_guests_id_seq', 1, false);


--
-- Name: reservation_additional_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_additional_info_id_seq', 7, true);


--
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_seq', 7, true);


--
-- Name: room_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_bookings_id_seq', 5, true);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: host_gst_numbers host_gst_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_gst_numbers
    ADD CONSTRAINT host_gst_numbers_pkey PRIMARY KEY (gst_id);


--
-- Name: host_information host_information_host_contact_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_information
    ADD CONSTRAINT host_information_host_contact_number_key UNIQUE (host_contact_number);


--
-- Name: host_information host_information_host_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_information
    ADD CONSTRAINT host_information_host_email_key UNIQUE (host_email);


--
-- Name: host_information host_information_host_pan_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_information
    ADD CONSTRAINT host_information_host_pan_number_key UNIQUE (host_pan_number);


--
-- Name: host_information host_information_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_information
    ADD CONSTRAINT host_information_pkey PRIMARY KEY (host_id);


--
-- Name: clients idx_client_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT idx_client_name UNIQUE (client_name);


--
-- Name: clients idx_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT idx_email UNIQUE (email_address);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: pincodes pincodes_pincode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pincodes
    ADD CONSTRAINT pincodes_pincode_key UNIQUE (pincode);


--
-- Name: pincodes pincodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pincodes
    ADD CONSTRAINT pincodes_pkey PRIMARY KEY (pincode_id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (property_id);


--
-- Name: property_rooms property_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_rooms
    ADD CONSTRAINT property_rooms_pkey PRIMARY KEY (id);


--
-- Name: reservation_additional_guests reservation_additional_guests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_additional_guests
    ADD CONSTRAINT reservation_additional_guests_pkey PRIMARY KEY (id);


--
-- Name: reservation_additional_info reservation_additional_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_additional_info
    ADD CONSTRAINT reservation_additional_info_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_reservation_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_reservation_no_key UNIQUE (reservation_no);


--
-- Name: room_bookings room_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_bookings
    ADD CONSTRAINT room_bookings_pkey PRIMARY KEY (id);


--
-- Name: host_gst_numbers unique_gst_number; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_gst_numbers
    ADD CONSTRAINT unique_gst_number UNIQUE (gst_number);


--
-- Name: host_gst_numbers fk_host; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.host_gst_numbers
    ADD CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES public.host_information(host_id) ON DELETE CASCADE;


--
-- Name: properties fk_host; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES public.host_information(host_id) ON DELETE CASCADE;


--
-- Name: properties fk_pincode; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT fk_pincode FOREIGN KEY (pincode_id) REFERENCES public.pincodes(pincode_id) ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: property_rooms property_rooms_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_rooms
    ADD CONSTRAINT property_rooms_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: reservation_additional_guests reservation_additional_guests_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_additional_guests
    ADD CONSTRAINT reservation_additional_guests_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON DELETE CASCADE;


--
-- Name: reservation_additional_info reservation_additional_info_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_additional_info
    ADD CONSTRAINT reservation_additional_info_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id);


--
-- Name: reservations reservations_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: reservations reservations_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: room_bookings room_bookings_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_bookings
    ADD CONSTRAINT room_bookings_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(property_id);


--
-- Name: room_bookings room_bookings_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_bookings
    ADD CONSTRAINT room_bookings_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Mtbd0eC2YJXPAI5s6JcMartXQee9JqDgWdflFoC1wGveFwJg2eHYkJpLgP0oCdx

