// import pool from "../../client.js";

// export const getAllReservations = async (req, res) => {
//   try {
//     const query = `
//       SELECT 
//         r.id,
//         r.status,
//         r.created_at,
//         r.reservation_no,
//         r.guest_name,
//         rb.room_type AS room,
//         // p.host,
//         p.address1,
//         c.client
//       FROM reservations r
//       JOIN room_bookings rb ON r.id = rb.reservation_id
//       JOIN properties p ON r.property_id = p.property_id
//       JOIN clients c ON r.client_id = c.id
//       ORDER BY r.booking_date DESC
//     `;

//     const result = await pool.query(query);
//     res.status(200).json({ data: result.rows });
//   } catch (error) {
//     console.error('Error fetching reservations:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

import pool from "../../client.js";

export const getAllReservations = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.*,
        rb.*,
        p.*,
        c.*
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
