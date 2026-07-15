--
-- PostgreSQL database dump
--

\restrict hKjqZhpgxaaryuXaIHfWgjCmzDTam8ofd1jrG4Q4pIwDKuC5AFctOIrdESYV3iK

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'EMAIL',
    'SMS'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'ASSIGNED',
    'PICKED_UP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: OrderType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderType" AS ENUM (
    'B2B',
    'B2C'
);


ALTER TYPE public."OrderType" OWNER TO postgres;

--
-- Name: PaymentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentType" AS ENUM (
    'PREPAID',
    'COD'
);


ALTER TYPE public."PaymentType" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'CUSTOMER',
    'AGENT'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: VehicleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleType" AS ENUM (
    'BIKE',
    'SCOOTER',
    'CAR',
    'VAN'
);


ALTER TYPE public."VehicleType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AdminProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdminProfile" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AdminProfile" OWNER TO postgres;

--
-- Name: AdminProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AdminProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AdminProfile_id_seq" OWNER TO postgres;

--
-- Name: AdminProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AdminProfile_id_seq" OWNED BY public."AdminProfile".id;


--
-- Name: AgentLocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AgentLocation" (
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "lastSeen" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL,
    "agentId" integer NOT NULL
);


ALTER TABLE public."AgentLocation" OWNER TO postgres;

--
-- Name: AgentLocation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AgentLocation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AgentLocation_id_seq" OWNER TO postgres;

--
-- Name: AgentLocation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AgentLocation_id_seq" OWNED BY public."AgentLocation".id;


--
-- Name: AgentProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AgentProfile" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "vehicleNumber" text NOT NULL,
    "vehicleType" public."VehicleType" NOT NULL,
    "licenseNumber" text NOT NULL,
    availability boolean DEFAULT true NOT NULL,
    "currentZoneId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AgentProfile" OWNER TO postgres;

--
-- Name: AgentProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AgentProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AgentProfile_id_seq" OWNER TO postgres;

--
-- Name: AgentProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AgentProfile_id_seq" OWNED BY public."AgentProfile".id;


--
-- Name: Area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Area" (
    name text NOT NULL,
    latitude double precision,
    longitude double precision,
    pincode text NOT NULL,
    id integer NOT NULL,
    "zoneId" integer NOT NULL
);


ALTER TABLE public."Area" OWNER TO postgres;

--
-- Name: Area_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Area_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Area_id_seq" OWNER TO postgres;

--
-- Name: Area_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Area_id_seq" OWNED BY public."Area".id;


--
-- Name: CustomerProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomerProfile" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "companyName" text,
    "gstNumber" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CustomerProfile" OWNER TO postgres;

--
-- Name: CustomerProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CustomerProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CustomerProfile_id_seq" OWNER TO postgres;

--
-- Name: CustomerProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CustomerProfile_id_seq" OWNED BY public."CustomerProfile".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    type public."NotificationType" NOT NULL,
    message text NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "isSent" boolean DEFAULT false NOT NULL,
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "orderId" integer NOT NULL,
    status text
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    "orderNumber" text NOT NULL,
    "actualWeight" numeric(8,2) NOT NULL,
    "volumetricWeight" numeric(8,2) NOT NULL,
    "billableWeight" numeric(8,2) NOT NULL,
    "orderType" public."OrderType" NOT NULL,
    "paymentType" public."PaymentType" NOT NULL,
    "deliveryCharge" numeric(10,2) NOT NULL,
    "codCharge" numeric(10,2) NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "heightCm" numeric(8,2) NOT NULL,
    "lengthCm" numeric(8,2) NOT NULL,
    "widthCm" numeric(8,2) NOT NULL,
    id integer NOT NULL,
    "customerId" integer NOT NULL,
    "assignedAgentId" integer,
    "pickupZoneId" integer NOT NULL,
    "dropZoneId" integer NOT NULL,
    "dropPincode" text NOT NULL,
    "pickupPincode" text NOT NULL,
    "dropAddressLine" text NOT NULL,
    "pickupAddressLine" text NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: RateCard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RateCard" (
    "orderType" public."OrderType" NOT NULL,
    "ratePerKg" numeric(10,2) NOT NULL,
    "codCharge" numeric(10,2) NOT NULL,
    "effectiveFrom" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id integer NOT NULL,
    "pickupZoneId" integer NOT NULL,
    "dropZoneId" integer NOT NULL
);


ALTER TABLE public."RateCard" OWNER TO postgres;

--
-- Name: RateCard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RateCard_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RateCard_id_seq" OWNER TO postgres;

--
-- Name: RateCard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RateCard_id_seq" OWNED BY public."RateCard".id;


--
-- Name: Reschedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reschedule" (
    "oldDate" timestamp(3) without time zone NOT NULL,
    "newDate" timestamp(3) without time zone NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "reassignedAgentId" integer
);


ALTER TABLE public."Reschedule" OWNER TO postgres;

--
-- Name: Reschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reschedule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reschedule_id_seq" OWNER TO postgres;

--
-- Name: Reschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reschedule_id_seq" OWNED BY public."Reschedule".id;


--
-- Name: TrackingHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrackingHistory" (
    status public."OrderStatus" NOT NULL,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedById" integer NOT NULL,
    id integer NOT NULL,
    "orderId" integer NOT NULL
);


ALTER TABLE public."TrackingHistory" OWNER TO postgres;

--
-- Name: TrackingHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TrackingHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TrackingHistory_id_seq" OWNER TO postgres;

--
-- Name: TrackingHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TrackingHistory_id_seq" OWNED BY public."TrackingHistory".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    email text NOT NULL,
    password text NOT NULL,
    phone text NOT NULL,
    role public."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Zone" (
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."Zone" OWNER TO postgres;

--
-- Name: Zone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Zone_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Zone_id_seq" OWNER TO postgres;

--
-- Name: Zone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Zone_id_seq" OWNED BY public."Zone".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: AdminProfile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminProfile" ALTER COLUMN id SET DEFAULT nextval('public."AdminProfile_id_seq"'::regclass);


--
-- Name: AgentLocation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentLocation" ALTER COLUMN id SET DEFAULT nextval('public."AgentLocation_id_seq"'::regclass);


--
-- Name: AgentProfile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentProfile" ALTER COLUMN id SET DEFAULT nextval('public."AgentProfile_id_seq"'::regclass);


--
-- Name: Area id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Area" ALTER COLUMN id SET DEFAULT nextval('public."Area_id_seq"'::regclass);


--
-- Name: CustomerProfile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerProfile" ALTER COLUMN id SET DEFAULT nextval('public."CustomerProfile_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: RateCard id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RateCard" ALTER COLUMN id SET DEFAULT nextval('public."RateCard_id_seq"'::regclass);


--
-- Name: Reschedule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reschedule" ALTER COLUMN id SET DEFAULT nextval('public."Reschedule_id_seq"'::regclass);


--
-- Name: TrackingHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingHistory" ALTER COLUMN id SET DEFAULT nextval('public."TrackingHistory_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Zone id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zone" ALTER COLUMN id SET DEFAULT nextval('public."Zone_id_seq"'::regclass);


--
-- Data for Name: AdminProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AdminProfile" (id, "userId", "createdAt", "updatedAt") FROM stdin;
1	1	2026-07-10 14:07:21.727	2026-07-10 14:07:21.727
\.


--
-- Data for Name: AgentLocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AgentLocation" (latitude, longitude, "lastSeen", id, "agentId") FROM stdin;
18.50357265	73.8325802	2026-07-15 03:37:04.156	1	4
\.


--
-- Data for Name: AgentProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AgentProfile" (id, "userId", "vehicleNumber", "vehicleType", "licenseNumber", availability, "currentZoneId", "createdAt", "updatedAt") FROM stdin;
1	3	MH12AB1234	BIKE	DL123456789	t	1	2026-07-11 05:05:45.824	2026-07-11 05:05:45.824
2	4	MH-43-AV-4402	SCOOTER	DL12345678912	t	2	2026-07-11 11:53:59.667	2026-07-11 11:53:59.667
3	5	DL-2D-AB-1111	VAN	DL123654789168	t	8	2026-07-11 17:57:13.566	2026-07-11 17:57:13.566
4	9	DL-67-HG-9898	BIKE	KL987654321098	t	8	2026-07-12 10:47:16.84	2026-07-13 02:03:11.768
\.


--
-- Data for Name: Area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Area" (name, latitude, longitude, pincode, id, "zoneId") FROM stdin;
Baner	18.559	73.786	411045	1	1
Kothrud	18.5074	73.8077	411038	2	2
Borivali	\N	\N	411030	3	3
Shelke Nagar	18.4607771	73.8236867	411051	4	7
Swargate	18.4997453	73.8574604	411001	5	8
Sarasbaug	18.5004949	73.8529037	411030	6	8
Hinjewadi	18.59	73.74	411057	7	3
Wakad	18.59	73.77	411057	8	3
\.


--
-- Data for Name: CustomerProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomerProfile" (id, "userId", "companyName", "gstNumber", "createdAt", "updatedAt") FROM stdin;
1	2	Amazon	GST12345	2026-07-11 05:02:54.515	2026-07-11 05:02:54.515
2	6		12SAJH21111112SQ	2026-07-11 18:00:57.206	2026-07-11 18:00:57.206
3	7			2026-07-12 06:38:49.066	2026-07-12 06:38:49.066
4	8			2026-07-12 06:44:39.925	2026-07-12 06:44:39.925
5	10	ABC		2026-07-13 03:56:11.634	2026-07-13 03:56:11.634
6	12	JD Corp	27AAAAA1111A1Z1	2026-07-14 09:08:43.284	2026-07-14 09:08:43.284
7	14			2026-07-14 13:00:04.41	2026-07-14 13:00:04.41
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (type, message, "sentAt", "createdAt", "isRead", "isSent", id, "userId", "orderId", status) FROM stdin;
SMS	Status update for order ORD-20260713-7135: Now PICKED_UP. (Driver transit status update.)	\N	2026-07-13 02:57:48.984	f	f	1	6	3	\N
SMS	You successfully updated ORD-20260713-7135 to PICKED_UP.	\N	2026-07-13 02:57:48.991	f	f	2	9	3	\N
SMS	Status update for order ORD-20260713-7135: Now IN_TRANSIT. (Driver transit status update.)	\N	2026-07-13 03:09:54.922	f	f	3	6	3	\N
SMS	You successfully updated ORD-20260713-7135 to IN_TRANSIT.	\N	2026-07-13 03:09:54.929	f	f	4	9	3	\N
SMS	Status update for order ORD-20260713-7135: Now OUT_FOR_DELIVERY. (Driver transit status update.)	\N	2026-07-13 03:09:58.256	f	f	5	6	3	\N
SMS	You successfully updated ORD-20260713-7135 to OUT_FOR_DELIVERY.	\N	2026-07-13 03:09:58.259	f	f	6	9	3	\N
SMS	Status update for order ORD-20260713-7135: Now DELIVERED. (Driver transit status update.)	\N	2026-07-13 03:10:02.68	f	f	7	6	3	\N
SMS	You successfully updated ORD-20260713-7135 to DELIVERED.	\N	2026-07-13 03:10:02.683	f	f	8	9	3	\N
SMS	Status update for order ORD-20260713-1927: Now PICKED_UP. (Driver transit status update.)	\N	2026-07-14 12:56:54.122	f	f	12	10	4	\N
SMS	You successfully updated ORD-20260713-1927 to PICKED_UP.	\N	2026-07-14 12:56:54.123	f	f	13	9	4	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260713-1927 - Status: PICKED UP	2026-07-14 12:56:58.526	2026-07-14 12:56:58.547	f	t	14	10	4	Sent: <2d50e611-5961-1aef-8153-b41cb90b69d2@gmail.com>
SMS	Status update for order ORD-20260713-1927: Now IN_TRANSIT. (Driver transit status update.)	\N	2026-07-14 12:57:00.598	f	f	15	10	4	\N
SMS	You successfully updated ORD-20260713-1927 to IN_TRANSIT.	\N	2026-07-14 12:57:00.599	f	f	16	9	4	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260713-1927 - Status: IN TRANSIT	2026-07-14 12:57:03.85	2026-07-14 12:57:03.851	f	t	17	10	4	Sent: <fd2d4a4c-1937-98f9-10f6-7ce41dba8ddb@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260714-6197 - Status: PENDING	2026-07-14 13:02:11.185	2026-07-14 13:02:11.186	f	t	18	14	12	Sent: <e4179d14-3a9b-f32e-8ceb-78bdda4852c9@gmail.com>
SMS	Status update for order ORD-20260713-1927: Now OUT_FOR_DELIVERY. (Driver transit status update.)	\N	2026-07-14 15:42:50.114	f	f	19	10	4	\N
SMS	You successfully updated ORD-20260713-1927 to OUT_FOR_DELIVERY.	\N	2026-07-14 15:42:50.116	f	f	20	9	4	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260713-1927 - Status: OUT FOR_DELIVERY	2026-07-14 15:42:53.521	2026-07-14 15:42:53.523	f	t	21	10	4	Sent: <d1bfbc94-a79e-07aa-5b35-d90ad251c0c7@gmail.com>
SMS	Status update for order ORD-20260713-1927: Now DELIVERED. (Driver transit status update.)	\N	2026-07-14 15:43:08.834	f	f	22	10	4	\N
SMS	You successfully updated ORD-20260713-1927 to DELIVERED.	\N	2026-07-14 15:43:08.835	f	f	23	9	4	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260713-1927 - Status: DELIVERED	2026-07-14 15:43:12.08	2026-07-14 15:43:12.082	f	t	24	10	4	Sent: <f2b81c0b-730f-91df-5e02-823760fc6b89@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260714-6197 - Status: ASSIGNED	2026-07-14 16:30:52.38	2026-07-14 16:30:52.382	f	t	25	14	12	Sent: <b538f3b2-84ee-5f12-dc77-501ede040730@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260714-6197 - Status: ASSIGNED	2026-07-14 16:45:03.55	2026-07-14 16:45:03.552	f	t	26	14	12	Sent: <a58855f7-14a9-9078-aab8-b7a619bb6a80@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-6279 - Status: PENDING	2026-07-14 19:53:38.38	2026-07-14 19:53:38.389	f	t	27	14	13	Sent: <65b8919d-c9e2-d209-8c39-31bf6786d9f6@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-6279 - Status: ASSIGNED	2026-07-14 19:54:26.408	2026-07-14 19:54:26.409	f	t	28	14	13	Sent: <e8caa97b-faa3-7639-d0ec-dd5ae3aa3ea6@gmail.com>
SMS	Status update for order ORD-20260715-6279: Now PICKED_UP. (Driver transit status update.)	\N	2026-07-14 19:54:51.077	f	f	29	14	13	\N
SMS	You successfully updated ORD-20260715-6279 to PICKED_UP.	\N	2026-07-14 19:54:51.079	f	f	30	9	13	\N
SMS	Status update for order ORD-20260715-6279: Now IN_TRANSIT. (Driver transit status update.)	\N	2026-07-14 19:54:53.692	f	f	31	14	13	\N
SMS	You successfully updated ORD-20260715-6279 to IN_TRANSIT.	\N	2026-07-14 19:54:53.693	f	f	32	9	13	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-6279 - Status: PICKED UP	2026-07-14 19:54:54.041	2026-07-14 19:54:54.042	f	t	33	14	13	Sent: <31cb2ee1-cfc3-78b4-5de0-451c660fc2c0@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-6279 - Status: IN TRANSIT	2026-07-14 19:54:56.712	2026-07-14 19:54:56.713	f	t	34	14	13	Sent: <573729fd-6bfd-5ee2-17b6-02a15a406f81@gmail.com>
SMS	Status update for order ORD-20260715-6279: Now OUT_FOR_DELIVERY. (Driver transit status update.)	\N	2026-07-14 19:55:01.921	f	f	35	14	13	\N
SMS	You successfully updated ORD-20260715-6279 to OUT_FOR_DELIVERY.	\N	2026-07-14 19:55:01.922	f	f	36	9	13	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-6279 - Status: OUT FOR_DELIVERY	2026-07-14 19:55:04.89	2026-07-14 19:55:04.892	f	t	37	14	13	Sent: <acbaf30d-914a-48ce-aee7-d6006069d0b4@gmail.com>
SMS	Status update for order ORD-20260715-6279: Now FAILED. (Driver transit status update.)	\N	2026-07-14 19:55:05.405	f	f	38	14	13	\N
SMS	You successfully updated ORD-20260715-6279 to FAILED.	\N	2026-07-14 19:55:05.406	f	f	39	9	13	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-6279 - Status: FAILED	2026-07-14 19:55:08.582	2026-07-14 19:55:08.584	f	t	40	14	13	Sent: <654c9710-0272-5cc3-9943-236241b2562f@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: PENDING	2026-07-14 19:59:31.344	2026-07-14 19:59:31.345	f	t	41	14	14	Sent: <155b02e2-3e5d-2d55-f9c8-03add70b9c79@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: ASSIGNED	2026-07-14 19:59:58.141	2026-07-14 19:59:58.143	f	t	42	14	14	Sent: <579de689-5eb2-99ea-d7e4-4e2bd593f06a@gmail.com>
SMS	Status update for order ORD-20260715-3874: Now PICKED_UP. (Driver transit status update.)	\N	2026-07-14 20:00:33.769	f	f	43	14	14	\N
SMS	You successfully updated ORD-20260715-3874 to PICKED_UP.	\N	2026-07-14 20:00:33.77	f	f	44	9	14	\N
SMS	Status update for order ORD-20260715-3874: Now IN_TRANSIT. (Driver transit status update.)	\N	2026-07-14 20:00:35.624	f	f	45	14	14	\N
SMS	You successfully updated ORD-20260715-3874 to IN_TRANSIT.	\N	2026-07-14 20:00:35.625	f	f	46	9	14	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: PICKED UP	2026-07-14 20:00:36.79	2026-07-14 20:00:36.791	f	t	47	14	14	Sent: <87f94a55-7016-7a3d-98cb-f72cf16c294c@gmail.com>
SMS	Status update for order ORD-20260715-3874: Now OUT_FOR_DELIVERY. (Driver transit status update.)	\N	2026-07-14 20:00:37.246	f	f	48	14	14	\N
SMS	You successfully updated ORD-20260715-3874 to OUT_FOR_DELIVERY.	\N	2026-07-14 20:00:37.248	f	f	49	9	14	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: IN TRANSIT	2026-07-14 20:00:38.872	2026-07-14 20:00:38.873	f	t	50	14	14	Sent: <704f81a0-4403-1b99-ec00-47e25d5f0880@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: OUT FOR_DELIVERY	2026-07-14 20:00:40.263	2026-07-14 20:00:40.264	f	t	51	14	14	Sent: <c6d4d26b-a2a5-e603-f31e-913a2b9049b7@gmail.com>
SMS	Status update for order ORD-20260715-3874: Now FAILED. (Customer Not Available)	\N	2026-07-14 20:00:46.968	f	f	52	14	14	\N
SMS	You successfully updated ORD-20260715-3874 to FAILED.	\N	2026-07-14 20:00:46.969	f	f	53	9	14	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: FAILED	2026-07-14 20:00:50.034	2026-07-14 20:00:50.035	f	t	54	14	14	Sent: <d5744d39-8b71-ae48-ee1d-5e3e84c46114@gmail.com>
SMS	Status update for order ORD-20260712-4673: Now PICKED_UP. (Driver transit status update.)	\N	2026-07-14 20:33:28.912	f	f	55	7	2	\N
SMS	You successfully updated ORD-20260712-4673 to PICKED_UP.	\N	2026-07-14 20:33:28.914	f	f	56	9	2	\N
SMS	Status update for order ORD-20260712-4673: Now IN_TRANSIT. (Driver transit status update.)	\N	2026-07-14 20:33:29.723	f	f	57	7	2	\N
SMS	You successfully updated ORD-20260712-4673 to IN_TRANSIT.	\N	2026-07-14 20:33:29.724	f	f	58	9	2	\N
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260712-4673 - Status: PICKED UP	2026-07-14 20:33:32.205	2026-07-14 20:33:32.206	f	t	59	7	2	Sent: <2ce56949-5812-845a-62ff-c2108a9cf020@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260712-4673 - Status: IN TRANSIT	2026-07-14 20:33:32.777	2026-07-14 20:33:32.778	f	t	60	7	2	Sent: <ac386a35-66e3-a443-ac59-3c879a2e7b0a@gmail.com>
EMAIL	Email notification sent successfully. Subject: [LastMile Logistics] Update on Consignment ORD-20260715-3874 - Status: PENDING	2026-07-15 02:17:27.699	2026-07-15 02:17:27.719	f	t	61	14	14	Sent: <2f15da3c-0492-7809-8adb-2a3cb9e23dd2@gmail.com>
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" ("orderNumber", "actualWeight", "volumetricWeight", "billableWeight", "orderType", "paymentType", "deliveryCharge", "codCharge", "totalAmount", status, "createdAt", "updatedAt", "heightCm", "lengthCm", "widthCm", id, "customerId", "assignedAgentId", "pickupZoneId", "dropZoneId", "dropPincode", "pickupPincode", "dropAddressLine", "pickupAddressLine") FROM stdin;
ORD-20260711-5721	2.50	0.60	2.50	B2B	COD	150.00	30.00	180.00	ASSIGNED	2026-07-11 05:13:22.583	2026-07-11 17:55:31.379	15.00	20.00	10.00	1	2	4	1	2	411038	411045	Kothrud	Baner
ORD-20260713-7135	75.00	1071.95	1071.95	B2C	PREPAID	80395.88	0.00	80395.88	DELIVERED	2026-07-13 02:56:45.482	2026-07-13 03:10:02.665	35.00	123.00	1245.00	3	6	9	7	8	411001	411051	asd	asd
ORD-20260713-4876	100.00	2.00	100.00	B2C	PREPAID	4500.00	0.00	4500.00	PENDING	2026-07-13 10:39:23.318	2026-07-13 10:39:23.318	10.00	100.00	10.00	6	10	\N	1	8	411001	411045	Swargate	Baner
ORD-20260713-9095	100.00	2.00	100.00	B2C	PREPAID	4500.00	0.00	4500.00	PENDING	2026-07-13 10:40:55.42	2026-07-13 10:40:55.42	10.00	100.00	10.00	7	10	\N	1	8	411001	411045	Swargate	Baner
ORD-20260713-8285	1.00	0.20	1.00	B2C	PREPAID	45.00	0.00	45.00	PENDING	2026-07-13 10:43:56.159	2026-07-13 10:43:56.159	10.00	10.00	10.00	8	10	\N	1	8	411001	411045	Swargate	Baner
ORD-20260713-4371	1.00	0.20	1.00	B2C	PREPAID	45.00	0.00	45.00	ASSIGNED	2026-07-13 10:48:18.814	2026-07-13 17:12:04.821	10.00	10.00	10.00	10	10	4	1	8	411001	411045	Swargate	Baner
ORD-20260713-6195	1.00	4.00	4.00	B2C	PREPAID	180.00	0.00	180.00	ASSIGNED	2026-07-13 10:33:46.213	2026-07-13 17:17:15.829	10.00	10.00	200.00	5	10	3	1	8	411001	411045	Swargate	Baner
ORD-20260713-1817	1.00	0.20	1.00	B2C	PREPAID	45.00	0.00	45.00	ASSIGNED	2026-07-13 10:47:11.055	2026-07-13 17:20:35.949	10.00	10.00	10.00	9	10	3	1	8	411001	411045	Swargate	Baner
ORD-20260713-1927	1.00	0.20	1.00	B2C	PREPAID	45.00	0.00	45.00	DELIVERED	2026-07-13 10:12:58.702	2026-07-14 15:43:08.813	10.00	10.00	10.00	4	10	9	1	8	411001	411045	Swargate	Baner
ORD-20260714-6197	1.00	2.00	2.00	B2C	PREPAID	90.00	0.00	90.00	ASSIGNED	2026-07-14 13:02:07.598	2026-07-14 16:45:00.388	10.00	10.00	100.00	12	14	3	1	8	411001	411045	Swargate PMPML Bus Stand, Satara Road, Swargate, Anandnagar - 411051, MH, India	Baner Road, Baner, Pune - 411007, MH, India
ORD-20260715-6279	56.00	2.00	56.00	B2C	COD	2520.00	0.00	2520.00	FAILED	2026-07-14 19:53:34.627	2026-07-14 19:55:05.388	10.00	100.00	10.00	13	14	9	1	8	411001	411045	Swargate Bus Dep0	Baner Road
ORD-20260712-4673	40.00	200.00	200.00	B2C	PREPAID	10000.00	0.00	10000.00	IN_TRANSIT	2026-07-12 06:41:09.336	2026-07-14 20:33:29.701	50.00	100.00	200.00	2	7	9	2	8	411001	411038	Swargate Bus Depo	ABC chowk
ORD-20260715-3874	19.00	20.60	20.60	B2C	COD	927.18	0.00	927.18	PENDING	2026-07-14 19:59:28.278	2026-07-15 02:17:23.29	10.00	101.00	102.00	14	14	9	1	8	411001	411045	Swargate PMPML Bus Stop Road, Swargate, Anandnagar - 411051, MH, India	Baner - Balewadi Road, Baner, Pune - 511045, MH, India
\.


--
-- Data for Name: RateCard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RateCard" ("orderType", "ratePerKg", "codCharge", "effectiveFrom", "createdAt", "updatedAt", id, "pickupZoneId", "dropZoneId") FROM stdin;
B2B	60.00	30.00	2026-07-11 05:00:02.269	2026-07-11 05:00:02.269	2026-07-11 05:00:02.269	1	1	2
B2C	50.00	50.00	2026-07-12 06:40:33.962	2026-07-12 06:40:33.962	2026-07-12 06:40:33.962	2	2	8
B2B	150.00	0.00	2026-07-12 10:55:32.983	2026-07-12 10:55:32.983	2026-07-12 10:55:32.983	3	4	3
B2C	75.00	100.00	2026-07-13 02:56:13.941	2026-07-13 02:56:13.941	2026-07-13 02:56:13.941	4	7	8
B2C	12.00	0.00	2026-07-13 10:09:22.379	2026-07-13 10:09:22.379	2026-07-13 10:09:22.379	5	4	8
B2C	45.00	0.00	2026-07-13 10:12:06.561	2026-07-13 10:12:06.561	2026-07-13 10:12:06.561	6	1	8
B2C	10.00	50.00	2026-07-14 09:08:43.337	2026-07-14 09:08:43.337	2026-07-14 09:08:43.337	7	3	3
B2C	12.00	0.00	2026-07-15 02:16:24.872	2026-07-15 02:16:24.872	2026-07-15 02:16:24.872	8	14	8
\.


--
-- Data for Name: Reschedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Reschedule" ("oldDate", "newDate", reason, "createdAt", id, "orderId", "reassignedAgentId") FROM stdin;
\.


--
-- Data for Name: TrackingHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TrackingHistory" (status, remarks, "createdAt", "updatedById", id, "orderId") FROM stdin;
PENDING	Order Created	2026-07-11 05:13:22.605	1	1	1
ASSIGNED	Assigned to Vikas Dube	2026-07-11 17:55:31.414	1	2	1
PENDING	Order Created	2026-07-12 06:41:09.34	1	3	2
PENDING	Order Created	2026-07-13 02:56:45.499	1	4	3
ASSIGNED	Assigned to Narendra Modi	2026-07-13 02:57:03.426	1	5	3
PICKED_UP	Driver updated status to PICKED_UP	2026-07-13 02:57:48.982	9	6	3
IN_TRANSIT	Driver updated status to IN_TRANSIT	2026-07-13 03:09:54.91	9	7	3
OUT_FOR_DELIVERY	Driver updated status to OUT_FOR_DELIVERY	2026-07-13 03:09:58.252	9	8	3
DELIVERED	Driver updated status to DELIVERED	2026-07-13 03:10:02.676	9	9	3
ASSIGNED	Assigned to Narendra Modi	2026-07-13 03:14:50.279	1	10	2
PENDING	Order Created	2026-07-13 10:12:58.713	10	11	4
ASSIGNED	Assigned to Narendra Modi	2026-07-13 10:26:51.773	1	12	4
PENDING	Order Created	2026-07-13 10:33:46.249	10	13	5
PENDING	Order Created	2026-07-13 10:39:23.351	10	14	6
PENDING	Order Created	2026-07-13 10:40:55.424	10	15	7
PENDING	Order Created	2026-07-13 10:43:56.182	10	16	8
PENDING	Order Created	2026-07-13 10:47:11.064	10	17	9
PENDING	Order Created	2026-07-13 10:48:18.823	10	18	10
ASSIGNED	Assigned to Vikas Dube	2026-07-13 17:12:04.841	1	19	10
ASSIGNED	Auto-assigned to Rahul Patil	2026-07-13 17:17:15.839	1	20	5
ASSIGNED	Assigned to Rahul Patil	2026-07-13 17:20:35.962	1	21	9
PICKED_UP	Driver updated status to PICKED_UP	2026-07-14 12:56:54.112	9	25	4
IN_TRANSIT	Driver updated status to IN_TRANSIT	2026-07-14 12:57:00.596	9	26	4
PENDING	Order Created	2026-07-14 13:02:07.62	14	27	12
OUT_FOR_DELIVERY	Driver updated status to OUT_FOR_DELIVERY	2026-07-14 15:42:50.112	9	28	4
DELIVERED	Driver updated status to DELIVERED	2026-07-14 15:43:08.833	9	29	4
ASSIGNED	Assigned to Narendra Modi	2026-07-14 16:30:48.583	1	30	12
ASSIGNED	Assigned to Rahul Patil	2026-07-14 16:45:00.393	1	31	12
PENDING	Order Created	2026-07-14 19:53:34.637	1	32	13
ASSIGNED	Assigned to Narendra Modi	2026-07-14 19:54:23.336	1	33	13
PICKED_UP	Driver updated status to PICKED_UP	2026-07-14 19:54:51.075	9	34	13
IN_TRANSIT	Driver updated status to IN_TRANSIT	2026-07-14 19:54:53.69	9	35	13
OUT_FOR_DELIVERY	Driver updated status to OUT_FOR_DELIVERY	2026-07-14 19:55:01.919	9	36	13
FAILED	Driver updated status to FAILED	2026-07-14 19:55:05.404	9	37	13
PENDING	Order Created	2026-07-14 19:59:28.281	14	38	14
ASSIGNED	Assigned to Narendra Modi	2026-07-14 19:59:54.805	1	39	14
PICKED_UP	Driver updated status to PICKED_UP	2026-07-14 20:00:33.767	9	40	14
IN_TRANSIT	Driver updated status to IN_TRANSIT	2026-07-14 20:00:35.623	9	41	14
OUT_FOR_DELIVERY	Driver updated status to OUT_FOR_DELIVERY	2026-07-14 20:00:37.244	9	42	14
FAILED	Customer Not Available	2026-07-14 20:00:46.967	9	43	14
PICKED_UP	Driver updated status to PICKED_UP	2026-07-14 20:33:28.909	9	44	2
IN_TRANSIT	Driver updated status to IN_TRANSIT	2026-07-14 20:33:29.721	9	45	2
PENDING	Admin triggered instant delivery retry	2026-07-15 02:17:23.32	1	46	14
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (email, password, phone, role, "isActive", "createdAt", "updatedAt", "firstName", "lastName", id) FROM stdin;
admin@gmail.com	$2b$10$UH1dqKCsocgSXN062in6behvacwHCz9N0J021FbyKQ8KSQvYaShUa	9999999999	ADMIN	t	2026-07-10 14:07:21.727	2026-07-10 14:07:21.727	System	Admin	1
vaibhav@gmail.com	$2b$10$gamKpl/uXvpKpvUhGWJteOQ.dSO6h4HUkjMbKzf8VIq/umOcMKih6	9876543210	CUSTOMER	t	2026-07-11 05:02:54.515	2026-07-11 05:02:54.515	Vaibhav	Pujari	2
rahul@gmail.com	$2b$10$SwOV0XKh0Y9yoFwiUwTl3ekQYb5FmW3axLTVAIfBw/141DPcrCjv.	9876543211	AGENT	t	2026-07-11 05:05:45.824	2026-07-11 05:05:45.824	Rahul	Patil	3
vikas.dube@gmail.com	$2b$10$w/OIbefkMFO4SiC4KLjJ/Oo2jHTYUffv6WFgYsSc9o1uBFJqkqxdy	9422622288	AGENT	t	2026-07-11 11:53:59.667	2026-07-11 11:53:59.667	Vikas	Dube	4
shashank@gmail.com	$2b$10$XG72k67Hv/du.zaNkn8wQ.pYSDztP3TMnfVmsypfrwrLegJK7bjB.	9456722256	AGENT	t	2026-07-11 17:57:13.566	2026-07-11 17:57:13.566	Shashank	Padhe	5
sattya@gmail.com	$2b$10$b9AsijgMpowbRgnAA64kAOAw69tdnkrLMoWfLNS0Wazp5vtWVPiTm	9422722200	CUSTOMER	t	2026-07-11 18:00:57.206	2026-07-11 18:00:57.206	Satyam	Anuja	6
janvi@gmail.com	$2b$10$8b5pTw4TF7VAneD.D7ckoO4v0G3l5jgBkRoTNTiizrYNQRUpXuvA.	7821935023	CUSTOMER	t	2026-07-12 06:38:49.066	2026-07-12 06:38:49.066	Janvi	Pujari	7
kunal.kamra@gmail.com	$2b$10$yy7nEyIylRMvI3dlNuwl6etC3dSKrv6drDqVND1W73EazXhV3Ma82	7831945023	CUSTOMER	t	2026-07-12 06:44:39.925	2026-07-12 06:44:39.925	Kunal 	Kamra	8
narendra.modi@gmail.com	$2b$10$0aPjl/5j0VfOWKU5dzrcKe4x8K13QLzso1DwPs2D24G52vrP98.E2	87652803766	AGENT	t	2026-07-12 10:47:16.84	2026-07-12 10:53:32.402	Narendra	Modi	9
raghu@gmail.com	$2b$10$pv3s/OiN0VquBRAWRsUuseYQQmDTk4./A.bkA87Aztcho4MhVe5Pu	9422622200	CUSTOMER	t	2026-07-13 03:56:11.634	2026-07-13 04:18:42.226	raghu	chadhha	10
customer_test@gmail.com	$2b$10$F0KrHZAzAw3ah4DUKNRGNu4NjGg2Vf.s4V5oh5Qax.OnCkZNgq.La	9876543244	CUSTOMER	t	2026-07-14 09:08:43.284	2026-07-14 09:08:43.284	John	Doe	12
vaibhav.pujari231@vit.edu	$2b$10$DOI35h9ehvRnKE7w.R3AxuYgeRiZtYBC1eXsda2T.d5Z.UDXsWSAq	7821935021	CUSTOMER	t	2026-07-14 13:00:04.41	2026-07-14 13:00:19.703	Vaibhav	Pujari	14
\.


--
-- Data for Name: Zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Zone" (name, description, "createdAt", "updatedAt", id) FROM stdin;
Mumbai		2026-07-11 11:01:47.128	2026-07-11 11:01:47.128	3
Shivajinagar	Shivajinagar	2026-07-10 19:56:51.481	2026-07-11 11:15:45.394	1
Kothrud	Karvenagar	2026-07-11 04:59:29.602	2026-07-11 11:15:53.842	2
Baner	[Polygon: Baner] 	2026-07-11 11:24:41.565	2026-07-11 11:24:41.565	4
Camp	[Polygon: Camp] 	2026-07-11 11:28:50.468	2026-07-11 11:28:50.468	5
Pimpri	[Polygon: Pimpri] 	2026-07-11 11:30:40.872	2026-07-11 11:30:40.872	6
SR Road	[Polygon: Sinhagad Road] 	2026-07-11 11:33:21.348	2026-07-11 11:33:21.348	7
Swargate	[Polygon: Swargate] 	2026-07-11 11:52:07.061	2026-07-11 11:52:07.061	8
Konkan	[Polygon: Konkan] 	2026-07-11 18:32:16.895	2026-07-11 18:32:16.895	9
Bandra	[Polygon: Bandra-Khar] 	2026-07-13 02:15:49.109	2026-07-13 02:15:49.109	10
Yerwada	[Polygon: Yerwada] 	2026-07-13 17:27:52.16	2026-07-13 17:27:52.16	11
Hinjewadi	[Polygon: Hinjewadi] 	2026-07-13 17:28:04.411	2026-07-13 17:28:04.411	12
Katraj	[Polygon: Katraj] 	2026-07-13 17:28:19.914	2026-07-13 17:28:19.914	13
Warje	[Polygon: Warje] 	2026-07-13 17:28:38.671	2026-07-13 17:28:38.671	14
Bhosari	[Polygon: Bhosari] 	2026-07-13 17:28:52.499	2026-07-13 17:28:52.499	15
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e97bb2df-143d-4a54-aade-4c44ba2f484f	578ba9874f2c5a8cc46531e916cda0d942282299c45b189b5d7ae636c6a94982	2026-07-10 19:11:55.326783+05:30	20260710134155_init	\N	\N	2026-07-10 19:11:55.28008+05:30	1
2cd297ee-1c12-4f27-a472-9692a1f7c944	e17a99038ca3179da8c0e81f00516c3cde4f38c9bc23f97202adef975e42d203	2026-07-10 19:15:19.608954+05:30	20260710134519_init	\N	\N	2026-07-10 19:15:19.427987+05:30	1
09dc92c0-efbc-4b85-869b-86895fdcc28b	9d4a677a4476c4cc63139400ac56a03bc86f84fff8874eeabb01e8c5e0ea31d0	2026-07-10 19:17:14.212483+05:30	20260710134714_init	\N	\N	2026-07-10 19:17:14.162441+05:30	1
b93f20a3-d070-4959-aabf-fd57c835b253	373c957d0e3076be9396d62ff7e3a0be2c51d80d9fcf69ba529e613e90c5de82	2026-07-10 19:30:37.501259+05:30	20260710140037_init	\N	\N	2026-07-10 19:30:37.44301+05:30	1
\.


--
-- Name: AdminProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AdminProfile_id_seq"', 1, true);


--
-- Name: AgentLocation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AgentLocation_id_seq"', 4807, true);


--
-- Name: AgentProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AgentProfile_id_seq"', 4, true);


--
-- Name: Area_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Area_id_seq"', 8, true);


--
-- Name: CustomerProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CustomerProfile_id_seq"', 7, true);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 61, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 14, true);


--
-- Name: RateCard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RateCard_id_seq"', 8, true);


--
-- Name: Reschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reschedule_id_seq"', 1, false);


--
-- Name: TrackingHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TrackingHistory_id_seq"', 46, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 14, true);


--
-- Name: Zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Zone_id_seq"', 15, true);


--
-- Name: AdminProfile AdminProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminProfile"
    ADD CONSTRAINT "AdminProfile_pkey" PRIMARY KEY (id);


--
-- Name: AgentLocation AgentLocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentLocation"
    ADD CONSTRAINT "AgentLocation_pkey" PRIMARY KEY (id);


--
-- Name: AgentProfile AgentProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentProfile"
    ADD CONSTRAINT "AgentProfile_pkey" PRIMARY KEY (id);


--
-- Name: Area Area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Area"
    ADD CONSTRAINT "Area_pkey" PRIMARY KEY (id);


--
-- Name: CustomerProfile CustomerProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerProfile"
    ADD CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: RateCard RateCard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RateCard"
    ADD CONSTRAINT "RateCard_pkey" PRIMARY KEY (id);


--
-- Name: Reschedule Reschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reschedule"
    ADD CONSTRAINT "Reschedule_pkey" PRIMARY KEY (id);


--
-- Name: TrackingHistory TrackingHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingHistory"
    ADD CONSTRAINT "TrackingHistory_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Zone Zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Zone"
    ADD CONSTRAINT "Zone_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AdminProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AdminProfile_userId_key" ON public."AdminProfile" USING btree ("userId");


--
-- Name: AgentLocation_agentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AgentLocation_agentId_key" ON public."AgentLocation" USING btree ("agentId");


--
-- Name: AgentProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AgentProfile_userId_key" ON public."AgentProfile" USING btree ("userId");


--
-- Name: Area_name_zoneId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Area_name_zoneId_key" ON public."Area" USING btree (name, "zoneId");


--
-- Name: Area_zoneId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Area_zoneId_idx" ON public."Area" USING btree ("zoneId");


--
-- Name: CustomerProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON public."CustomerProfile" USING btree ("userId");


--
-- Name: Notification_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_orderId_idx" ON public."Notification" USING btree ("orderId");


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: Order_assignedAgentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_assignedAgentId_idx" ON public."Order" USING btree ("assignedAgentId");


--
-- Name: Order_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_customerId_idx" ON public."Order" USING btree ("customerId");


--
-- Name: Order_dropZoneId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_dropZoneId_idx" ON public."Order" USING btree ("dropZoneId");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_pickupZoneId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_pickupZoneId_idx" ON public."Order" USING btree ("pickupZoneId");


--
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- Name: RateCard_dropZoneId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RateCard_dropZoneId_idx" ON public."RateCard" USING btree ("dropZoneId");


--
-- Name: RateCard_pickupZoneId_dropZoneId_orderType_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RateCard_pickupZoneId_dropZoneId_orderType_key" ON public."RateCard" USING btree ("pickupZoneId", "dropZoneId", "orderType");


--
-- Name: RateCard_pickupZoneId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RateCard_pickupZoneId_idx" ON public."RateCard" USING btree ("pickupZoneId");


--
-- Name: Reschedule_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Reschedule_orderId_idx" ON public."Reschedule" USING btree ("orderId");


--
-- Name: TrackingHistory_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TrackingHistory_orderId_idx" ON public."TrackingHistory" USING btree ("orderId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: Zone_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Zone_name_key" ON public."Zone" USING btree (name);


--
-- Name: AdminProfile AdminProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminProfile"
    ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AgentLocation AgentLocation_agentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentLocation"
    ADD CONSTRAINT "AgentLocation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES public."AgentProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AgentProfile AgentProfile_currentZoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentProfile"
    ADD CONSTRAINT "AgentProfile_currentZoneId_fkey" FOREIGN KEY ("currentZoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AgentProfile AgentProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AgentProfile"
    ADD CONSTRAINT "AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Area Area_zoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Area"
    ADD CONSTRAINT "Area_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CustomerProfile CustomerProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerProfile"
    ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_assignedAgentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_dropZoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_dropZoneId_fkey" FOREIGN KEY ("dropZoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_pickupZoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pickupZoneId_fkey" FOREIGN KEY ("pickupZoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RateCard RateCard_dropZoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RateCard"
    ADD CONSTRAINT "RateCard_dropZoneId_fkey" FOREIGN KEY ("dropZoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RateCard RateCard_pickupZoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RateCard"
    ADD CONSTRAINT "RateCard_pickupZoneId_fkey" FOREIGN KEY ("pickupZoneId") REFERENCES public."Zone"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reschedule Reschedule_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reschedule"
    ADD CONSTRAINT "Reschedule_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Reschedule Reschedule_reassignedAgentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reschedule"
    ADD CONSTRAINT "Reschedule_reassignedAgentId_fkey" FOREIGN KEY ("reassignedAgentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TrackingHistory TrackingHistory_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingHistory"
    ADD CONSTRAINT "TrackingHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrackingHistory TrackingHistory_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrackingHistory"
    ADD CONSTRAINT "TrackingHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict hKjqZhpgxaaryuXaIHfWgjCmzDTam8ofd1jrG4Q4pIwDKuC5AFctOIrdESYV3iK

