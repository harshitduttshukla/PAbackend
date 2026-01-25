import pool from './client.js';

async function seedConfirmedReservations() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🌱 Starting to seed 10 confirmed reservations...');

        // Get current timestamp for unique reservation numbers
        const timestamp = Date.now();

        // Using actual property IDs from your database: 10, 11, 14, 16, 17, 18, 19, 20, 22, 23
        const reservations = [
            {
                guest_name: 'Arjun Mehta',
                email: 'arjun.mehta@techsolutions.com',
                phone: '+919876543301',
                client_id: 1,
                property_id: 10,
                occupancy: 2,
                days: 4,
                base_rate: 5500,
                offset: 5
            },
            {
                guest_name: 'Kavya Sharma',
                email: 'kavya.sharma@globalenterprises.com',
                phone: '+919876543302',
                client_id: 2,
                property_id: 11,
                occupancy: 3,
                days: 5,
                base_rate: 9000,
                offset: 7
            },
            {
                guest_name: 'Rohan Patel',
                email: 'rohan.patel@brightfuture.com',
                phone: '+919876543303',
                client_id: 3,
                property_id: 14,
                occupancy: 2,
                days: 5,
                base_rate: 6500,
                offset: 10
            },
            {
                guest_name: 'Priya Iyer',
                email: 'priya.iyer@innovativesystems.com',
                phone: '+919876543304',
                client_id: 4,
                property_id: 16,
                occupancy: 1,
                days: 4,
                base_rate: 4800,
                offset: 12
            },
            {
                guest_name: 'Aditya Singh',
                email: 'aditya.singh@smartsolutions.com',
                phone: '+919876543305',
                client_id: 5,
                property_id: 17,
                occupancy: 2,
                days: 6,
                base_rate: 6200,
                offset: 15
            },
            {
                guest_name: 'Neha Gupta',
                email: 'neha.gupta@techsolutions.com',
                phone: '+919876543306',
                client_id: 1,
                property_id: 18,
                occupancy: 3,
                days: 5,
                base_rate: 8800,
                offset: 18
            },
            {
                guest_name: 'Vikram Nair',
                email: 'vikram.nair@globalenterprises.com',
                phone: '+919876543307',
                client_id: 2,
                property_id: 19,
                occupancy: 2,
                days: 5,
                base_rate: 6300,
                offset: 20
            },
            {
                guest_name: 'Ananya Reddy',
                email: 'ananya.reddy@brightfuture.com',
                phone: '+919876543308',
                client_id: 3,
                property_id: 20,
                occupancy: 1,
                days: 4,
                base_rate: 5000,
                offset: 22
            },
            {
                guest_name: 'Karthik Pillai',
                email: 'karthik.pillai@innovativesystems.com',
                phone: '+919876543309',
                client_id: 4,
                property_id: 22,
                occupancy: 2,
                days: 5,
                base_rate: 5900,
                offset: 25
            },
            {
                guest_name: 'Divya Kapoor',
                email: 'divya.kapoor@smartsolutions.com',
                phone: '+919876543310',
                client_id: 5,
                property_id: 23,
                occupancy: 2,
                days: 5,
                base_rate: 5600,
                offset: 28
            }
        ];

        const hostData = {
            10: { name: 'Rajesh Kumar Properties', email: 'rajesh.kumar@properties.com', contact: 'Ramesh Verma', phone: '+919876543220' },
            11: { name: 'Priya Sharma Estates', email: 'priya.sharma@estates.com', contact: 'Anjali Mehta', phone: '+919876543222' },
            14: { name: 'Amit Patel Homes', email: 'amit.patel@homes.com', contact: 'Deepak Joshi', phone: '+919876543224' },
            16: { name: 'Sunita Reddy Rentals', email: 'sunita.reddy@rentals.com', contact: 'Lakshmi Iyer', phone: '+919876543226' },
            17: { name: 'Vikram Singh Properties', email: 'vikram.singh@properties.com', contact: 'Sourav Banerjee', phone: '+919876543228' },
            18: { name: 'Rajesh Kumar Properties', email: 'rajesh.kumar@properties.com', contact: 'Ramesh Verma', phone: '+919876543220' },
            19: { name: 'Priya Sharma Estates', email: 'priya.sharma@estates.com', contact: 'Anjali Mehta', phone: '+919876543222' },
            20: { name: 'Amit Patel Homes', email: 'amit.patel@homes.com', contact: 'Deepak Joshi', phone: '+919876543224' },
            22: { name: 'Sunita Reddy Rentals', email: 'sunita.reddy@rentals.com', contact: 'Lakshmi Iyer', phone: '+919876543226' },
            23: { name: 'Vikram Singh Properties', email: 'vikram.singh@properties.com', contact: 'Sourav Banerjee', phone: '+919876543228' }
        };

        const comments = ['VIP Guest', 'Corporate Booking', 'Regular Customer', 'First Time Guest', 'Long Stay Guest',
            'Business Traveler', 'Family Vacation', 'Solo Traveler', 'Group Booking', 'Repeat Customer'];

        for (let i = 0; i < reservations.length; i++) {
            const res = reservations[i];
            const reservationNo = `RES-CONF-${timestamp}-${String(i + 1).padStart(3, '0')}`;

            // Calculate dates
            const checkInDate = new Date();
            checkInDate.setDate(checkInDate.getDate() + res.offset);
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + res.days);

            const checkInStr = checkInDate.toISOString().split('T')[0];
            const checkOutStr = checkOutDate.toISOString().split('T')[0];

            // Calculate financials
            const taxes = 18;
            const totalTariff = (res.base_rate * (1 + taxes / 100)).toFixed(2);

            // Determine payment mode and tariff type
            const paymentMode = i % 2 === 0 ? 'Bill to Company' : 'Direct Payment';
            const tariffType = i % 2 === 0 ? 'As Per Contract' : 'As Per Email';

            // Determine check-in/out times based on property
            const checkInTime = [11, 16].includes(res.property_id) ? '12:00:00' : [14, 20].includes(res.property_id) ? '13:00:00' : '14:00:00';
            const checkOutTime = [17, 22, 23].includes(res.property_id) ? '12:00:00' : '11:00:00';

            // Insert reservation
            const resQuery = `
        INSERT INTO reservations (
          reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
          check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
          base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
          admin_email, status, modification_tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING id
      `;

            const resResult = await client.query(resQuery, [
                reservationNo,
                res.client_id,
                res.property_id,
                res.guest_name,
                res.email,
                res.phone,
                checkInStr,
                checkOutStr,
                checkInTime,
                checkOutTime,
                res.occupancy,
                res.base_rate,
                taxes,
                totalTariff,
                paymentMode,
                tariffType,
                res.days,
                'ps@pajasaapartments.com, accounts@pajasaapartments.com',
                'active',
                null // No modification tags for confirmed reservations
            ]);

            const reservationId = resResult.rows[0].id;

            // Insert room bookings
            if (res.occupancy === 1) {
                await client.query(
                    `INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [reservationId, 'Master Bedroom-1', res.property_id, checkInStr, checkOutStr, 'active']
                );
            } else if (res.occupancy === 2) {
                await client.query(
                    `INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [reservationId, 'Master Bedroom-1', res.property_id, checkInStr, checkOutStr, 'active']
                );
            } else if (res.occupancy === 3) {
                await client.query(
                    `INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
           VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12)`,
                    [
                        reservationId, 'Master Bedroom-1', res.property_id, checkInStr, checkOutStr, 'active',
                        reservationId, 'Master Bedroom-2', res.property_id, checkInStr, checkOutStr, 'active'
                    ]
                );
            }

            // Insert additional info
            const host = hostData[res.property_id];
            const hostBaseRate = res.base_rate - 500;
            const hostTotalAmount = (hostBaseRate * 1.18).toFixed(2);

            const services = i % 3 === 0
                ? { wifi: true, morningBreakfast: true, vegLunch: true, nonVegLunch: false, vegDinner: true, nonVegDinner: false }
                : i % 3 === 1
                    ? { wifi: true, morningBreakfast: true, vegLunch: false, nonVegLunch: true, vegDinner: false, nonVegDinner: true }
                    : { wifi: true, morningBreakfast: true, vegLunch: false, nonVegLunch: false, vegDinner: false, nonVegDinner: false };

            await client.query(
                `INSERT INTO reservation_additional_info (
          reservation_id, host_name, host_email, host_base_rate, host_taxes,
          host_total_amount, contact_person, contact_number, comments, services, note
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    reservationId,
                    host.name,
                    host.email,
                    hostBaseRate,
                    18,
                    hostTotalAmount,
                    host.contact,
                    host.phone,
                    comments[i],
                    JSON.stringify(services),
                    i % 2 === 0 ? 'Standard check-in' : 'Early check-in requested'
                ]
            );

            console.log(`✅ Created reservation ${i + 1}/10: ${reservationNo} - ${res.guest_name}`);
        }

        await client.query('COMMIT');

        // Verify
        const countResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status='active' AND (modification_tags IS NULL OR modification_tags='') THEN 1 END) as confirmed
      FROM reservations
    `);

        console.log('\n📊 Database Statistics:');
        console.log(`Total Reservations: ${countResult.rows[0].total}`);
        console.log(`Confirmed Reservations: ${countResult.rows[0].confirmed}`);
        console.log('\n✨ Seeding completed successfully!');
        console.log('\n💡 Refresh your frontend to see the new confirmed reservations!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error seeding data:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

seedConfirmedReservations();
