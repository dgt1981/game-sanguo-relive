import {
  ProvinceId,
  Attributes,
  LifeChoice,
  SeasonIndex,
  HistoricalDialogue,
} from './game';
import { PersonProfile } from '../services/lifeSimulator';

export type EventCategory =
  | 'INFANT_SURVIVAL'   // 0~2岁 襁褓婴儿存续
  | 'CHILDHOOD'         // 3~13岁 成童与启蒙教育
  | 'RITE_OF_PASSAGE'   // 14~19岁 束发成丁与行当抉择
  | 'HISTORICAL_CAMPAIGN' // 190~265年 重大编年演义战役与行伍从军
  | 'FIGURE_ENCOUNTER'  // 同郡名士结交会面与对话
  | 'CRISIS_ORDEAL'     // 伤寒大疫、灾荒、流民乱世
  | 'CIVILIAN_DAILY'    // 市井百业与耕织四季风貌
  | 'MATURE_SENIOR';    // 40~80岁 乡党长者、花甲见证、归真岁月

export interface EventTriggerCondition {
  minYear: number;
  maxYear: number;
  seasons?: SeasonIndex[]; // 0:春, 1:夏, 2:秋, 3:冬 (若未指定则四季皆可)
  minAge: number;
  maxAge: number;
  provinces?: ProvinceId[]; // 限制特定州郡 (若未指定则天下皆可)
  requiredFlags?: string[]; // 必须具备的因果链标签 (如 'learned_herbs', 'befriended:zhao_yun')
  forbiddenFlags?: string[]; // 不可具备的标签 (如 'done:evt_190_hulao'，防止重复)
  requiredCamp?: 'WEI' | 'SHU' | 'WU' | 'NEUTRAL';
  minStats?: Partial<Attributes>;
  requiredOccupation?: string[];
  onceOnly?: boolean; // 是否一生仅触发一次 (默认 true)
}

export interface EventTableRow {
  id: string; // 唯一事件ID, 如 'evt_child_7_education'
  category: EventCategory;
  title: string; // 事件标题, 如 '七岁束发开蒙'
  priority: number; // 匹配优先级 (数值越高越优先): 战役=100, 危机=80, 名士=60, 成长=40, 日常=10
  conditions: EventTriggerCondition;
  
  // 天下大事摘要 (可选，若未提供则采用自然编年宏观大事)
  macroHistoryOverride?: string;
  
  // 个人故事文本或动态生成函数
  storyText: string | ((profile: PersonProfile, stats: Attributes, season: SeasonIndex) => string);
  
  // 同郡名将/名士对话数据
  figureDialogue?: HistoricalDialogue | ((profile: PersonProfile, year: number) => HistoricalDialogue | undefined);
  
  // 演义/史实战役标识
  campaignName?: string;
  isCampaignEvent?: boolean;
  
  // 抉择设计
  choice?: {
    prompt: string;
    options: LifeChoice[];
  };
}

export interface EventQueryContext {
  year: number;
  season: SeasonIndex;
  age: number;
  profile: PersonProfile;
  stats: Attributes;
}
