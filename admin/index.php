<?php
require_once __DIR__ . '/includes/auth.php';

initSession();
redirect(currentUser() !== null ? 'dashboard.php' : 'login.php');
