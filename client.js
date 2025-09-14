import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();




const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
  // Or use remote:
  // connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@13.202.193.4:5432/${process.env.DB_NAME}`,
});

// Helper function
const query = async (text, params = []) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", JSON.stringify({ text, duration, rows: res.rowCount }));
    return res;
  } catch (err) {
    console.error("❌ Error encountered in DB query");
    console.error(err);
    throw err;
  }
};

// ✅ Export in ESM way
export default pool;
export { query };
