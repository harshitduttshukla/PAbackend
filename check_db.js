import pool from './client.js';

async function checkDatabase() {
    try {
        console.log('🔍 Checking database tables...\n');

        // Check clients
        const clientsResult = await pool.query('SELECT id, client_name FROM clients ORDER BY id LIMIT 10');
        console.log('📋 Clients:');
        clientsResult.rows.forEach(row => {
            console.log(`  ID: ${row.id}, Name: ${row.client_name}`);
        });

        // Check properties
        const propertiesResult = await pool.query('SELECT property_id, city, location FROM properties ORDER BY property_id LIMIT 10');
        console.log('\n🏠 Properties:');
        propertiesResult.rows.forEach(row => {
            console.log(`  ID: ${row.property_id}, City: ${row.city}, Location: ${row.location}`);
        });

        // Check reservations count
        const reservationsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status='active' AND (modification_tags IS NULL OR modification_tags='') THEN 1 END) as confirmed,
        COUNT(CASE WHEN status='Cancelled' THEN 1 END) as cancelled
      FROM reservations
    `);
        console.log('\n📊 Reservations:');
        console.log(`  Total: ${reservationsResult.rows[0].total}`);
        console.log(`  Confirmed: ${reservationsResult.rows[0].confirmed}`);
        console.log(`  Cancelled: ${reservationsResult.rows[0].cancelled}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkDatabase();
