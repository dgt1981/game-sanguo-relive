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
  { name: '春', fullName: '春季', months: '1~3月', solarTerm: '立春 · 清明', color: '#4ade80' },
  { name: '夏', fullName: '夏季', months: '4~6月', solarTerm: '立夏 · 夏至', color: '#f87171' },
  { name: '秋', fullName: '秋季', months: '7~9月', solarTerm: '立秋 · 霜降', color: '#fbbf24' },
  { name: '冬', fullName: '冬季', months: '10~12月', solarTerm: '立冬 · 岁末', color: '#38bdf8' },
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
    occupation: '吃奶娃娃',
    fatherName: `${surname}老汉`,
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
      stageName: '婴儿期',
      tag: '牙牙学语',
      description: '刚来到乱世，身子骨还软得很，全靠爹娘一口米汤一口奶把你拉扯大。',
      ageRange: '0~2岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'DORMANT' },
    };
  }
  if (age <= 6) {
    return {
      stageKey: 'CHILD',
      stageName: '幼儿期',
      tag: '到处撒欢',
      description: '学会了满地乱跑，在泥坑里玩泥巴抓小虫，慢慢能听懂大人的话了。',
      ageRange: '3~6岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'GROWING' },
    };
  }
  if (age <= 13) {
    return {
      stageKey: 'YOUTH',
      stageName: '少年期',
      tag: '个头猛蹿',
      description: '个头蹿得飞快，开始懂事了，帮家里放牛割草捡柴火，分担家务。',
      ageRange: '7~13岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'GROWING' },
    };
  }
  if (age <= 19) {
    return {
      stageKey: 'ADULT',
      stageName: '青年期',
      tag: '独当一面',
      description: '长成结实的大小伙/大姑娘了，力气变大，能干重活，开始自力更生。',
      ageRange: '14~19岁',
      growthTrend: { health: 'GROWING', intellect: 'GROWING', martial: 'GROWING' },
    };
  }
  if (age <= 35) {
    return {
      stageKey: 'PRIME',
      stageName: '壮年期',
      tag: '身强力壮',
      description: '人生最好的年纪，有使不完的劲儿，成家立业，为了过上好日子拼命干。',
      ageRange: '20~35岁',
      growthTrend: { health: 'PEAK', intellect: 'GROWING', martial: 'PEAK' },
    };
  }
  if (age <= 50) {
    return {
      stageKey: 'MIDDLE',
      stageName: '中年期',
      tag: '成熟稳重',
      description: '人情世故全摸透了，处事沉稳，受村里后生晚辈的尊重，手里也有了点积蓄。',
      ageRange: '36~50岁',
      growthTrend: { health: 'PEAK', intellect: 'PEAK', martial: 'DECLINING' },
    };
  }
  if (age <= 65) {
    return {
      stageKey: 'ELDER',
      stageName: '老年期',
      tag: '白发渐生',
      description: '头发花白，身子骨不如从前硬朗了，拉不动硬弓，成了村里的老长辈。',
      ageRange: '51~65岁',
      growthTrend: { health: 'DECLINING', intellect: 'STABLE', martial: 'DECLINING' },
    };
  }
  return {
    stageKey: 'VENERABLE',
    stageName: '高寿暮年',
    tag: '见惯风浪',
    description: '活过了一辈子大风大浪，见证了天下分分合合，儿孙绕膝，听天由命。',
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
 */
export function calculateNaturalPhysiologicalChange(
  age: number,
  season: SeasonIndex,
  currentStats: Attributes
): NaturalChangeResult {
  const stage = getPhysiologicalStage(age);
  const delta: Partial<Record<keyof Attributes, number>> = {};
  let naturalNote: string | undefined = undefined;

  // 1. 婴儿期 (0~2岁)
  if (stage.stageKey === 'INFANT') {
    if (season === 0) {
      delta.health = 1;
      naturalNote = '【慢慢长个】春天天气暖和了，被窝里温温热热，你长胖了一点。体魄+1。';
    } else if (season === 2) {
      delta.intellect = 1;
      naturalNote = '【学会认人】认得爹娘的脸了，嘴里开始咿呀学语。识见+1。';
    } else if (season === 3) {
      if (currentStats.wealth < 4) {
        delta.health = -1;
        naturalNote = '【着凉感冒】大冬天屋里漏风又缺柴火，受了点风寒流鼻涕。体魄-1。';
      }
    }
  }
  // 2. 幼儿期 (3~6岁)
  else if (stage.stageKey === 'CHILD') {
    if (season === 0) {
      delta.health = 1;
      naturalNote = '【春天撒欢】在田埂上跑来跑去，手脚越来越利索了。体魄+1。';
    } else if (season === 1) {
      delta.intellect = 1;
      naturalNote = '【聪明懂事】开始认识身边的花鸟虫草，说话也利索了。识见+1。';
    } else if (season === 2) {
      delta.martial = 1;
      naturalNote = '【追鸡逗狗】追着院里的小鸡小狗到处跑，动作挺敏捷。勇略+1。';
    } else if (season === 3) {
      delta.virtue = 1;
      naturalNote = '【乖巧懂事】主动帮爹娘干点轻快活，街坊邻居都夸乖。仁厚+1。';
    }
  }
  // 3. 少年期 (7~13岁)
  else if (stage.stageKey === 'YOUTH') {
    if (season === 0) {
      delta.health = 1;
      delta.martial = 1;
      naturalNote = '【个头猛蹿】开春帮着放牛割草，个子蹿高了一截，越来越结实。体魄+1，勇略+1。';
    } else if (season === 1) {
      delta.martial = 1;
      naturalNote = '【下河摸鱼】夏天跳进河里游泳摸鱼，晒出一身黝黑皮肉。勇略+1。';
    } else if (season === 2) {
      delta.intellect = 1;
      delta.wealth = 1;
      naturalNote = '【帮衬家里】帮着家里秋收搬粮食，体会到了柴米油盐不容易。识见+1，家资+1。';
    } else if (season === 3) {
      delta.virtue = 1;
      naturalNote = '【孝顺长辈】大冬天给爹娘暖被窝倒热水，懂得体贴人了。仁厚+1。';
    }
  }
  // 4. 青年期 (14~19岁)
  else if (stage.stageKey === 'ADULT') {
    if (season === 0) {
      delta.health = 1;
      delta.martial = 1;
      naturalNote = '【成大小伙】力气大增，能下地扶犁干重农活了。体魄+1，勇略+1。';
    } else if (season === 2) {
      delta.intellect = 1;
      delta.wealth = 1;
      naturalNote = '【自力更生】秋天干零工赚了点铜钱，能自己养活自己了。识见+1，家资+1。';
    } else if (season === 3) {
      delta.virtue = 1;
      naturalNote = '【讲信守义】帮邻里修屋扫雪，在村里落了个好名声。仁厚+1。';
    }
  }
  // 5. 壮年期 (20~35岁)
  else if (stage.stageKey === 'PRIME') {
    if (season === 0 && currentStats.health < 65) {
      delta.health = 1;
      naturalNote = '【身强体壮】春天万物复苏，身上有使不完的力气。体魄+1。';
    } else if (season === 2 && currentStats.wealth < 70) {
      delta.wealth = 1;
      naturalNote = '【勤劳致富】年轻肯吃苦，秋收后家里存粮多了不少。家资+1。';
    }
  }
  // 6. 中年期 (36~50岁)
  else if (stage.stageKey === 'MIDDLE') {
    if (season === 0 && currentStats.intellect < 80) {
      delta.intellect = 1;
      naturalNote = '【见多识广】人到中年，各种人情世故全看透了。识见+1。';
    } else if (season === 1 && currentStats.martial > 55) {
      delta.martial = -1;
      naturalNote = '【体力下降】力气不如小伙子那会儿了，腰腿偶尔发酸。勇略-1。';
    } else if (season === 2) {
      delta.virtue = 1;
      naturalNote = '【德高望重】办事公道稳重，成了村里主心骨。仁厚+1。';
    } else if (season === 3 && currentStats.health > 70) {
      delta.health = -1;
    }
  }
  // 7. 老年期 (51~65岁)
  else if (stage.stageKey === 'ELDER') {
    if (season === 0) {
      delta.virtue = 1;
      naturalNote = '【受人尊敬】年过半百，村里后生晚辈见到都客客气气打招呼。仁厚+1。';
    } else if (season === 1) {
      delta.martial = -1;
      naturalNote = '【腿脚变慢】走路没年轻时快了，拿不动太重的东西。勇略-1。';
    } else if (season === 2) {
      delta.health = -1;
      naturalNote = '【秋凉畏冷】秋风一吹身上有点发虚，容易咳嗽。体魄-1。';
    } else if (season === 3) {
      delta.health = -1;
      naturalNote = '【冬天猫冬】大雪天怕冷，大部分时间缩在屋里烤火。体魄-1。';
    }
  }
  // 8. 高寿暮年 (66岁以上)
  else {
    if (season === 0) {
      delta.virtue = 1;
      delta.fortune = 1;
      naturalNote = '【村里老寿星】乱世里活过花甲古稀，全村都把你当成有福气的老宝贝。仁厚+1，气数+1。';
    } else if (season === 1) {
      delta.martial = -1;
      naturalNote = '【行动迟缓】眼神有些花了，走远路需要拐杖或儿孙搀扶。勇略-1。';
    } else if (season === 2) {
      delta.health = -1;
      naturalNote = '【年老体衰】年纪大了，吃得少睡得多，多在榻上歇息。体魄-1。';
    } else if (season === 3) {
      delta.health = -1;
      naturalNote = '【安享晚年】风雪漫天，儿孙端来热汤饭伺候在床前。体魄-1。';
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
export const SEASONAL_MACRO_EVENTS: Record<string, string> = {
  // 184 Yellow Turban
  '184-0': '巨鹿的张角创立太平道，三十多万人头裹黄巾同时起义造反，天下震动。朝廷大将军何进紧急搜捕叛党，各地官府乱成一团。',
  '184-1': '朝廷派皇甫嵩、朱儁带兵讨伐黄巾军，在长社被黄巾大将波才包围。皇甫嵩趁着夜半大风放火烧营，曹操率骑兵杀出，大破黄巾军。',
  '184-2': '朝廷大将卢植把张角围在广宗，却因没给宦官塞钱被诬陷打入死牢。朝廷改派董卓领兵却吃了败仗。八月张角在广宗病死。',
  '184-3': '皇甫嵩接管大军，攻破广宗和曲阳，杀掉了张角的弟弟张梁、张宝。黄巾主力虽然被打散，但各地小股叛军依然四处抢劫。',

  // 189 Dong Zhuo Enter Capital
  '189-0': '汉灵帝病重快不行了，宦官蹇硕想暗杀何进没成功。大将军何进调动禁军守住皇宫，洛阳城里剑拔弩张。',
  '189-1': '汉灵帝去世，少帝即位。大将军何进想彻底除掉宦官，太后不答应，何进便暗中招引西凉的董卓带大军进京逼宫。',
  '189-2': '宦官设伏杀了何进，袁绍、袁术兄弟立刻率兵杀进皇宫，诛杀了上千名宦官。董卓趁着混乱带三千西凉铁骑开进洛阳，接管了兵权。',
  '189-3': '董卓独揽大权，废掉少帝改立九岁的汉献帝，还毒死了太后。西凉兵在洛阳街头横行霸道，到处抢夺百姓钱财。',

  // 190 Coalition against Dong
  '190-0': '关东各州郡起兵讨伐董卓，推举袁绍当盟主，曹操、孙坚等十八路诸侯歃血为盟。董卓大将华雄带兵迎战诸侯联军。',
  '190-1': '董卓害怕诸侯联军，竟然放火烧毁了整个洛阳城，强行把几百万老百姓迁往长安，路上死伤踩踏无数，哭声震天。',
  '190-2': '关东诸侯天天在营地喝酒扯皮没人敢上，只有曹操带兵追击，结果在荥阳中了埋伏大败，曹洪让马才救出曹操一命。',
  '190-3': '孙坚带着江东部队猛冲猛打，斩杀了华雄，率先杀进烧成废墟的洛阳，在水井里意外打捞出了汉家的传国玉玺。',

  // 192 Lu Bu kills Dong Zhuo & Chang'an Chaos
  '192-0': '孙坚渡江攻打刘表，在岘山中了黄祖手下的冷箭阵亡。袁术和袁绍兄弟翻脸，天下各路诸侯开始互相攻打兼并。',
  '192-1': '王允和吕布暗中联手，在未央宫设计刺杀了董卓，百姓欢天喜地。随后贾诩给李傕、郭汜出主意，西凉大军反扑长安。',
  '192-2': '李傕、郭汜攻破长安，杀了王允，吕布被迫逃出关东。乱兵在长安四处洗劫，关中发生大饥荒，几十万人饿死。',
  '192-3': '曹操在兖州收服了百多万青州黄巾降兵，挑选其中的精壮汉子编成“青州兵”，在中原站稳了脚跟。',

  // 193-194 Cao Cao conquest of Xuzhou & Yan famine
  '193-2': '曹操因为父亲在徐州被杀，带大军大举进攻陶谦，一路攻城掠地，沿途百姓死伤无数，泗水河道都被尸体堵塞断流。',
  '194-1': '陈宫和张邈背叛曹操，迎请吕布偷袭夺走了兖州，曹操只剩三座县城。夏秋时分飞蝗遮天蔽日，把草木啃得精光，中原百姓断粮。',
  '194-3': '徐州陶谦病重快不行了，临终前三次劝说刘备接管徐州，刘备最终接下徐州大印成了徐州牧。',

  // 196 Emperor to Xuchang
  '196-2': '汉献帝历经千难万险从长安乱军中逃回洛阳，宫殿早已被烧毁，百官只能吃野草度日。曹操听从谋士荀彧的建议，派大军把皇帝迎到了许县。',
  '196-3': '曹操在许昌颁布“屯田令”，召集逃难的流民开垦荒地种粮，产出的粮食公私分成，几年下来军粮充足，百姓也免于挨饿。',

  // 198 Fall of Lu Bu
  '198-3': '曹操把吕布团团围在下邳城，引泗水和沂水淹城一个多月。部下叛变绑了陈宫投降，吕布在白门楼被绞死，张辽归降曹操。',

  // 200 Battle of Guandu
  '200-0': '董承策划除掉曹操的衣带诏密谋泄露，全家被处死。曹操亲征刘备，刘备大败投奔袁绍，关羽在下邳被围，为保全两位嫂子暂时归降曹操。',
  '200-1': '白马之战关羽策马突击，一刀刺死袁绍大将颜良；随后曹操又在延津用诱饵计斩了文丑。关羽挂印封金，护送二位嫂嫂千里寻刘备。',
  '200-2': '袁绍十万大军逼近官渡，筑起高台俯身放箭射曹营，曹军造出发石霹雳车砸毁敌楼。双方挖战壕死守，曹操快断粮了。',
  '200-3': '袁绍谋士许攸投奔曹操，曹操光着脚跑出来迎接。曹操亲自带领五千骑兵夜袭乌巢，一把火烧光了袁军所有粮食，袁绍大军彻底崩盘。',

  // 208 Red Cliffs
  '208-2': '曹操带几十万大军南下荆州，刘琮直接举城投降。刘备带着十万荆襄百姓逃难，赵云在当阳长坂坡单骑救下阿斗，张飞在当阳桥喝退曹兵。',
  '208-3': '孙权与刘备联合抵抗曹操。黄盖用火船点燃曹操战船，长江上烈火连天烧成一片，曹操败走华容道，天下三分的局面由此奠定。',

  // 214 Liu Bei enters Chengdu
  '214-1': '庞统在落凤坡不幸中箭阵亡，诸葛亮、张飞带兵入川支援。刘备大军包围成都，刘璋开城投降，刘备正式占领益州天府之国。',

  // 217 Jian'an Great Epidemic
  '217-3': '中原爆发罕见的恶性伤寒大瘟疫，成千上万的老百姓病倒死去，很多名士文学家也在这一年染病离世，家家户户都在哭泣。',

  // 219 Guan Yu flood & Fall of Jingzhou
  '219-2': '秋天大雨连绵，关羽水淹于禁七军，活捉于禁、斩杀庞德，威震华夏，曹操一度打算迁都暂避关羽锋芒。',
  '219-3': '孙权派吕蒙伪装成商船白衣渡江偷袭荆州，糜芳投降。关羽被断了后路，败退麦城突围时中伏遇害。',

  // 220 Han Dynasty Ends
  '220-0': '魏王曹操在洛阳病逝，享年六十六岁。儿子曹丕继承魏王和丞相之位。',
  '220-3': '汉献帝在许昌被迫禅位，曹丕登基称帝建立魏国，四百多年的大汉天下正式画上句号。',

  // 222 Battle of Yiling
  '222-1': '刘备为了给关羽报仇出兵伐吴，几十里连营扎在山林里。东吴大都督陆逊看准时机顺风放火，蜀汉大军损失惨重，刘备退守白帝城。',

  // 223 Liu Bei passes at Baidi
  '223-0': '刘备在白帝城永安宫病危，把后事托付给诸葛亮：“你的才能远胜曹丕，若阿斗能辅佐就辅佐，若不成器你可自行作主。”诸葛亮泣不成声发誓效忠到底。',

  // 228 Zhuge Liang Northern Expedition
  '228-0': '诸葛亮第一次北伐出祁山，天水姜维归顺蜀汉。马谡违背军令在街亭大败失守，诸葛亮只得把西县百姓迁回汉中，挥泪斩了马谡。',

  // 234 Wuzhang Plains
  '234-2': '诸葛亮第五次北伐，在五丈原与司马懿对峙了一百多天，终因积劳成疾在军营中病逝，蜀军井然有序退回汉中。',

  // 249 Gaoping Tomb Incident
  '249-0': '曹魏小皇帝曹芳出城扫墓，大将军曹爽跟着一同出行。太傅司马懿趁机装病起事，封锁洛阳城门，逼得曹爽交权，随后诛灭曹爽三族，魏国大权尽归司马家。',
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
      title: `${profile.county}夭折孩童 · 活了${deathAge}岁`,
      epitaphTitle: '匆匆一瞥的小生命',
      summary: `出生在公元184年天下大乱的时候，只活到了公元${deathYear}年。因为${deathReason || '大冬天受凉得病'}，没能长大成人。母亲把你埋在村后的大榆树下，每年春天都会摘几朵野花放在坟前。`,
      historianNote: '汉末动乱年代，很多小娃娃还没来得及长大就离开人世。在那个缺医少药的乱世里，能平平安安活下来已是不易。',
      tier: 'TRAGIC',
    };
  }

  if (deathReason && (deathReason.includes('阵亡') || deathReason.includes('战死') || deathReason.includes('就义') || deathReason.includes('矢石') || deathReason.includes('乌巢'))) {
    const isWuchao = deathReason.includes('乌巢') || deathReason.includes('官渡');
    const isJustMartyr = deathReason.includes('就义') || deathReason.includes('不降');
    return {
      title: isWuchao
        ? `${profile.county}官渡阵亡小兵 · 活了${deathAge}岁`
        : isJustMartyr
        ? `${profile.county}宁死不屈的好汉 · 活了${deathAge}岁`
        : `${profile.county}沙场从军戍卒 · 活了${deathAge}岁`,
      epitaphTitle: isWuchao
        ? '战死在官渡前线'
        : isJustMartyr
        ? '硬骨头 · 临死不服软'
        : '马革裹尸的普通兵卒',
      summary: `应征入伍当了兵，跟着队伍南征北战，在公元${deathYear}年${deathReason}。走的时候，怀里还揣着一包没来得及寄回家的故乡泥土，还有母亲亲手纳的旧布鞋底。虽然生平短暂，但也是一条响当当的热血汉子。`,
      historianNote: isJustMartyr
        ? '刀架在脖子上也不肯低头。乱世里哪怕只是个普通小兵，骨头也是硬邦邦的！'
        : '王侯将相为了争夺地盘打得天翻地覆，最终倒在荒野战场上的，都是普通人家的儿女。',
      tier: 'TRAGIC',
    };
  }

  if (deathAge < 30) {
    return {
      title: `${profile.county}英年早逝的年轻人 · 活了${deathAge}岁` ,
      epitaphTitle: '荒乱岁月的叹息',
      summary: `平日里勤劳朴实，对父母孝顺，对乡邻和气。可惜战乱和灾荒无常，在公元${deathYear}年因为${deathReason || '得病挨饿'}匆匆离世。同村的老少爷们合力把你妥善安葬了。`,
      historianNote: '天下大乱的时候，普通老百姓的生活脆弱得像一片树叶。平平安安过好一生，在那个年代是多么奢侈的愿望。',
      tier: 'COMMON',
    };
  }

  if (deathAge >= 60) {
    return {
      title: `${profile.county}长寿长者 · 活了${deathAge}岁`,
      epitaphTitle: '熬过乱世的老人',
      summary: `出生在公元184年黄巾起义的时候，一路经历董卓进京、官渡之战、赤壁大火，见证了天下三分。靠着勤快、谨慎和本分，硬是保全了一家老小的性命。活到公元${deathYear}年，儿孙满堂，安安稳稳地在自家床上寿终正寝。`,
      historianNote: '在到处都在打仗吃人的年代，一个普通人能保全一家老小、安稳活到六十多岁，这份坚韧和生活智慧，绝不比那些争霸天下的诸侯逊色！',
      tier: 'RESILIENT',
    };
  }

  if (stats.wealth >= 65) {
    return {
      title: `${province.provinceName}殷实户掌柜 · 活了${deathAge}岁`,
      epitaphTitle: '日子红火的本分人',
      summary: `从小做小买卖或起早贪黑种地积攒家底，在城里乡下置办了田产和大瓦房。遇到兵荒马乱的大饥荒年份，还常常开仓借粮食救济穷苦乡亲，名声非常好，走的时候体面又安详。`,
      historianNote: '不求当官发大财，踏踏实实过好自己的小日子。遇到困难还愿意拉邻居一把，邻里乡亲都会长久记着你的好。',
      tier: 'RESILIENT',
    };
  }

  return {
    title: `${profile.county}庄稼汉 · 活了${deathAge}岁`,
    epitaphTitle: '平凡普通的一生',
    summary: `生在汉末乱世，在乡下老老实实种了一辈子地。没见过皇帝，也没见过曹操刘备这些大人物，一辈子只操心每年春天下不下雨、秋天能收多少粮食。在战乱频发的年代里，靠自己的双手顽强活了${deathAge}个年头，给儿女留下了能遮风挡雨的泥瓦房。`,
    historianNote: '史书上写的都是王侯将相，但真正撑起这片土地的，是无数像他这样面朝黄土背朝天、默默耕耘的普通老百姓。',
    tier: 'COMMON',
  };
}
