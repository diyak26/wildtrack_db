-- 001_create_tables.sql
CREATE DATABASE IF NOT EXISTS wildtrack_db;
USE wildtrack_db;

-- users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','staff') DEFAULT 'staff',
);


CREATE TABLE IF NOT EXISTS Animal (
  animal_id INT AUTO_INCREMENT PRIMARY KEY,
  species VARCHAR(100) NOT NULL,
  age INT,
  gender ENUM('Male','Female','Unknown'),
  health_status VARCHAR(255),
  conservation_status VARCHAR(255),
  entry_date DATE
);

CREATE TABLE IF NOT EXISTS Zone (
  zone_id INT AUTO_INCREMENT PRIMARY KEY,
  zone_name VARCHAR(100),
  region VARCHAR(100),
  climate VARCHAR(100),
  area_type VARCHAR(100),
  size VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Tracking_Record (
  tracking_id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  gps_location VARCHAR(255),
  time_stamp DATETIME,
  movement_pattern TEXT,
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS Medical_Record (
  followup_id INT AUTO_INCREMENT PRIMARY KEY,
  record_id VARCHAR(100),
  animal_id INT NOT NULL,
  treatment_date DATE,
  vet_name VARCHAR(100),
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Conservation_Action (
  action_id INT AUTO_INCREMENT PRIMARY KEY,
  action_type VARCHAR(100),
  animal_id INT NOT NULL,
  action_date DATE,
  outcome TEXT,
  official VARCHAR(100),
  phone_no VARCHAR(15),
  FOREIGN KEY (animal_id) REFERENCES Animal(animal_id)
    ON DELETE CASCADE
);
