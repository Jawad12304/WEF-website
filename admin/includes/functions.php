<?php
/**
 * Small, boring helpers used everywhere else. No framework magic.
 */

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

function clientIp(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function logActivity(?int $userId, string $action, string $module = 'auth', ?string $details = null): void
{
    $stmt = getDb()->prepare(
        'INSERT INTO activity_logs (user_id, action, module, details, ip_address, user_agent)
         VALUES (:user_id, :action, :module, :details, :ip, :agent)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'action' => $action,
        'module' => $module,
        'details' => $details,
        'ip' => clientIp(),
        'agent' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
    ]);
}
