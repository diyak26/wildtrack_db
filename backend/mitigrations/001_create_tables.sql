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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- zones
CREATE TABLE IF NOT EXISTS zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  area VARCHAR(100),
  description TEXT,
  animal_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- animals
CREATE TABLE IF NOT EXISTS animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  species VARCHAR(150),
  age VARCHAR(50),
  gender ENUM('Male','Female','Unknown') DEFAULT 'Unknown',
  zone_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE SET NULL
);

-- gps_movements
CREATE TABLE IF NOT EXISTS gps_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  speed DECIMAL(6,2) DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
);

-- medical_records
CREATE TABLE IF NOT EXISTS medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  record_type VARCHAR(100),
  date DATE,
  vet VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
);

-- threats
CREATE TABLE IF NOT EXISTS threats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT DEFAULT NULL,
  threat_type VARCHAR(150),
  severity ENUM('low','medium','high') DEFAULT 'low',
  location VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','resolved') DEFAULT 'active',
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE SET NULL
);

-- conservation actions
CREATE TABLE IF NOT EXISTS actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  zone_id INT DEFAULT NULL,
  status ENUM('planned','ongoing','completed') DEFAULT 'planned',
  start_date DATE,
  team VARCHAR(150),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE SET NULL
);
