import { Attributes, ProvinceId, RealisticEnding, SeasonIndex } from '../types/game';
import { PersonProfile } from './lifeSimulator';

export interface MatchedHistoricalFigure {
  id: string;
  name: string;           // 姓名 (如: 贾诩)
  courtesyName: string;   // 表字 (如: 文和)
  camp: 'WEI' | 'SHU' | 'WU' | 'NEUTRAL';
  campLabel: string;      // 阵营称号 (如: 曹魏开国太尉 / 隐忍之谋)
  titleTag: string;       // 核心头衔标签 (如: 【算无遗策 · 苟道真仙】)
  birthplace: string;     // 籍贯 (如: 凉州武威郡姑臧县)
  provinceId: ProvinceId; // 籍贯归属州
  historicLifespan: string;// 生卒年与享年 (如: 公元147—223年 · 享年77岁)
  historicAge: number;    // 享年
  stats: Attributes;      // 历史人物五维属性
  archetype: 'STRATEGIST' | 'MARTIAL' | 'HERMIT' | 'HEALER_SCHOLAR' | 'WEALTHY' | 'SURVIVOR';
  similarityScore: number;// 契合度百分比 (0 - 100)
  resonanceTitle: string; // 契合品评 (如: 「神交同道 · 谋己安天下」)
  resonanceReason: string;// 为什么匹配TA的详细评述
  keyParallels: string[]; // 3点具体契合对照
  historicQuote: string;  // 史书传赞或名言
}

interface HistoricalFigureTemplate {
  id: string;
  name: string;
  courtesyName: string;
  camp: 'WEI' | 'SHU' | 'WU' | 'NEUTRAL';
  campLabel: string;
  titleTag: string;
  birthplace: string;
  provinceId: ProvinceId;
  historicLifespan: string;
  historicAge: number;
  stats: Attributes;
  archetype: 'STRATEGIST' | 'MARTIAL' | 'HERMIT' | 'HEALER_SCHOLAR' | 'WEALTHY' | 'SURVIVOR';
  historicQuote: string;
  personalityKeywords: string[];
}

export const HISTORICAL_FIGURES_DB: HistoricalFigureTemplate[] = [
  // 1. 贾诩 (文和) - 凉州苟道与深谋之王
  {
    id: 'jia_xu',
    name: '贾诩',
    courtesyName: '文和',
    camp: 'WEI',
    campLabel: '曹魏太尉 · 乱世谋首',
    titleTag: '【算无遗策 · 隐忍苟道之尊】',
    birthplace: '凉州武威郡姑臧县',
    provinceId: 'LIANGZHOU',
    historicLifespan: '公元147 — 223年 · 享年77岁',
    historicAge: 77,
    stats: { health: 70, intellect: 97, martial: 38, virtue: 55, wealth: 68, fortune: 92 },
    archetype: 'STRATEGIST',
    historicQuote: '“天下纷扰，唯文和算无遗策；深自结纳，闭门自守，终全其家。”',
    personalityKeywords: ['苟道', '长寿', '深谋', '凉州', '保身', '机警', '洞察'],
  },

  // 2. 诸葛亮 (孔明) - 忠贞济世、鞠躬尽瘁
  {
    id: 'zhuge_liang',
    name: '诸葛亮',
    courtesyName: '孔明',
    camp: 'SHU',
    campLabel: '蜀汉丞相 · 武乡侯',
    titleTag: '【鞠躬尽瘁 · 经天纬地名相】',
    birthplace: '徐州琅琊国阳都县',
    provinceId: 'XUZHOU',
    historicLifespan: '公元181 — 234年 · 享年54岁',
    historicAge: 54,
    stats: { health: 50, intellect: 99, martial: 45, virtue: 98, wealth: 42, fortune: 65 },
    archetype: 'STRATEGIST',
    historicQuote: '“受任于败军之际，奉命于危难之间。鞠躬尽瘁，死而后已。”',
    personalityKeywords: ['大仁大智', '徐州', '躬耕南阳', '济世', '心力交瘁', '高识见'],
  },

  // 3. 赵云 (子龙) - 浑身是胆、忠厚果决
  {
    id: 'zhao_yun',
    name: '赵云',
    courtesyName: '子龙',
    camp: 'SHU',
    campLabel: '蜀汉镇东将军 · 顺平侯',
    titleTag: '【一身是胆 · 仁勇两全之将】',
    birthplace: '幽州常山国真定县',
    provinceId: 'YOUZHOU',
    historicLifespan: '公元168 — 229年 · 享年62岁',
    historicAge: 62,
    stats: { health: 88, intellect: 76, martial: 96, virtue: 94, wealth: 35, fortune: 80 },
    archetype: 'MARTIAL',
    historicQuote: '“子龙一身都是胆也！益州既定，当以田宅还民，何可分赐诸将。”',
    personalityKeywords: ['幽州', '勇武', '仁厚还民', '常胜', '寿过花甲', '纯粹忠义'],
  },

  // 4. 廖化 (元俭) - 超高寿见证者、先锋砥柱
  {
    id: 'liao_hua',
    name: '廖化',
    courtesyName: '元俭',
    camp: 'SHU',
    campLabel: '蜀汉右车骑将军 · 中都护',
    titleTag: '【见证始终 · 寿跨百战老先锋】',
    birthplace: '荆州襄阳郡中庐县',
    provinceId: 'JINGZHOU',
    historicLifespan: '公元185 — 264年 · 享年79岁',
    historicAge: 79,
    stats: { health: 80, intellect: 68, martial: 78, virtue: 75, wealth: 50, fortune: 82 },
    archetype: 'SURVIVOR',
    historicQuote: '“蜀中无大将，廖化作先锋。历经黄巾、赤壁、刘关张诸葛之世，终老归西。”',
    personalityKeywords: ['荆州', '长寿', '见证历史', '先锋', '大难不死', '坚韧'],
  },

  // 5. 华佗 (元化) - 悬壶济世、民间圣手
  {
    id: 'hua_tuo',
    name: '华佗',
    courtesyName: '元化',
    camp: 'NEUTRAL',
    campLabel: '汉末神医 · 杏林宗师',
    titleTag: '【仁心活人 · 民间扁鹊再世】',
    birthplace: '豫州沛国谯县',
    provinceId: 'YUZHOU',
    historicLifespan: '公元145 — 208年 · 享年63岁',
    historicAge: 63,
    stats: { health: 75, intellect: 92, martial: 35, virtue: 96, wealth: 40, fortune: 45 },
    archetype: 'HEALER_SCHOLAR',
    historicQuote: '“人体欲得劳动，但不当使极耳。动摇则谷气得消，血脉流通，病不得生。”',
    personalityKeywords: ['治病救人', '悬壶', '大疫', '豫州', '仁厚', '草药方术'],
  },

  // 6. 鲁肃 (子敬) - 巨富好施、指仓相赠
  {
    id: 'lu_su',
    name: '鲁肃',
    courtesyName: '子敬',
    camp: 'WU',
    campLabel: '东吴大都督 · 临淮高士',
    titleTag: '【散财济世 · 榻上策天下之士】',
    birthplace: '徐州临淮郡东城县',
    provinceId: 'XUZHOU',
    historicLifespan: '公元172 — 217年 · 享年46岁',
    historicAge: 46,
    stats: { health: 60, intellect: 92, martial: 58, virtue: 95, wealth: 95, fortune: 70 },
    archetype: 'WEALTHY',
    historicQuote: '“家富于财，性好施与。周瑜请粮，子敬指一囷米以赠，遂为莫逆。”',
    personalityKeywords: ['徐州', '家财万贯', '仗义疏财', '仁善', '远见卓识'],
  },

  // 7. 糜竺 (子仲) - 祖世货殖、倾资助业
  {
    id: 'mi_zhu',
    name: '糜竺',
    courtesyName: '子仲',
    camp: 'SHU',
    campLabel: '蜀汉安汉将军 · 东海巨商',
    titleTag: '【富可敌国 · 毁家纾难忠义臣】',
    birthplace: '徐州东海郡朐县',
    provinceId: 'XUZHOU',
    historicLifespan: '公元165 — 221年 · 享年56岁',
    historicAge: 56,
    stats: { health: 62, intellect: 72, martial: 40, virtue: 88, wealth: 98, fortune: 65 },
    archetype: 'WEALTHY',
    historicQuote: '“祖世货殖，僮客万人，赀产巨亿。后闻先主危难，倾资相助，位在诸葛之上。”',
    personalityKeywords: ['徐州', '大富', '贩夫商贾', '散尽家财', '温和忠正'],
  },

  // 8. 庞德公 - 鹿门隐逸、不入浊流
  {
    id: 'pang_degong',
    name: '庞德公',
    courtesyName: '尚长',
    camp: 'NEUTRAL',
    campLabel: '荆襄大隐 · 鹿门山逸叟',
    titleTag: '【林泉自乐 · 躬耕不屈之高隐】',
    birthplace: '荆州南郡襄阳县',
    provinceId: 'JINGZHOU',
    historicLifespan: '公元150 — 235年 · 享年85岁',
    historicAge: 85,
    stats: { health: 85, intellect: 90, martial: 25, virtue: 92, wealth: 45, fortune: 88 },
    archetype: 'HERMIT',
    historicQuote: '“鸿鹄巢于高林之上，暮而宿之；鼋鼍穴于深渊之下，夕而庇之。去就趣舍，何患之有？”',
    personalityKeywords: ['荆州', '归隐', '躬耕', '寿考期颐', '不涉兵争', '清雅'],
  },

  // 9. 管宁 (幼安) - 避乱辽东、割席布衣
  {
    id: 'guan_ning',
    name: '管宁',
    courtesyName: '幼安',
    camp: 'NEUTRAL',
    campLabel: '汉末布衣高士 · 辽东隐学',
    titleTag: '【割席高洁 · 避乱三十载真布衣】',
    birthplace: '青州北海国朱虚县',
    provinceId: 'QINGZHOU',
    historicLifespan: '公元158 — 241年 · 享年84岁',
    historicAge: 84,
    stats: { health: 82, intellect: 91, martial: 28, virtue: 95, wealth: 38, fortune: 85 },
    archetype: 'HERMIT',
    historicQuote: '“子非吾友也！避乱辽东三十余载，庐于山谷，讲诗书，化流俗，终老布衣。”',
    personalityKeywords: ['青州', '布衣', '高寿', '割席', '避乱', '讲学', '耕读'],
  },

  // 10. 司马懿 (仲达) - 鹰视狼顾、熬尽英雄
  {
    id: 'sima_yi',
    name: '司马懿',
    courtesyName: '仲达',
    camp: 'WEI',
    campLabel: '曹魏太傅 · 晋高祖宣皇帝',
    titleTag: '【能屈能伸 · 熬杀三代之雄主】',
    birthplace: '司隶河内郡温县',
    provinceId: 'LUOYANG',
    historicLifespan: '公元179 — 251年 · 享年73岁',
    historicAge: 73,
    stats: { health: 76, intellect: 98, martial: 68, virtue: 40, wealth: 85, fortune: 95 },
    archetype: 'SURVIVOR',
    historicQuote: '“夫将兵者，不战而屈人之兵，善之善者也。忍常人所不能忍，成常人所不能成。”',
    personalityKeywords: ['司隶', '极高寿', '忍耐', '气数绝顶', '权谋', '熬死群雄'],
  },

  // 11. 荀彧 (文若) - 王佐之才、颍川清流
  {
    id: 'xun_yu',
    name: '荀彧',
    courtesyName: '文若',
    camp: 'WEI',
    campLabel: '曹魏尚书令 · 万岁亭侯',
    titleTag: '【王佐风骨 · 留香百代士族宗师】',
    birthplace: '豫州颍川郡颍阴县',
    provinceId: 'YINGCHUAN',
    historicLifespan: '公元163 — 212年 · 享年50岁',
    historicAge: 50,
    stats: { health: 52, intellect: 98, martial: 35, virtue: 96, wealth: 72, fortune: 60 },
    archetype: 'STRATEGIST',
    historicQuote: '“守正持重，深虑长计。君子爱人以德，荀令留香，汉末士人之冠冕。”',
    personalityKeywords: ['颍川', '世家', '清流', '尚书令', '大仁大忠', '深谋'],
  },

  // 12. 关羽 (云长) - 威震华夏、忠义千秋
  {
    id: 'guan_yu',
    name: '关羽',
    courtesyName: '云长',
    camp: 'SHU',
    campLabel: '蜀汉前将军 · 汉寿亭侯',
    titleTag: '【义薄云天 · 万人辟易武圣之风】',
    birthplace: '并州河东郡解县',
    provinceId: 'BINGZHOU',
    historicLifespan: '公元160 — 220年 · 享年60岁',
    historicAge: 60,
    stats: { health: 85, intellect: 75, martial: 98, virtue: 90, wealth: 35, fortune: 55 },
    archetype: 'MARTIAL',
    historicQuote: '“玉可碎而不可改其白，竹可焚而不可毁其节。身虽殒，名可垂于竹帛也。”',
    personalityKeywords: ['并州', '万夫莫敌', '威震天下', '忠义', '刚烈', '悲壮'],
  },

  // 13. 士燮 (威彦) - 偏安岭南、保境安民九十载
  {
    id: 'shi_xie',
    name: '士燮',
    courtesyName: '威彦',
    camp: 'NEUTRAL',
    campLabel: '交州太守 · 龙度亭侯',
    titleTag: '【南天福星 · 保境安民九十寿叟】',
    birthplace: '交州苍梧郡广信县',
    provinceId: 'JIAOZHOU',
    historicLifespan: '公元137 — 226年 · 享年90岁',
    historicAge: 90,
    stats: { health: 86, intellect: 84, martial: 45, virtue: 89, wealth: 88, fortune: 94 },
    archetype: 'SURVIVOR',
    historicQuote: '“居南越四十余岁，兄弟并为列郡，拥地千里，民夷安堵，寿终九十，福寿双全。”',
    personalityKeywords: ['交州', '寿登九十', '避难', '边郡', '富足', '福寿安康'],
  },

  // 14. 蔡琰 (文姬) - 乱世才女、胡笳哀鸣
  {
    id: 'cai_wenji',
    name: '蔡琰',
    courtesyName: '文姬',
    camp: 'NEUTRAL',
    campLabel: '汉末一代词客 · 大儒蔡邕之女',
    titleTag: '【颠沛流离 · 胡笳悲歌旷世才女】',
    birthplace: '兖州陈留郡圉县',
    provinceId: 'YANZHOU',
    historicLifespan: '公元177 — 249年 · 享年72岁',
    historicAge: 72,
    stats: { health: 58, intellect: 96, martial: 20, virtue: 88, wealth: 35, fortune: 50 },
    archetype: 'HEALER_SCHOLAR',
    historicQuote: '“天不仁兮降乱离，地不仁兮使我逢此时。十七拍兮心鼻酸，关山阻修兮行路难。”',
    personalityKeywords: ['兖州', '才情', '兵灾流离', '坚强', '文史', '长寿'],
  },

  // 15. 太史慈 (子义) - 信义笃烈、神箭无双
  {
    id: 'taishi_ci',
    name: '太史慈',
    courtesyName: '子义',
    camp: 'WU',
    campLabel: '东吴建昌都尉 · 折冲中郎将',
    titleTag: '【笃烈信义 · 弦无虚发东莱豪士】',
    birthplace: '青州东莱郡黄县',
    provinceId: 'QINGZHOU',
    historicLifespan: '公元166 — 206年 · 享年41岁',
    historicAge: 41,
    stats: { health: 78, intellect: 70, martial: 93, virtue: 90, wealth: 42, fortune: 60 },
    archetype: 'MARTIAL',
    historicQuote: '“大丈夫生于乱世，当带三尺剑立不世之功；今所志未遂，奈何死乎！”',
    personalityKeywords: ['青州', '勇武', '笃烈', '报母恩', '神射', '壮志未酬'],
  },

  // 16. 张鲁 (公祺) - 汉中五斗米、设义米济民
  {
    id: 'zhang_lu',
    name: '张鲁',
    courtesyName: '公祺',
    camp: 'NEUTRAL',
    campLabel: '汉中镇南将军 · 阆中侯',
    titleTag: '【义舍施米 · 宽厚济民保境之主】',
    birthplace: '益州汉中郡南郑县',
    provinceId: 'YIZHOU',
    historicLifespan: '公元162 — 216年 · 享年55岁',
    historicAge: 55,
    stats: { health: 70, intellect: 75, martial: 50, virtue: 86, wealth: 85, fortune: 80 },
    archetype: 'WEALTHY',
    historicQuote: '“置义舍，悬义米义肉于其中，行者量腹取足。后封侯归魏，五子皆封列侯。”',
    personalityKeywords: ['益州', '施粮济饥', '方道', '保全民生', '富足善终'],
  },

  // 17. 郭嘉 (奉孝) - 鬼谋神策、天妒英才
  {
    id: 'guo_jia',
    name: '郭嘉',
    courtesyName: '奉孝',
    camp: 'WEI',
    campLabel: '曹魏司空军祭酒 · 洧阳亭侯',
    titleTag: '【鬼谋神算 · 天妒英才三十八年】',
    birthplace: '豫州颍川郡阳翟县',
    provinceId: 'YINGCHUAN',
    historicLifespan: '公元170 — 207年 · 享年38岁',
    historicAge: 38,
    stats: { health: 32, intellect: 98, martial: 30, virtue: 65, wealth: 55, fortune: 58 },
    archetype: 'STRATEGIST',
    historicQuote: '“使孤成大业者，必此人也。哀哉奉孝！痛哉奉孝！惜哉奉孝！”',
    personalityKeywords: ['颍川', '鬼才', '短折体虚', '智绝', '知机', '水土不服'],
  },

  // 18. 甘宁 (兴霸) - 锦帆豪侠、百骑劫营
  {
    id: 'gan_ning',
    name: '甘宁',
    courtesyName: '兴霸',
    camp: 'WU',
    campLabel: '东吴折冲将军 · 西陵太守',
    titleTag: '【锦帆豪侠 · 胆气过人水陆霸王】',
    birthplace: '益州巴郡临江县',
    provinceId: 'YIZHOU',
    historicLifespan: '公元168 — 220年 · 享年53岁',
    historicAge: 53,
    stats: { health: 85, intellect: 65, martial: 95, virtue: 68, wealth: 70, fortune: 75 },
    archetype: 'MARTIAL',
    historicQuote: '“孟德有张辽，孤有甘兴霸，足相敌也。锦帆带铃，纵横江表。”',
    personalityKeywords: ['益州', '水客舟夫', '豪侠', '猛烈', '敢战', '劫营'],
  },

  // 19. 张仲景 (机) - 坐堂医圣、救苦建安大疫
  {
    id: 'zhang_zhongjing',
    name: '张机',
    courtesyName: '仲景',
    camp: 'NEUTRAL',
    campLabel: '东汉长沙太守 · 万代医圣',
    titleTag: '【仁爱济世 · 伤寒活命万家生佛】',
    birthplace: '荆州南阳郡涅阳县',
    provinceId: 'JINGZHOU',
    historicLifespan: '公元150 — 219年 · 享年70岁',
    historicAge: 70,
    stats: { health: 74, intellect: 95, martial: 25, virtue: 98, wealth: 52, fortune: 78 },
    archetype: 'HEALER_SCHOLAR',
    historicQuote: '“进则救世，退则救民；舍医之外，何以济斯民？勤求古训，博采众方。”',
    personalityKeywords: ['荆州', '大疫', '医圣', '仁善', '高寿', '活人无数'],
  },

  // 20. 曹冲 (仓舒) - 称象神童、早夭仁慈
  {
    id: 'cao_chong',
    name: '曹冲',
    courtesyName: '仓舒',
    camp: 'WEI',
    campLabel: '曹魏邓哀王 · 汉末第一神童',
    titleTag: '【灵秀天纵 · 智察仁善匆匆早夭】',
    birthplace: '司隶河南尹洛阳县',
    provinceId: 'LUOYANG',
    historicLifespan: '公元196 — 208年 · 享年13岁',
    historicAge: 13,
    stats: { health: 22, intellect: 96, martial: 20, virtue: 92, wealth: 75, fortune: 35 },
    archetype: 'HEALER_SCHOLAR',
    historicQuote: '“生五六岁，智意所及，有若成人。曹冲称象，辨鼠啮鞍之枉，惜其十三早殂。”',
    personalityKeywords: ['早夭', '年少', '聪慧', '洛阳', '仁慈', '病卒'],
  },

  // 21. 严颜 - 老将刚直、不降宁死
  {
    id: 'yan_yan',
    name: '严颜',
    courtesyName: '伯坚',
    camp: 'SHU',
    campLabel: '巴郡太守 · 蜀汉宿将',
    titleTag: '【老当益壮 · 断头将军威武不屈】',
    birthplace: '益州巴郡江州县',
    provinceId: 'YIZHOU',
    historicLifespan: '公元153 — 224年 · 享年72岁',
    historicAge: 72,
    stats: { health: 82, intellect: 66, martial: 85, virtue: 86, wealth: 45, fortune: 70 },
    archetype: 'MARTIAL',
    historicQuote: '“我州但有断头将军，无有降将军也！喝叱风云，义动张飞释缚。”',
    personalityKeywords: ['益州', '老将', '硬骨头', '寿过七旬', '勇烈', '忠正'],
  },

  // 22. 沮授 (公与) - 冀州名士、志存社稷
  {
    id: 'ju_shou',
    name: '沮授',
    courtesyName: '公与',
    camp: 'NEUTRAL',
    campLabel: '袁绍军师 · 监军都督',
    titleTag: '【少有大志 · 冀野风骨忠贞之士】',
    birthplace: '冀州广平郡广平县',
    provinceId: 'JIZHOU',
    historicLifespan: '公元155 — 200年 · 享年46岁',
    historicAge: 46,
    stats: { health: 60, intellect: 94, martial: 52, virtue: 82, wealth: 60, fortune: 45 },
    archetype: 'STRATEGIST',
    historicQuote: '“少有大志，多权略。审配、逢纪虽争权，唯沮授抱忠义不肯降曹，殁于官渡。”',
    personalityKeywords: ['冀州', '骨鲠', '智略', '忠义', '悲壮官渡'],
  },
];

/**
 * 契合度评分计算引擎
 */
export function matchHistoricalFigures(
  profile: PersonProfile,
  stats: Attributes,
  deathAge: number,
  deathYear: number,
  deathReason?: string,
  endingTier?: string
): MatchedHistoricalFigure[] {
  const scoredList: MatchedHistoricalFigure[] = HISTORICAL_FIGURES_DB.map((template) => {
    // 1. 属性五维欧几里得距离相似度 (满分 45分)
    const statKeys: (keyof Attributes)[] = ['health', 'intellect', 'martial', 'virtue', 'wealth', 'fortune'];
    let squaredDiffSum = 0;
    statKeys.forEach((key) => {
      const pVal = stats[key] ?? 50;
      const tVal = template.stats[key] ?? 50;
      squaredDiffSum += Math.pow((pVal - tVal) / 100, 2);
    });
    const normalizedDistance = Math.sqrt(squaredDiffSum / statKeys.length); // 0 (identical) to 1 (opposite)
    const statScore = Math.max(0, 45 * (1 - normalizedDistance * 1.3));

    // 2. 寿数与时代寿命阶段匹配 (满分 25分)
    const ageDiff = Math.abs(deathAge - template.historicAge);
    let ageScore = 0;
    if (ageDiff <= 3) {
      ageScore = 25;
    } else if (ageDiff <= 8) {
      ageScore = 22;
    } else if (ageDiff <= 15) {
      ageScore = 18;
    } else if (ageDiff <= 25) {
      ageScore = 12;
    } else {
      ageScore = Math.max(3, 25 - ageDiff * 0.4);
    }

    // 极端早夭/极端长寿特殊加分
    if (deathAge >= 70 && template.historicAge >= 70) {
      ageScore = Math.min(25, ageScore + 5);
    }
    if (deathAge <= 16 && template.historicAge <= 18) {
      ageScore = Math.min(25, ageScore + 8);
    }

    // 3. 籍贯与地理渊源 (满分 15分)
    let geoScore = 0;
    if (profile.birthProvince === template.provinceId) {
      geoScore = 15; // 彻底同乡
    } else {
      // 临近州郡判定
      const neighbors: Record<ProvinceId, ProvinceId[]> = {
        LUOYANG: ['YUZHOU', 'YANZHOU', 'JIZHOU', 'BINGZHOU', 'YINGCHUAN'],
        YINGCHUAN: ['LUOYANG', 'YUZHOU', 'YANZHOU', 'JINGZHOU'],
        YUZHOU: ['LUOYANG', 'YINGCHUAN', 'YANZHOU', 'XUZHOU', 'JINGZHOU'],
        XUZHOU: ['YUZHOU', 'YANZHOU', 'QINGZHOU', 'YANGZHOU'],
        YANZHOU: ['LUOYANG', 'YUZHOU', 'JIZHOU', 'QINGZHOU', 'XUZHOU'],
        JIZHOU: ['BINGZHOU', 'YOUZHOU', 'YANZHOU', 'QINGZHOU'],
        QINGZHOU: ['JIZHOU', 'YANZHOU', 'XUZHOU'],
        YOUZHOU: ['JIZHOU', 'BINGZHOU'],
        BINGZHOU: ['YOUZHOU', 'JIZHOU', 'LIANGZHOU', 'LUOYANG'],
        LIANGZHOU: ['BINGZHOU', 'LUOYANG', 'YIZHOU'],
        JINGZHOU: ['YUZHOU', 'YANGZHOU', 'YIZHOU', 'JIAOZHOU'],
        YANGZHOU: ['XUZHOU', 'JINGZHOU', 'JIAOZHOU'],
        YIZHOU: ['LIANGZHOU', 'JINGZHOU'],
        JIAOZHOU: ['JINGZHOU', 'YANGZHOU'],
      };
      if (neighbors[profile.birthProvince]?.includes(template.provinceId)) {
        geoScore = 9;
      } else {
        geoScore = 4;
      }
    }

    // 4. 阶层、性情、死因、行事共鸣 (满分 15分)
    let fateScore = 7;
    const rLower = (deathReason || '').toLowerCase();

    // 苟道/寿终
    if ((deathAge >= 60 || endingTier === 'RESILIENT') && (template.id === 'jia_xu' || template.id === 'liao_hua' || template.id === 'shi_xie' || template.id === 'guan_ning')) {
      fateScore += 6;
    }
    // 伤寒/大疫救人
    if ((rLower.includes('疫') || rLower.includes('伤寒') || stats.virtue >= 75) && (template.id === 'hua_tuo' || template.id === 'zhang_zhongjing')) {
      fateScore += 7;
    }
    // 经商大富
    if ((profile.socialClass === 'MERCHANT' || stats.wealth >= 65) && (template.id === 'mi_zhu' || template.id === 'lu_su' || template.id === 'zhang_lu')) {
      fateScore += 7;
    }
    // 兵戈军旅
    if ((profile.occupation.includes('军') || profile.socialClass === 'FRONTIER_ARMY' || stats.martial >= 65) && (template.id === 'zhao_yun' || template.id === 'guan_yu' || template.id === 'liao_hua' || template.id === 'taishi_ci')) {
      fateScore += 6;
    }
    // 隐逸布衣
    if ((profile.socialClass === 'PEASANT' || profile.occupation.includes('耕') || profile.occupation.includes('长者')) && (template.id === 'pang_degong' || template.id === 'guan_ning')) {
      fateScore += 6;
    }

    fateScore = Math.min(15, fateScore);

    // 计算总百分比得分 (加权并在 65 ~ 98 之间形成更真实的宿命共鸣区间)
    const rawTotal = statScore + ageScore + geoScore + fateScore;
    const finalSimilarity = Math.min(98, Math.max(62, Math.round(rawTotal)));

    // 构造具体契合分析文案
    const keyParallels: string[] = [];
    if (profile.birthProvince === template.provinceId) {
      keyParallels.push(`【同乡地缘】：传主降生于${profile.commandery}，与${template.name}同出${template.birthplace.split('郡')[0] || template.birthplace}，浸染同一方山川气象。`);
    } else {
      keyParallels.push(`【气局共鸣】：虽一在${profile.commandery}、一在${template.birthplace}，然所处汉末天运之脉络如出一辙。`);
    }

    if (Math.abs(deathAge - template.historicAge) <= 6) {
      keyParallels.push(`【寿数相若】：传主享年${deathAge}岁，${template.name}享年${template.historicAge}岁，皆在此时岁完成了属于自己的宿命轮回。`);
    } else if (deathAge >= 60 && template.historicAge >= 60) {
      keyParallels.push(`【乱世期颐】：皆熬过建安兵戈之浩劫，于汉末群雄纷争之中笑对风霜，寿超花甲。`);
    } else {
      keyParallels.push(`【属性神似】：五维气数中，体魄/识见/勇略之分布与${template.name}生平特质存在高度共鸣。`);
    }

    if (stats.virtue >= 70 && template.stats.virtue >= 85) {
      keyParallels.push(`【仁心厚德】：为人处世皆以仁德宽厚立身，在荒年与乱世中广积乡里口碑。`);
    } else if (stats.martial >= 70 && template.stats.martial >= 85) {
      keyParallels.push(`【勇烈刚强】：行事勇决，面对危难从不退缩，兼具民间武侠豪士之胆略。`);
    } else if (stats.intellect >= 70 && template.stats.intellect >= 85) {
      keyParallels.push(`【识见超群】：看淡浮沉，料事机敏，知晓趋吉避凶与乱世生存之大智慧。`);
    } else if (stats.wealth >= 65 && template.stats.wealth >= 75) {
      keyParallels.push(`【丰衣足食】：善于持家货殖，家中仓廪充裕，在流民饥馑岁月中能全己全邻。`);
    } else {
      keyParallels.push(`【坚韧天命】：历尽民间坎坷，在时代巨浪中书写了一介草民不平凡的生平。`);
    }

    // 专属评语
    let resonanceTitle = '「同声相应 · 汉末故人」';
    let resonanceReason = `传主生平之起伏与【${template.name}】最见神似。无论是对世事的洞见，还是在险象环生中的抉择步调，皆仿佛倒映着昔日${template.name}在风云激荡中的影子。`;

    if (template.id === 'jia_xu') {
      resonanceTitle = '「神交同道 · 苟道真仙」';
      resonanceReason = `传主历尽沧桑却总能洞悉危险、明哲保身，与凉州贾文和“算无遗策、闭门远祸”之生存大智慧如出一辙。英雄争相陨落，唯大智者见得始终。`;
    } else if (template.id === 'liao_hua') {
      resonanceTitle = '「天命宿伴 · 历史见证者」';
      resonanceReason = `传主从灵帝中平元年一路行来，步步踏过三国漫长四季，恰似蜀汉老将廖化——一生为先锋，见尽豪杰兴替，最终以高寿为这纷扰乱世作结。`;
    } else if (template.id === 'hua_tuo' || template.id === 'zhang_zhongjing') {
      resonanceTitle = '「仁心映照 · 救苦悬壶客」';
      resonanceReason = `传主平生仁厚过人，大疫饥馑之时心系万民，宛若当年行医于谯县或南阳的先贤。官渡赤壁战火易熄，唯医者慈心永润草民。`;
    } else if (template.id === 'zhao_yun') {
      resonanceTitle = '「胆气凌云 · 仁勇赤子」';
      resonanceReason = `传主胆魄过人且心怀善念，面对兵戈强寇敢拔刀迎上，危难过后又能安分守拙，深得常山赵子龙“一身是胆、仁义还民”之赤子风范。`;
    } else if (template.id === 'guan_ning' || template.id === 'pang_degong') {
      resonanceTitle = '「林泉高格 · 鹿门布衣」';
      resonanceReason = `传主身虽在草莽，心却远避浊浪，不慕虚名利禄，躬耕乐道，如管幼安辽东讲席、庞德公鹿门采药，尽得天地真隐士之怡然。`;
    } else if (template.id === 'mi_zhu' || template.id === 'lu_su') {
      resonanceTitle = '「仗义疏财 · 豪商长者」';
      resonanceReason = `传主家底殷实且乐善好施，未被黄白之物迷了心窍，在乱世之中周济亲邻，颇有昔日糜子仲、鲁子敬倾资济危之长者古风。`;
    }

    return {
      ...template,
      similarityScore: finalSimilarity,
      resonanceTitle,
      resonanceReason,
      keyParallels,
    };
  });

  // 按契合度降序排列，取前 3 位
  scoredList.sort((a, b) => b.similarityScore - a.similarityScore);
  return scoredList.slice(0, 3);
}
