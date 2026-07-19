<?php
require_once __DIR__ . '/includes/auth.php';

initSession();
requireLogin();

$user = currentUser();
$initial = strtoupper(substr($user['name'], 0, 1));

$navItems = [
    ['label' => 'Dashboard', 'active' => true, 'soon' => false],
    ['label' => 'Programs', 'active' => false, 'soon' => true],
    ['label' => 'Team', 'active' => false, 'soon' => true],
    ['label' => 'Honor Board / Sponsors', 'active' => false, 'soon' => true],
    ['label' => 'Gallery', 'active' => false, 'soon' => true],
    ['label' => 'Annual Reports', 'active' => false, 'soon' => true],
    ['label' => 'Media Manager', 'active' => false, 'soon' => true],
    ['label' => 'Users & Roles', 'active' => false, 'soon' => true],
    ['label' => 'Settings', 'active' => false, 'soon' => true],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Dashboard — WEF Admin</title>
<link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="app-sidebar-brand">
        <div class="app-sidebar-brand-mark">WEF</div>
        <span>Admin Panel</span>
      </div>
      <nav class="app-nav">
        <?php foreach ($navItems as $item): ?>
          <div class="app-nav-item<?= $item['active'] ? ' is-active' : '' ?><?= $item['soon'] ? ' is-disabled' : '' ?>">
            <span><?= e($item['label']) ?></span>
            <?php if ($item['soon']): ?><span class="app-nav-soon">Soon</span><?php endif; ?>
          </div>
        <?php endforeach; ?>
      </nav>
    </aside>

    <div class="app-main">
      <header class="app-topbar">
        <div class="app-user">
          <div class="app-user-avatar"><?= e($initial) ?></div>
          <div>
            <div class="app-user-name"><?= e($user['name']) ?></div>
            <div class="app-user-role"><?= e(ucwords(str_replace('_', ' ', $user['role']))) ?></div>
          </div>
        </div>
        <a href="logout.php" class="btn-logout">Log Out</a>
      </header>

      <main class="app-content">
        <div class="welcome-card">
          <h2>Welcome back, <?= e(explode(' ', $user['name'])[0]) ?>.</h2>
          <p>You're signed in to the WEF admin foundation — authentication, sessions, and activity logging are live.</p>
        </div>

        <div class="phase-note">
          <strong>Phase 1 of the admin build is complete:</strong> secure login, session handling, rate-limited
          brute-force protection, and activity logging are working end-to-end against a real MySQL database.
          The modules in the sidebar marked "Soon" are the next phases — content management for Programs, Team,
          Honor Board, Gallery, and Annual Reports comes next, followed by media management, roles, and the rest
          of the CMS.
        </div>
      </main>
    </div>
  </div>
</body>
</html>
