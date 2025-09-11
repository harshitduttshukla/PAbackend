import pool from "../../client.js";

export async function insertClient(req, res) {
  try {
    const {
      active,
      clientName,
      gstNo,
      streetAddress,
      streetAddress2,
      city,
      state,
      zipCode,
      phoneNumber,
      faxNumber,
      mobileNumber,
      emailAddress,
      webAddress,
    } = req.body;

    const query = `
      INSERT INTO clients (
        active, client_name, gst_no, street_address, street_address_2, 
        city, state, zip_code, phone_number, fax_number, mobile_number, 
        email_address, web_address, created_at, updated_at
      ) 
      VALUES (
        $1, $2, $3, $4, $5, 
        $6, $7, $8, $9, $10, $11, 
        $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *;
    `;

    const values = [
      active ?? true,
      clientName,
      gstNo,
      streetAddress,
      streetAddress2,
      city,
      state,
      zipCode,
      phoneNumber,
      faxNumber,
      mobileNumber,
      emailAddress,
      webAddress,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Client inserted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error inserting client:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

