<?php
/**
 * Session bootstrap + authentication. Rate limiting is keyed on the
 * submitted email (via login_attempts), not the admin_users row, so a
 * login attempt against an email that doesn't exist is throttled too —
 * otherwise the login form's timing/behavior would leak which emails
 * are registered.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/functions.php';

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MINUTES = 15;

function initSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict',
        'secure' => defined('APP_FORCE_HTTPS_COOKIE') && APP_FORCE_HTTPS_COOKIE,
    ]);

    session_start();
}

function currentUser(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
        'role' => $_SESSION['user_role'],
    ];
}

function requireLogin(): void
{
    if (currentUser() === null) {
        redirect('login.php');
    }
}

function isRateLimited(string $email): bool
{
    $stmt = getDb()->prepare(
        'SELECT COUNT(*) AS attempts FROM login_attempts
         WHERE email = :email AND success = 0
           AND created_at > (NOW() - INTERVAL :minutes MINUTE)'
    );
    $stmt->execute(['email' => $email, 'minutes' => LOGIN_LOCKOUT_MINUTES]);
    $row = $stmt->fetch();

    return (int) $row['attempts'] >= MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(string $email, bool $success): void
{
    $stmt = getDb()->prepare(
        'INSERT INTO login_attempts (email, ip_address, success) VALUES (:email, :ip, :success)'
    );
    $stmt->execute([
        'email' => $email,
        'ip' => clientIp(),
        'success' => $success ? 1 : 0,
    ]);
}

/**
 * @return array{ok: bool, error: ?string}
 */
function attemptLogin(string $email, string $password): array
{
    $email = trim(strtolower($email));
    $genericError = 'Invalid email or password.';

    if ($email === '' || $password === '') {
        return ['ok' => false, 'error' => $genericError];
    }

    if (isRateLimited($email)) {
        return [
            'ok' => false,
            'error' => "Too many failed attempts. Try again in a few minutes.",
        ];
    }

    $stmt = getDb()->prepare(
        'SELECT id, name, email, password_hash, role, status FROM admin_users WHERE email = :email LIMIT 1'
    );
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || $user['status'] !== 'active' || !password_verify($password, $user['password_hash'])) {
        recordLoginAttempt($email, false);
        return ['ok' => false, 'error' => $genericError];
    }

    recordLoginAttempt($email, true);

    $upd = getDb()->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = :id');
    $upd->execute(['id' => $user['id']]);

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    logActivity((int) $user['id'], 'login', 'auth');

    return ['ok' => true, 'error' => null];
}

function logoutUser(): void
{
    $user = currentUser();
    if ($user) {
        logActivity($user['id'], 'logout', 'auth');
    }

    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}
