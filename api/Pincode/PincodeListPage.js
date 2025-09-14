
import pool from "../../client.js"; 

export async function AllPinCode(req, res) {
  try {
    
    const query = `
      SELECT * FROM pincodes
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No pincodes found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching pincodes:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

