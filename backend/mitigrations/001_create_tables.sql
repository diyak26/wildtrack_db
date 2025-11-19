-- 001_create_tables.sql
CREATE DATABASE IF NOT EXISTS wildtrack_db;
USE wildtrack_db;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANIMAL TABLE
CREATE TABLE IF NOT EXISTS Animal (
  animal_id INT(11) NOT NULL,
  name VARCHAR(150) NOT NULL,
  species VARCHAR(100) NOT NULL,
  age INT(11) DEFAULT NULL,
  gender ENUM('Male','Female','Unknown') NOT NULL DEFAULT 'Unknown',
  zone_id INT(11) DEFAULT NULL,
  health_status VARCHAR(255) DEFAULT NULL,
  conservation_status VARCHAR(255) DEFAULT NULL,
  entry_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (animal_id),
  CONSTRAINT fk_animal_zone FOREIGN KEY (zone_id)
    REFERENCES Zone(zone_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


-- ZONE TABLE
CREATE TABLE IF NOT EXISTS Zone (
  zone_id INT PRIMARY KEY,
  zone_name VARCHAR(100),
  description VARCHAR(100),
  area VARCHAR(50),
  animals_cnt INT ,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRACKING RECORD TABLE
CREATE TABLE IF NOT EXISTS Tracking_Record (
  tracking_id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  gps_location VARCHAR(255),
  time_stamp DATETIME,
  movement_pattern TEXT,
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);

-- THREAT ALERT TABLE
CREATE TABLE IF NOT EXISTS Threat_Alert (
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  type VARCHAR(100),
  severity VARCHAR(50),
  reported_date DATE,
  action TEXT,
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);

-- MEDICAL RECORD TABLE
CREATE TABLE IF NOT EXISTS Medical_Record (
  followup_id INT AUTO_INCREMENT PRIMARY KEY,
  record_id VARCHAR(100),
  animal_id INT NOT NULL,
  treatment_date DATE,
  vet_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);

-- CONSERVATION ACTION TABLE
CREATE TABLE IF NOT EXISTS Conservation_Action (
  action_id INT AUTO_INCREMENT PRIMARY KEY,
  action_type VARCHAR(100),
  animal_id INT NOT NULL,
  action_date DATE,
  outcome TEXT,
  official VARCHAR(100),
  phone_no VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);
