

CREATE TABLE host_information (
    host_id SERIAL PRIMARY KEY, -- Unique ID for each host (auto-increment)
    host_name VARCHAR(100) NOT NULL, -- Name of the host
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