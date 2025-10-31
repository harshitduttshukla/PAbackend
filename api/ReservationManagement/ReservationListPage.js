import pool from "../../client.js";

export const getAllReservations = async (req, res) => {
  try {
  
    const query = `
      SELECT 
        r.*,
        rb.room_type,
        p.property_type,p.address1,p.address2,p.address3,
        p.Location,p.city,p.Landmark,p.contact_person,
        p.contact_number AS contact_person_number,
        p.caretaker_name,p.caretaker_number,p.property_url,
        c.client_name,c.state,c.zip_code
      FROM reservations r
      JOIN room_bookings rb ON r.id = rb.reservation_id
      JOIN properties p ON r.property_id = p.property_id
      JOIN clients c ON r.client_id = c.id
      ORDER BY r.created_at DESC
    `;

    const result = await pool.query(query);
  
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
