
-- Estrutura do banco de dados MySQL
CREATE DATABASE license_plate_db;
USE license_plate_db;

CREATE TABLE plates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
