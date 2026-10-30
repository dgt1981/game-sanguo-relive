import {
  ProvinceId,
  SocialClass,
  Attributes,
  SeasonalEvent,
  RealisticEnding,
  LifeChoice,
  SeasonIndex,
  PhysiologicalStage,
  HistoricalFigureBond,
  MilitaryAffiliation,
  HistoricalDialogue,
  NobleBoon,
} from '../types/game';
import { PROVINCES } from '../data/regions';
import { querySeasonalEventFromTable } from './eventEngine';
import { initChildhoodBonds } from './figuresSimulation';

export interface PersonProfile {
  name: string;
  surname: string;
  givenName: string;
  courtesyName: string;
  gender: 'MALE' | 'FEMALE';
  birthProvince: ProvinceId;
  currentProvince: ProvinceId;
  commandery: string;
  county: string;
  socialClass: SocialClass;
  occupation: string;
  fatherName: string;
  fatherAlive: boolean;
  motherName: string;
  motherAlive: boolean;
  siblingCount: number;
  spouseName?: string;
  childrenCount: number;
  knownFigures: HistoricalFigureBond[];
  collectedBoons?: NobleBoon[];
  militaryAffiliation?: MilitaryAffiliation;
  eventFlags: Record<string, boolean | number | string>;
}

export const SEASONS_CONFIG: {
  name: string;
  fullName: string;
  months: string;
  solarTerm: string;
  color: string;
}[] = [
  { name: '春', fullName: '春季', months: '孟春·正月至季春·三月', solarTerm: '立春 · 雨水 · 惊蛰 · 清明', color: '#4ade80' },
  { name: '夏', fullName: '夏季', months: '孟夏·四月至季夏·六月', solarTerm: '立夏 · 小满 · 芒种 · 夏至', color: '#f87171' },
  { name: '秋', fullName: '秋季', months: '孟秋·七月至季秋·九月', solarTerm: '立秋 · 处暑 · 白露 · 霜降', color: '#fbbf24' },
  { name: '冬', fullName: '冬季', months: '孟冬·十月至季冬·十二月', solarTerm: '立冬 · 小雪 · 大雪 · 岁除', color: '#38bdf8' },
];

export function generateRandomBirth(): PersonProfile {
  const surnames = [
    '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
    '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
    '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
    '程', '曹', '袁', '荀', '陆', '顾', '邓', '姜', '崔', '司马',
  ];
  const givenNamesMale = ['安', '顺', '福', '保', '生', '牛', '广', '平', '富', '康', '寿', '松', '山', '林', '义', '良', '定', '延', '崇', '道'];
  const givenNamesFemale = ['娣', '娘', '花', '秀', '英', '兰', '凤', '巧', '姑', '春', '梅', '月', '环', '青', '贞', '慧'];
  const courtesyRoots = ['子', '叔', '伯', '季', '文', '元', '公', '玄'];
  const courtesyEnds = ['明', '华', '德', '远', '安', '道', '休', '博', '达', '和', '修', '度', '正', '若'];

  const isMale = Math.random() > 0.35;
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = isMale
    ? givenNamesMale[Math.floor(Math.random() * givenNamesMale.length)]
    : givenNamesFemale[Math.floor(Math.random() * givenNamesFemale.length)];

  const courtesy = `${courtesyRoots[Math.floor(Math.random() * courtesyRoots.length)]}${
    courtesyEnds[Math.floor(Math.random() * courtesyEnds.length)]
  }`;

  const provincePick = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
  const commanderyPick = provincePick.commanderies[Math.floor(Math.random() * provincePick.commanderies.length)];
  const countyPick = provincePick.counties[Math.floor(Math.random() * provincePick.counties.length)];

  const classRoll = Math.random();
  let socialClass: SocialClass = 'PEASANT';
  if (classRoll < 0.45) {
    socialClass = 'PEASANT';
  } else if (classRoll < 0.65) {
    socialClass = 'TOWN_ARTISAN';
  } else if (classRoll < 0.78) {
    socialClass = 'FISHER_BOATMAN';
  } else if (classRoll < 0.88) {
    socialClass = 'FRONTIER_ARMY';
  } else if (classRoll < 0.95) {
    socialClass = 'SCHOLAR_CLERK';
  } else if (classRoll < 0.985) {
    socialClass = 'MERCHANT';
  } else {
    socialClass = 'NOBLE_GENTRY';
  }

  return {
    name: `${surname}${givenName}`,
    surname,
    givenName,
    courtesyName: courtesy,
    gender: isMale ? 'MALE' : 'FEMALE',
    birthProvince: provincePick.id,
    currentProvince: provincePick.id,
    commandery: commanderyPick,
    county: countyPick,
    socialClass,
    occupation: '襁褓幼童',
    fatherName: `${surname}大郎`,
    fatherAlive: true,
    motherName: '陈氏',
    motherAlive: true,
    siblingCount: Math.floor(Math.random() * 4),
    childrenCount: 0,
    knownFigures: [],
    eventFlags: {},
  };
}

/**
 * 属性上限极值：天下之理，水满则溢，月盈则亏。
 * 无论何时何地，主角及各项属性绝不可出现满值（100），其最高上限为95。
 */
export const MAX_STAT_LIMIT = 95;

/**
 * 年龄阶段属性生理承载上限 (Age-Stage Capacity Limit)
 * 幼童与成长阶段有其客观生理极限，绝不可出现幼童时期属性过高、背于常理的现象。
 */
export function getStatCapacityForAge(age: number): Record<keyof Attributes, number> {
  if (age <= 2) {
    // 襁褓幼婴 (0~2岁): 骨软神萌，牙牙学语，肢体尚不能奔走
    return { health: 18, intellect: 8, martial: 3, virtue: 12, wealth: 25, fortune: 65 };
  }
  if (age <= 6) {
    // 龆龀幼童 (3~6岁): 戏耍发蒙，学步奔走，心智初开
    return { health: 28, intellect: 18, martial: 10, virtue: 22, wealth: 35, fortune: 75 };
  }
  if (age <= 13) {
    // 总角成童 (7~13岁): 少年抽条，助耕拾柴，初晓大义
    return { health: 48, intellect: 42, martial: 32, virtue: 45, wealth: 50, fortune: 85 };
  }
  if (age <= 19) {
    // 及冠成丁 (14~19岁): 编入丁册，气力大成，能挽弓负犁
    return { health: 72, intellect: 68, martial: 62, virtue: 70, wealth: 75, fortune: 90 };
  }
  // 壮年及以后 (20岁以上): 可达凡人极致，但不可逾越 95
  return {
    health: MAX_STAT_LIMIT,
    intellect: MAX_STAT_LIMIT,
    martial: MAX_STAT_LIMIT,
    virtue: MAX_STAT_LIMIT,
    wealth: MAX_STAT_LIMIT,
    fortune: MAX_STAT_LIMIT,
  };
}

/**
 * 依据真实生理婴儿起点，生成公元184年刚出生的婴儿初始属性
 * 刚降生的婴儿必须符合常理：
 * - 体魄娇弱（8~12，极易受寒疾侵袭）；
 * - 识见微萌（1~3，仅感知双亲抚触与啼哭）；
 * - 勇略近无（0~1，骨软无法持物行步）；
 * - 仁厚纯真（2~5，赤子天然无邪）；
 * - 家财为家庭随身裹儿资粮（2~18，依出身微有差异）；
 * - 气数来自天命造化（35~52）。
 */
export function generateInitialAttributes(socialClass: SocialClass): Attributes {
  const base: Attributes = {
    health: 10 + Math.floor(Math.random() * 3) - 1, // 9 ~ 11
    intellect: 2,                                   // 2
    martial: Math.random() < 0.3 ? 1 : 0,           // 0 ~ 1
    virtue: 3 + Math.floor(Math.random() * 3),      // 3 ~ 5
    wealth: 3 + Math.floor(Math.random() * 3),      // 3 ~ 5
    fortune: 42 + Math.floor(Math.random() * 11) - 5, // 37 ~ 47
  };

  switch (socialClass) {
    case 'PEASANT':
      base.health += 1; // 农家微耐粗砺
      base.wealth = Math.max(2, base.wealth - 1);
      break;
    case 'TOWN_ARTISAN':
      base.wealth += 1;
      base.intellect += 1;
      break;
    case 'FISHER_BOATMAN':
      base.health += 1;
      break;
    case 'FRONTIER_ARMY':
      base.health += 2;
      base.martial = 1;
      break;
    case 'SCHOLAR_CLERK':
      base.intellect += 1;
      base.virtue += 2;
      base.wealth += 2;
      break;
    case 'MERCHANT':
      base.wealth += 5;
      base.intellect += 1;
      break;
    case 'NOBLE_GENTRY':
      base.wealth += 10;
      base.intellect += 1;
      base.virtue += 2;
      base.health += 1;
      base.fortune += 3;
      break;
  }

  // 严格杜绝幼童数值过高违背常理
  base.health = Math.max(7, Math.min(14, base.health));
  base.intellect = Math.max(1, Math.min(4, base.intellect));
  base.martial = Math.max(0, Math.min(2, base.martial));
  base.virtue = Math.max(2, Math.min(8, base.virtue));
  base.wealth = Math.max(2, Math.min(18, base.wealth));
  base.fortune = Math.max(30, Math.min(55, base.fortune));

  return base;
}

/**
 * 计算平缓递减的有效属性变动，防止暴增与数值膨胀：
 * 1. 幼童期大幅平抑；
 * 2. 高数值边际衰减；
 * 3. 严格受限于年龄承载上限与 MAX_STAT_LIMIT (95)。
 */
export function calculateEffectiveStatDelta(
  currentStats: Attributes,
  rawDelta: Partial<Record<keyof Attributes, number>>,
  age: number
): Partial<Record<keyof Attributes, number>> {
  const effective: Partial<Record<keyof Attributes, number>> = {};
  const capacity = getStatCapacityForAge(age);

  for (const [keyStr, rawVal] of Object.entries(rawDelta)) {
    const key = keyStr as keyof Attributes;
    if (rawVal === undefined || rawVal === 0) continue;

    if (rawVal < 0) {
      // 减损直接生效，但保持下限为0（体魄由后续判定处理）
      effective[key] = rawVal;
      continue;
    }

    const cur = currentStats[key] ?? 0;
    const cap = capacity[key] ?? MAX_STAT_LIMIT;

    // 若已达当前年龄承载上限或全局极值上限（95），绝不再增加，永不满值
    if (cur >= cap || cur >= MAX_STAT_LIMIT) {
      effective[key] = 0;
      continue;
    }

    // 1. 年龄阶梯增益衰减 (幼童时期绝无可能单次获得名将级爆发增长)
    let scaledGain = rawVal;
    if (age <= 2) {
      scaledGain = Math.min(1, Math.max(1, Math.round(rawVal * 0.25)));
    } else if (age <= 6) {
      scaledGain = Math.min(2, Math.max(1, Math.round(rawVal * 0.4)));
    } else if (age <= 13) {
      scaledGain = Math.min(3, Math.max(1, Math.round(rawVal * 0.6)));
    } else {
      if (scaledGain > 5) {
        scaledGain = 3 + Math.round((scaledGain - 5) * 0.4);
      }
    }

    // 2. 边际递减效应 (越接近高值，精进越艰难)
    let dimFactor = 1.0;
    if (cur >= 85) {
      dimFactor = 0.15;
    } else if (cur >= 70) {
      dimFactor = 0.35;
    } else if (cur >= 55) {
      dimFactor = 0.60;
    } else if (cur >= 40) {
      dimFactor = 0.80;
    }

    let finalGain = Math.round(scaledGain * dimFactor);
    if (finalGain === 0 && scaledGain > 0 && cur < cap) {
      // 适度保底1点以保留游戏反馈
      finalGain = 1;
    }

    // 3. 严格受限于年龄承载上限与 MAX_STAT_LIMIT (95)
    const availableRoom = Math.max(0, Math.min(cap, MAX_STAT_LIMIT) - cur);
    effective[key] = Math.min(finalGain, availableRoom);
  }

  return effective;
}

/**
 * 将属性变更安全施加于当前状态，严格保证绝不超上限且符合生理规律
 */
export function applyStatsWithLimits(
  currentStats: Attributes,
  delta: Partial<Record<keyof Attributes, number>>,
  age: number
): Attributes {
  const effectiveDelta = calculateEffectiveStatDelta(currentStats, delta, age);
  const next: Attributes = { ...currentStats };
  const capacity = getStatCapacityForAge(age);

  for (const key of Object.keys(next) as (keyof Attributes)[]) {
    const change = effectiveDelta[key] || 0;
    let newVal = next[key] + change;
    const maxAllowed = Math.min(MAX_STAT_LIMIT, capacity[key]);
    newVal = Math.max(0, Math.min(maxAllowed, newVal));
    next[key] = newVal;
  }

  return next;
}

/**
 * 获取当前年龄对应的生理成长与衰老阶段
 */
export function getPhysiologicalStage(age: number): PhysiologicalStage {
  if (age <= 2) {
    return {
      stageKey: 'INFANT',
      stageName: '襁褓幼婴',
      tag: '骨软神萌',
      description: '初临乱世，襁褓骨弱，易染风热，全赖母乳温汤悉心护持。',
      ageRange: '0~2岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'DORMANT' },
    };
  }
  if (age <= 6) {
    return {
      stageKey: 'CHILD',
      stageName: '龆龀幼童',
      tag: '戏耍发蒙',
      description: '学步奔走，在田垄水洼捉虫嬉戏，识人辨物，筋骨日健。',
      ageRange: '3~6岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'GROWING' },
    };
  }
  if (age <= 13) {
    return {
      stageKey: 'YOUTH',
      stageName: '总角成童',
      tag: '拔节抽条',
      description: '少年长成，拔节拔高，帮衬家计放牛拾柴，初晓是非大义。',
      ageRange: '7~13岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'GROWING' },
    };
  }
  if (age <= 19) {
    return {
      stageKey: 'ADULT',
      stageName: '及冠成丁',
      tag: '气力大成',
      description: '束发成丁，编入官府丁册。能荷重犁挽硬弓，自立生计以养家。',
      ageRange: '14~19岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'GROWING' },
    };
  }
  if (age <= 35) {
    return {
      stageKey: 'PRIME',
      stageName: '弱冠壮盛',
      tag: '鼎盛春秋',
      description: '气血方刚，体力武略正值人生峰顶。生儿育女，奋力拼搏安家。',
      ageRange: '20~35岁',
      growthTrend: { health: 'PEAK', intellect: 'GROWING', martial: 'PEAK' },
    };
  }
  if (age <= 50) {
    return {
      stageKey: 'MIDDLE',
      stageName: '不惑知命',
      tag: '沉潜厚重',
      description: '筋骨渐定，世事洞明。处事老练持重，受后生敬仰，家资沉淀。',
      ageRange: '36~50岁',
      growthTrend: { health: 'PEAK', intellect: 'PEAK', martial: 'DECLINING' },
    };
  }
  if (age <= 65) {
    return {
      stageKey: 'ELDER',
      stageName: '花甲耳顺',
      tag: '气血渐衰',
      description: '两鬓苍苍，自然衰老。气力难挽强弓，而德厚名重，尊为乡老。',
      ageRange: '51~65岁',
      growthTrend: { health: 'DECLINING', intellect: 'STABLE', martial: 'DECLINING' },
    };
  }
  return {
    stageKey: 'VENERABLE',
    stageName: '古稀耄耋',
    tag: '桑榆暮年',
    description: '见汉家四百年倾覆与天下三分，寿考人瑞。听天安命，子孙绕膝。',
    ageRange: '66岁以上',
    growthTrend: { health: 'DECLINING_FAST', intellect: 'STABLE', martial: 'DECLINING_FAST' },
  };
}

export interface NaturalChangeResult {
  delta: Partial<Record<keyof Attributes, number>>;
  stage: PhysiologicalStage;
  naturalNote?: string;
}

/**
 * 随生理年龄与四季自然更迭的生理成长与衰老动力学系统
 * 严格调整流转节奏：
 * - 避免四季每一季均暴增数值；
 * - 生长主要循着孟春阳和生发与秋收沉淀缓慢推进；
 * - 绝不在幼童阶段产生非人超常数值。
 */
export function calculateNaturalPhysiologicalChange(
  age: number,
  season: SeasonIndex,
  currentStats: Attributes
): NaturalChangeResult {
  const stage = getPhysiologicalStage(age);
  const delta: Partial<Record<keyof Attributes, number>> = {};
  let naturalNote: string | undefined = undefined;

  // 1. 襁褓期 (0~2岁) - 婴儿自然温养，极其娇弱缓慢
  if (stage.stageKey === 'INFANT') {
    if (season === 0) {
      delta.health = 1;
      naturalNote = '【生理生发】孟春阳和，襁褓温养，骨肉微丰。体魄+1。';
    } else if (season === 2) {
      delta.intellect = 1;
      naturalNote = '【心智微萌】识得双亲慈容，咿呀学语。识见+1。';
    } else if (season === 3) {
      if (currentStats.wealth < 4) {
        delta.health = -1;
        naturalNote = '【生理风寒】岁暮苦寒屋漏，受了些许风霜。体魄-1。';
      }
    }
  }
  // 2. 幼童期 (3~6岁) - 奔跑跳跃、学步识物，平缓发蒙
  else if (stage.stageKey === 'CHILD') {
    if (season === 0) {
      delta.health = 1;
      naturalNote = '【自然拔节】春日田埂嬉玩，筋骨渐韧。体魄+1。';
    } else if (season === 1) {
      delta.intellect = 1;
      naturalNote = '【心智发蒙】学认鸟兽草木，言语清晰。识见+1。';
    } else if (season === 2) {
      delta.martial = 1;
      naturalNote = '【跑跳玩闹】追逐鸡犬捉蜻蜓，腿脚利落。勇略+1。';
    } else if (season === 3) {
      delta.virtue = 1;
      naturalNote = '【童心纯良】帮父母做些轻快家务，受邻人夸赞。仁厚+1。';
    }
  }
  // 3. 成童总角期 (7~13岁) - 少年抽条拔节，按年逐步长成
  else if (stage.stageKey === 'YOUTH') {
    if (season === 0) {
      delta.health = 1;
      delta.martial = 1;
      naturalNote = '【骨骼抽条】春耕放牛拾柴，身形抽条拔节。体魄+1，勇略+1。';
    } else if (season === 1) {
      delta.martial = 1;
      naturalNote = '【少年筋骨】下河泅水摸鱼，体格黝黑健朗。勇略+1。';
    } else if (season === 2) {
      delta.intellect = 1;
      delta.wealth = 1;
      naturalNote = '【帮衬家计】分担秋收稼穑，初知柴米艰辛。识见+1，家资+1。';
    } else if (season === 3) {
      delta.virtue = 1;
      naturalNote = '【知晓孝悌】冬日敬奉长辈，初晓乡邻人情。仁厚+1。';
    }
  }
  // 4. 及冠成丁期 (14~19岁) - 筋骨定型自立养家
  else if (stage.stageKey === 'ADULT') {
    if (season === 0) {
      delta.health = 1;
      delta.martial = 1;
      naturalNote = '【束发成丁】束发成丁编入赋籍，力能挽弓扶犁。体魄+1，勇略+1。';
    } else if (season === 2) {
      delta.intellect = 1;
      delta.wealth = 1;
      naturalNote = '【自立谋生】秋收营生有度，在乡里立身自足。识见+1，家资+1。';
    } else if (season === 3) {
      delta.virtue = 1;
      naturalNote = '【立身扬名】处事沉稳守分，受乡邻称道。仁厚+1。';
    }
  }
  // 5. 弱冠壮盛期 (20~35岁) - 人生鼎盛黄金巅峰，属性平稳
  else if (stage.stageKey === 'PRIME') {
    if (season === 0 && currentStats.health < 65) {
      delta.health = 1;
      naturalNote = '【盛年气血】春回大地，气血调达。体魄+1。';
    } else if (season === 2 && currentStats.wealth < 70) {
      delta.wealth = 1;
      naturalNote = '【壮岁立业】年富力强，田园营生有度。家资+1。';
    }
  }
  // 6. 不惑知命期 (36~50岁) - 识见登峰，体力平稳微沉
  else if (stage.stageKey === 'MIDDLE') {
    if (season === 0 && currentStats.intellect < 80) {
      delta.intellect = 1;
      naturalNote = '【沉潜睿智】历尽世事沧桑，洞悉人事机微。识见+1。';
    } else if (season === 1 && currentStats.martial > 55) {
      delta.martial = -1;
      naturalNote = '【旧伤微显】气力不及初冠之时，骨节偶感酸楚。勇略-1。';
    } else if (season === 2) {
      delta.virtue = 1;
      naturalNote = '【德隆望重】处事持重端正，渐成乡党主心骨。仁厚+1。';
    } else if (season === 3 && currentStats.health > 70) {
      delta.health = -1;
    }
  }
  // 7. 花甲耳顺期 (51~65岁) - 自然平缓衰老
  else if (stage.stageKey === 'ELDER') {
    if (season === 0) {
      delta.virtue = 1;
      naturalNote = '【耆老尊长】年届花甲，晚生后辈皆尊为长者。仁厚+1。';
    } else if (season === 1) {
      delta.martial = -1;
      naturalNote = '【气力稍逊】步履渐缓，难挽硬弓重兵。勇略-1。';
    } else if (season === 2) {
      delta.health = -1;
      naturalNote = '【筋骨渐衰】秋风萧瑟，步履微迟。体魄-1。';
    } else if (season === 3) {
      delta.health = -1;
      naturalNote = '【岁暮畏寒】大雪天寒，围炉避冻。体魄-1。';
    }
  }
  // 8. 古稀耄耋期 (66岁以上) - 暮景祥瑞，听天由命
  else {
    if (season === 0) {
      delta.virtue = 1;
      delta.fortune = 1;
      naturalNote = '【乱世人瑞】历经两甲子乱世而得享古稀，被奉为祥瑞长者。仁厚+1，气数+1。';
    } else if (season === 1) {
      delta.martial = -1;
      naturalNote = '【筋力消退】耳目渐花，行动需人搀扶。勇略-1。';
    } else if (season === 2) {
      delta.health = -1;
      naturalNote = '【秋凉畏冷】气血渐衰，卧榻歇息。体魄-1。';
    } else if (season === 3) {
      delta.health = -1;
      naturalNote = '【风雪残年】朔风彻骨，子孙端奉热汤。体魄-1。';
    }
  }

  return { delta, stage, naturalNote };
}

export function getLunarYearName(year: number): string {
  const lunarMap: Record<number, string> = {
    184: '中平元年 · 甲子',
    185: '中平二年 · 乙丑',
    186: '中平三年 · 丙寅',
    187: '中平四年 · 丁卯',
    188: '中平五年 · 戊辰',
    189: '中平六年 / 光熹元年 · 己巳',
    190: '初平元年 · 庚午',
    191: '初平二年 · 辛未',
    192: '初平三年 · 壬申',
    193: '初平四年 · 癸酉',
    194: '兴平元年 · 甲戌',
    195: '兴平二年 · 乙亥',
    196: '建安元年 · 丙子',
    197: '建安二年 · 丁丑',
    198: '建安三年 · 戊寅',
    199: '建安四年 · 己卯',
    200: '建安五年 · 庚辰',
    201: '建安六年 · 辛巳',
    202: '建安七年 · 壬午',
    203: '建安八年 · 癸未',
    204: '建安九年 · 甲申',
    205: '建安十年 · 乙酉',
    206: '建安十一年 · 丙戌',
    207: '建安十二年 · 丁亥',
    208: '建安十三年 · 戊子',
    209: '建安十四年 · 己丑',
    210: '建安十五年 · 庚寅',
    211: '建安十六年 · 辛卯',
    212: '建安十七年 · 壬辰',
    213: '建安十八年 · 癸巳',
    214: '建安十九年 · 甲午',
    215: '建安二十年 · 乙未',
    216: '建安二十一年 · 丙申',
    217: '建安二十二年 · 丁酉',
    218: '建安二十三年 · 戊戌',
    219: '建安二十四年 · 己亥',
    220: '延康元年 / 黄初元年 · 庚子',
    221: '章武元年 / 黄初二年 · 辛丑',
    222: '章武二年 / 黄武元年 · 壬寅',
    223: '建兴元年 / 黄初四年 · 癸卯',
    228: '建兴六年 / 太和二年 · 戊申',
    234: '建兴十二年 / 青龙二年 · 甲寅',
    249: '正始十年 / 嘉平元年 · 己巳',
  };
  return lunarMap[year] || `公元${year}年`;
}

/**
 * Seasonal Macro Three Kingdoms Historical Database
 */
const SEASONAL_MACRO_EVENTS: Record<string, string> = {
  // 184 Yellow Turban Rebellion
  '184-0': '巨鹿张角传道十载，门徒唐周洛阳首告，大将军何进搜捕马元义斩于洛阳。张角星夜飞敕三十六方提前反汉，三十余万众同日举事，海内震动。',
  '184-1': '四月皇甫嵩、朱儁兵发颍川讨黄巾，波才败朱儁并围皇甫嵩于长社。五月长社大风，皇甫嵩夜半纵火，曹操引飞骑夹击，大破黄巾贼数万。',
  '184-2': '北中郎将卢植围张角于广宗。中常侍左丰索贿未遂诬奏卢植，槛车征卢植下狱。朝廷改派董卓代领，董卓兵败。八月张角病殁于广宗。',
  '184-3': '皇甫嵩接掌北军，十月夜袭广宗斩张梁，十一月斩张宝于曲阳，筑京观于城西。主力略平，然黑山、白波诸盗四起，天下凋敝。',

  // 189 Dong Zhuo Enter Capital
  '189-0': '汉灵帝病笃于洛阳南宫嘉德殿。蹇硕欲谋杀何进未果，大将军何进掌握禁军，两宫宿卫甲兵森严。',
  '189-1': '四月灵帝驾崩，皇子辩即位为少帝。何进与袁绍密谋诛灭中官，何太后不许，何进阴召西凉刺史董卓引兵逼京。',
  '189-2': '八月何进伏诛于长乐宫，袁绍袁术引禁军尽杀宦官二千人，宫室大火。董卓率三千西凉飞熊铁骑趁夜入洛阳，并吞何进部曲。',
  '189-3': '董卓专权，废少帝封弘农王，立九岁陈留王为汉献帝。夜宿龙床，鸩杀何太后，毒杀弘农王，西凉兵劫掠洛阳士庶。',

  // 190 Coalition against Dong
  '190-0': '关东州郡起兵讨董，袁绍为盟主，曹操、孙坚等十八路诸侯歃血结盟，分屯酸枣、河内。董卓部将华雄迎战诸侯。',
  '190-1': '二月董卓惧关东兵锋，纵火焚烧洛阳两百里宫阙陵墓，悉发数百万百姓西迁长安，老弱相践踏于道，号泣震天。',
  '190-2': '诸侯进军迟疑，唯曹操引兵西追，于荥阳汴水遇董卓大将徐荣伏击，兵败中箭，为曹洪让马救脱。酸枣大营日日高会置酒，貌合神离。',
  '190-3': '孙坚率江东孤军破梁县斩华雄，率先收复洛阳废墟，扫除汉家宗庙，于建章殿残井中得传国玉玺。',

  // 192 Lu Bu kills Dong Zhuo & Chang'an Chaos
  '192-0': '孙坚跨江攻刘表，于岘山被黄祖部将流矢射杀。袁术与袁绍兄弟反目，天下诸侯各起兵吞并。',
  '192-1': '四月司徒王允与吕布设连环计，在未央宫斩杀董卓，弃尸于市，万民点灯相庆。贾诩献策于李傕郭汜，凉州大军反扑长安。',
  '192-2': '六月李傕郭汜破长安，杀王允，吕布东奔。凉州乱兵纵火劫掠公卿百官，关中大饥，死者数十万，白骨蔽野，人相食。',
  '192-3': '曹操在兖州收编青州百万黄巾余部，择其精锐号为“青州兵”，威镇中原。',

  // 193-194 Cao Cao conquest of Xuzhou & Yan famine
  '193-2': '曹操因父曹嵩遇害于徐州，引大军大举东征陶谦，攻拔十余城，坑杀男女数十万人于泗水，泗水为之断流，鸡犬亦尽。',
  '194-1': '陈宫、张邈反曹操，迎吕布袭据兖州，曹操仅余甄城、范县、东阿三县。夏秋飞蝗蔽天，食草木叶俱尽，中原人相食。',
  '194-3': '陶谦病笃，临终三让徐州于平原相刘备，刘备领徐州牧。',

  // 196 Emperor to Xuchang
  '196-2': '汉献帝历尽千辛万苦自长安乱军中东归洛阳，宫室尽毁，百官食野草。曹操依荀彧“奉天子以从民望”之计，亲引大军迎驾迁都许县。',
  '196-3': '曹操颁布“屯田令”，召集流民耕种许昌荒田，农官分岁收，数年中公私丰足，中原军民免于饥馑。',

  // 198 Fall of Lu Bu
  '198-3': '曹操围吕布于下邳，决泗水、沂水灌城月余。部将宋宪魏续缚陈宫降曹，吕布白门楼受缢。张辽降曹，徐州底定。',

  // 200 Battle of Guandu
  '200-0': '董承等衣带诏事泄被族诛。曹操亲征刘备，刘备奔邺城投袁绍，关羽下邳被围，为保二嫂暂降曹操。',
  '200-1': '白马之战，关羽策赤兔马冲阵，斩颜良于万众之中；延津之战曹操以诱饵计阵斩文丑。关羽挂印封金，千里走单骑寻刘备。',
  '200-2': '八月袁绍进逼官渡，筑土楼俯射曹营，曹军造发石霹雳车摧毁敌楼。两军堑壕相持，曹军粮少兵疲，危在旦夕。',
  '200-3': '十月袁绍谋士许攸叛降，曹操跣足相迎。曹操亲引五千精骑夜袭乌巢，放火焚尽万车军粮。袁军十万土崩瓦解，河北霸业尽付尘土。',

  // 208 Red Cliffs
  '208-2': '秋七月曹操引兵大举南征荆州，八月刘表卒，九月刘琮降曹。刘备携十万襄樊百姓南渡汉水，赵云当阳单骑救幼主，张飞断后当阳桥。',
  '208-3': '冬十一月孙刘联军定苦肉计、借东风。黄盖引二十艘蒙冲火船突撞曹军水寨，长江烈焰八百里，曹操溃败华容道，天下三分之势成型。',

  // 214 Liu Bei enters Chengdu
  '214-1': '庞统落凤坡阵亡，诸葛亮、张飞、赵云溯江西进。刘备大军合围成都数十日，刘璋开门降汉，刘备自此据有益州天府之国。',

  // 217 Jian'an Great Epidemic
  '217-3': '建安二十二年冬，中原伤寒大疫暴发，家家有僵尸之痛，室室有号泣之哀。建安七子中徐干、陈琳、应玚、刘桢同卒于疫。',

  // 219 Guan Yu flood & Fall of Jingzhou
  '219-2': '秋八月霖雨暴溢，关羽水淹于禁七军，擒于禁，斩庞德，降卒三万，威震华夏，曹操欲迁都避其锋芒。',
  '219-3': '冬十月孙权使吕蒙身着白衣伪装商船偷袭荆州，糜芳傅士仁降吴。关羽回师被断，败走麦城突围中伏遇害。',

  // 220 Han Dynasty Ends
  '220-0': '正月魏王曹操卒于洛阳，享年六十六岁。曹丕嗣位为魏王丞相。',
  '220-3': '冬十月汉献帝于繁阳受禅台禅位，曹丕即位皇帝，改国号为魏，黄初改元。四百年大汉天下正式告终。',

  // 222 Battle of Yiling
  '222-1': '章武二年盛夏，刘备伐吴连营七百里。吴大都督陆逊坚壁清野，夜半顺风纵火，蜀汉大军瓦解，先主败退白帝城。',

  // 223 Liu Bei passes at Baidi
  '223-0': '夏四月汉昭烈帝刘备病笃于永安宫，召丞相诸葛亮托孤：“君才十倍曹丕，必能安国，若嗣子可辅，辅之；如其不才，君可自取。”',

  // 228 Zhuge Liang Northern Expedition
  '228-0': '建兴六年春，诸葛亮上一出师表率军出祁山，天水姜维归汉。张郃拔街亭，马谡违节失道，孔明拔西县民还汉中，挥泪斩马谡。',

  // 234 Wuzhang Plains
  '234-2': '秋八月，诸葛亮第五次北伐相持于五丈原百余日，积劳成疾。陨星如斗坠于蜀营，武乡侯病殁五丈原，蜀军从容退回汉中。',

  // 249 Gaoping Tomb Incident
  '249-0': '正月初六，魏少帝曹芳谒高平陵，大将军曹爽兄弟皆从。太傅司马懿称病发难，闭洛阳城门指洛水为誓，旋即夷曹爽三族，魏柄尽归司马。',
};

export function getSeasonalEvent(
  year: number,
  season: SeasonIndex,
  age: number,
  profile: PersonProfile,
  stats: Attributes
): SeasonalEvent {
  return querySeasonalEventFromTable({
    year,
    season,
    age,
    profile,
    stats,
  });
}

export function generateRealisticEnding(
  profile: PersonProfile,
  stats: Attributes,
  deathAge: number,
  deathYear: number,
  deathReason?: string
): RealisticEnding {
  const province = PROVINCES.find((p) => p.id === profile.currentProvince) || PROVINCES[0];

  if (deathAge <= 3) {
    return {
      title: `${profile.county}殇子 · 享年${deathAge}岁`,
      epitaphTitle: '中平襁褓孤魂',
      summary: `生于公元184年汉季大乱之始，殁于公元${deathYear}年。因${deathReason || '寒冬恶疾'}夭折于襁褓。母亲将其葬于村后老榆树下，岁岁清明以野花为祭。`,
      historianNote: '汉季大乱，户口减耗十之八九。襁褓之殇，不绝于道，斯民之苦，何其极也！',
      tier: 'TRAGIC',
    };
  }

  if (deathReason && (deathReason.includes('阵亡') || deathReason.includes('战死') || deathReason.includes('就义') || deathReason.includes('矢石') || deathReason.includes('乌巢'))) {
    const isWuchao = deathReason.includes('乌巢') || deathReason.includes('官渡');
    const isJustMartyr = deathReason.includes('就义') || deathReason.includes('不降');
    return {
      title: isWuchao
        ? `${profile.county}阵亡将士 · 享年${deathAge}岁`
        : isJustMartyr
        ? `${profile.county}不屈忠烈 · 享年${deathAge}岁`
        : `${profile.county}随军戍卒 · 享年${deathAge}岁`,
      epitaphTitle: isWuchao
        ? '官渡烈火 · 残甲浩气'
        : isJustMartyr
        ? '慷慨就义 · 气节凛然'
        : '乱世白骨 · 沙场裹尸',
      summary: `从军入伍，转战中原，于公元${deathYear}年${deathReason}。死时怀中尚揣着一包未寄出的故乡泥土与母亲缝制的旧布鞋底。生平虽短，其气魄与忠烈令后人唏嘘。`,
      historianNote: isJustMartyr
        ? '宁死不失大节，杀身以成仁。汉末草芥之躯，亦有千秋烈士之风骨！'
        : '可怜无定河边骨，犹是春闺梦里人。横槊之雄今安在，枯骨荒草伴残阳。',
      tier: 'TRAGIC',
    };
  }

  if (deathAge < 30) {
    return {
      title: `${profile.county}短折良民 · 享年${deathAge}岁`,
      epitaphTitle: '荒岁悲歌',
      summary: `勤劳朴实，孝悌著于里闾。然兵灾疫病无常，于公元${deathYear}年因${deathReason || '疫病饥寒'}离世。乡邻合力将其殡葬。`,
      historianNote: '天地不仁，以万物为刍狗。在东汉建安的巨浪之下，一个普通生灵的陨落，悄无声息。',
      tier: 'COMMON',
    };
  }

  if (deathAge >= 60) {
    return {
      title: `${profile.county}寿考耆宿 · 享年${deathAge}岁`,
      epitaphTitle: '乱世人瑞 · 乡党长者',
      summary: `生于公元184年黄巾初起之时，历经董卓乱政、官渡赤壁与天下鼎分。一介布衣，凭勤勉谨慎与仁德保全一家老小。殁于公元${deathYear}年，子孙满堂，寿终正寝。`,
      historianNote: '大乱之世，公以匹夫之身全生保家，寿越花甲，见三国盛衰，其坚韧胜过万乘之尊！',
      tier: 'RESILIENT',
    };
  }

  if (stats.wealth >= 65) {
    return {
      title: `${province.provinceName}丰家业户 · 享年${deathAge}岁`,
      epitaphTitle: '守业勤民',
      summary: `以市井小本或农桑起家，积攒田地屋舍数处。兵荒马乱之际常借粮救济饥民，善名远播，安然长逝于自家榻上。`,
      historianNote: '不为王侯驱驰，自守一亩三分。输财济邻，虽无青史功名，而乡民永怀其德。',
      tier: 'RESILIENT',
    };
  }

  return {
    title: `${profile.county}田舍耕夫 · 享年${deathAge}岁`,
    epitaphTitle: '汉末平凡春秋',
    summary: `生于汉季，耕于乡野。一辈子没有见过天子与曹刘名将，只识春耕夏耘、秋收冬藏。在战火波及的缝隙里，顽强地活过了${deathAge}个春秋，给后代留下了熟田瓦舍。`,
    historianNote: '太史公书多记将相王侯，然支撑这万里山河与四百年汉家天下的，正是无数如他这般默默耕耘的无名草木。',
    tier: 'COMMON',
  };
}
