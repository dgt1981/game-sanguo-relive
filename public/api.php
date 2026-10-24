<?php
/**
 * 三国人生演义 · 便捷 API 入口 (同级代理)
 * 若将本文件直接置于 dist 根目录或 index.html 同级，可无缝代理执行 backend/api.php
 */
if (file_exists(__DIR__ . '/backend/api.php')) {
    require_once __DIR__ . '/backend/api.php';
} else {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'code' => 404,
        'message' => '未找到 backend/api.php，请确保 backend 目录已一并上传'
    ], JSON_UNESCAPED_UNICODE);
}
