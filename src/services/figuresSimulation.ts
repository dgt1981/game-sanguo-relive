import {
  Attributes,
  ProvinceId,
  HistoricalFigureBond,
  FigureArchetype,
  LifeChoice,
  HistoricalDialogue,
  SeasonIndex,
} from '../types/game';
import { HISTORICAL_FIGURES_CATALOG, FigureCatalogEntry } from '../data/historicalFiguresCatalog';
import type { PersonProfile } from './lifeSimulator';

/**
 * 历史名仕动态成长与属性计算
 * 历史人物跟主角一样在岁月流转中逐渐成长，拥有年龄、体魄、识见、勇略、仁厚、家财等属性演化
 */
export function calculateFigureDynamicStats(
  base184: Attributes,
  peak: Attributes,
  birthYear: number,
  currentYear: number
): Attributes {
  const age = Math.max(0, currentYear - birthYear);

  // 幼年期 (0-15岁): 属性从幼年基础逐步萌发至初始水准
  if (age <= 15) {
    const ratio = Math.max(0.35, age / 15);
    return {
      health: Math.round(base184.health * ratio),
      intellect: Math.round(base184.intellect * (0.4 + ratio * 0.6)),
      martial: Math.round(base184.martial * ratio * 0.9),
      virtue: Math.round(base184.virtue * (0.5 + ratio * 0.5)),
      wealth: Math.round(base184.wealth * (0.3 + ratio * 0.7)),
      fortune: base184.fortune,
    };
  }

  // 青年成长期 (16-30岁): 从184年水平向巅峰属性平滑成长
  if (age <= 30) {
    const progress = (age - 16) / 14; // 0 ~ 1.0
    return {
      health: Math.round(base184.health + (peak.health - base184.health) * progress),
      intellect: Math.round(base184.intellect + (peak.intellect - base184.intellect) * progress),
      martial: Math.round(base184.martial + (peak.martial - base184.martial) * progress),
      virtue: Math.round(base184.virtue + (peak.virtue - base184.virtue) * progress),
      wealth: Math.round(base184.wealth + (peak.wealth - base184.wealth) * progress),
      fortune: Math.round(base184.fortune + (peak.fortune - base184.fortune) * progress),
    };
  }

  // 壮年巅峰期 (31-50岁): 维持巅峰极盛状态，识见仁厚甚至更醇厚
  if (age <= 50) {
    return {
      health: peak.health,
      intellect: Math.min(100, peak.intellect + Math.floor((age - 30) / 7)),
      martial: peak.martial,
      virtue: Math.min(100, peak.virtue + Math.floor((age - 30) / 6)),
      wealth: Math.min(100, peak.wealth + Math.floor((age - 30) / 5)),
      fortune: peak.fortune,
    };
  }

  // 垂暮晚年期 (51岁及以上): 体力与武力适度衰退，德望与智谋愈加炉火纯青
  const elderFactor = Math.min(0.3, (age - 50) * 0.015);
  return {
    health: Math.max(30, Math.round(peak.health * (1 - elderFactor * 1.5))),
    intellect: peak.intellect,
    martial: Math.max(30, Math.round(peak.martial * (1 - elderFactor * 1.8))),
    virtue: Math.min(100, peak.virtue + 3),
    wealth: peak.wealth,
    fortune: Math.max(25, Math.round(peak.fortune * (1 - elderFactor))),
  };
}

/**
 * 根据人物当前年龄获取匹配的季节交互/问候语
 */
export function getFigureDialogueForAge(entry: FigureCatalogEntry, age: number): string {
  if (age < 16) {
    return entry.dialogues.childhoodGreeting;
  } else if (age < 32) {
    return entry.dialogues.youthGreeting;
  } else if (age < 55) {
    return entry.dialogues.primeGreeting;
  } else {
    return entry.dialogues.seniorGreeting;
  }
}

/**
 * 实例化一个名士羁绊对象，包含其实时属性与年岁
 */
export function createFigureBond(
  entry: FigureCatalogEntry,
  metYear: number,
  relation: string,
  bondLevel: number,
  currentYear: number
): HistoricalFigureBond {
  const currentAge = Math.max(0, currentYear - entry.birthYear);
  const isAlive = currentYear <= entry.deathYear;
  const currentStats = calculateFigureDynamicStats(
    entry.baseStats184,
    entry.peakStats,
    entry.birthYear,
    currentYear
  );
  const lastSpoken = getFigureDialogueForAge(entry, currentAge);

  return {
    id: entry.id,
    name: entry.name,
    courtesyName: entry.courtesyName,
    title: entry.titleTag,
    camp: entry.camp,
    campLabel: entry.campLabel,
    relation,
    bondLevel,
    intimacy: Math.max(15, bondLevel * 25 - 5),
    unlockedGifts: [],
    lastSpoken,
    metYear,
    birthYear: entry.birthYear,
    deathYear: entry.deathYear,
    currentAge,
    isAlive,
    archetype: entry.archetype,
    currentStats,
    perkTitle: entry.perk.title,
    perkEffect: entry.perk.buffEffect,
    avatarChar: entry.avatarChar,
    birthplace: entry.birthplace,
    provinceId: entry.provinceId,
    commandery: entry.commandery,
    county: entry.county,
    titleTag: entry.titleTag,
    historicalBio: entry.historicalBio,
  };
}

/**
 * 地理同乡天然羁绊初始化:
 * 如果玩家与名士在同一个郡国/同县长大，天然会有非常高的概率结下幼年竹马、砚友、乡梓故交羁绊
 */
export function initChildhoodBonds(
  birthProvince: ProvinceId,
  commandery: string,
  county: string,
  birthYear: number
): HistoricalFigureBond[] {
  const bonds: HistoricalFigureBond[] = [];

  for (const entry of HISTORICAL_FIGURES_CATALOG) {
    let rollChance = 0;
    let baseRelation = '';
    let startBond = 2;

    const ageDiff = entry.birthYear - birthYear; // 负数代表名士比主角年长

    // 1. 同郡或同县 (极高概率天然认识: 75% ~ 90%)
    const isSameCounty = entry.county && county && (county.includes(entry.county) || entry.county.includes(county));
    const isSameCommandery = entry.commandery && commandery && (commandery.includes(entry.commandery) || entry.commandery.includes(commandery));

    if (isSameCounty) {
      rollChance = 0.90;
      if (Math.abs(ageDiff) <= 5) {
        baseRelation = '同邑总角 · 竹马砚友';
        startBond = 3;
      } else if (ageDiff < -5) {
        baseRelation = '同里乡贤 · 提携长者';
        startBond = 2;
      } else {
        baseRelation = '闾里故知 · 邻家少弟';
        startBond = 2;
      }
    } else if (isSameCommandery) {
      rollChance = 0.75;
      if (Math.abs(ageDiff) <= 6) {
        baseRelation = '同郡俊彦 · 少岁契友';
        startBond = 2;
      } else if (ageDiff < -6) {
        baseRelation = '郡望先贤 · 乡里长兄';
        startBond = 2;
      } else {
        baseRelation = '郡学同砚 · 后生晚辈';
        startBond = 2;
      }
    } else if (entry.provinceId === birthProvince) {
      // 2. 同一州域 (约 35% 概率因州学/世族往来/商道而自幼相识)
      rollChance = 0.35;
      baseRelation = '桑梓同州 · 莫逆之交';
      startBond = 1;
    }

    if (rollChance > 0 && Math.random() < rollChance) {
      bonds.push(createFigureBond(entry, birthYear, baseRelation, startBond, birthYear));
    }
  }

  return bonds;
}

/**
 * 季节/年岁流转时，推进所有已结识名仕的成长、属性和生死状态
 */
export function updateKnownFiguresForSeason(
  knownFigures: HistoricalFigureBond[],
  currentYear: number
): HistoricalFigureBond[] {
  return knownFigures.map((fig) => {
    const entry = HISTORICAL_FIGURES_CATALOG.find((e) => e.id === fig.id);
    const currentAge = Math.max(0, currentYear - fig.birthYear);
    const isAlive = currentYear <= fig.deathYear;

    let dynamicStats = fig.currentStats;
    let spoken = fig.lastSpoken;

    if (entry) {
      dynamicStats = calculateFigureDynamicStats(
        entry.baseStats184,
        entry.peakStats,
        entry.birthYear,
        currentYear
      );
      spoken = getFigureDialogueForAge(entry, currentAge);
    }

    return {
      ...fig,
      currentAge,
      isAlive,
      currentStats: dynamicStats,
      lastSpoken: spoken,
    };
  });
}

/**
 * 统计玩家结识名士的人脉加成与庇护特权
 * 主角的后期高度紧密依赖这些人脉:
 * - 勇武过人 (MARTIAL): 战阵逢凶化吉，大幅降低战死几率
 * - 才智过人 (STRATEGIST): 识见指点，解惑明机
 * - 财富雄厚 (WEALTHY): 商道扶持，岁末粮饷厚馈
 * - 妙手医圣 (HEALER): 医圣常伴，驱避疫病恶疾
 * - 经学名士 (HERMIT): 清议品评，声名传于刺史公卿
 */
export interface FigurePerkBenefit {
  activePerks: {
    figureName: string;
    archetype: FigureArchetype;
    perkTitle: string;
    description: string;
  }[];
  statBonuses: Partial<Record<keyof Attributes, number>>;
  fatalDamageProtection: boolean; // 是否免死一次或降低死伤
  epidemicImmunity: boolean;      // 疫病抵抗
  seasonalWealthYield: number;    // 巨贾岁末贴补铜钱
  reputationBoost: number;        // 名士清谈声望
}

export function evaluateFigurePerks(knownFigures: HistoricalFigureBond[]): FigurePerkBenefit {
  const result: FigurePerkBenefit = {
    activePerks: [],
    statBonuses: {
      health: 0,
      intellect: 0,
      martial: 0,
      virtue: 0,
      wealth: 0,
      fortune: 0,
    },
    fatalDamageProtection: false,
    epidemicImmunity: false,
    seasonalWealthYield: 0,
    reputationBoost: 0,
  };

  // 唯有健在且羁绊达标（bondLevel >= 2）的名仕能生效强力特权
  for (const fig of knownFigures) {
    if (!fig.isAlive) continue;

    const multiplier = fig.bondLevel >= 3 ? 1.5 : 1.0;

    result.activePerks.push({
      figureName: fig.name,
      archetype: fig.archetype,
      perkTitle: fig.perkTitle,
      description: fig.perkEffect,
    });

    switch (fig.archetype) {
      case 'MARTIAL':
        result.statBonuses.martial = (result.statBonuses.martial || 0) + Math.round(5 * multiplier);
        result.statBonuses.health = (result.statBonuses.health || 0) + Math.round(3 * multiplier);
        result.fatalDamageProtection = true;
        break;

      case 'STRATEGIST':
        result.statBonuses.intellect = (result.statBonuses.intellect || 0) + Math.round(6 * multiplier);
        result.statBonuses.fortune = (result.statBonuses.fortune || 0) + Math.round(4 * multiplier);
        break;

      case 'WEALTHY':
        result.statBonuses.wealth = (result.statBonuses.wealth || 0) + Math.round(8 * multiplier);
        result.seasonalWealthYield += Math.round(40 * multiplier);
        break;

      case 'HEALER':
        result.statBonuses.health = (result.statBonuses.health || 0) + Math.round(8 * multiplier);
        result.epidemicImmunity = true;
        break;

      case 'HERMIT':
        result.statBonuses.virtue = (result.statBonuses.virtue || 0) + Math.round(8 * multiplier);
        result.reputationBoost += Math.round(15 * multiplier);
        break;
    }
  }

  return result;
}

/**
 * 获取当前地区尚未结识的名仕（可供奇遇或寻访）
 */
export function getUnmetRegionalFigures(
  currentProvince: ProvinceId,
  knownFigureIds: string[],
  currentYear: number
): FigureCatalogEntry[] {
  const knownSet = new Set(knownFigureIds);
  return HISTORICAL_FIGURES_CATALOG.filter(
    (entry) =>
      !knownSet.has(entry.id) &&
      entry.provinceId === currentProvince &&
      currentYear >= entry.birthYear &&
      currentYear <= entry.deathYear
  );
}

/**
 * 增加或升级与某名仕的羁绊
 */
export function increaseFigureBond(
  knownFigures: HistoricalFigureBond[],
  figureId: string,
  addedLevel = 1,
  newSpoken?: string
): HistoricalFigureBond[] {
  return knownFigures.map((fig) => {
    if (fig.id === figureId) {
      const nextLevel = Math.min(4, fig.bondLevel + addedLevel);
      let relation = fig.relation;
      if (nextLevel >= 4) {
        relation = '生死托付 · 金兰同舟';
      } else if (nextLevel === 3) {
        relation = '情谊深厚 · 莫逆之交';
      }
      return {
        ...fig,
        bondLevel: nextLevel,
        relation,
        lastSpoken: newSpoken || fig.lastSpoken,
      };
    }
    return fig;
  });
}

export interface ContextualEncounterResult {
  figureDialogue: HistoricalDialogue;
  personalStory: string;
  choice: {
    prompt: string;
    options: LifeChoice[];
  };
}

/**
 * 依据玩家当前时空、身份（平民/军旅阵营）、年龄、以及与名士的历史渊源（总角竹马/初识新遇/同袍），
 * 严格杜绝逻辑自相矛盾，动态生成高度契合因果的前后呼应名士对话与抉择！
 */
export function generateContextualFigureEncounter(
  profile: PersonProfile,
  year: number,
  season: SeasonIndex,
  age: number,
  stats: Attributes
): ContextualEncounterResult | null {
  const flags = profile.eventFlags || {};
  const playerCamp = profile.militaryAffiliation?.camp || 'NONE';
  const isCivilian = playerCamp === 'NONE';

  // 1. 严格过滤候选人物 (杜绝频繁对话同一个人、杜绝寿元错乱、杜绝敌营长官违和闲聊)
  const eligibleFigures = HISTORICAL_FIGURES_CATALOG.filter((entry) => {
    // 寿限检查
    if (year < entry.birthYear || year > entry.deathYear) return false;

    // 冷却检查: 4年 (16个季节) 内严禁重复触发同一人
    const cooldownUntil = Number(flags[`cooldown_fig_${entry.id}`] || 0);
    if (year < cooldownUntil) return false;

    // 严禁刚对话过的人物连续出现
    if (flags['last_figure_spoken'] === entry.id) return false;

    // 阵营匹配检查: 从军者只能遇到同阵营长官/同袍，或中立医圣、隐士
    if (!isCivilian) {
      const isNeutral = entry.archetype === 'HEALER' || entry.archetype === 'HERMIT';
      const isSameCamp = entry.camp === playerCamp;
      if (!isNeutral && !isSameCamp) return false;
    }

    // 地理或阵营合规
    const isLocal = entry.provinceId === profile.currentProvince;
    const isNative = entry.provinceId === profile.birthProvince;
    const isKnown = (profile.knownFigures || []).some((f) => f.id === entry.id);
    const isWanderer = entry.archetype === 'HEALER' || entry.archetype === 'HERMIT';
    const isCampOfficer = !isCivilian && entry.camp === playerCamp;

    return isLocal || isNative || isKnown || isWanderer || isCampOfficer;
  });

  if (eligibleFigures.length === 0) return null;

  // 2. 优化名仕抽选分布：优先结识尚未谋面的天下名仕（拓宽人脉），其次是相隔数年未见的故知
  const unmetList = eligibleFigures.filter(
    (e) => !(profile.knownFigures || []).some((f) => f.id === e.id)
  );
  const knownList = eligibleFigures.filter(
    (e) => (profile.knownFigures || []).some((f) => f.id === e.id)
  );

  let picked: FigureCatalogEntry;
  if (unmetList.length > 0 && (knownList.length === 0 || Math.random() < 0.65)) {
    picked = unmetList[Math.floor(Math.random() * unmetList.length)];
  } else {
    picked = knownList[Math.floor(Math.random() * knownList.length)];
  }

  const figureAge = Math.max(0, year - picked.birthYear);
  const quote = getFigureDialogueForAge(picked, figureAge);

  const existingBond = (profile.knownFigures || []).find((f) => f.id === picked.id);
  const isChildhood =
    existingBond &&
    (existingBond.relation.includes('竹马') ||
      existingBond.relation.includes('总角') ||
      existingBond.relation.includes('同邑') ||
      existingBond.relation.includes('同里'));
  const isSameCampMilitary = !isCivilian && picked.camp === playerCamp;

  let personalStory = '';
  let prompt = '';
  let options: LifeChoice[] = [];

  const cooldownKey = `cooldown_fig_${picked.id}`;

  // =========================================================================
  // 分支 1: 总角同窗 / 莫逆旧友重聚 (彻底解决“早就是发小却说初识相知”的矛盾！)
  // =========================================================================
  if (isChildhood || (existingBond && existingBond.bondLevel >= 2)) {
    if (isChildhood) {
      personalStory = `这一日，你在【${profile.county}】与少小相识的总角旧友【${picked.name}（字${picked.courtesyName}）】阔别重逢。当年乡里同砚少年，如今各自历尽风雨。相视一笑间，满是故交重逢的醇厚暖意。`;
    } else {
      personalStory = `这一日，你在【${profile.county}】与深交知己【${picked.name}（字${picked.courtesyName}）】再次相会。大乱年月音讯阻绝，今朝得见故人无恙，二人执手相看，皆大为宽慰。`;
    }

    prompt = `与旧友【${picked.name}】阔别重逢，二人相坐叙话，你当如何应对？`;

    // 依流派定制专属请益选项
    let adviceLabel = `向【${picked.name}】求教`;
    let adviceOutcome = '';
    let statDelta: Partial<Record<keyof Attributes, number>> = {};

    switch (picked.archetype) {
      case 'MARTIAL':
        adviceLabel = `向【${picked.name}】请益破阵枪棒与战阵防身要诀`;
        adviceOutcome = `【${picked.name}】欣然取枪示范，悉心提点你近身攻防的命门与力道，令你勇略与体魄大有长进！`;
        statDelta = { martial: 10, health: 4 };
        break;
      case 'STRATEGIST':
        adviceLabel = `向【${picked.name}】请教天下各路割据大势与安身避祸良策`;
        adviceOutcome = `【${picked.name}】取树枝在地上为你细画诸侯虚实，点拨你见微知著、趋吉避凶之道，令你识见大开！`;
        statDelta = { intellect: 10, fortune: 6 };
        break;
      case 'WEALTHY':
        adviceLabel = `向【${picked.name}】探讨商道钱谷通融与经业营生之方`;
        adviceOutcome = `【${picked.name}】为你指点各地官市物价起落，并慷慨资助你两包精制茶饼与通关路引，家资大增！`;
        statDelta = { wealth: 14, intellect: 6 };
        break;
      case 'HEALER':
        adviceLabel = `向【${picked.name}】请教四时节令调摄与避疫导引长生之法`;
        adviceOutcome = `【${picked.name}】为你号脉调治，赠予你数副秘制辟秽药囊与延寿经方，通体大受裨益！`;
        statDelta = { health: 10, virtue: 6 };
        break;
      case 'HERMIT':
        adviceLabel = `向【${picked.name}】研求圣贤经籍与修身立德之道`;
        adviceOutcome = `【${picked.name}】为你阐发古圣修己安人之理，字字珠玑，令你心境高洁超迈，仁厚德望更隆！`;
        statDelta = { virtue: 12, intellect: 8 };
        break;
    }

    options = [
      {
        id: `c_reunion_${picked.id}_drink`,
        label: `沽上一壶温热浊酒，与【${picked.name}】围炉畅叙别后桑梓风物`,
        description: `重温总角同道旧情，在战乱岁月互慰平生。`,
        approachTag: '【故人温情】',
        requirementHint: '增进仁厚，抚平沧桑',
        statChanges: { virtue: 10, health: 4, fortune: 4 },
        outcomeText: `二人把酒言欢，虽逢甲子大乱，但同里故交情谊愈笃。彼此相约无论世事如何，永为知心同道！`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: isChildhood ? '同邑总角 · 莫逆之交' : '至契知己 · 患难相扶',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
      {
        id: `c_reunion_${picked.id}_learn`,
        label: adviceLabel,
        description: `虚心向故友请益其所长，砥砺自身才学。`,
        approachTag: '【切磋砥砺】',
        requirementHint: '增进专长属性',
        statChanges: statDelta,
        outcomeText: adviceOutcome,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: isChildhood ? '总角同砚 · 师友相兼' : '深交莫逆 · 互为砥砺',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
      {
        id: `c_reunion_${picked.id}_pledge`,
        label: `备下一份盘缠干粮或随身手信相赠，相约若逢危难必倾力赴救`,
        description: `乱世存身不易，与深交好友互立守望相助之诺。`,
        approachTag: '【生死相托】',
        requirementHint: '备薄资结盟，铸就生死托付',
        statChanges: { virtue: 8, fortune: 8, wealth: -4 },
        outcomeText: `【${picked.name}】极为动容，亦解下贴身信物相赠：“有贤弟此言，此生无憾！来日若逢大难，某必全力赴救！”二人自此情同骨肉！`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: '生死托付 · 金兰同舟',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
    ];
  }
  // =========================================================================
  // 分支 2: 行伍同袍检阅 (从军者在军营中检阅操练，绝不出现市井闲坐与敌营叛逃！)
  // =========================================================================
  else if (isSameCampMilitary) {
    personalStory = `军营辕门鼓角肃杀，你在【${profile.militaryAffiliation?.roleTitle || '行伍'}】哨卡值守之时，恰逢军中名将【${picked.name}】按剑督察前沿阵防。见你刀弓严整、气度沉稳，【${picked.name}】特驻足校考你的行伍操练。`;
    prompt = `主将【${picked.name}】巡营检阅，考校战阵军备，你当如何应对？`;

    options = [
      {
        id: `c_mil_encounter_${picked.id}_drill`,
        label: `当面操演破阵刀枪与挽弓引矢，展现过硬武略`,
        description: '在主将面前展露武略，争当破阵前锋。',
        approachTag: '【精熟武艺】',
        requirementHint: '需勇略过人',
        statChanges: { martial: 12, health: 4, fortune: 4 },
        outcomeText: `【${picked.name}】抚掌赞赏：“真健卒也！”当即下令军需官赏赐你精铁短刀一把，并记大功一次。`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: '帐前赏识校尉',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
      {
        id: `c_mil_encounter_${picked.id}_plan`,
        label: `呈递前沿斥候密探图卷，陈说军寨粮道整饬与防偷袭之策`,
        description: '展现治军韬略与细密心思，得主帅青睐。',
        approachTag: '【建言方略】',
        requirementHint: '需识见沉稳',
        statChanges: { intellect: 12, virtue: 6 },
        outcomeText: `【${picked.name}】细阅图卷连连颔首：“足下颇有大将之才，深谙关要虚实！”特擢升你参赞中军行伍。`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: '军前倚重亲信',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
      {
        id: `c_mil_encounter_${picked.id}_logistics`,
        label: `主动请缨负责后营草料盘库与伤病士卒看护，确保后方无虞`,
        description: '勤勉敬业，任劳任怨抚恤袍泽。',
        approachTag: '【笃谨军风】',
        requirementHint: '仁厚务实',
        statChanges: { virtue: 10, wealth: 8 },
        outcomeText: `后营粮草井井有条，伤员大受照料。【${picked.name}】在全军面前亲口嘉勉你的仁厚忠谨。`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: '麾下得力心腹',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
    ];
  }
  // =========================================================================
  // 分支 3: 初识新名士 (平民偶遇名士，合乎情理的结交与请益)
  // =========================================================================
  else {
    personalStory = `这一日，你在【${profile.county}】市井驿道/杏林草舍间，偶遇初临此地的名士【${picked.name}（字${picked.courtesyName}）】。对方见你目光清澈、举止沉稳，驻足与你温言攀谈。`;
    prompt = `偶遇当世名士【${picked.name}】，对方驻足攀谈，你当如何应对？`;

    // 只有在玩家是平民且正值青壮年（16~35岁）、且该名士确属军事领袖时，才提供从军选项
    const canEnlist = isCivilian && age >= 16 && age <= 35 && picked.camp !== 'NONE';

    options = [
      {
        id: `c_new_encounter_${picked.id}_learn`,
        label: `恭敬拱手请教世道风云与安身之策，聆听教诲`,
        description: `虚心受教，以诚相待，聆听当世英杰的高见。`,
        approachTag: '【虚怀受教】',
        requirementHint: '崇德慕义，增进识见',
        statChanges: { intellect: 10, virtue: 6, fortune: 4 },
        outcomeText: `【${picked.name}】见你目光清澈、虚心好学，欣然传授了你诸多经世要诀与度世法度，二人遂结为相知！`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: '推心置腹之师友',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
      {
        id: `c_new_encounter_${picked.id}_treat`,
        label: `以乡党邻里之谊置办一席粗茶干粮，为【${picked.name}】温厚接风`,
        description: `仗义疏财，以纯厚仁义相待。`,
        approachTag: '【倾盖相待】',
        requirementHint: '纯朴好义，广结善缘',
        statChanges: { virtue: 10, wealth: -2, fortune: 6 },
        outcomeText: `二人就着粗茶畅叙四方风物，【${picked.name}】大赞你为人敦厚慷慨，引为莫逆同道！`,
        figureBond: {
          figureId: picked.id,
          figureName: picked.name,
          courtesyName: picked.courtesyName,
          title: picked.titleTag,
          camp: picked.camp,
          campLabel: picked.campLabel,
          relation: '同道莫逆知己',
          dialogue: quote,
        },
        eventFlagToSet: cooldownKey,
      },
      canEnlist
        ? {
            id: `c_new_encounter_${picked.id}_enlist`,
            label: `长揖及地，坦陈愿投身其麾下，从军报国保全桑梓`,
            description: `乱世投效明主，投身沙场闯荡一番功名！`,
            approachTag: '【投军麾下】',
            requirementHint: '需勇略过人',
            requirements: { martial: 25 },
            statChanges: { martial: 12, intellect: 6, fortune: 6 },
            outcomeText: `【${picked.name}】见你身手矫健、志在四方，欣然大笑：“得足下相从，实乃幸事！”收你入其帐前亲兵行伍！`,
            figureBond: {
              figureId: picked.id,
              figureName: picked.name,
              courtesyName: picked.courtesyName,
              title: picked.titleTag,
              camp: picked.camp,
              campLabel: picked.campLabel,
              relation: '麾下投效牙将',
              dialogue: quote,
            },
            campaignUnlock: {
              campaignName: `${picked.name}麾下从军`,
              camp: picked.camp,
              commander: picked.name,
              roleTitle: `${picked.name}帐前随行牙将`,
            },
            eventFlagToSet: cooldownKey,
          }
        : {
            id: `c_new_encounter_${picked.id}_recommend`,
            label: `向其探讨乡里民风物产，恳请在官府太守或大族门前予以美言清议`,
            description: '结识海内名士，增益乡望与声名。',
            approachTag: '【结好名望】',
            requirementHint: '修德积善，名传乡里',
            statChanges: { virtue: 10, intellect: 6, fortune: 6 },
            outcomeText: `【${picked.name}】对你大加赞赏，亲手写下评语赐你，你的名望在四邻八乡大为传扬。`,
            figureBond: {
              figureId: picked.id,
              figureName: picked.name,
              courtesyName: picked.courtesyName,
              title: picked.titleTag,
              camp: picked.camp,
              campLabel: picked.campLabel,
              relation: '赏识提携先贤',
              dialogue: quote,
            },
            eventFlagToSet: cooldownKey,
          },
    ];
  }

  return {
    figureDialogue: {
      figureId: picked.id,
      speaker: picked.name,
      courtesyName: picked.courtesyName,
      title: picked.titleTag,
      camp: picked.camp,
      avatarChar: picked.avatarChar,
      quote,
      replyPrompt: personalStory,
    },
    personalStory,
    choice: {
      prompt,
      options,
    },
  };
}
