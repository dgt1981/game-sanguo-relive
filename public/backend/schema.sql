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
  `matched_figure_name` VARCHAR(64) DEFAULT NULL COMMENT '宿命映照历史人物姓名 (如 贾诩, 廖化, 华佗)',
  `matched_figure_similarity` INT(11) DEFAULT NULL COMMENT '历史人物宿命契合度百分比 (如 96)',
  `matched_figure_title` VARCHAR(128) DEFAULT NULL COMMENT '历史人物名号标签 (如 【算无遗策 · 隐忍苟道之尊】)',
  
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

-- ----------------------------------------------------------
-- 3. 历史与人生事件预存数据表 (规范事件触发时机、前置因果与扩充维护)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `tb_three_kingdoms_events_catalog`;
CREATE TABLE `tb_three_kingdoms_events_catalog` (
  `id` VARCHAR(64) NOT NULL COMMENT '事件条目唯一标识 (如 camp_chibi_fire, milestone_age_15)',
  `category` VARCHAR(32) NOT NULL COMMENT '分类 (HISTORICAL_CAMPAIGN/CRISIS/LIFE_STAGE/VOCATION/FIGURE_ENCOUNTER/SEASONAL_FOLK)',
  `priority` INT(11) NOT NULL DEFAULT 50 COMMENT '权重优先级 (越高越优先匹配，如战役100/危机95/名士85/日常50)',
  `campaign_name` VARCHAR(64) DEFAULT NULL COMMENT '所属著名战役名称 (如 赤壁之战、官渡之战、长坂坡之变)',
  
  -- 时空与触发条件约束 (避免因果时机错乱)
  `min_year` INT(11) DEFAULT NULL COMMENT '最早发生公元年份 (如 208)',
  `max_year` INT(11) DEFAULT NULL COMMENT '最晚发生公元年份 (如 208)',
  `seasons_json` VARCHAR(64) DEFAULT NULL COMMENT '允许触发的季节JSON (如 [0,1,2,3] 或 [3]仅冬季)',
  `min_age` INT(11) DEFAULT NULL COMMENT '触发最小生理岁数 (如 16)',
  `max_age` INT(11) DEFAULT NULL COMMENT '触发最大生理岁数 (如 65)',
  `required_camp` VARCHAR(32) DEFAULT NULL COMMENT '限定军旅/隶属阵营 (WEI/SHU/WU/NONE)',
  `required_provinces_json` TEXT DEFAULT NULL COMMENT '限定所在州郡JSON (如 ["JINGZHOU","YANGZHOU"])',
  `required_flags_json` TEXT DEFAULT NULL COMMENT '必须已具备的因果标志JSON (如 ["joined_military","knows_zhuge_liang"])',
  `forbidden_flags_json` TEXT DEFAULT NULL COMMENT '禁止出现的互斥标志JSON (如 ["fled_to_south","dead"])',
  `min_stats_json` TEXT DEFAULT NULL COMMENT '五维属性门槛JSON (如 {"courage":50,"insight":40})',
  
  -- 事件叙事与历史人物互动
  `historical_figure_id` VARCHAR(64) DEFAULT NULL COMMENT '登场历史名士ID (如 zhuge_liang, cao_cao, zhou_yu)',
  `narrative_template` TEXT NOT NULL COMMENT '季节个人生平纪事正文模版',
  `dialogue_prompt` TEXT DEFAULT NULL COMMENT '名士对话/军机发问引导语',
  `dialogue_quote` TEXT DEFAULT NULL COMMENT '名士原话台词',
  
  -- 玩家决策选项 (JSON结构包含提示、隐藏数值、因果标签增减)
  `choices_json` JSON NOT NULL COMMENT '抉择分支列表JSON (包含id, text, statChanges, setFlags, removeFlags)',
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用该事件 (1启用, 0下线)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_years` (`min_year`, `max_year`),
  INDEX `idx_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='三国事件总谱预存数据表 (时序与因果关联引擎)';

-- 预置种子事件数据示例
INSERT INTO `tb_three_kingdoms_events_catalog` 
(`id`, `category`, `priority`, `campaign_name`, `min_year`, `max_year`, `seasons_json`, `min_age`, `max_age`, `required_camp`, `narrative_template`, `choices_json`)
VALUES
('camp_chibi_fire', 'HISTORICAL_CAMPAIGN', 100, '赤壁之战', 208, 208, '[3]', 16, 60, NULL,
 '建安十三年冬，江东大都督周瑜乘东南狂风纵火，曹公铁索连环战船烈焰蔽江！红光照彻赤壁数十里，江水尽沸。你在江畔大营中目睹了这场决定天下三分的大火……',
 '[{"id":"chibi_c1","text":"顺水驾轻舟救捞落水溃兵与残存粮草","statChanges":{"benevolence":8,"reputation":5,"vitality":-4},"setFlags":["rescued_chibi_soldiers"]},
   {"id":"chibi_c2","text":"趁乱背负缴获兵甲银两向江陵南撤","statChanges":{"wealth":15,"courage":-2,"insight":3},"setFlags":["gained_chibi_spoils"]},
   {"id":"chibi_c3","text":"从容伫立矶头，研判曹刘两军退进军略","statChanges":{"insight":12,"courage":6,"reputation":4},"setFlags":["witnessed_chibi_tactics"]}]'
),
('camp_guandu_wuchao', 'HISTORICAL_CAMPAIGN', 100, '官渡乌巢之劫', 200, 200, '[2,3]', 16, 60, NULL,
 '建安五年秋冬，曹操亲率奇兵假扮袁军衔枚夜行，袭破乌巢粮屯。烈火烛天，淳于琼覆没，数十万斛军粮化为焦炭！北方形势自此大逆转。',
 '[{"id":"guandu_c1","text":"跟随溃散役夫四散奔逃保全性命","statChanges":{"vitality":4,"courage":-3,"insight":2},"setFlags":["fled_wuchao"]},
   {"id":"guandu_c2","text":"趁夜在焦黑营地搜罗散落的蹄铁干粮","statChanges":{"wealth":8,"insight":4,"vitality":-2},"setFlags":["wuchao_scavenger"]}]'
);
