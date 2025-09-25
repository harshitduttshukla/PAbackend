

CREATE TABLE host_information (
    host_id SERIAL PRIMARY KEY, -- Unique ID for each host (auto-increment)
    host_name VARCHAR(100) NOT NULL, -- Name of the host
   -- add the host owner name 
    host_pan_number VARCHAR(20) UNIQUE NOT NULL, -- PAN (unique)
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5), -- Rating between 0 and 5
    host_email VARCHAR(100) UNIQUE NOT NULL, -- Unique email
    host_contact_number VARCHAR(15) UNIQUE NOT NULL, -- Mobile/phone (unique)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- When the record was created
);




CREATE TABLE host_gst_numbers (
    gst_id SERIAL PRIMARY KEY, -- Unique ID for each GST record
    host_id INT NOT NULL, -- Foreign key to host_information
    gst_number VARCHAR(20) NOT NULL, -- GST number
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record created time
    UNIQUE (host_id, gst_number), -- Prevent same GST being added twice for one host
    CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES host_information(host_id) ON DELETE CASCADE
);



CREATE TABLE pincodes (
    pincode_id SERIAL PRIMARY KEY,
    pincode VARCHAR(10) UNIQUE NOT NULL
    aadd the city 
);


CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    property_status VARCHAR(50) NOT NULL,
    host_id INT NOT NULL,  //importan
    ivr_number VARCHAR(50),
    pincode_id INT NOT NULL,  //importan
    manual_pincode VARCHAR(10),  -- delete this 
    city VARCHAR(100),
    location VARCHAR(255),
    post_id VARCHAR(100),
    property_type VARCHAR(50),
    manual_host_name VARCHAR(255),  -- delete this 
    contact_person VARCHAR(100),
    contact_number VARCHAR(15),
    email_id VARCHAR(255),
    caretaker_name VARCHAR(100),
    caretaker_number VARCHAR(15),
    note TEXT,
    check_in_time TIME,
    check_out_time TIME,
    master_bedroom INT,
    common_bedroom INT,
    landmark VARCHAR(255),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    address3 VARCHAR(255),
    thumbnail TEXT,
    property_url TEXT,

    -- 🔑 Foreign Keys
    CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES host_information(host_id) ON DELETE CASCADE,
    CONSTRAINT fk_pincode FOREIGN KEY (pincode_id) REFERENCES pincodes(pincode_id) ON DELETE CASCADE
);





CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    active BOOLEAN DEFAULT true,
    client_name VARCHAR(255) NOT NULL,
    gst_no VARCHAR(50),
    street_address TEXT,
    street_address_2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    phone_number VARCHAR(20),
    fax_number VARCHAR(20),
    mobile_number VARCHAR(20),
    email_address VARCHAR(255) UNIQUE,  -- unique email
    web_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT idx_client_name UNIQUE (client_name),
    CONSTRAINT idx_email UNIQUE (email_address)
);



-- Reservations table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    reservation_no VARCHAR(50) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    property_id INTEGER REFERENCES properties(id),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    contact_number VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    check_in_time TIME DEFAULT '12:00',
    check_out_time TIME DEFAULT '11:00',
    occupancy INTEGER,
    base_rate DECIMAL(10,2),
    taxes DECIMAL(10,2),
    total_tariff DECIMAL(10,2),
    payment_mode VARCHAR(50),
    tariff_type VARCHAR(50),
    chargeable_days INTEGER,
    admin_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room bookings table (for tracking which specific rooms are booked)
CREATE TABLE room_bookings (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservations(id),
    room_type VARCHAR(50) NOT NULL, -- 'masterBedroom1', 'masterBedroom2', 'masterBedroom3'
    property_id INTEGER REFERENCES properties(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- Property rooms table (to define available rooms in each property)
CREATE TABLE property_rooms (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    room_type VARCHAR(50) NOT NULL,
    room_name VARCHAR(100),
    max_occupancy INTEGER DEFAULT 2,
    is_active BOOLEAN DEFAULT true
);






CREATE TABLE reservation_additional_info (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservations(id),
    host_name VARCHAR(255),
    host_email VARCHAR(255),
    host_base_rate DECIMAL(10,2),
    host_taxes DECIMAL(10,2),
    host_total_amount DECIMAL(10,2),
    contact_person VARCHAR(255),
    contact_number VARCHAR(20),
    comments TEXT,
    services JSONB, -- Store services as JSON
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);