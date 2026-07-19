<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

initSession();

if (currentUser() !== null) {
    redirect('dashboard.php');
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrfVerify($_POST['csrf_token'] ?? null)) {
        $error = 'Your session expired. Please try again.';
    } else {
        $result = attemptLogin($_POST['email'] ?? '', $_POST['password'] ?? '');
        if ($result['ok']) {
            redirect('dashboard.php');
        }
        $error = $result['error'];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Sign In — WEF Admin</title>
<link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
  <div class="login-shell">
    <div class="login-card">
      <div class="login-brand">
        <div class="login-brand-mark">WEF</div>
        <h1>Worldwide Education Foundation</h1>
        <p>Admin Panel</p>
      </div>

      <?php if ($error): ?>
        <div class="alert alert-error"><?= e($error) ?></div>
      <?php endif; ?>

      <form method="post" action="login.php" novalidate>
        <?= csrfField() ?>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" autocomplete="username" required autofocus>
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" autocomplete="current-password" required>
        </div>
        <button type="submit" class="btn-submit">Sign In</button>
      </form>

      <p class="login-footnote">Internal use only — Worldwide Education Foundation</p>
    </div>
  </div>
</body>
</html>
