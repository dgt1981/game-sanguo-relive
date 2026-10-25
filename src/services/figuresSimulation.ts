import { Attributes, ProvinceId, HistoricalFigureBond, FigureArchetype } from '../types/game';
import { HISTORICAL_FIGURES_CATALOG, FigureCatalogEntry } from '../data/historicalFiguresCatalog';

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
