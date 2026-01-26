import pool from './client.js';

async function add10MoreConfirmed() {
    try {
        console.log('🌱 Adding 10 more confirmed reservations...\n');

        const timestamp = Date.now();
        let successCount = 0;

        // Using existing property and client IDs
        const propertyIds = [10, 11, 14, 16, 17, 18, 19, 20, 22, 23];

        const guests = [
            { name: 'Rahul Sharma', email: 'rahul.sharma@techcorp.com', phone: '+919876543311', client: 1, days: 5, rate: 6200 },
            { name: 'Sneha Patel', email: 'sneha.patel@innovate.com', phone: '+919876543312', client: 2, days: 4, rate: 5800 },
            { name: 'Amit Kumar', email: 'amit.kumar@solutions.com', phone: '+919876543313', client: 3, days: 6, rate: 7500 },
            { name: 'Pooja Reddy', email: 'pooja.reddy@enterprises.com', phone: '+919876543314', client: 4, days: 4, rate: 5200 },
            { name: 'Sanjay Gupta', email: 'sanjay.gupta@systems.com', phone: '+919876543315', client: 5, days: 5, rate: 6800 },
            { name: 'Riya Singh', email: 'riya.singh@techcorp.com', phone: '+919876543316', client: 1, days: 7, rate: 9500 },
            { name: 'Manish Joshi', email: 'manish.joshi@innovate.com', phone: '+919876543317', client: 2, days: 4, rate: 5500 },
            { name: 'Deepika Nair', email: 'deepika.nair@solutions.com', phone: '+919876543318', client: 3, days: 5, rate: 6300 },
            { name: 'Vishal Mehta', email: 'vishal.mehta@enterprises.com', phone: '+919876543319', client: 4, days: 6, rate: 7200 },
            { name: 'Anjali Verma', email: 'anjali.verma@systems.com', phone: '+919876543320', client: 5, days: 4, rate: 5400 }
        ];

        for (let i = 0; i < guests.length; i++) {
            const g = guests[i];
            const resNo = `RES-CONF-${timestamp}-${String(i + 11).padStart(3, '0')}`; // Start from 011

            const checkIn = new Date();
            checkIn.setDate(checkIn.getDate() + (i * 3) + 35); // Start 35 days from now
            const checkOut = new Date(checkIn);
            checkOut.setDate(checkOut.getDate() + g.days);

            const checkInStr = checkIn.toISOString().split('T')[0];
            const checkOutStr = checkOut.toISOString().split('T')[0];

            const total = (g.rate * 1.18).toFixed(2);
            const paymentMode = i % 2 === 0 ? 'Bill to Company' : 'Direct Payment';
            const tariffType = i % 2 === 0 ? 'As Per Contract' : 'As Per Email';

            try {
                const result = await pool.query(`
          INSERT INTO reservations (
            reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
            check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
            base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
            admin_email, status, modification_tags
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '14:00:00', '11:00:00', 2, $9, 18, $10, 
                    $11, $12, $13, 'ps@pajasaapartments.com', 'active', NULL)
          RETURNING id
        `, [resNo, g.client, propertyIds[i], g.name, g.email, g.phone, checkInStr, checkOutStr,
                    g.rate, total, paymentMode, tariffType, g.days]);

                const resId = result.rows[0].id;

                // Add room booking
                await pool.query(`
          INSERT INTO room_bookings (reservation_id, room_type, property_id, check_in_date, check_out_date, status)
          VALUES ($1, 'Master Bedroom-1', $2, $3, $4, 'active')
        `, [resId, propertyIds[i], checkInStr, checkOutStr]);

                successCount++;
                console.log(`✅ ${i + 1}/10: ${g.name} - ${resNo}`);

            } catch (err) {
                console.error(`❌ Failed for ${g.name}:`, err.message);
            }
        }

        console.log(`\n✨ Successfully created ${successCount}/10 reservations!`);

        // Show updated counts
        const countResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status='active' AND (modification_tags IS NULL OR modification_tags='') THEN 1 END) as confirmed,
        COUNT(CASE WHEN status='Cancelled' THEN 1 END) as cancelled
      FROM reservations
    `);

        console.log('\n📊 Updated Database Statistics:');
        console.log(`  Total Reservations: ${countResult.rows[0].total}`);
        console.log(`  Confirmed: ${countResult.rows[0].confirmed}`);
        console.log(`  Cancelled: ${countResult.rows[0].cancelled}`);
        console.log('\n💡 Refresh your frontend to see the new confirmed reservations!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

add10MoreConfirmed();
