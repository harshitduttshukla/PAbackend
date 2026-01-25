-- ============================================
-- SEED 10 CONFIRMED RESERVATIONS
-- Matching existing naming conventions
-- ============================================

BEGIN;

-- First, let's update any existing cancelled reservations to active if needed
-- (Optional - comment out if you want to keep cancelled ones)

-- ============================================
-- INSERT 10 NEW CONFIRMED RESERVATIONS
-- ============================================

INSERT INTO reservations (
    reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
    check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
    base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
    admin_email, status, modification_tags, created_at
) VALUES
-- Reservation 1
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-001', 
    1, 1, 'Arjun Mehta', 'arjun.mehta@techsolutions.com', '+919876543301',
    CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '9 days', 
    '14:00:00', '11:00:00', 2,
    5500.00, 18.00, 6490.00, 'Bill to Company', 'As Per Contract', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NULL, NOW()
),
-- Reservation 2
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-002',
    2, 2, 'Kavya Sharma', 'kavya.sharma@globalenterprises.com', '+919876543302',
    CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '12 days',
    '12:00:00', '10:00:00', 3,
    9000.00, 18.00, 10620.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', '', NOW()
),
-- Reservation 3
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-003',
    3, 3, 'Rohan Patel', 'rohan.patel@brightfuture.com', '+919876543303',
    CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '15 days',
    '14:00:00', '11:00:00', 2,
    6500.00, 18.00, 7670.00, 'Bill to Company', 'As Per Contract', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NULL, NOW()
),
-- Reservation 4
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-004',
    4, 4, 'Priya Iyer', 'priya.iyer@innovativesystems.com', '+919876543304',
    CURRENT_DATE + INTERVAL '12 days', CURRENT_DATE + INTERVAL '16 days',
    '13:00:00', '11:00:00', 1,
    4800.00, 18.00, 5664.00, 'Direct Payment', 'As Per Email', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NULL, NOW()
),
-- Reservation 5
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-005',
    5, 5, 'Aditya Singh', 'aditya.singh@smartsolutions.com', '+919876543305',
    CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '21 days',
    '14:00:00', '12:00:00', 2,
    6200.00, 18.00, 7316.00, 'Bill to Company', 'As Per Contract', 6,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', '', NOW()
),
-- Reservation 6
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-006',
    1, 2, 'Neha Gupta', 'neha.gupta@techsolutions.com', '+919876543306',
    CURRENT_DATE + INTERVAL '18 days', CURRENT_DATE + INTERVAL '23 days',
    '12:00:00', '10:00:00', 3,
    8800.00, 18.00, 10384.00, 'Bill to Company', 'As Per Contract', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NULL, NOW()
),
-- Reservation 7
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-007',
    2, 3, 'Vikram Nair', 'vikram.nair@globalenterprises.com', '+919876543307',
    CURRENT_DATE + INTERVAL '20 days', CURRENT_DATE + INTERVAL '25 days',
    '14:00:00', '11:00:00', 2,
    6300.00, 18.00, 7434.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', '', NOW()
),
-- Reservation 8
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-008',
    3, 4, 'Ananya Reddy', 'ananya.reddy@brightfuture.com', '+919876543308',
    CURRENT_DATE + INTERVAL '22 days', CURRENT_DATE + INTERVAL '26 days',
    '13:00:00', '11:00:00', 1,
    5000.00, 18.00, 5900.00, 'Bill to Company', 'As Per Contract', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NULL, NOW()
),
-- Reservation 9
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-009',
    4, 5, 'Karthik Pillai', 'karthik.pillai@innovativesystems.com', '+919876543309',
    CURRENT_DATE + INTERVAL '25 days', CURRENT_DATE + INTERVAL '30 days',
    '14:00:00', '12:00:00', 2,
    5900.00, 18.00, 6962.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', '', NOW()
),
-- Reservation 10
(
    'RES-CONF-' || to_char(NOW(), 'YYYYMMDDHH24MISS') || '-010',
    5, 1, 'Divya Kapoor', 'divya.kapoor@smartsolutions.com', '+919876543310',
    CURRENT_DATE + INTERVAL '28 days', CURRENT_DATE + INTERVAL '33 days',
    '14:00:00', '11:00:00', 2,
    5600.00, 18.00, 6608.00, 'Bill to Company', 'As Per Contract', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NULL, NOW()
);

-- ============================================
-- ADD ROOM BOOKINGS FOR EACH RESERVATION
-- ============================================

-- Get the last 10 reservation IDs we just inserted
DO $$
DECLARE
    res RECORD;
    counter INTEGER := 1;
BEGIN
    FOR res IN 
        SELECT id, property_id, check_in_date, check_out_date, occupancy
        FROM reservations 
        WHERE reservation_no LIKE 'RES-CONF-%'
        ORDER BY created_at DESC
        LIMIT 10
    LOOP
        -- Add room bookings based on occupancy
        IF res.occupancy = 1 THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res.id, 'Master Bedroom-1', res.property_id, res.check_in_date, res.check_out_date, 'active');
        ELSIF res.occupancy = 2 THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res.id, 'Master Bedroom-1', res.property_id, res.check_in_date, res.check_out_date, 'active');
        ELSIF res.occupancy = 3 THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES 
                (res.id, 'Master Bedroom-1', res.property_id, res.check_in_date, res.check_out_date, 'active'),
                (res.id, 'Master Bedroom-2', res.property_id, res.check_in_date, res.check_out_date, 'active');
        END IF;
        
        counter := counter + 1;
    END LOOP;
END $$;

-- ============================================
-- ADD RESERVATION ADDITIONAL INFO
-- ============================================

DO $$
DECLARE
    res RECORD;
    host_names TEXT[] := ARRAY['Rajesh Kumar Properties', 'Priya Sharma Estates', 'Amit Patel Homes', 'Sunita Reddy Rentals', 'Vikram Singh Properties'];
    host_emails TEXT[] := ARRAY['rajesh.kumar@properties.com', 'priya.sharma@estates.com', 'amit.patel@homes.com', 'sunita.reddy@rentals.com', 'vikram.singh@properties.com'];
    contact_persons TEXT[] := ARRAY['Ramesh Verma', 'Anjali Mehta', 'Deepak Joshi', 'Lakshmi Iyer', 'Sourav Banerjee'];
    contact_numbers TEXT[] := ARRAY['+919876543220', '+919876543222', '+919876543224', '+919876543226', '+919876543228'];
    comments_array TEXT[] := ARRAY['VIP Guest', 'Corporate Booking', 'Regular Customer', 'First Time Guest', 'Long Stay Guest', 'Business Traveler', 'Family Vacation', 'Solo Traveler', 'Group Booking', 'Repeat Customer'];
    idx INTEGER := 1;
BEGIN
    FOR res IN 
        SELECT id, property_id, base_rate, taxes, total_tariff
        FROM reservations 
        WHERE reservation_no LIKE 'RES-CONF-%'
        ORDER BY created_at DESC
        LIMIT 10
    LOOP
        INSERT INTO reservation_additional_info (
            reservation_id, host_name, host_email, host_base_rate, host_taxes, 
            host_total_amount, contact_person, contact_number, comments, services, note
        ) VALUES (
            res.id, 
            host_names[((res.property_id - 1) % 5) + 1],
            host_emails[((res.property_id - 1) % 5) + 1],
            res.base_rate - 500.00, -- Host gets slightly less
            18.00,
            (res.base_rate - 500.00) * 1.18,
            contact_persons[((res.property_id - 1) % 5) + 1],
            contact_numbers[((res.property_id - 1) % 5) + 1],
            comments_array[idx],
            CASE 
                WHEN idx % 3 = 0 THEN '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": true, "nonVegDinner": false}'::jsonb
                WHEN idx % 3 = 1 THEN '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": true, "vegDinner": false, "nonVegDinner": true}'::jsonb
                ELSE '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb
            END,
            CASE 
                WHEN idx % 2 = 0 THEN 'Standard check-in'
                ELSE 'Early check-in requested'
            END
        );
        
        idx := idx + 1;
    END LOOP;
END $$;

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show total counts
SELECT 
    'Total Reservations' as metric,
    COUNT(*) as count
FROM reservations
UNION ALL
SELECT 
    'Confirmed (Active, No Modifications)' as metric,
    COUNT(*) as count
FROM reservations
WHERE status = 'active' AND (modification_tags IS NULL OR modification_tags = '')
UNION ALL
SELECT 
    'Modified' as metric,
    COUNT(*) as count
FROM reservations
WHERE modification_tags IS NOT NULL AND modification_tags != ''
UNION ALL
SELECT 
    'Cancelled' as metric,
    COUNT(*) as count
FROM reservations
WHERE status = 'Cancelled';

-- Show the newly created confirmed reservations
SELECT 
    r.reservation_no,
    r.guest_name,
    c.client_name,
    r.check_in_date,
    r.check_out_date,
    r.total_tariff,
    r.status,
    r.modification_tags,
    STRING_AGG(rb.room_type, ', ') as rooms
FROM reservations r
LEFT JOIN clients c ON r.client_id = c.id
LEFT JOIN room_bookings rb ON r.id = rb.reservation_id
WHERE r.reservation_no LIKE 'RES-CONF-%'
GROUP BY r.id, r.reservation_no, r.guest_name, c.client_name, r.check_in_date, r.check_out_date, r.total_tariff, r.status, r.modification_tags
ORDER BY r.created_at DESC;
