import pool from './client.js';

async function quickSeed() {
    try {
        console.log('🌱 Quick seeding 10 confirmed reservations...\n');

        const timestamp = Date.now();

        for (let i = 1; i <= 10; i++) {
            const resNo = `RES-CONF-${timestamp}-${String(i).padStart(3, '0')}`;
            const checkIn = new Date();
            checkIn.setDate(checkIn.getDate() + i * 3);
            const checkOut = new Date(checkIn);
            checkOut.setDate(checkOut.getDate() + 4);

            const checkInStr = checkIn.toISOString().split('T')[0];
            const checkOutStr = checkOut.toISOString().split('T')[0];

            const clientId = ((i - 1) % 5) + 1;
            const propertyIds = [10, 11, 14, 16, 17, 18, 19, 20, 22, 23];
            const propertyId = propertyIds[i - 1];

            const names = ['Arjun Mehta', 'Kavya Sharma', 'Rohan Patel', 'Priya Iyer', 'Aditya Singh',
                'Neha Gupta', 'Vikram Nair', 'Ananya Reddy', 'Karthik Pillai', 'Divya Kapoor'];

            try {
                await pool.query(`
          INSERT INTO reservations (
            reservation_no, client_id, property_id, guest_name, guest_email, contact_number,
            check_in_date, check_out_date, check_in_time, check_out_time, occupancy,
            base_rate, taxes, total_tariff, payment_mode, tariff_type, chargeable_days,
            admin_email, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '14:00:00', '11:00:00', 2, 
                    5500, 18, 6490, 'Bill to Company', 'As Per Contract', 4, 
                    'ps@pajasaapartments.com', 'active')
        `, [resNo, clientId, propertyId, names[i - 1], `guest${i}@example.com`, `+9198765433${String(i).padStart(2, '0')}`,
                    checkInStr, checkOutStr]);

                console.log(`✅ ${i}/10: ${names[i - 1]}`);
            } catch (err) {
                console.error(`❌ ${i}: ${err.message}`);
            }
        }

        console.log('\n✨ Done! Check your frontend.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

quickSeed();
