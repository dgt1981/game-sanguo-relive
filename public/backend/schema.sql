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

-- ----------------------------------------------------------
-- 4. 汉末历史名士人物全谱表 (记录生卒年、五维演化轨迹、同乡羁绊、专属特权与对白)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `tb_three_kingdoms_figures`;
CREATE TABLE `tb_three_kingdoms_figures` (
  `id` VARCHAR(64) NOT NULL COMMENT '名士唯一标识 (如 zhao_yun, zhuge_liang, hua_tuo)',
  `name` VARCHAR(32) NOT NULL COMMENT '名士姓名 (如 赵云)',
  `courtesy_name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '表字 (如 子龙)',
  `birth_year` INT(11) NOT NULL COMMENT '出生公元年份 (如 168)',
  `death_year` INT(11) NOT NULL COMMENT '辞世公元年份 (如 229)',
  `birthplace` VARCHAR(128) NOT NULL COMMENT '出生籍贯全称 (如 幽州常山国真定县)',
  `province_id` VARCHAR(32) NOT NULL COMMENT '所属州域 (如 YOUZHOU, XUZHOU, YUZHOU)',
  `commandery` VARCHAR(64) NOT NULL COMMENT '所属郡国 (如 常山郡, 琅琊国)',
  `county` VARCHAR(64) NOT NULL COMMENT '所属县邑 (如 真定县, 阳都县)',
  `camp` VARCHAR(32) NOT NULL DEFAULT 'NONE' COMMENT '终局阵营 (WEI/SHU/WU/YUAN_SHAO/NONE)',
  `camp_label` VARCHAR(64) NOT NULL COMMENT '官职与封爵称谓 (如 蜀汉镇东将军 · 顺平侯)',
  `title_tag` VARCHAR(128) NOT NULL COMMENT '称号标签 (如 【常胜义将 · 一身是胆】)',
  `avatar_char` VARCHAR(8) NOT NULL COMMENT '印信大字头像 (如 云, 亮, 肃)',
  `archetype` ENUM('MARTIAL', 'STRATEGIST', 'WEALTHY', 'HEALER', 'HERMIT') NOT NULL COMMENT '贤士流派 (勇武/谋略/巨贾/医圣/经学)',
  
  -- 五维属性演化起点与巅峰
  `base_stats_184_json` JSON NOT NULL COMMENT '公元184年灵帝末期初始属性 (体魄,识见,勇略,仁厚,家财,气数)',
  `peak_stats_json` JSON NOT NULL COMMENT '壮盛巅峰期属性 (体魄,识见,勇略,仁厚,家财,气数)',
  
  -- 专属庇护特权
  `perk_title` VARCHAR(128) NOT NULL COMMENT '特权名称 (如 【一身是胆 · 阵前护佑】)',
  `perk_description` TEXT NOT NULL COMMENT '特权详细阐述',
  `perk_buff_effect` VARCHAR(255) NOT NULL COMMENT '具体数值与庇护机制 (如 主角面临致死战败时，赵云驰援庇护，抵御致命杀伤)',
  
  -- 四大生理与年岁阶段对白
  `dialogues_json` JSON NOT NULL COMMENT '幼年、青年、巅峰、垂暮四个阶段的问候与交互对白',
  `historic_quote` VARCHAR(255) NOT NULL COMMENT '名垂青史名言',
  `historical_bio` TEXT NOT NULL COMMENT '传记考据与平生梗概',
  
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_province` (`province_id`),
  INDEX `idx_commandery` (`commandery`),
  INDEX `idx_archetype` (`archetype`),
  INDEX `idx_years` (`birth_year`, `death_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='三国历史名仕人脉谱牒表 (成长演化与羁绊特权)';

-- 预置种子名士数据示例
INSERT INTO `tb_three_kingdoms_figures` 
(`id`, `name`, `courtesy_name`, `birth_year`, `death_year`, `birthplace`, `province_id`, `commandery`, `county`, `camp`, `camp_label`, `title_tag`, `avatar_char`, `archetype`, `base_stats_184_json`, `peak_stats_json`, `perk_title`, `perk_description`, `perk_buff_effect`, `dialogues_json`, `historic_quote`, `historical_bio`)
VALUES
('zhao_yun', '赵云', '子龙', 168, 229, '幽州常山国真定县', 'YOUZHOU', '常山郡', '真定县', 'SHU', '蜀汉镇东将军 · 顺平侯', '【常胜义将 · 一身是胆】', '云', 'MARTIAL',
 '{"health":78,"intellect":58,"martial":72,"virtue":82,"wealth":28,"fortune":75}',
 '{"health":92,"intellect":78,"martial":97,"virtue":95,"wealth":45,"fortune":88}',
 '【一身是胆 · 阵前护佑】', '赵云勇烈兼备，深明大义。结交之后，战场临危得免死救护，勇略大幅精进。',
 '主角若面临致死军阵战败，有极大概率得赵子龙策马驰援保全性命，并永久提升勇略。',
 '{"childhoodGreeting":"阿兄，真定郊外的野马又在林间嘶鸣，咱们且去比试一番御马骑射如何？","youthGreeting":"天下蟊贼四起，大丈夫当拔剑从戎，岂可伏于草野？","primeGreeting":"子龙受先帝厚恩，纵使千军万马当前，亦誓死护百姓与同袍周全！","seniorGreeting":"烈士暮年，壮心不已。想当年长坂坡鏖战，犹历历在目……"}',
 '古来冲阵扶危主，只有常山赵子龙。',
 '常山真定人，姿颜雄伟，从公孙瓒，后随刘备三十余年，汉水一战被刘备赞为“子龙一身都是胆也”。'
),
('zhuge_liang', '诸葛亮', '孔明', 181, 234, '徐州琅琊国阳都县', 'XUZHOU', '琅琊国', '阳都县', 'SHU', '蜀汉丞相 · 武乡侯', '【卧龙腾渊 · 智绝千古】', '亮', 'STRATEGIST',
 '{"health":45,"intellect":60,"martial":18,"virtue":65,"wealth":32,"fortune":85}',
 '{"health":72,"intellect":100,"martial":38,"virtue":98,"wealth":40,"fortune":92}',
 '【卧龙明机 · 运筹帷幄】', '与诸葛孔明结为知音，通晓天下大势走向，危难之际得妙计指引。',
 '重大历史关隘抉择时解锁特殊绝佳选项，识见与气数大幅获得指点加成。',
 '{"childhoodGreeting":"琅琊山野葱茏，草木皆有灵性，闲暇时同去竹林听风抚琴可好？","youthGreeting":"亮躬耕于南阳，非求闻达于诸侯，特待明主以安海内苍生。","primeGreeting":"受命于败军之际，奉命于危难之间，二十有一年矣。亮必竭股肱之力！","seniorGreeting":"鞠躬尽瘁，死而后已。汉室未复，先帝之托，安敢有一刻懈怠……"}',
 '鞠躬尽力，死而后已。',
 '徐州琅琊阳都人，早孤随叔父至荆州隆中隐居，精通内政、军谋、阵法，为三国智绝化身。'
),
('lu_su', '鲁肃', '子敬', 172, 217, '扬州临淮郡东城县', 'YANGZHOU', '九江郡', '东城县', 'WU', '东吴奋武校尉 · 临淮名士', '【榻上雄谟 · 掷仓济世】', '肃', 'WEALTHY',
 '{"health":68,"intellect":70,"martial":45,"virtue":85,"wealth":90,"fortune":80}',
 '{"health":78,"intellect":92,"martial":58,"virtue":96,"wealth":98,"fortune":86}',
 '【倾家指廪 · 淮商巨贾】', '鲁子敬家赀巨万而仗义疏财，指囷相赠。结交之后，永无粮资匮乏之忧。',
 '每年岁末冬令必定得赠大量铜钱军饷（家资+50~100），经商种田产出大幅翻倍。',
 '{"childhoodGreeting":"阿兄何必忧虑无粮？我家粮仓尚满，尽管取用便是！","youthGreeting":"天下纷扰，富家何用？唯有招贤纳士，保境安民方为正道。","primeGreeting":"曹操南下，众谋士劝降皆为自保私计，唯主公不可降也！","seniorGreeting":"临淮鲁肃虽不才，愿倾尽毕生之资，以保江东父老无恙。"}',
 '指囷相赠，天下高义。',
 '临淮东城人，性格豪爽好施，周瑜缺粮时指一囷（三千斛）相赠，后提出汉室不可复兴、建号帝王的榻上策。'
),
('hua_tuo', '华佗', '元化', 145, 208, '豫州沛国谯县', 'YUZHOU', '沛国', '谯县', 'HEALER',
 '{"health":85,"intellect":82,"martial":35,"virtue":92,"wealth":35,"fortune":78}',
 '{"health":95,"intellect":96,"martial":48,"virtue":99,"wealth":42,"fortune":82}',
 '{"title":"【青囊回春 · 拔除百疾】","description":"华佗精研五禽戏与麻沸散，悬壶救苦。结识后大幅增强体魄，疫病退散。","buffEffect":"主角及家眷免疫各种伤寒恶疾猝死，体魄上限突破，危急时有神医施针延寿。"}',
 '{"childhoodGreeting":"老夫采药方归，小友骨骼清奇，切莫久坐，随我练练这五禽戏罢！","youthGreeting":"人身如流水户枢，动则不腐。若知导引之术，何惧乱世瘟疫？","primeGreeting":"麻沸散已成，不论刳腹涤肠、断骨刮毒，老夫皆可手到病除。","seniorGreeting":"这卷青囊经若能传于后世，活人无数，老夫便无憾矣……"}',
 '医者仁心，活人无数。',
 '沛国谯人，兼通数经，晓养性之术，发明麻沸散与五禽之戏，后世尊为外科鼻祖。'
);

