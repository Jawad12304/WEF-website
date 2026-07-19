-- WEF Admin Panel — Phase 1 schema (users, login throttling, activity log)
-- Charset/collation set explicitly so emoji/accented names in later phases
-- (team bios, sponsor names) store correctly without a migration later.

CREATE DATABASE IF NOT EXISTS wef_admin
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE wef_admin;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'administrator', 'editor') NOT NULL DEFAULT 'super_admin',
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Single source of truth for both rate limiting (see isRateLimited() in
-- includes/auth.php) and a future "recent login activity" admin view —
-- deliberately not duplicated as a failed_attempts/locked_until pair of
-- columns on admin_users, which would just be a second, driftable copy
-- of the same information.
-- Tracks every login attempt (successful or not) by email, independent of
-- whether that email exists in admin_users. This lets us rate-limit
-- against email enumeration too, not just brute-forcing a real account.
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  success TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_login_attempts_email_time (email, created_at),
  KEY idx_login_attempts_ip_time (ip_address, created_at)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  module VARCHAR(80) NOT NULL DEFAULT 'auth',
  details VARCHAR(255) NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_activity_logs_user (user_id),
  KEY idx_activity_logs_created (created_at),
  CONSTRAINT fk_activity_logs_user FOREIGN KEY (user_id)
    REFERENCES admin_users (id) ON DELETE SET NULL
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
