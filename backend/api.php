<?php
/**
 * 三国人生演义 · 汉末四季草民录 后端接口程序 (PHP 7.4+ / PHP 8.x)
 * 作用：
 * 1. 保存玩家完成的生平履历，供所有玩家公共浏览、点赞与检索；
 * 2. 存储中途退出的实时存档进度，并在重新进入时实现断点续传；
 * 3. 基于 PDO MySQL 预编译语句，防 SQL 注入。
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --------------------------------------------------------------------------
// 数据库配置 (可根据生产或测试环境修改)
// --------------------------------------------------------------------------
$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'three_kingdoms_life';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: 'root123456';

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'code'    => 500,
        'message' => '数据库连接失败: ' . $e->getMessage(),
        'tip'     => '请先导入 backend/schema.sql 初始化数据库表结构',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 统一响应助手
function jsonResponse($code, $message, $data = null) {
    echo json_encode([
        'code'      => $code,
        'message'   => $message,
        'data'      => $data,
        'timestamp' => time(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$action = isset($_GET['action']) ? trim($_GET['action']) : '';
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

// --------------------------------------------------------------------------
// 路由分发
// --------------------------------------------------------------------------
switch ($action) {

    // 1. 保存已完结的生平履历 (供天下玩家公共浏览)
    case 'save_life':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(405, '请使用 POST 请求');
        }

        $id = $body['id'] ?? ('life_' . uniqid());
        $name = $body['name'] ?? '无名氏';
        $courtesyName = $body['courtesyName'] ?? '';
        $gender = ($body['gender'] ?? 'MALE') === 'FEMALE' ? 'FEMALE' : 'MALE';
        $birthYear = (int)($body['birthYear'] ?? 184);
        $deathYear = (int)($body['deathYear'] ?? 200);
        $deathSeason = $body['deathSeason'] ?? '冬令';
        $deathAge = (int)($body['deathAge'] ?? 16);
        $birthplace = $body['birthplace'] ?? '洛阳';
        $provinceId = $body['provinceId'] ?? 'LUOYANG';
        $socialClass = $body['socialClass'] ?? 'PEASANT';
        $finalOccupation = $body['finalOccupation'] ?? '布衣';

        $ending = $body['ending'] ?? [];
        $endingTitle = $ending['title'] ?? '汉末草民';
        $epitaphTitle = $ending['epitaphTitle'] ?? '汉末草民实录';
        $summary = $ending['summary'] ?? '';
        $historianNote = $ending['historianNote'] ?? '';

        $funTitles = $body['funTitles'] ?? [];
        $primaryFunTitle = $funTitles['primaryTitle'] ?? '「平平无奇乱世人」';
        $folkNickname = $funTitles['folkNickname'] ?? '村东头老懂哥';
        $badgesJson = json_encode($funTitles['badges'] ?? [], JSON_UNESCAPED_UNICODE);
        $humorousQuote = $funTitles['humorousQuote'] ?? '';

        $statsJson = json_encode($body['finalStats'] ?? [], JSON_UNESCAPED_UNICODE);
        $seasonLogsJson = json_encode($body['seasonLogs'] ?? [], JSON_UNESCAPED_UNICODE);
        $seasonLogsCount = (int)($body['seasonLogsCount'] ?? 0);
        $deathReason = $body['deathReason'] ?? null;
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        $sql = "INSERT INTO `tb_three_kingdoms_lives` (
            `id`, `name`, `courtesy_name`, `gender`, `birth_year`, `death_year`, `death_season`,
            `death_age`, `birthplace`, `province_id`, `social_class`, `final_occupation`,
            `ending_title`, `epitaph_title`, `primary_fun_title`, `folk_nickname`, `badges_json`,
            `summary`, `historian_note`, `humorous_quote`, `stats_json`, `season_logs_json`,
            `season_logs_count`, `death_reason`, `ip_address`
        ) VALUES (
            :id, :name, :courtesy_name, :gender, :birth_year, :death_year, :death_season,
            :death_age, :birthplace, :province_id, :social_class, :final_occupation,
            :ending_title, :epitaph_title, :primary_fun_title, :folk_nickname, :badges_json,
            :summary, :historian_note, :humorous_quote, :stats_json, :season_logs_json,
            :season_logs_count, :death_reason, :ip_address
        ) ON DUPLICATE KEY UPDATE
            `ending_title` = VALUES(`ending_title`),
            `summary` = VALUES(`summary`),
            `likes_count` = `likes_count` + 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => $name,
            ':courtesy_name' => $courtesyName,
            ':gender' => $gender,
            ':birth_year' => $birthYear,
            ':death_year' => $deathYear,
            ':death_season' => $deathSeason,
            ':death_age' => $deathAge,
            ':birthplace' => $birthplace,
            ':province_id' => $provinceId,
            ':social_class' => $socialClass,
            ':final_occupation' => $finalOccupation,
            ':ending_title' => $endingTitle,
            ':epitaph_title' => $epitaphTitle,
            ':primary_fun_title' => $primaryFunTitle,
            ':folk_nickname' => $folkNickname,
            ':badges_json' => $badgesJson,
            ':summary' => $summary,
            ':historian_note' => $historianNote,
            ':humorous_quote' => $humorousQuote,
            ':stats_json' => $statsJson,
            ':season_logs_json' => $seasonLogsJson,
            ':season_logs_count' => $seasonLogsCount,
            ':death_reason' => $deathReason,
            ':ip_address' => $ip,
        ]);

        jsonResponse(200, '生平履历已成功存入万民谱！', ['life_id' => $id]);
        break;

    // 2. 查询公共万民谱履历 (支持搜索、按州筛选、排序)
    case 'get_community_lives':
        $province = isset($_GET['province']) ? trim($_GET['province']) : '';
        $keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';
        $sort = isset($_GET['sort']) && $_GET['sort'] === 'likes' ? 'likes_count' : 'created_at';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        $where = [];
        $params = [];

        if (!empty($province) && $province !== 'ALL') {
            $where[] = "`province_id` = :province";
            $params[':province'] = $province;
        }

        if (!empty($keyword)) {
            $where[] = "(`name` LIKE :keyword OR `courtesy_name` LIKE :keyword OR `primary_fun_title` LIKE :keyword OR `birthplace` LIKE :keyword)";
            $params[':keyword'] = "%{$keyword}%";
        }

        $whereSql = count($where) > 0 ? ('WHERE ' . implode(' AND ', $where)) : '';

        // 总数
        $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM `tb_three_kingdoms_lives` {$whereSql}");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        // 列表
        $sql = "SELECT `id`, `name`, `courtesy_name`, `gender`, `birth_year`, `death_year`, `death_season`,
                       `death_age`, `birthplace`, `province_id`, `social_class`, `final_occupation`,
                       `ending_title`, `epitaph_title`, `primary_fun_title`, `folk_nickname`, `badges_json`,
                       `summary`, `historian_note`, `humorous_quote`, `stats_json`, `likes_count`, `created_at`
                FROM `tb_three_kingdoms_lives`
                {$whereSql}
                ORDER BY `{$sort}` DESC
                LIMIT :limit OFFSET :offset";

        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $list = $stmt->fetchAll();

        foreach ($list as &$item) {
            $item['badges'] = json_decode($item['badges_json'], true) ?: [];
            $item['stats'] = json_decode($item['stats_json'], true) ?: [];
            unset($item['badges_json'], $item['stats_json']);
        }

        jsonResponse(200, '获取成功', [
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'list' => $list,
        ]);
        break;

    // 3. 为某位平民先贤点赞 / 斟浊酒一杯
    case 'like_life':
        $lifeId = $body['id'] ?? ($_GET['id'] ?? '');
        if (empty($lifeId)) {
            jsonResponse(400, '缺少记录ID');
        }

        $stmt = $pdo->prepare("UPDATE `tb_three_kingdoms_lives` SET `likes_count` = `likes_count` + 1 WHERE `id` = :id");
        $stmt->execute([':id' => $lifeId]);

        jsonResponse(200, '斟酒致敬成功！');
        break;

    // 4. 保存中途游玩进度 (断点续传)
    case 'save_progress':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(405, '请使用 POST 请求');
        }

        $userToken = $body['userToken'] ?? 'default_user';
        $playerName = $body['playerName'] ?? '无名氏';
        $currentYear = (int)($body['currentYear'] ?? 184);
        $currentSeason = (int)($body['currentSeason'] ?? 0);
        $currentAge = (int)($body['currentAge'] ?? 0);
        $profileJson = json_encode($body['profile'] ?? [], JSON_UNESCAPED_UNICODE);
        $statsJson = json_encode($body['stats'] ?? [], JSON_UNESCAPED_UNICODE);
        $seasonLogsJson = json_encode($body['seasonLogs'] ?? [], JSON_UNESCAPED_UNICODE);
        $currentEventJson = json_encode($body['currentEvent'] ?? [], JSON_UNESCAPED_UNICODE);
        $isAutoRunning = !empty($body['isAutoRunning']) ? 1 : 0;
        $playbackSpeed = (int)($body['playbackSpeed'] ?? 1);

        $sql = "INSERT INTO `tb_three_kingdoms_saves` (
            `user_token`, `player_name`, `current_year`, `current_season`, `current_age`,
            `profile_json`, `stats_json`, `season_logs_json`, `current_event_json`,
            `is_auto_running`, `playback_speed`
        ) VALUES (
            :user_token, :player_name, :current_year, :current_season, :current_age,
            :profile_json, :stats_json, :season_logs_json, :current_event_json,
            :is_auto_running, :playback_speed
        ) ON DUPLICATE KEY UPDATE
            `player_name` = VALUES(`player_name`),
            `current_year` = VALUES(`current_year`),
            `current_season` = VALUES(`current_season`),
            `current_age` = VALUES(`current_age`),
            `profile_json` = VALUES(`profile_json`),
            `stats_json` = VALUES(`stats_json`),
            `season_logs_json` = VALUES(`season_logs_json`),
            `current_event_json` = VALUES(`current_event_json`),
            `is_auto_running` = VALUES(`is_auto_running`),
            `playback_speed` = VALUES(`playback_speed`),
            `updated_at` = CURRENT_TIMESTAMP";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':user_token' => $userToken,
            ':player_name' => $playerName,
            ':current_year' => $currentYear,
            ':current_season' => $currentSeason,
            ':current_age' => $currentAge,
            ':profile_json' => $profileJson,
            ':stats_json' => $statsJson,
            ':season_logs_json' => $seasonLogsJson,
            ':current_event_json' => $currentEventJson,
            ':is_auto_running' => $isAutoRunning,
            ':playback_speed' => $playbackSpeed,
        ]);

        jsonResponse(200, '进度已自动保存');
        break;

    // 5. 加载上次中途未竟的进度
    case 'load_progress':
        $userToken = $_GET['userToken'] ?? 'default_user';
        $stmt = $pdo->prepare("SELECT * FROM `tb_three_kingdoms_saves` WHERE `user_token` = :user_token LIMIT 1");
        $stmt->execute([':user_token' => $userToken]);
        $row = $stmt->fetch();

        if (!$row) {
            jsonResponse(404, '未找到先前进度存档');
        }

        jsonResponse(200, '读取存档成功', [
            'userToken' => $row['user_token'],
            'playerName' => $row['player_name'],
            'currentYear' => (int)$row['current_year'],
            'currentSeason' => (int)$row['current_season'],
            'currentAge' => (int)$row['current_age'],
            'profile' => json_decode($row['profile_json'], true),
            'stats' => json_decode($row['stats_json'], true),
            'seasonLogs' => json_decode($row['season_logs_json'], true),
            'currentEvent' => json_decode($row['current_event_json'], true),
            'isAutoRunning' => (bool)$row['is_auto_running'],
            'playbackSpeed' => (int)$row['playback_speed'],
            'updatedAt' => $row['updated_at'],
        ]);
        break;

    // 6. 清除存档 (如重新开局或人命已尽)
    case 'clear_progress':
        $userToken = $body['userToken'] ?? ($_GET['userToken'] ?? 'default_user');
        $stmt = $pdo->prepare("DELETE FROM `tb_three_kingdoms_saves` WHERE `user_token` = :user_token");
        $stmt->execute([':user_token' => $userToken]);

        jsonResponse(200, '存档已清空');
        break;

    default:
        jsonResponse(400, '未知的 action 请求参数');
        break;
}
