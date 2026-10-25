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

export type CampType =
  | 'WEI'         // 曹魏 / 曹操
  | 'SHU'         // 蜀汉 / 刘备
  | 'WU'          // 东吴 / 孙策孙权
  | 'YUAN_SHAO'   // 河北袁绍
  | 'DONG_ZHUO'   // 凉州董卓
  | 'LU_BU'       // 温侯吕布
  | 'NEUTRAL'     // 地方诸侯/义军
  | 'NONE';       // 乡野平民/非军职

export interface HistoricalFigureBond {
  id: string;              // e.g. 'zhao_yun'
  name: string;            // e.g. '赵云'
  courtesyName: string;    // e.g. '子龙'
  title: string;           // e.g. '常山真定名将'
  camp: CampType;
  campLabel: string;       // e.g. '蜀汉顺平侯'
  relation: string;        // e.g. '生死之交', '同道知己', '提携主将', '杏林良师'
  bondLevel: number;       // 1: 初识, 2: 相熟, 3: 莫逆, 4: 生死托付
  lastSpoken: string;      // Latest famous quote or conversational line
  metYear: number;
}

export interface MilitaryAffiliation {
  camp: CampType;
  commanderName: string;   // e.g. '赵云' | '曹操' | '诸葛亮' | '周瑜' | '关羽' | '刘备' | '袁绍' | '淳于琼'
  roleTitle: string;       // e.g. '常山义从亲骑', '典农司马督粮官', '白毦亲军校尉', '江东水师牙门将', '河北亲军大戟士'
  enlistYear: number;
  campaigns: string[];     // e.g. ['虎牢关会盟', '官渡乌巢', '长坂坡护民', '赤壁火攻', '汉中鏖战', '出祁山']
}

export interface HistoricalDialogue {
  figureId: string;
  speaker: string;         // e.g. '赵云'
  courtesyName?: string;   // e.g. '子龙'
  title: string;           // e.g. '常山真定壮士'
  camp: CampType;
  avatarChar: string;      // e.g. '云'
  quote: string;           // Character dialogue line
  replyPrompt?: string;    // Contextual explanation of the encounter
}

export interface LifeChoice {
  id: string;
  label: string;
  description: string;
  requirements?: Partial<Attributes>;
  requirementHint?: string; // Subtle atmospheric hint, e.g. "需识见通达" or "需勇力绝伦"
  approachTag?: string;     // e.g. "【勇者当先】", "【韬光养晦】", "【仁德恤民】", "【投效名将】"
  statChanges: Partial<Record<keyof Attributes, number>>;
  outcomeText: string;
  customEffect?: string;
  figureBond?: {
    figureId: string;
    figureName: string;
    courtesyName: string;
    title: string;
    camp: CampType;
    campLabel: string;
    relation: string;
    dialogue: string;
  };
  campaignUnlock?: {
    campaignName: string;
    camp: CampType;
    commander: string;
    roleTitle: string;
  };
  eventFlagToSet?: string;
  eventFlagToRemove?: string;
  
  // 阵营脱离与下野
  leaveMilitary?: boolean; // 脱离军伍下野为民 (camp 归 NONE, 恢复乡野身份)
  
  // 生死战死判定
  fatalCheck?: (stats: Attributes) => { isFatal: boolean; deathReason: string } | null;
  isDirectFatal?: boolean;  // 直接殉国/战死判定
  fatalDeathReason?: string;// 战死原因文案 (如: 官渡乌巢烈火中力战身亡)
  
  // 被俘等临场二次抉择 (如被俘后是否归降、下野或就义)
  followUpChoice?: {
    prompt: string;
    options: LifeChoice[];
  };
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
  figureDialogue?: HistoricalDialogue; // Historical figure dialogue
  campaignName?: string; // Campaign title if participating
  isCampaignEvent?: boolean;
  eventFlagTriggered?: string;
  choice?: {
    prompt: string;
    options: LifeChoice[];
  };
}

export interface PhysiologicalStage {
  stageKey: 'INFANT' | 'CHILD' | 'YOUTH' | 'ADULT' | 'PRIME' | 'MIDDLE' | 'ELDER' | 'VENERABLE';
  stageName: string;       // e.g. "襁褓幼婴"
  tag: string;             // e.g. "骨软神萌"
  description: string;     // e.g. "初临乱世，襁褓骨弱，极易受风寒侵袭，全赖父母温汤护持。"
  ageRange: string;        // e.g. "0~2岁"
  growthTrend: {
    health: 'GROWING_FAST' | 'GROWING' | 'PEAK' | 'DECLINING' | 'DECLINING_FAST';
    intellect: 'GROWING_FAST' | 'GROWING' | 'PEAK' | 'STABLE';
    martial: 'DORMANT' | 'GROWING_FAST' | 'GROWING' | 'PEAK' | 'DECLINING' | 'DECLINING_FAST';
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
  naturalChanges?: Partial<Record<keyof Attributes, number>>;
  naturalChangeNote?: string;
  physiologicalStageName?: string;
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
  knownFiguresList?: string[];
  militaryCamp?: string;
  campaignsList?: string[];
}
