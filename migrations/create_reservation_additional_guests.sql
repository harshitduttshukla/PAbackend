CREATE TABLE IF NOT EXISTS reservation_additional_guests (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
    guest_name VARCHAR(255),
    cid DATE,
    cod DATE,
    room_type VARCHAR(100),
    occupancy VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
