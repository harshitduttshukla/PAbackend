import pool from './client.js';

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Check if table exists, if not create it (based on what we saw in code usage)
        await pool.query(`
      CREATE TABLE IF NOT EXISTS reservation_additional_guests (
        id SERIAL PRIMARY KEY,
        reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
        guest_name VARCHAR(255),
        cid DATE,
        cod DATE,
        room_type VARCHAR(100),
        occupancy INTEGER,
        address TEXT
      );
    `);

        // Add columns if they don't exist
        await pool.query(`
      ALTER TABLE reservation_additional_guests 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_number VARCHAR(20);
    `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
