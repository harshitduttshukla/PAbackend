import pool from './client.js';

async function seedSimpleConfirmed() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🌱 Seeding 10 confirmed reservations...\n');

        const timestamp = Date.now();
        let successCount = 0;

        // Simple data - using existing property and client IDs
        const guests = [
            { name: 'Arjun Mehta', email: 'arjun.mehta@techsolutions.com', phone: '+919876543301', client: 1, property: 10, days: 4, rate: 5500 },
            { name: 'Kavya Sharma', email: 'kavya.sharma@globalenterprises.com', phone: '+919876543302', client: 2, property: 11, days: 5, rate: 9000 },
            { name: 'Rohan Patel', email: 'rohan.patel@brightfuture.com', phone: '+919876543303', client: 3, property: 14, days: 5, rate: 6500 },
            { name: 'Priya Iyer', email: 'priya.iyer@innovativesystems.com', phone: '+919876543304', client: 4, property: 16, days: 4, rate: 4800 },
            { name: 'Aditya Singh', email: 'aditya.singh@smartsolutions.com', phone: '+919876543305', client: 5, property: 17, days: 6, rate: 6200 },
            { name: 'Neha Gupta', email: 'neha.gupta@techsolutions.com', phone: '+919876543306', client: 1, property: 18, days: 5, rate: 8800 },
            { name: 'Vikram Nair', email: 'vikram.nair@globalenterprises.com', phone: '+919876543307', client: 2, property: 19, days: 5, rate: 6300 },
            { name: 'Ananya Reddy', email: 'ananya.reddy@brightfuture.com', phone: '+919876543308', client: 3, property: 20, days: 4, rate: 5000 },
            { name: 'Karthik Pillai', email: 'karthik.pillai@innovativesystems.com', phone: '+919876543309', client: 4, property: 22, days: 5, rate: 5900 },
            { name: 'Divya Kapoor', email: 'divya.kapoor@smartsolutions.com', phone: '+919876543310', client: 5, property: 23, days: 5, rate: 5600 }
        ];

        for (let i = 0; i < guests.length; i++) {
            const g = guests[i];
            const resNo = `RES-CONF-${timestamp}-${String(i + 1).padStart(3, '0')}`;

            const checkIn = new Date();
            checkIn.setDate(checkIn.getDate() + (i * 3) + 5);
            const checkOut = new Date(checkIn);
            checkOut.setDate(checkOut.getDate() + g.days);

            const checkInStr = checkIn.toISOString().split('T')[0];
            const checkOutStr = checkOut.toISOString().split('T')[0];

            const total = (g.rate * 1.18).toFixed(2);

            try {
                const result = await client.query(`
          INSERT INTO reservations (
            reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
            check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
            base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
            admin_email, status, modification_tags
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '14:00:00', '11:00:00', 2, $9, 18, $10, 
                    'Bill to Company', 'As Per Contract', $11, 
                    'ps@pajasaapartments.com', 'active', NULL)
          RETURNING id
        `, [resNo, g.client, g.property, g.name, g.email, g.phone, checkInStr, checkOutStr, g.rate, total, g.days]);

                const resId = result.rows[0].id;

                // Add room booking
                await client.query(`
          INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
          VALUES ($1, 'Master Bedroom-1', $2, $3, $4, 'active')
        `, [resId, g.property, checkInStr, checkOutStr]);

                successCount++;
                console.log(`✅ ${i + 1}/10: ${g.name} - ${resNo}`);

            } catch (err) {
                console.error(`❌ Failed for ${g.name}:`, err.message);
            }
        }

        await client.query('COMMIT');

        console.log(`\n✨ Successfully created ${successCount}/10 reservations!`);
        console.log('💡 Refresh your frontend to see them!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seedSimpleConfirmed();
