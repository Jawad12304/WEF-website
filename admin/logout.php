<?php
require_once __DIR__ . '/includes/auth.php';

initSession();
logoutUser();
redirect('login.php');
