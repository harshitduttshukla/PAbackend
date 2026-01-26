import pool from './client.js';

async function removeCancelledReservations() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🗑️  Removing 10 cancelled reservations...\n');

        // Get 10 cancelled reservation IDs
        const getCancelledQuery = `
      SELECT id, reservation_no, guest_name, status
      FROM reservations
      WHERE status = 'Cancelled'
      ORDER BY created_at DESC
      LIMIT 10
    `;

        const cancelledResult = await client.query(getCancelledQuery);

        if (cancelledResult.rows.length === 0) {
            console.log('❌ No cancelled reservations found.');
            await client.query('ROLLBACK');
            return;
        }

        console.log(`Found ${cancelledResult.rows.length} cancelled reservations to delete:\n`);

        for (const reservation of cancelledResult.rows) {
            console.log(`  - ${reservation.reservation_no}: ${reservation.guest_name}`);

            // Delete related data first (foreign key constraints)

            // Delete room bookings
            await client.query(
                'DELETE FROM room_bookings WHERE reservation_id = $1',
                [reservation.id]
            );

            // Delete additional info
            await client.query(
                'DELETE FROM reservation_additional_info WHERE reservation_id = $1',
                [reservation.id]
            );

            // Delete additional guests
            await client.query(
                'DELETE FROM reservation_additional_guests WHERE reservation_id = $1',
                [reservation.id]
            );

            // Delete booking history
            await client.query(
                'DELETE FROM booking_history WHERE reservation_id = $1',
                [reservation.id]
            );

            // Finally delete the reservation
            await client.query(
                'DELETE FROM reservations WHERE id = $1',
                [reservation.id]
            );
        }

        await client.query('COMMIT');

        console.log(`\n✅ Successfully deleted ${cancelledResult.rows.length} cancelled reservations!`);

        // Show updated counts
        const countResult = await client.query(`
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

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

removeCancelledReservations();
