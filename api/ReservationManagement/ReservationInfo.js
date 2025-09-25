import pool from "../../client.js";

export async function ClientList(req, res) {
  try {
    const clientName = req.query.clientname;

    const query = `
      SELECT * FROM clients WHERE client_name LIKE $1
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
      SELECT * 
      FROM properties 
      WHERE address1 LIKE $1 
         OR address2 LIKE $1 
         OR address3 LIKE $1
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




// checkAvailability.js
export async function checkRoomAvailability(req, res) {
    try {
        const { propertyId, checkInDate, checkOutDate, roomTypes } = req.body;

        if (!propertyId || !checkInDate || !checkOutDate || !roomTypes) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check for overlapping bookings
        const conflictQuery = `
            SELECT 
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
            AND (
                (rb.check_in_date <= $3 AND rb.check_out_date > $3) OR
                (rb.check_in_date < $4 AND rb.check_out_date >= $4) OR
                (rb.check_in_date >= $3 AND rb.check_out_date <= $4)
            )
        `;

        const conflicts = await pool.query(conflictQuery, [
            propertyId,
            roomTypes,
            checkInDate,
            checkOutDate
        ]);

        // Group conflicts by room type
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
                roomType: conflict.room_type
            });
        });

        // Generate availability response
        const availability = roomTypes.map(roomType => ({
            roomType,
            isAvailable: !conflictsByRoom[roomType],
            conflictingReservations: conflictsByRoom[roomType] || []
        }));

        res.json({
            success: true,
            availability
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
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

        const reservationResult = await client.query(reservationQuery, [
            reservationNo,
            clientId,
            propertyId,
            guestInfo.guestName,
            guestInfo.guestEmail,
            guestInfo.contactNumber,
            guestInfo.cid, // check-in date
            apartmentInfo.checkOutDate,
            guestInfo.checkInTime,
            guestInfo.checkOutTime,
            parseInt(guestInfo.occupancy),
            parseFloat(guestInfo.baseRate),
            parseFloat(guestInfo.taxes),
            parseFloat(guestInfo.totalTariff),
            guestInfo.paymentMode,
            guestInfo.tariffType,
            parseInt(guestInfo.chargeableDays),
            guestInfo.adminEmail,
            createdAt
        ]);

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
                guestInfo.cid,
                apartmentInfo.checkOutDate
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

        await client.query(additionalInfoQuery, [
            reservationId,
            apartmentInfo.hostName,
            apartmentInfo.hostEmail,
            parseFloat(apartmentInfo.hostBaseRate) || 0,
            parseFloat(apartmentInfo.hostTaxes) || 0,
            parseFloat(apartmentInfo.hostTotalAmount) || 0,
            apartmentInfo.contactPerson,
            apartmentInfo.contactNumber,
            pajasaInfo.comments,
            JSON.stringify(pajasaInfo.services),
            pajasaInfo.note
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


































































































// import express from 'express';
// import { body, param, validationResult } from 'express-validator';

// const router = express.Router();

// // Mock databases (in production, use actual database)
// let clients = [
//   { id: '1', name: 'BG Exploration and Production India Ltd', email: 'contact@bg-exploration.com', phone: '+91-9876543210', createdAt: new Date() },
//   { id: '2', name: 'ABC Corp', email: 'info@abccorp.com', phone: '+91-9876543211', createdAt: new Date() },
//   { id: '3', name: 'XYZ Industries', email: 'contact@xyzind.com', phone: '+91-9876543212', createdAt: new Date() }
// ];

// let addresses = [
//   { id: '1', address: '123 Business District', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001', clientId: '1' },
//   { id: '2', address: '456 Corporate Avenue', city: 'Delhi', state: 'Delhi', zipCode: '110001', clientId: '1' },
//   { id: '3', address: '789 Industrial Park', city: 'Bangalore', state: 'Karnataka', zipCode: '560001', clientId: '2' }
// ];

// let properties = [
//   {
//     id: 'prop1',
//     name: 'Premium Apartments Complex',
//     address: '123 Hotel Street, Mumbai',
//     type: 'Apartment',
//     rooms: [
//       { id: 'room1', name: 'Master Bedroom-1', type: 'Master', capacity: 2, baseRate: 3000, isAvailable: false, propertyId: 'prop1' },
//       { id: 'room2', name: 'Master Bedroom-2', type: 'Master', capacity: 2, baseRate: 3200, isAvailable: true, propertyId: 'prop1' },
//       { id: 'room3', name: 'Master Bedroom-3', type: 'Master', capacity: 2, baseRate: 3500, isAvailable: false, propertyId: 'prop1' }
//     ],
//     amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Parking']
//   }
// ];

// let reservations = [
//   {
//     id: 'res1',
//     reservationNo: '11030',
//     clientId: '1',
//     propertyId: 'prop1',
//     guestInfo: {
//       companyName: 'BG Exploration and Production India Ltd',
//       guestName: 'Aditya Sharma',
//       guestEmail: 'aditya.sharma@bg-exploration.com',
//       contactNumber: '+91-9876543210',
//       cid: '15 June,2022',
//       baseRate: 3000,
//       taxes: 360,
//       totalTariff: 3360,
//       paymentMode: 'Direct Payment',
//       tariffType: 'As Per Contract',
//       occupancy: 2,
//       checkInTime: '12:00 PM',
//       checkOutTime: '11:00 AM',
//       chargeableDays: 2,
//       adminEmail: 'admin@bg-exploration.com'
//     },
//     roomIds: ['room3'],
//     status: 'confirmed',
//     createdAt: new Date('2022-06-15'),
//     updatedAt: new Date('2022-06-15')
//   }
// ];

// // Validation middleware
// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors: errors.array()
//     });
//   }
//   next();
// };

// // 1. GET All Clients
// router.get('/clients', (req, res) => {
//   res.json({
//     success: true,
//     data: clients,
//     message: 'Clients retrieved successfully'
//   });
// });

// // 2. GET Client by ID
// router.get('/clients/:id', 
//   param('id').notEmpty().withMessage('Client ID is required'),
//   handleValidationErrors,
//   (req, res) => {
//     const client = clients.find(c => c.id === req.params.id);
    
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: 'Client not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: client,
//       message: 'Client retrieved successfully'
//     });
//   }
// );

// // 3. GET Addresses by Client ID
// router.get('/clients/:clientId/addresses',
//   param('clientId').notEmpty().withMessage('Client ID is required'),
//   handleValidationErrors,
//   (req, res) => {
//     const clientAddresses = addresses.filter(addr => addr.clientId === req.params.clientId);
    
//     res.json({
//       success: true,
//       data: clientAddresses,
//       message: 'Addresses retrieved successfully'
//     });
//   }
// );

// // 4. GET All Properties
// router.get('/properties', (req, res) => {
//   res.json({
//     success: true,
//     data: properties,
//     message: 'Properties retrieved successfully'
//   });
// });

// // 5. GET Property by ID
// router.get('/properties/:id',
//   param('id').notEmpty().withMessage('Property ID is required'),
//   handleValidationErrors,
//   (req, res) => {
//     const property = properties.find(p => p.id === req.params.id);
    
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: property,
//       message: 'Property retrieved successfully'
//     });
//   }
// );

// // 6. GET Room Availability
// router.get('/properties/:propertyId/rooms/availability',
//   param('propertyId').notEmpty().withMessage('Property ID is required'),
//   (req, res) => {
//     const { checkIn, checkOut } = req.query;
//     const property = properties.find(p => p.id === req.params.propertyId);
    
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }

//     // In a real implementation, check against actual reservations and dates
//     const availableRooms = property.rooms.filter(room => room.isAvailable);
    
//     res.json({
//       success: true,
//       data: {
//         propertyId: req.params.propertyId,
//         checkIn,
//         checkOut,
//         availableRooms,
//         totalRooms: property.rooms.length,
//         availableCount: availableRooms.length
//       },
//       message: 'Room availability retrieved successfully'
//     });
//   }
// );

// // 7. POST Create Reservation
// router.post('/reservations',
//   [
//     body('clientId').notEmpty().withMessage('Client ID is required'),
//     body('propertyId').notEmpty().withMessage('Property ID is required'),
//     body('guestInfo.guestName').notEmpty().withMessage('Guest name is required'),
//     body('guestInfo.guestEmail').isEmail().withMessage('Valid guest email is required'),
//     body('guestInfo.contactNumber').notEmpty().withMessage('Contact number is required'),
//     body('roomIds').isArray({ min: 1 }).withMessage('At least one room must be selected')
//   ],
//   handleValidationErrors,
//   (req, res) => {
//     const { clientId, propertyId, guestInfo, apartmentInfo, pajasaInfo, roomIds } = req.body;

//     // Validate client exists
//     const client = clients.find(c => c.id === clientId);
//     if (!client) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid client ID'
//       });
//     }

//     // Validate property exists
//     const property = properties.find(p => p.id === propertyId);
//     if (!property) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid property ID'
//       });
//     }

//     // Validate rooms exist and are available
//     const requestedRooms = property.rooms.filter(room => roomIds.includes(room.id));
//     if (requestedRooms.length !== roomIds.length) {
//       return res.status(400).json({
//         success: false,
//         message: 'One or more room IDs are invalid'
//       });
//     }

//     const unavailableRooms = requestedRooms.filter(room => !room.isAvailable);
//     if (unavailableRooms.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'One or more selected rooms are not available',
//         unavailableRooms: unavailableRooms.map(room => room.name)
//       });
//     }

//     // Create new reservation
//     const newReservation = {
//       id: `res${Date.now()}`,
//       reservationNo: `${10000 + reservations.length + 1}`,
//       clientId,
//       propertyId,
//       guestInfo,
//       apartmentInfo,
//       pajasaInfo,
//       roomIds,
//       status: 'pending',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     reservations.push(newReservation);

//     // Mark rooms as unavailable
//     requestedRooms.forEach(room => {
//       room.isAvailable = false;
//     });

//     res.status(201).json({
//       success: true,
//       data: newReservation,
//       message: 'Reservation created successfully'
//     });
//   }
// );

// // 8. GET All Reservations
// router.get('/reservations', (req, res) => {
//   const { clientId, status, propertyId } = req.query;
  
//   let filteredReservations = reservations;

//   if (clientId) {
//     filteredReservations = filteredReservations.filter(r => r.clientId === clientId);
//   }

//   if (status) {
//     filteredReservations = filteredReservations.filter(r => r.status === status);
//   }

//   if (propertyId) {
//     filteredReservations = filteredReservations.filter(r => r.propertyId === propertyId);
//   }

//   res.json({
//     success: true,
//     data: filteredReservations,
//     message: 'Reservations retrieved successfully'
//   });
// });

// // 9. GET Reservation by ID
// router.get('/reservations/:id',
//   param('id').notEmpty().withMessage('Reservation ID is required'),
//   handleValidationErrors,
//   (req, res) => {
//     const reservation = reservations.find(r => r.id === req.params.id);
    
//     if (!reservation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Reservation not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: reservation,
//       message: 'Reservation retrieved successfully'
//     });
//   }
// );

// // 10. PUT Update Reservation
// router.put('/reservations/:id',
//   param('id').notEmpty().withMessage('Reservation ID is required'),
//   handleValidationErrors,
//   (req, res) => {
//     const reservationIndex = reservations.findIndex(r => r.id === req.params.id);
    
//     if (reservationIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'Reservation not found'
//       });
//     }

//     const updatedReservation = {
//       ...reservations[reservationIndex],
//       ...req.body,
//       updatedAt: new Date()
//     };

//     reservations[reservationIndex] = updatedReservation;

//     res.json({
//       success: true,
//       data: updatedReservation,
//       message: 'Reservation updated successfully'
//     });
//   }
// );

// // 11. DELETE Reservation (Cancel)
// router.delete('/reservations/:id',
//   param('id').notEmpty().withMessage('Reservation ID is required'),
//   handleValidationErrors,
//   (req, res) => {
//     const reservationIndex = reservations.findIndex(r => r.id === req.params.id);
    
//     if (reservationIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'Reservation not found'
//       });
//     }

//     const reservation = reservations[reservationIndex];
    
//     // Mark rooms as available again
//     const property = properties.find(p => p.id === reservation.propertyId);
//     if (property) {
//       property.rooms.forEach(room => {
//         if (reservation.roomIds.includes(room.id)) {
//           room.isAvailable = true;
//         }
//       });
//     }

//     // Update status instead of deleting
//     reservations[reservationIndex] = {
//       ...reservation,
//       status: 'cancelled',
//       updatedAt: new Date()
//     };

//     res.json({
//       success: true,
//       message: 'Reservation cancelled successfully'
//     });
//   }
// );

// // 12. POST Check Room Availability (detailed check)
// router.post('/check-availability',
//   [
//     body('propertyId').notEmpty().withMessage('Property ID is required'),
//     body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
//     body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
//     body('roomIds').isArray().withMessage('Room IDs must be an array')
//   ],
//   handleValidationErrors,
//   (req, res) => {
//     const { propertyId, checkIn, checkOut, roomIds } = req.body;

//     const property = properties.find(p => p.id === propertyId);
//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: 'Property not found'
//       });
//     }

//     // Check if rooms are available
//     const requestedRooms = property.rooms.filter(room => 
//       roomIds.length === 0 ? true : roomIds.includes(room.id)
//     );

//     const availabilityResults = requestedRooms.map(room => ({
//       roomId: room.id,
//       roomName: room.name,
//       isAvailable: room.isAvailable,
//       baseRate: room.baseRate,
//       capacity: room.capacity
//     }));

//     const allAvailable = availabilityResults.every(room => room.isAvailable);

//     res.json({
//       success: true,
//       data: {
//         propertyId,
//         checkIn,
//         checkOut,
//         rooms: availabilityResults,
//         allAvailable,
//         message: allAvailable ? 'All rooms are available' : 'Some rooms are not available'
//       },
//       message: 'Availability check completed'
//     });
//   }
// );

// // 13. GET Dashboard Stats
// router.get('/dashboard/stats', (req, res) => {
//   const totalClients = clients.length;
//   const totalProperties = properties.length;
//   const totalReservations = reservations.length;
//   const activeReservations = reservations.filter(r => r.status === 'confirmed').length;
//   const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  
//   const totalRooms = properties.reduce((acc, prop) => acc + prop.rooms.length, 0);
//   const occupiedRooms = properties.reduce((acc, prop) => 
//     acc + prop.rooms.filter(room => !room.isAvailable).length, 0
//   );
//   const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

//   res.json({
//     success: true,
//     data: {
//       totalClients,
//       totalProperties,
//       totalReservations,
//       activeReservations,
//       pendingReservations,
//       totalRooms,
//       occupiedRooms,
//       availableRooms: totalRooms - occupiedRooms,
//       occupancyRate: Math.round(occupancyRate * 100) / 100
//     },
//     message: 'Dashboard statistics retrieved successfully'
//   });
// });

// export default router;

