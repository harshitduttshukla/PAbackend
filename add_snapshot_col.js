
import pool from "./client.js";

async function addSnapshotColumn() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        console.log("Adding snapshot_data to booking_history...");
        await client.query(`
      ALTER TABLE booking_history 
      ADD COLUMN IF NOT EXISTS snapshot_data JSONB;
    `);

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

addSnapshotColumn();
