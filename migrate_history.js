import pool from "./client.js";

const createHistoryTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS reservation_versions (
      id SERIAL PRIMARY KEY,
      reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
      change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      snapshot_data JSONB, 
      changed_by VARCHAR(255) -- Optional, for future use or if we pass user info
    );
  `;

    try {
        await pool.query(query);
        console.log("Reservation Versions table created successfully.");
    } catch (err) {
        console.error("Error creating reservation_versions table:", err);
    } finally {
        pool.end();
    }
};

createHistoryTable();
