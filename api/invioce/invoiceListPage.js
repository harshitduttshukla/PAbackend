import pool from "../../client.js";

export const getAllInvoices = async (req, res) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        id, 
        invoice_number, 
        invoice_date, 
        invoice_to, 
        grand_total, 
        status 
      FROM invoices 
      ORDER BY created_at DESC
    `;
    
    const result = await client.query(query);
    
    res.status(200).json({
      message: "Invoices fetched successfully",
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  } finally {
    client.release();
  }
};
