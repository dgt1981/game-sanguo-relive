-- ==========================================================
-- 三国人生演义 · 汉末四季草民录 数据库表结构
-- Database: three_kingdoms_life
-- Charset: utf8mb4
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `three_kingdoms_life` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `three_kingdoms_life`;

-- ----------------------------------------------------------
-- 1. 已完结生平履历表 (提供给所有玩家公共浏览)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `tb_three_kingdoms_lives`;
CREATE TABLE `tb_three_kingdoms_lives` (
  `id` VARCHAR(64) NOT NULL COMMENT '履历记录唯一ID (如 life_1729000000)',
  `name` VARCHAR(32) NOT NULL COMMENT '传主姓名 (如 赵安)',
  `courtesy_name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '表字 (如 子龙)',
  `gender` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE' COMMENT '性别 (MALE男 / FEMALE女)',
  `birth_year` INT(11) NOT NULL DEFAULT 184 COMMENT '降生年份 (公元184年)',
  `death_year` INT(11) NOT NULL COMMENT '归真年份 (如 公元236年)',
  `death_season` VARCHAR(16) NOT NULL COMMENT '归真季节 (春季/夏季/秋季/冬季)',
  `death_age` INT(11) NOT NULL COMMENT '终老岁数 (享年)',
  `birthplace` VARCHAR(128) NOT NULL COMMENT '出生籍贯 (如 司隶河南尹洛阳县)',
  `province_id` VARCHAR(32) NOT NULL COMMENT '归属州 (如 LUOYANG, XUZHOU, JIAOZHOU)',
  `social_class` VARCHAR(32) NOT NULL COMMENT '家庭出身阶层 (如 PEASANT, MERCHANT)',
  `final_occupation` VARCHAR(64) NOT NULL COMMENT '终老前身份 (如 乡党长者, 运粮夫)',
  
  -- 结局与评价
  `ending_title` VARCHAR(128) NOT NULL COMMENT '生平结局主标题 (如 彭城桑农 · 享年四十八)',
  `epitaph_title` VARCHAR(128) NOT NULL COMMENT '谥号/墓志铭文 (如 汉末草民实录)',
  `primary_fun_title` VARCHAR(128) NOT NULL DEFAULT '' COMMENT '趣味称号 (如 「熬死曹刘孙的大仙」)',
  `folk_nickname` VARCHAR(128) NOT NULL DEFAULT '' COMMENT '乡里诨名 (如 村东头老懂哥)',
  `badges_json` TEXT COMMENT '趣味标签数组JSON (如 ["百岁长命锁","泗水幸存者"])',
  `summary` TEXT NOT NULL COMMENT '平生总叙全文',
  `historian_note` TEXT NOT NULL COMMENT '太史公史家赞曰',
  `humorous_quote` VARCHAR(255) DEFAULT '' COMMENT '幽默生平评语',
  
  -- 数据详情
  `stats_json` JSON NOT NULL COMMENT '终局五维属性JSON (体魄,识见,勇略,仁厚,家财,气数)',
  `season_logs_json` LONGTEXT COMMENT '平生四季编年史完整流水记录JSON',
  `season_logs_count` INT(11) NOT NULL DEFAULT 0 COMMENT '亲历季节总数',
  `death_reason` VARCHAR(255) DEFAULT NULL COMMENT '殁因 (如 伤寒, 兵灾, 善终)',
  
  -- 互动统计
  `likes_count` INT(11) NOT NULL DEFAULT 0 COMMENT '其他玩家斟酒/点赞数',
  `ip_address` VARCHAR(64) DEFAULT NULL COMMENT '提交者IP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
  PRIMARY KEY (`id`),
  INDEX `idx_province` (`province_id`),
  INDEX `idx_death_age` (`death_age`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='三国万民谱 · 玩家公共浏览生平履历表';

-- ----------------------------------------------------------
-- 2. 玩家中途存档表 (中途退出保存与再次进入继续)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `tb_three_kingdoms_saves`;
CREATE TABLE `tb_three_kingdoms_saves` (
  `user_token` VARCHAR(64) NOT NULL COMMENT '玩家唯一凭证或设备唯一标识',
  `player_name` VARCHAR(32) NOT NULL COMMENT '正在游玩的传主姓名',
  `current_year` INT(11) NOT NULL DEFAULT 184 COMMENT '当前进行到的年份',
  `current_season` TINYINT(4) NOT NULL DEFAULT 0 COMMENT '当前季节 (0春, 1夏, 2秋, 3冬)',
  `current_age` INT(11) NOT NULL DEFAULT 0 COMMENT '当前岁数',
  `profile_json` JSON NOT NULL COMMENT '人物基础档案与籍贯家庭JSON',
  `stats_json` JSON NOT NULL COMMENT '当前六维属性JSON',
  `season_logs_json` LONGTEXT NOT NULL COMMENT '已沉淀的历史四季流水JSON',
  `current_event_json` LONGTEXT NOT NULL COMMENT '当前正面临的季节事件与抉择JSON',
  `is_auto_running` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '退出时是否处于自动流转状态',
  `playback_speed` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '流转倍速 (1, 2, 4, 8)',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后存档时间',
  PRIMARY KEY (`user_token`),
  INDEX `idx_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='玩家实时进度存档表 (断点续传)';
