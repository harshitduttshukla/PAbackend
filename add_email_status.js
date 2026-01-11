
import pool from './client.js';

const migrate = async () => {
    try {
        console.log("Starting migration...");
        await pool.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS email_status VARCHAR(50) DEFAULT 'Unsent';`);
        console.log("Migration successful: email_status column added.");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        process.exit();
    }
};

migrate();
