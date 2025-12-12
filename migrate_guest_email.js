import pool from "./client.js";

const migrateGuestEmail = async () => {
    const query = `
    ALTER TABLE reservations ALTER COLUMN guest_email TYPE TEXT;
  `;

    try {
        await pool.query(query);
        console.log("Successfully altered guest_email column to TEXT.");
    } catch (err) {
        console.error("Error altering guest_email column:", err);
    } finally {
        pool.end();
    }
};

migrateGuestEmail();
