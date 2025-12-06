import pool from "../../client.js";

export async function ClientList(req, res) {
  try {
    const clientName = req.query.clientname;

    const query = `
      SELECT * FROM clients WHERE client_name ILIKE $1
    `;
    const result = await pool.query(query, [`%${clientName}%`]);

    res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error get client:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}







export async function getProperty(req, res) {
  try {
    const Address = req.query.Address;

    const query = `
      SELECT p.* ,
        h.host_name,
        h.host_email,
        h.host_contact_number
      FROM properties p
      LEFT JOIN host_information h ON p.host_id = h.host_id
      WHERE p.address1 ILIKE $1 
         OR p.address2 ILIKE $1 
         OR p.address3 ILIKE $1
    `;

    const result = await pool.query(query, [`%${Address}%`]);

    res.json({
      data: result.rows   // or result.rows[0] if you need just one
    });

  } catch (error) {
    console.error('Error Fetching property:', error);
    res.status(500).json({
      error: 'Internal server error while fetching property'
    });
  }
}






// // checkAvailability.js
export async function checkRoomAvailability(req, res) {
  try {
    const { propertyId, checkInDate, checkOutDate, roomTypes } = req.body;

    if (!propertyId || !checkInDate || !checkOutDate || !roomTypes) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const conflictQuery = `
    SELECT DISTINCT
        rb.room_type,
        r.reservation_no,
        r.guest_name,
        r.check_in_date,
        r.check_out_date
    FROM room_bookings rb
    JOIN reservations r ON rb.reservation_id = r.id
    WHERE rb.property_id = $1
        AND rb.status = 'active'
        AND rb.room_type = ANY($2::text[])
        AND rb.check_in_date <= $4 
        AND rb.check_out_date >= $3
    `;


    const conflicts = await pool.query(conflictQuery, [
      propertyId,
      roomTypes,
      checkInDate,
      checkOutDate,
    ]);

    const conflictsByRoom = {};
    conflicts.rows.forEach(conflict => {
      if (!conflictsByRoom[conflict.room_type]) {
        conflictsByRoom[conflict.room_type] = [];
      }
      conflictsByRoom[conflict.room_type].push({
        id: conflict.reservation_no,
        reservationNo: conflict.reservation_no,
        guestName: conflict.guest_name,
        checkIn: conflict.check_in_date,
        checkOut: conflict.check_out_date,
        roomType: conflict.room_type,
      });
    });

    const availability = roomTypes.map(roomType => ({
      roomType,
      isAvailable: !conflictsByRoom[roomType],
      conflictingReservations: conflictsByRoom[roomType] || [],
    }));

    res.json({ success: true, availability });

  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}








// ✅ Utility functions
function toInt(value, defaultValue = 0) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? defaultValue : n;
}

function toFloat(value, defaultValue = 0) {
  const n = parseFloat(value);
  return Number.isNaN(n) ? defaultValue : n;
}

// ✅ Main API
export async function saveReservation(req, res) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      clientId,
      propertyId,
      guestInfo,
      apartmentInfo,
      pajasaInfo,
      roomSelection,
      createdAt,
    } = req.body;

    // 🧾 Generate a unique reservation number
    const reservationNo = `RES${Date.now()}`;

    console.log("guestInfo received:", guestInfo);

    // ✅ Ensure date fields come from guestInfo (not apartmentInfo)
    const checkInDate =
      guestInfo.checkInDate && guestInfo.checkInDate !== ""
        ? guestInfo.checkInDate
        : null;
    const checkOutDate =
      guestInfo.checkOutDate && guestInfo.checkOutDate !== ""
        ? guestInfo.checkOutDate
        : null;

    // ✅ Prepare values for main reservation insert
    const reservationValues = [
      reservationNo,
      clientId,
      propertyId,
      guestInfo.guestName || "",
      guestInfo.guestEmail || "",
      guestInfo.contactNumber || "",
      checkInDate, // ✅ correct source
      checkOutDate, // ✅ correct source
      guestInfo.checkInTime || "",
      guestInfo.checkOutTime || "",
      toInt(guestInfo.occupancy),
      toFloat(guestInfo.baseRate),
      toFloat(guestInfo.taxes),
      toFloat(guestInfo.totalTariff),
      guestInfo.paymentMode || "",
      guestInfo.tariffType || "",
      toInt(guestInfo.chargeableDays),
      guestInfo.adminEmail || "",
      createdAt || new Date(),
    ];

    const reservationQuery = `
      INSERT INTO reservations (
        reservation_no, client_id, property_id, guest_name, guest_email,
        contact_number, check_in_date, check_out_date, check_in_time,
        check_out_time, occupancy, base_rate, taxes, total_tariff,
        payment_mode, tariff_type, chargeable_days, admin_email, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id
    `;

    const reservationResult = await client.query(
      reservationQuery,
      reservationValues
    );

    const reservationId = reservationResult.rows[0].id;

    // ✅ Insert room bookings
    const roomBookingQuery = `
      INSERT INTO room_bookings (reservation_id, room_type)
      VALUES ($1, $2)
    `;

    if (roomSelection && roomSelection.length > 0) {
      for (const room of roomSelection) {
        await client.query(roomBookingQuery, [reservationId, room]);
      }
    }

    // ✅ Insert additional reservation info
    const additionalInfoQuery = `
      INSERT INTO reservation_additional_info(
      reservation_id, host_name, host_email, host_base_rate,
      host_taxes, host_total_amount, contact_person, contact_number,
      comments, services, note
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

    await client.query(additionalInfoQuery, [
      reservationId,
      apartmentInfo.hostName || "",
      apartmentInfo.hostEmail || "",
      toFloat(apartmentInfo.hostBaseRate),
      toFloat(apartmentInfo.hostTaxes),
      toFloat(apartmentInfo.hostTotalAmount),
      apartmentInfo.contactPerson || "",
      apartmentInfo.contactNumber || "",
      pajasaInfo.comments || "",
      JSON.stringify(pajasaInfo.services || []),
      pajasaInfo.note || "",
    ]);

    await client.query("COMMIT");

    // ✅ Response
    res.json({
      success: true,
      message: "Reservation saved successfully",
      reservationNo,
      reservationId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving reservation:", error);
    res.status(500).json({
      success: false,
      message: "Error saving reservation",
      error: error.message,
    });
  } finally {
    client.release();
  }
}


export async function getReservationById(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID is required",
      });
    }

    const query = `
    SELECT
    r.*,
      c.client_name,
      p.address1, p.city, p.location, p.property_type,
      rai.host_name, rai.host_email, rai.host_base_rate, rai.host_taxes,
      rai.host_total_amount, rai.contact_person, rai.contact_number as contact_person_number,
      rai.comments, rai.services, rai.note,
      (
        SELECT json_agg(room_type)
          FROM room_bookings rb
          WHERE rb.reservation_id = r.id
        ) as "roomSelection",
      (
        SELECT json_agg(json_build_object(
          'id', rag.id,
          'guestName', rag.guest_name,
          'cid', rag.cid,
          'cod', rag.cod,
          'roomType', rag.room_type,
          'occupancy', rag.occupancy,
          'address', rag.address
        ))
          FROM reservation_additional_guests rag
          WHERE rag.reservation_id = r.id
        ) as "additionalGuests"
      FROM reservations r
      LEFT JOIN clients c ON r.client_id = c.id
      LEFT JOIN properties p ON r.property_id = p.property_id
      LEFT JOIN reservation_additional_info rai ON r.id = rai.reservation_id
      WHERE r.id = $1
      `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    const data = result.rows[0];

    // Parse services if it's a string
    if (typeof data.services === 'string') {
      try {
        data.services = JSON.parse(data.services);
      } catch (e) {
        data.services = {};
      }
    }

    // Map DB fields to frontend expected format if needed
    // For now, sending as is, frontend will map it

    res.json({
      success: true,
      data: data,
    });

  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reservation details",
      error: error.message,
    });
  }
}

export async function updateReservation(req, res) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      id,
      clientId,
      propertyId,
      guestInfo,
      apartmentInfo,
      pajasaInfo,
      roomSelection,
      additionalGuests
    } = req.body;

    if (!id) {
      throw new Error("Reservation ID is required for update");
    }

    // ✅ Ensure date fields come from guestInfo
    const checkInDate =
      guestInfo.checkInDate && guestInfo.checkInDate !== ""
        ? guestInfo.checkInDate
        : null;
    const checkOutDate =
      guestInfo.checkOutDate && guestInfo.checkOutDate !== ""
        ? guestInfo.checkOutDate
        : null;

    // 1. Update main reservation table
    const updateReservationQuery = `
      UPDATE reservations
    SET
    client_id = $1, property_id = $2, guest_name = $3, guest_email = $4,
      contact_number = $5, check_in_date = $6, check_out_date = $7, check_in_time = $8,
      check_out_time = $9, occupancy = $10, base_rate = $11, taxes = $12, total_tariff = $13,
      payment_mode = $14, tariff_type = $15, chargeable_days = $16, admin_email = $17
      WHERE id = $18
      `;

    const reservationValues = [
      clientId,
      propertyId,
      guestInfo.guestName || "",
      guestInfo.guestEmail || "",
      guestInfo.contactNumber || "",
      checkInDate,
      checkOutDate,
      guestInfo.checkInTime || "",
      guestInfo.checkOutTime || "",
      toInt(guestInfo.occupancy),
      toFloat(guestInfo.baseRate),
      toFloat(guestInfo.taxes),
      toFloat(guestInfo.totalTariff),
      guestInfo.paymentMode || "",
      guestInfo.tariffType || "",
      toInt(guestInfo.chargeableDays),
      guestInfo.adminEmail || "",
      id
    ];

    await client.query(updateReservationQuery, reservationValues);

    // 2. Update Room Bookings
    // Strategy: Delete existing bookings for this reservation and insert new ones
    // This handles changes in room types, dates, or number of rooms easily

    await client.query("DELETE FROM room_bookings WHERE reservation_id = $1", [id]);

    const roomBookingQuery = `
      INSERT INTO room_bookings(
        reservation_id, room_type, property_id, check_in_date, check_out_date
      ) VALUES($1, $2, $3, $4, $5)
        `;

    for (const roomType of roomSelection) {
      await client.query(roomBookingQuery, [
        id,
        roomType,
        propertyId,
        checkInDate,
        checkOutDate,
      ]);
    }

    // 3. Update Additional Info
    // Check if additional info exists first
    const checkInfoQuery = "SELECT id FROM reservation_additional_info WHERE reservation_id = $1";
    const infoResult = await client.query(checkInfoQuery, [id]);

    if (infoResult.rows.length > 0) {
      const updateInfoQuery = `
        UPDATE reservation_additional_info
    SET
    host_name = $1, host_email = $2, host_base_rate = $3,
      host_taxes = $4, host_total_amount = $5, contact_person = $6, contact_number = $7,
      comments = $8, services = $9, note = $10
        WHERE reservation_id = $11
      `;

      await client.query(updateInfoQuery, [
        apartmentInfo.hostName || "",
        apartmentInfo.hostEmail || "",
        toFloat(apartmentInfo.hostBaseRate),
        toFloat(apartmentInfo.hostTaxes),
        toFloat(apartmentInfo.hostTotalAmount),
        apartmentInfo.contactPerson || "",
        apartmentInfo.contactNumber || "",
        pajasaInfo.comments || "",
        JSON.stringify(pajasaInfo.services || []),
        pajasaInfo.note || "",
        id
      ]);
    } else {
      // Insert if it doesn't exist (handling legacy data or partial saves)
      const insertInfoQuery = `
        INSERT INTO reservation_additional_info(
        reservation_id, host_name, host_email, host_base_rate,
        host_taxes, host_total_amount, contact_person, contact_number,
        comments, services, note
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

      await client.query(insertInfoQuery, [
        id,
        apartmentInfo.hostName || "",
        apartmentInfo.hostEmail || "",
        toFloat(apartmentInfo.hostBaseRate),
        toFloat(apartmentInfo.hostTaxes),
        toFloat(apartmentInfo.hostTotalAmount),
        apartmentInfo.contactPerson || "",
        apartmentInfo.contactNumber || "",
        pajasaInfo.comments || "",
        JSON.stringify(pajasaInfo.services || []),
        pajasaInfo.note || "",
      ]);
    }

    // 4. Update Additional Guests
    await client.query("DELETE FROM reservation_additional_guests WHERE reservation_id = $1", [id]);

    if (additionalGuests && additionalGuests.length > 0) {
      const additionalGuestsQuery = `
        INSERT INTO reservation_additional_guests(
          reservation_id, guest_name, cid, cod, room_type, occupancy, address
        ) VALUES ${additionalGuests.map((_, i) => `($1, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6}, $${i * 6 + 7})`).join(", ")}
    `;

      const additionalGuestsValues = [id, ...additionalGuests.flatMap(guest => [
        guest.guestName || null,
        guest.cid || null,
        guest.cod || null,
        guest.roomType || null,
        guest.occupancy || null,
        guest.address || null
      ])];

      await client.query(additionalGuestsQuery, additionalGuestsValues);
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Reservation updated successfully",
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Error updating reservation",
      error: error.message,
    });
  } finally {
    client.release();
  }
}
