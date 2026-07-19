<?php
/**
 * Copy this file to config.php and fill in real values.
 * config.php is gitignored — never commit real credentials.
 */

// --- Database ---
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'wef_admin');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// --- App ---
// true on your local XAMPP install; set to false on Hostinger unless it's served over HTTPS
define('APP_FORCE_HTTPS_COOKIE', false);

// Base URL of this admin app, no trailing slash (used for redirects)
define('APP_BASE_URL', 'http://localhost/admin');
