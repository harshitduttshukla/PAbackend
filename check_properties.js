import pool from './client.js';

async function checkPropertiesDetail() {
    try {
        console.log('🔍 Checking properties table structure...\n');

        // Check table structure
        const structureResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'properties'
      ORDER BY ordinal_position
    `);

        console.log('📋 Properties Table Columns:');
        structureResult.rows.forEach(row => {
            console.log(`  ${row.column_name}: ${row.data_type}`);
        });

        // Check actual property IDs
        const propertiesResult = await pool.query('SELECT * FROM properties ORDER BY property_id LIMIT 5');
        console.log('\n🏠 Sample Properties (first 5):');
        console.log(JSON.stringify(propertiesResult.rows, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

checkPropertiesDetail();
