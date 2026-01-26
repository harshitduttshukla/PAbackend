
import pool from "./client.js";

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        console.log("Creating booking_history table...");
        await client.query(`
      CREATE TABLE IF NOT EXISTS booking_history (
        id SERIAL PRIMARY KEY,
        reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
        check_in_date DATE,
        check_out_date DATE,
        status VARCHAR(50),
        modification_tags TEXT, -- Comma separated tags
        total_tariff DECIMAL(10,2),
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        changed_by VARCHAR(255)
      );
    `);

        console.log("Adding modification_tags to reservations table...");
        await client.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS modification_tags TEXT;
    `);

        console.log("Updating usage of 'active' status to 'Confirmed'...");
        await client.query(`
      UPDATE reservations 
      SET status = 'Confirmed' 
      WHERE status = 'active';
    `);

        await client.query(`
        UPDATE reservations 
        SET status = 'Confirmed' 
        WHERE status = 'Confirmed';
      `);

        // Ensure status column is length enough to hold 'Confirmed', 'Modified', 'Cancelled'
        // It is VARCHAR(20) in TableList.sql, which is enough.

        await client.query("COMMIT");
        console.log("Migration completed successfully.");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Migration failed:", err);
    } finally {
        client.release();
        process.exit();
    }
}

migrate();
