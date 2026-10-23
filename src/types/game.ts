/**
 * Data structures for the realistic Three Kingdoms Life Simulator
 * "公元184年，你出生了。然后让时间自己向前走。"
 * 支持自定义姓氏、名字、表字，以及按季/月流转的丰富历史与民间演义大事。
 */

export type ProvinceId =
  | 'LUOYANG'    // 司隶 · 洛阳
  | 'YINGCHUAN'  // 豫州 · 颍川
  | 'XUZHOU'     // 徐州
  | 'YOUZHOU'    // 幽州
  | 'BINGZHOU'   // 并州
  | 'JIZHOU'     // 冀州
  | 'QINGZHOU'   // 青州
  | 'YUZHOU'     // 豫州
  | 'YANZHOU'    // 兖州
  | 'JINGZHOU'   // 荆州
  | 'YANGZHOU'   // 扬州
  | 'YIZHOU'     // 益州
  | 'LIANGZHOU'  // 凉州
  | 'JIAOZHOU';   // 交州

export interface RegionInfo {
  id: ProvinceId;
  provinceName: string;
  commanderies: string[];
  counties: string[];
  culturalNote: string;
}

export type SocialClass =
  | 'PEASANT'        // 贫苦佃农 / 耕夫
  | 'TOWN_ARTISAN'   // 市井工匠 / 织户 / 铁铺
  | 'FISHER_BOATMAN' // 滨水渔户 / 舟夫
  | 'FRONTIER_ARMY'  // 边塞军户 / 戍卒之后
  | 'SCHOLAR_CLERK'  // 乡塾秀士 / 县吏门第
  | 'MERCHANT'       // 贩夫走卒 / 坊市行商
  | 'NOBLE_GENTRY';  // 冠盖世家 / 累世经学 (极为罕见)

export interface Attributes {
  health: number;     // 体魄 (Physical vitality, disease resistance)
  intellect: number;  // 识见 (Wisdom, reading, perception)
  martial: number;    // 勇略 (Martial courage, archery, combat)
  virtue: number;     // 仁厚 (Morality, kinship, reputation in neighborhood)
  wealth: number;     // 家财 (Coin, grain, household inventory)
  fortune: number;    // 气数 (Destiny, luck in crises)
}

export type SeasonIndex = 0 | 1 | 2 | 3; // 0: 春, 1: 夏, 2: 秋, 3: 冬

export interface SeasonInfo {
  index: SeasonIndex;
  name: string;        // '春' | '夏' | '秋' | '冬'
  fullName: string;    // '春季 · 岁首农发'
  months: string;      // '正月至三月'
  solarTerm: string;   // '立春·惊蛰·清明' 等
  themeColor: string;
}

export interface LifeChoice {
  id: string;
  label: string;
  description: string;
  requirements?: Partial<Attributes>;
  statChanges: Partial<Record<keyof Attributes, number>>;
  outcomeText: string;
  customEffect?: string;
  fatalCheck?: (stats: Attributes) => { isFatal: boolean; deathReason: string } | null;
}

export interface SeasonalEvent {
  year: number;          // e.g. 184
  season: SeasonIndex;   // 0: 春, 1: 夏, 2: 秋, 3: 冬
  seasonName: string;    // '春季' | '夏季' | '秋季' | '冬季'
  seasonMonths: string;  // e.g. '正月至三月'
  lunarYear: string;     // e.g. "中平元年 · 甲子"
  age: number;           // 0, 1, 2...
  macroHistory: string;  // 天下大事 (Detailed historical events of this season)
  regionalImpact: string;// 本地风物 (What happened in the player's province/county)
  personalStory: string; // 个人生计 (What happened in the player's family/village this season)
  choice?: {
    prompt: string;
    options: LifeChoice[];
  };
}

export interface SeasonLogEntry {
  year: number;
  season: SeasonIndex;
  seasonName: string;
  age: number;
  lunarYear: string;
  macroHistory: string;
  storySummary: string;
  choiceMade?: string;
  statChanges?: Partial<Record<keyof Attributes, number>>;
  location: string;
  occupation: string;
}

export interface RealisticEnding {
  title: string;           // e.g. "彭城桑农 · 享年四十八"
  epitaphTitle: string;    // e.g. "汉末草民实录" / "中平孤魂" / "乡里耆宿"
  summary: string;         // Detailed life retrospective
  historianNote: string;   // 史家笔法或亲友悼言
  tier: 'COMMON' | 'RESILIENT' | 'LEGENDARY' | 'TRAGIC';
}

export interface CompletedLifeRecord {
  id: string;
  name: string;
  courtesyName: string;
  gender: 'MALE' | 'FEMALE';
  birthYear: number;
  deathYear: number;
  deathSeason: string;
  deathAge: number;
  birthplace: string;
  socialClass: string;
  finalOccupation: string;
  ending: RealisticEnding;
  finalStats: Attributes;
  seasonLogsCount: number;
  completedAt: string;
  matchedFigureName?: string;
  matchedFigureSimilarity?: number;
  matchedFigureTitle?: string;
}
