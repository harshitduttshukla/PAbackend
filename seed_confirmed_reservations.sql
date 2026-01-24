-- ============================================
-- SEED CONFIRMED RESERVATIONS
-- ============================================
-- This script adds confirmed reservation data
-- matching existing patterns
-- ============================================

BEGIN;

-- ============================================
-- SEED MORE RESERVATIONS (Confirmed Status)
-- ============================================
INSERT INTO reservations (
    reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
    check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
    base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
    admin_email, status, created_at
) VALUES
-- Confirmed Reservations
(
    'RES-2026-1768323000001', 1, 1, 'Amit Kumar', 'amit.kumar@techsolutions.com', '+919876543250',
    '2026-02-08', '2026-02-12', '14:00:00', '11:00:00', 2,
    5500.00, 18.00, 6490.00, 'Bill to Company', 'As Per Contract', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000002', 2, 2, 'Priya Sharma', 'priya.sharma@globalenterprises.com', '+919876543251',
    '2026-02-18', '2026-02-22', '12:00:00', '10:00:00', 3,
    9000.00, 18.00, 10620.00, 'Direct Payment', 'As Per Email', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000003', 3, 3, 'Rajesh Verma', 'rajesh.v@brightfuture.com', '+919876543252',
    '2026-02-25', '2026-03-02', '14:00:00', '11:00:00', 2,
    6500.00, 18.00, 7670.00, 'Bill to Company', 'As Per Contract', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000004', 4, 4, 'Sneha Reddy', 'sneha.reddy@innovativesystems.com', '+919876543253',
    '2026-03-05', '2026-03-10', '13:00:00', '11:00:00', 1,
    5000.00, 18.00, 5900.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000005', 5, 5, 'Vikram Singh', 'vikram.singh@smartsolutions.com', '+919876543254',
    '2026-03-12', '2026-03-18', '14:00:00', '12:00:00', 2,
    6000.00, 18.00, 7080.00, 'Bill to Company', 'As Per Contract', 6,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000006', 1, 2, 'Kavita Desai', 'kavita.desai@techsolutions.com', '+919876543255',
    '2026-03-20', '2026-03-25', '12:00:00', '10:00:00', 3,
    8500.00, 18.00, 10030.00, 'Bill to Company', 'As Per Contract', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000007', 2, 3, 'Arun Nair', 'arun.nair@globalenterprises.com', '+919876543256',
    '2026-03-28', '2026-04-02', '14:00:00', '11:00:00', 2,
    6200.00, 18.00, 7316.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000008', 3, 4, 'Meera Iyer', 'meera.iyer@brightfuture.com', '+919876543257',
    '2026-04-05', '2026-04-09', '13:00:00', '11:00:00', 1,
    4800.00, 18.00, 5664.00, 'Bill to Company', 'As Per Contract', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000009', 4, 5, 'Suresh Pillai', 'suresh.p@innovativesystems.com', '+919876543258',
    '2026-04-12', '2026-04-17', '14:00:00', '12:00:00', 2,
    5800.00, 18.00, 6844.00, 'Direct Payment', 'As Per Email', 5,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
),
(
    'RES-2026-1768323000010', 5, 1, 'Anita Kapoor', 'anita.kapoor@smartsolutions.com', '+919876543259',
    '2026-04-20', '2026-04-24', '14:00:00', '11:00:00', 2,
    5300.00, 18.00, 6254.00, 'Bill to Company', 'As Per Contract', 4,
    'ps@pajasaapartments.com, accounts@pajasaapartments.com', 'active', NOW()
);

-- Get the IDs of the newly inserted reservations
DO $$
DECLARE
    res_id INTEGER;
    res_no VARCHAR;
BEGIN
    -- Loop through the new reservations and add room bookings and additional info
    FOR res_id, res_no IN 
        SELECT id, reservation_no FROM reservations 
        WHERE reservation_no LIKE 'RES-2026-1768323000%'
        ORDER BY id
    LOOP
        -- Add room bookings based on reservation
        IF res_no = 'RES-2026-1768323000001' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 1, '2026-02-08', '2026-02-12', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Rajesh Kumar Properties', 'rajesh.kumar@properties.com', 5000.00, 18.00,
                5900.00, 'Ramesh Verma', '+919876543220', 'Corporate guest',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
                'Standard check-in'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000002' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES 
                (res_id, 'Master Bedroom-1', 2, '2026-02-18', '2026-02-22', 'active'),
                (res_id, 'Master Bedroom-2', 2, '2026-02-18', '2026-02-22', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Priya Sharma Estates', 'priya.sharma@estates.com', 8500.00, 18.00,
                10030.00, 'Anjali Mehta', '+919876543222', 'VIP guest',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": true, "nonVegDinner": false}'::jsonb,
                'Vegetarian meals preferred'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000003' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 3, '2026-02-25', '2026-03-02', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Amit Patel Homes', 'amit.patel@homes.com', 6000.00, 18.00,
                7080.00, 'Deepak Joshi', '+919876543224', 'Regular customer',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": true, "vegDinner": false, "nonVegDinner": true}'::jsonb,
                'Non-veg meals'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000004' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 4, '2026-03-05', '2026-03-10', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Sunita Reddy Rentals', 'sunita.reddy@rentals.com', 4500.00, 18.00,
                5310.00, 'Lakshmi Iyer', '+919876543226', 'Solo traveler',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
                'Quiet environment requested'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000005' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 5, '2026-03-12', '2026-03-18', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Vikram Singh Properties', 'vikram.singh@properties.com', 5500.00, 18.00,
                6490.00, 'Sourav Banerjee', '+919876543228', 'Extended stay',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
                'Weekly housekeeping'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000006' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES 
                (res_id, 'Master Bedroom-1', 2, '2026-03-20', '2026-03-25', 'active'),
                (res_id, 'Master Bedroom-2', 2, '2026-03-20', '2026-03-25', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Priya Sharma Estates', 'priya.sharma@estates.com', 8000.00, 18.00,
                9440.00, 'Anjali Mehta', '+919876543222', 'Family stay',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": true, "nonVegDinner": false}'::jsonb,
                'Child-friendly setup needed'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000007' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 3, '2026-03-28', '2026-04-02', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Amit Patel Homes', 'amit.patel@homes.com', 5700.00, 18.00,
                6726.00, 'Deepak Joshi', '+919876543224', 'Business traveler',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
                'Early check-in if possible'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000008' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 4, '2026-04-05', '2026-04-09', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Sunita Reddy Rentals', 'sunita.reddy@rentals.com', 4300.00, 18.00,
                5074.00, 'Lakshmi Iyer', '+919876543226', 'Short stay',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": true, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
                'Vegetarian breakfast only'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000009' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 5, '2026-04-12', '2026-04-17', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Vikram Singh Properties', 'vikram.singh@properties.com', 5300.00, 18.00,
                6254.00, 'Sourav Banerjee', '+919876543228', 'Repeat customer',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": true, "vegDinner": false, "nonVegDinner": true}'::jsonb,
                'Preferred room if available'
            );
        END IF;

        IF res_no = 'RES-2026-1768323000010' THEN
            INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
            VALUES (res_id, 'Master Bedroom-1', 1, '2026-04-20', '2026-04-24', 'active');
            
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate, host_taxes, 
                host_total_amount, contact_person, contact_number, comments, services, note
            ) VALUES (
                res_id, 'Rajesh Kumar Properties', 'rajesh.kumar@properties.com', 4800.00, 18.00,
                5664.00, 'Ramesh Verma', '+919876543220', 'Standard booking',
                '{"wifi": true, "morningBreakfast": true, "vegLunch": false, "nonVegLunch": false, "vegDinner": false, "nonVegDinner": false}'::jsonb,
                'No special requests'
            );
        END IF;
    END LOOP;
END $$;

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
    'Total Reservations:' as info, 
    COUNT(*) as count 
FROM reservations;

SELECT 
    'Confirmed Reservations:' as info, 
    COUNT(*) as count 
FROM reservations 
WHERE status = 'active' AND (modification_tags IS NULL OR modification_tags = '');

SELECT 
    'Modified Reservations:' as info, 
    COUNT(*) as count 
FROM reservations 
WHERE modification_tags IS NOT NULL AND modification_tags != '';

SELECT 
    'Cancelled Reservations:' as info, 
    COUNT(*) as count 
FROM reservations 
WHERE status = 'Cancelled';

-- Show sample of new reservations
SELECT 
    reservation_no,
    guest_name,
    client_name,
    check_in_date,
    check_out_date,
    total_tariff,
    status
FROM reservations r
LEFT JOIN clients c ON r.client_id = c.id
WHERE reservation_no LIKE 'RES-2026-1768323000%'
ORDER BY check_in_date;
