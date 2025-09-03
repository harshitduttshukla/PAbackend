import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
import pool from "../client.js"; 

// ✅ Validation schema
const hostSchema = z.object({
  host_name: z.string().min(3, "Name must be at least 3 characters"),
  host_pan_number: z.string().length(10, "PAN must be 10 characters"),
  rating: z.number().min(0).max(5),
  host_email: z.string().email("Invalid email format"),
  host_contact_number: z.string().regex(/^[0-9]{10}$/, "Contact must be 10 digits"),
  host_gst_numbers: z.array(z.string()).optional() // ✅ multiple GSTs
});

const createHost = async (req, res) => {
  try {
    // 1️⃣ Validate input
    const validatedData = hostSchema.parse(req.body);
    const {
      host_name,
      host_pan_number,
      rating,
      host_email,
      host_contact_number,
      host_gst_numbers
    } = validatedData;

    // 2️⃣ Insert into host_information
    const hostResult = await pool.query(
      `INSERT INTO host_information 
       (host_name, host_pan_number, rating, host_email, host_contact_number)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING host_id, host_name, host_pan_number, rating, host_email, host_contact_number`,
      [host_name, host_pan_number, rating, host_email, host_contact_number]
    );

    const newHost = hostResult.rows[0];

    // 3️⃣ Insert GST numbers (if any)
    if (host_gst_numbers && host_gst_numbers.length > 0) {
      await Promise.all(
        host_gst_numbers.map((gst) =>
          pool.query(
            `INSERT INTO host_gst_numbers (host_id, gst_number)
             VALUES ($1, $2)`,
            [newHost.host_id, gst] // ✅ first 2 chars = state code
          )
        )
      );
    }

    // 4️⃣ Response
    return res.json({
      message: "Host created successfully",
      host: newHost,
      gst_numbers: host_gst_numbers || []
    });
  } catch (err) {
    // Handle validation error from Zod
    if (err.errors) {
      return res.status(400).json({ error: err.errors });
    }

    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
};

export default createHost;


