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






function toInt(value, defaultValue = 0){
    const n = parseInt(value,10);
    return Number.isNaN(n)?defaultValue : n;
}

function toFloat(value,defaultValue = 0){
    const n = parseFloat(value);
    return Number.isNaN(n)? defaultValue : n;
}


// saveReservation.js
export async function saveReservation(req, res) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const {
            clientId,
            propertyId,
            guestInfo,
            apartmentInfo,
            pajasaInfo,
            roomSelection,
            createdAt
        } = req.body;

        // Generate reservation number
        const reservationNo = `RES${Date.now()}`;

          const reservationValues = [
            reservationNo,
            clientId,
            propertyId,
            guestInfo.guestName || '',
            guestInfo.guestEmail || '',
            guestInfo.contactNumber || '',
            guestInfo.cid || null, // check-in date
            apartmentInfo.checkOutDate || null, // check-out date
            guestInfo.checkInTime || '',
            guestInfo.checkOutTime || '',
            toInt(guestInfo.occupancy),
            toFloat(guestInfo.baseRate),
            toFloat(guestInfo.taxes),
            toFloat(guestInfo.totalTariff),
            guestInfo.paymentMode || '',
            guestInfo.tariffType || '',
            toInt(guestInfo.chargeableDays),
            guestInfo.adminEmail || '',
            createdAt || new Date()
        ];

        // Insert main reservation
        const reservationQuery = `
            INSERT INTO reservations (
                reservation_no, client_id, property_id, guest_name, guest_email,
                contact_number, check_in_date, check_out_date, check_in_time,
                check_out_time, occupancy, base_rate, taxes, total_tariff,
                payment_mode, tariff_type, chargeable_days, admin_email, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            RETURNING id
        `;

       
        

        const reservationResult = await client.query(reservationQuery,reservationValues);

        const reservationId = reservationResult.rows[0].id;

        // Insert room bookings
        const roomBookingQuery = `
            INSERT INTO room_bookings (
                reservation_id, room_type, property_id, check_in_date, check_out_date
            ) VALUES ($1, $2, $3, $4, $5)
        `;

        for (const roomType of roomSelection) {
            await client.query(roomBookingQuery, [
                reservationId,
                roomType,
                propertyId,
                guestInfo.cid || null,
                apartmentInfo.checkOutDate || null
            ]);
        }

        // Save additional info (apartment and pajasa info)
        const additionalInfoQuery = `
            INSERT INTO reservation_additional_info (
                reservation_id, host_name, host_email, host_base_rate,
                host_taxes, host_total_amount, contact_person, contact_number,
                comments, services, note
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        await client.query(additionalInfoQuery,  [
            reservationId,
            apartmentInfo.hostName || '',
            apartmentInfo.hostEmail || '',
            toFloat(apartmentInfo.hostBaseRate),
            toFloat(apartmentInfo.hostTaxes),
            toFloat(apartmentInfo.hostTotalAmount),
            apartmentInfo.contactPerson || '',
            apartmentInfo.contactNumber || '',
            pajasaInfo.comments || '',
            JSON.stringify(pajasaInfo.services || []),
            pajasaInfo.note || ''
        ]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Reservation saved successfully',
            reservationNo,
            reservationId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saving reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving reservation'
        });
    } finally {
        client.release();
    }
}


















































