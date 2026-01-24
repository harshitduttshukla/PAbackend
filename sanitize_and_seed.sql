-- ============================================
-- DATABASE SANITIZATION AND SEEDING SCRIPT
-- ============================================
-- This script will:
-- 1. Clean up existing data
-- 2. Seed with proper sample data
-- 3. Follow naming conventions
-- ============================================

-- Start transaction
BEGIN;

-- ============================================
-- STEP 1: CLEAN UP EXISTING DATA
-- ============================================
TRUNCATE TABLE reservation_additional_guests CASCADE;
TRUNCATE TABLE reservation_additional_info CASCADE;
TRUNCATE TABLE booking_history CASCADE;
TRUNCATE TABLE room_bookings CASCADE;
TRUNCATE TABLE reservations CASCADE;
TRUNCATE TABLE property_rooms CASCADE;
TRUNCATE TABLE properties CASCADE;
TRUNCATE TABLE host_gst_numbers CASCADE;
TRUNCATE TABLE host_information CASCADE;
TRUNCATE TABLE pincodes CASCADE;
TRUNCATE TABLE clients CASCADE;

-- Reset sequences
ALTER SEQUENCE host_information_host_id_seq RESTART WITH 1;
ALTER SEQUENCE pincodes_pincode_id_seq RESTART WITH 1;
ALTER SEQUENCE properties_property_id_seq RESTART WITH 1;
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
ALTER SEQUENCE reservations_id_seq RESTART WITH 1;

-- ============================================
-- STEP 2: SEED PINCODES
-- ============================================
INSERT INTO pincodes (pincode) VALUES
('110001'), -- Delhi
('400001'), -- Mumbai
('560001'), -- Bangalore
('600001'), -- Chennai
('700001'), -- Kolkata
('411001'), -- Pune
('500001'), -- Hyderabad
('380001'), -- Ahmedabad
('201301'), -- Noida
('122001'); -- Gurgaon

-- ============================================
-- STEP 3: SEED HOST INFORMATION
-- ============================================
INSERT INTO host_information (host_name, host_pan_number, rating, host_email, host_contact_number) VALUES
('Rajesh Kumar Properties', 'ABCDE1234F', 4.5, 'rajesh.kumar@properties.com', '+919876543210'),
('Priya Sharma Estates', 'FGHIJ5678K', 4.8, 'priya.sharma@estates.com', '+919876543211'),
('Amit Patel Homes', 'LMNOP9012Q', 4.2, 'amit.patel@homes.com', '+919876543212'),
('Sunita Reddy Rentals', 'RSTUV3456W', 4.7, 'sunita.reddy@rentals.com', '+919876543213'),
('Vikram Singh Properties', 'XYZAB7890C', 4.6, 'vikram.singh@properties.com', '+919876543214');

-- ============================================
-- STEP 4: SEED HOST GST NUMBERS
-- ============================================
INSERT INTO host_gst_numbers (host_id, gst_number) VALUES
(1, '07ABCDE1234F1Z5'),
(2, '27FGHIJ5678K1Z5'),
(3, '29LMNOP9012Q1Z5'),
(4, '36RSTUV3456W1Z5'),
(5, '07XYZAB7890C1Z5');

-- ============================================
-- STEP 5: SEED PROPERTIES
-- ============================================
INSERT INTO properties (
    property_status, host_id, ivr_number, pincode_id, city, location, 
    property_type, contact_person, contact_number, email_id,
    caretaker_name, caretaker_number, check_in_time, check_out_time,
    master_bedroom, common_bedroom, landmark, address1, address2, address3,
    property_url, thumbnail
) VALUES
(
    'Active', 1, 'IVR001', 1, 'Delhi', 'Connaught Place',
    'Apartment', 'Ramesh Verma', '+919876543220', 'ramesh@property1.com',
    'Suresh Kumar', '+919876543221', '14:00:00', '11:00:00',
    2, 1, 'Near CP Metro', '123 Janpath Road', 'Block A', 'Connaught Place',
    'https://property1.com', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
),
(
    'Active', 2, 'IVR002', 2, 'Mumbai', 'Bandra West',
    'Villa', 'Anjali Mehta', '+919876543222', 'anjali@property2.com',
    'Prakash Rao', '+919876543223', '12:00:00', '10:00:00',
    3, 2, 'Near Bandra Station', '456 Linking Road', 'Bandra West', 'Mumbai',
    'https://property2.com', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
),
(
    'Active', 3, 'IVR003', 3, 'Bangalore', 'Koramangala',
    'Apartment', 'Deepak Joshi', '+919876543224', 'deepak@property3.com',
    'Ganesh Naik', '+919876543225', '14:00:00', '11:00:00',
    2, 2, 'Near Sony Signal', '789 80 Feet Road', 'Koramangala 4th Block', 'Bangalore',
    'https://property3.com', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
),
(
    'Active', 4, 'IVR004', 4, 'Chennai', 'T Nagar',
    'Guest House', 'Lakshmi Iyer', '+919876543226', 'lakshmi@property4.com',
    'Murugan S', '+919876543227', '13:00:00', '11:00:00',
    1, 1, 'Near Pondy Bazaar', '321 Usman Road', 'T Nagar', 'Chennai',
    'https://property4.com', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
),
(
    'Active', 5, 'IVR005', 5, 'Kolkata', 'Salt Lake',
    'Apartment', 'Sourav Banerjee', '+919876543228', 'sourav@property5.com',
    'Raju Das', '+919876543229', '14:00:00', '12:00:00',
    2, 1, 'Near City Centre', '654 Sector V', 'Salt Lake', 'Kolkata',
    'https://property5.com', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
);

-- ============================================
-- STEP 6: SEED CLIENTS
-- ============================================
INSERT INTO clients (
    active, client_name, gst_no, street_address, street_address_2,
    city, state, zip_code, phone_number, mobile_number, email_address, web_address
) VALUES
(
    true, 'Tech Solutions Pvt Ltd', '29AABCT1332L1ZV',
    'Tower A, Cyber Park', 'Sector 62',
    'Bangalore', 'Karnataka', '560001', '080-12345678', '+919876543230',
    'contact@techsolutions.com', 'www.techsolutions.com'
),
(
    true, 'Global Enterprises', '27AABCG5678M1Z1',
    'Business Hub, Andheri East', 'Near Metro Station',
    'Mumbai', 'Maharashtra', '400001', '022-87654321', '+919876543231',
    'info@globalenterprises.com', 'www.globalenterprises.com'
),
(
    true, 'Bright Future Ltd', '07AABCB1234N1Z2',
    'Corporate Tower, Nehru Place', 'Phase 3',
    'Delhi', 'Delhi', '110001', '011-23456789', '+919876543232',
    'admin@brightfuture.com', 'www.brightfuture.com'
),
(
    true, 'Innovative Systems', '33AABCI9012P1Z3',
    'IT Park, Guindy', 'Block B',
    'Chennai', 'Tamil Nadu', '600001', '044-34567890', '+919876543233',
    'contact@innovativesystems.com', 'www.innovativesystems.com'
),
(
    true, 'Smart Solutions Inc', '19AABCS3456Q1Z4',
    'Tech City, Sector V', 'Salt Lake',
    'Kolkata', 'West Bengal', '700001', '033-45678901', '+919876543234',
    'hello@smartsolutions.com', 'www.smartsolutions.com'
);

-- ============================================
-- STEP 7: SEED RESERVATIONS
-- ============================================
INSERT INTO reservations (
    reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
    check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
    base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
    admin_email, status
) VALUES
(
    'RES-SEED-1768322341968-1', 1, 1, 'Rahul Sharma', 'rahul.sharma@techsolutions.com', '+919876543240',
    '2026-02-01', '2026-02-05', '14:00:00', '11:00:00', 2,
    5000.00, 18.00, 5900.00, 'Bill to Company', 'As Per Contract', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active'
),
(
    'RES-SEED-1768322341968-2', 2, 2, 'Neha Gupta', 'neha.gupta@globalenterprises.com', '+919876543241',
    '2026-02-10', '2026-02-15', '12:00:00', '10:00:00', 3,
    8000.00, 18.00, 9440.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active'
),
(
    'RES-SEED-1768322341968-3', 3, 3, 'Arjun Patel', 'arjun.patel@brightfuture.com', '+919876543242',
    '2026-02-15', '2026-02-20', '14:00:00', '11:00:00', 2,
    6000.00, 18.00, 7080.00, 'Bill to Company', 'As Per Contract', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active'
),
(
    'RES-SEED-1768322341968-4', 4, 4, 'Priya Krishnan', 'priya.k@innovativesystems.com', '+919876543243',
    '2026-02-20', '2026-02-25', '13:00:00', '11:00:00', 1,
    4500.00, 18.00, 5310.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active'
),
(
    'RES-SEED-1768322341968-5', 5, 5, 'Sanjay Banerjee', 'sanjay.b@smartsolutions.com', '+919876543244',
    '2026-03-01', '2026-03-07', '14:00:00', '12:00:00', 2,
    5500.00, 18.00, 6490.00, 'Bill to Company', 'As Per Contract', 6,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active'
);

-- ============================================
-- STEP 8: SEED ROOM BOOKINGS
-- ============================================
INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status) VALUES
(1, 'Master Bedroom-1', 1, '2026-02-01', '2026-02-05', 'active'),
(2, 'Master Bedroom-1', 2, '2026-02-10', '2026-02-15', 'active'),
(2, 'Master Bedroom-2', 2, '2026-02-10', '2026-02-15', 'active'),
(3, 'Master Bedroom-1', 3, '2026-02-15', '2026-02-20', 'active'),
(3, 'Common Bedroom-1', 3, '2026-02-15', '2026-02-20', 'active'),
(4, 'Master Bedroom-1', 4, '2026-02-20', '2026-02-25', 'active'),
(5, 'Master Bedroom-1', 5, '2026-03-01', '2026-03-07', 'active');

-- ============================================
-- STEP 9: SEED RESERVATION ADDITIONAL INFO
-- ============================================
INSERT INTO reservation_additional_info (
    reservation_id, host_name, host_email, host_base_rate, host_taxes, 
    host_total_amount, contact_person, contact_number, comments, services, note
) VALUES
(
    1, 'Rajesh Kumar Properties', 'rajesh.kumar@properties.com', 4500.00, 18.00,
    5310.00, 'Ramesh Verma', '+919876543220', 'VIP Guest',
    '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
    'Early check-in requested'
),
(
    2, 'Priya Sharma Estates', 'priya.sharma@estates.com', 7500.00, 18.00,
    8850.00, 'Anjali Mehta', '+919876543222', 'Corporate booking',
    '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": true, "nonVegDinner": false}'::jsonb,
    'Vegetarian meals only'
),
(
    3, 'Amit Patel Homes', 'amit.patel@homes.com', 5500.00, 18.00,
    6490.00, 'Deepak Joshi', '+919876543224', 'Regular customer',
    '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": true, "vegDinner": false, "nonVegDinner": true}'::jsonb,
    'Non-veg meals preferred'
),
(
    4, 'Sunita Reddy Rentals', 'sunita.reddy@rentals.com', 4000.00, 18.00,
    4720.00, 'Lakshmi Iyer', '+919876543226', 'Solo traveler',
    '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
    'Quiet room requested'
),
(
    5, 'Vikram Singh Properties', 'vikram.singh@properties.com', 5000.00, 18.00,
    5900.00, 'Sourav Banerjee', '+919876543228', 'Extended stay',
    '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
    'Weekly housekeeping needed'
);

-- ============================================
-- STEP 10: ADD MISSING COLUMNS TO RESERVATIONS
-- ============================================
-- Add columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reservations' AND column_name='modification_tags') THEN
        ALTER TABLE reservations ADD COLUMN modification_tags VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reservations' AND column_name='email_status') THEN
        ALTER TABLE reservations ADD COLUMN email_status VARCHAR(50) DEFAULT 'Pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reservations' AND column_name='updated_at') THEN
        ALTER TABLE reservations ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Update email status for seeded data
UPDATE reservations SET email_status = 'Pending' WHERE email_status IS NULL;

-- ============================================
-- STEP 11: CREATE BOOKING HISTORY TABLE IF NOT EXISTS
-- ============================================
CREATE TABLE IF NOT EXISTS booking_history (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
    check_in_date DATE,
    check_out_date DATE,
    status VARCHAR(50),
    total_tariff DECIMAL(10,2),
    modification_tags VARCHAR(255),
    snapshot_data JSONB,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMMIT TRANSACTION
-- ============================================
COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Hosts Created:' as info, COUNT(*) as count FROM host_information;
SELECT 'Properties Created:' as info, COUNT(*) as count FROM properties;
SELECT 'Clients Created:' as info, COUNT(*) as count FROM clients;
SELECT 'Reservations Created:' as info, COUNT(*) as count FROM reservations;
SELECT 'Room Bookings Created:' as info, COUNT(*) as count FROM room_bookings;

-- Show sample reservation with all details
SELECT 
    r.reservation_no,
    r.guest_name,
    c.client_name,
    p.city,
    p.location,
    r.check_in_date,
    r.check_out_date,
    r.status
FROM reservations r
JOIN clients c ON r.client_id = c.id
JOIN properties p ON r.property_id = p.property_id
LIMIT 5;
