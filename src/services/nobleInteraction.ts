import {
  Attributes,
  HistoricalFigureBond,
  NobleBoon,
  SeasonIndex,
  FigureArchetype,
} from '../types/game';

export interface InteractionOption {
  type: 'SPAR_STUDY' | 'FEAST_GIFT' | 'LETTER_GREETING';
  title: string;
  tag: string;
  description: string;
  costDescription: string;
  statCosts: Partial<Record<keyof Attributes, number>>;
  intimacyGainMin: number;
  intimacyGainMax: number;
  archetypeGains: Partial<Record<keyof Attributes, number>>;
}

/**
 * 完整的三国名士赐予图录
 * 涵盖名剑神兵、兵法绝学秘籍、战略情报与传世奇珍
 */
export const NOBLE_BOONS_CATALOG: Record<string, NobleBoon[]> = {
  zhao_yun: [
    {
      id: 'boon_zhao_yun_spear',
      name: '【亮银梨花枪谱】',
      type: 'MANUAL',
      typeLabel: '武艺秘籍',
      requiredBondLevel: 3,
      description: '常山赵子龙亲笔所录梨花枪术图解，招招直取中门，攻守兼备，修习后勇略精进。',
      figureId: 'zhao_yun',
      figureName: '赵云',
      statBonus: { martial: 4, intellect: 2, health: 2 },
      specialEffect: '战阵历练勇略成长率提升，单挑大捷概率增加',
    },
    {
      id: 'boon_zhao_yun_sword',
      name: '【青釭宝剑】',
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: '长坂坡神勇夺得的曹营镇军名剑，削铁如泥，剑柄刻金，蕴含常胜之势。',
      figureId: 'zhao_yun',
      figureName: '赵云',
      statBonus: { martial: 7, fortune: 4, health: 3 },
      specialEffect: '佩戴此剑者沙场逢凶化吉，免于致命突袭',
    },
  ],

  zhuge_liang: [
    {
      id: 'boon_zhuge_liang_scroll',
      name: '【隆中三分策手卷】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '孔明草庐中亲手绘制的天下山川险隘与鼎足大计手稿，洞察十三州虚实。',
      figureId: 'zhuge_liang',
      figureName: '诸葛亮',
      statBonus: { intellect: 5, fortune: 3, virtue: 2 },
      specialEffect: '识破天下军旅行军伏击，从政立功评级提升',
    },
    {
      id: 'boon_zhuge_liang_crossbow',
      name: '【元戎连弩机图 · 八阵秘要】',
      type: 'MANUAL',
      typeLabel: '绝学秘籍',
      requiredBondLevel: 4,
      description: '蜀相穷毕生心血所推演之神机连弩构造图与九宫八卦奇门阵解，矢石莫能御。',
      figureId: 'zhuge_liang',
      figureName: '诸葛亮',
      statBonus: { intellect: 8, martial: 4, virtue: 3 },
      specialEffect: '统兵征战时行伍大捷，解锁至高军机奇功',
    },
  ],

  cao_cao: [
    {
      id: 'boon_cao_cao_book',
      name: '【孟德新书精义断章】',
      type: 'MANUAL',
      typeLabel: '兵法秘籍',
      requiredBondLevel: 3,
      description: '曹公亲注孙子十三篇之兵法要诀，深谙奇正相生、兵贵神速之王霸大略。',
      figureId: 'cao_cao',
      figureName: '曹操',
      statBonus: { intellect: 5, martial: 3, virtue: 2 },
      specialEffect: '战阵调度机敏过人，曹营屯田立功翻倍',
    },
    {
      id: 'boon_cao_cao_sword',
      name: '【倚天名剑 · 魏相辟书】',
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: '魏王随身所佩绝世倚天古剑，附带尚书台直除辟书，受之者直参霸府军谋。',
      figureId: 'cao_cao',
      figureName: '曹操',
      statBonus: { martial: 6, intellect: 4, wealth: 6 },
      specialEffect: '威名震于北疆，得曹魏众将推重辟举',
    },
  ],

  guan_yu: [
    {
      id: 'boon_guan_yu_spring_autumn',
      name: '【春秋左氏传朱注本】',
      type: 'MANUAL',
      typeLabel: '儒将秘籍',
      requiredBondLevel: 3,
      description: '武圣关云长秉烛夜读、亲笔批注的儒家经史，蕴含浩然正气与忠义风骨。',
      figureId: 'guan_yu',
      figureName: '关羽',
      statBonus: { virtue: 5, intellect: 3, martial: 2 },
      specialEffect: '仁厚威望流传乡野，得四海豪杰钦慕敬仰',
    },
    {
      id: 'boon_guan_yu_blade',
      name: '【青龙副刃 · 寒铁短柄】',
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: '铸造青龙偃月刀时同炉炼就的百炼寒钢短刃，森森青芒，吹毛立断。',
      figureId: 'guan_yu',
      figureName: '关羽',
      statBonus: { martial: 8, virtue: 4, fortune: 3 },
      specialEffect: '临阵斩将威震华夏，武略超绝万军辟易',
    },
  ],

  lu_su: [
    {
      id: 'boon_lu_su_trade',
      name: '【江淮八郡通商度牒】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '鲁子敬持有的江淮水道粮饷与私盐通商密引，凭此牒可在江南坊市畅通无阻。',
      figureId: 'lu_su',
      figureName: '鲁肃',
      statBonus: { wealth: 8, intellect: 3 },
      specialEffect: '商贾货殖免除苛税，岁末商入大幅提升',
    },
    {
      id: 'boon_lu_su_token',
      name: '【指囷通宝玉筹】',
      type: 'TREASURE',
      typeLabel: '传世奇珍',
      requiredBondLevel: 4,
      description: '鲁氏指囷赠粮之信物暖玉，持此筹可向临淮鲁府支取重金，世传豪迈义商之印。',
      figureId: 'lu_su',
      figureName: '鲁肃',
      statBonus: { wealth: 15, virtue: 5, fortune: 4 },
      specialEffect: '彻底免除一切饥荒破产之苦，终生无衣食匮乏之患',
    },
  ],

  zhou_yu: [
    {
      id: 'boon_zhou_yu_naval',
      name: '【赤壁锁江水战阵图】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '江东大都督周公瑾推演风向、战船水文与铁索连环的亲笔军机水战图。',
      figureId: 'zhou_yu',
      figureName: '周瑜',
      statBonus: { intellect: 5, martial: 3, virtue: 2 },
      specialEffect: '南方江河战事无往不利，规避风涛倾覆危厄',
    },
    {
      id: 'boon_zhou_yu_sword',
      name: '【古锭名剑 · 焦尾鸣桐琴】',
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: '周郎随身佩剑与江南雅士焦尾良琴，文武兼备，风流儒将之生死信物。',
      figureId: 'zhou_yu',
      figureName: '周瑜',
      statBonus: { martial: 6, intellect: 6, virtue: 4 },
      specialEffect: '江东名流争相推崇，风雅识见名播四海',
    },
  ],

  hua_tuo: [
    {
      id: 'boon_hua_tuo_exercise',
      name: '【五禽导引真形图】',
      type: 'MANUAL',
      typeLabel: '养生秘籍',
      requiredBondLevel: 3,
      description: '华神医摹仿虎、鹿、熊、猿、鸟之姿所创神功，日日修习可畅通百脉、除疾延寿。',
      figureId: 'hua_tuo',
      figureName: '华佗',
      statBonus: { health: 6, martial: 2, virtue: 2 },
      specialEffect: '四季流转体魄损耗减半，大幅抵御恶疾旧患',
    },
    {
      id: 'boon_hua_tuo_bag',
      name: '【青囊遗篇 · 麻沸秘方】',
      type: 'MANUAL',
      typeLabel: '绝学秘籍',
      requiredBondLevel: 4,
      description: '华佗集一生针石外科神方所著之青囊书卷，神药一出，肉白骨活死人。',
      figureId: 'hua_tuo',
      figureName: '华佗',
      statBonus: { health: 10, virtue: 5, fortune: 4 },
      specialEffect: '全家免疫建安大疫，命悬一线时神药续命',
    },
  ],

  zhang_zhongjing: [
    {
      id: 'boon_zhang_zhongjing_presc',
      name: '【金匮当归生姜经方】',
      type: 'MANUAL',
      typeLabel: '医道秘籍',
      requiredBondLevel: 3,
      description: '南阳张仲景坐堂亲开之温里散寒古方，冬月煎服，百病消散。',
      figureId: 'zhang_zhongjing',
      figureName: '张机',
      statBonus: { health: 5, virtue: 3, intellect: 2 },
      specialEffect: '冬季体虚自然恢复，调顺气血阴阳',
    },
    {
      id: 'boon_zhang_zhongjing_treatise',
      name: '【伤寒杂病论全卷初稿】',
      type: 'MANUAL',
      typeLabel: '医圣秘典',
      requiredBondLevel: 4,
      description: '十六卷救苦济民之无上医圣心经，字字泣血，广施六经辨证。',
      figureId: 'zhang_zhongjing',
      figureName: '张机',
      statBonus: { health: 8, virtue: 8, intellect: 4 },
      specialEffect: '施药救济乡里万民，得民望立祠敬仰',
    },
  ],

  mi_zhu: [
    {
      id: 'boon_mi_zhu_salt',
      name: '【东海海西盐铁通关照会】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '糜家纵横青徐海疆之盐铁行商通关路线密图，凭此贩运获利丰厚。',
      figureId: 'mi_zhu',
      figureName: '糜竺',
      statBonus: { wealth: 10, intellect: 2 },
      specialEffect: '行商收益加成50%，遭遇败兵避祸有术',
    },
    {
      id: 'boon_mi_zhu_retinue',
      name: '【徐州糜府千金令 · 精悍义仆契】',
      type: 'TREASURE',
      typeLabel: '传世奇珍',
      requiredBondLevel: 4,
      description: '东海糜府金印令符与两名披甲家丁死士护卫，生死相随，倾囊相助。',
      figureId: 'mi_zhu',
      figureName: '糜竺',
      statBonus: { wealth: 16, martial: 4, fortune: 4 },
      specialEffect: '家财雄厚终生无忧，死士忠诚护卫化解危难',
    },
  ],

  jia_xu: [
    {
      id: 'boon_jia_xu_safe_letters',
      name: '【乱世避祸机变私札】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '毒士文和手书之趋吉避凶十二诫，教人看破阴谋、绝不轻信权贵许诺。',
      figureId: 'jia_xu',
      figureName: '贾诩',
      statBonus: { intellect: 6, fortune: 4 },
      specialEffect: '免受朝廷党争株连，避开权贵暗害借刀杀人',
    },
    {
      id: 'boon_jia_xu_strategy',
      name: '【遁甲九星明哲秘卷】',
      type: 'MANUAL',
      typeLabel: '保身秘籍',
      requiredBondLevel: 4,
      description: '贾太尉历仕群雄而终得寿考的大智慧心印，算无遗策，善始善终。',
      figureId: 'jia_xu',
      figureName: '贾诩',
      statBonus: { intellect: 8, fortune: 8, health: 3 },
      specialEffect: '气数保底维持在75以上，乱世风云永立不败之地',
    },
  ],

  pang_degong: [
    {
      id: 'boon_pang_degong_appraisal',
      name: '【鹿门山品藻贤愚录】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '庞德公评点荆襄诸子、卧龙凤雏之密录，洞察人心伪饰，指点当世治乱。',
      figureId: 'pang_degong',
      figureName: '庞德公',
      statBonus: { intellect: 6, virtue: 5 },
      specialEffect: '结交名士成功率倍增，清高声望流传荆襄',
    },
    {
      id: 'boon_pang_degong_whisk',
      name: '【周易隐仙鹤翎拂尘】',
      type: 'TREASURE',
      typeLabel: '传世奇珍',
      requiredBondLevel: 4,
      description: '德公登鹿门山采药隐遁前相赠之随身法物，清静无为，能安神定魄。',
      figureId: 'pang_degong',
      figureName: '庞德公',
      statBonus: { fortune: 8, virtue: 6, health: 4 },
      specialEffect: '超脱人间杀伐征战，晚岁寿登耄耋得道归真',
    },
  ],

  sun_ce: [
    {
      id: 'boon_sun_ce_tactic',
      name: '【小霸王陷阵短戟诀】',
      type: 'MANUAL',
      typeLabel: '勇武秘籍',
      requiredBondLevel: 3,
      description: '江东孙郎横行六郡之搏杀绝学，势若奔雷，专破敌阵铁甲重盾。',
      figureId: 'sun_ce',
      figureName: '孙策',
      statBonus: { martial: 6, health: 3 },
      specialEffect: '军阵突阵拔寨斩将概率翻倍',
    },
    {
      id: 'boon_sun_ce_sword',
      name: '【太阿辟地龙泉宝剑】',
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: '孙伯符横扫江东时所佩之名剑，锋芒毕露，有霸王辟地千里之雄风。',
      figureId: 'sun_ce',
      figureName: '孙策',
      statBonus: { martial: 9, fortune: 4, virtue: 3 },
      specialEffect: '阵前敌将胆寒，东吴行伍威望拔升至极顶',
    },
  ],

  gan_ning: [
    {
      id: 'boon_gan_ning_bell',
      name: '【锦帆飞索铜铃】',
      type: 'TREASURE',
      typeLabel: '游侠奇珍',
      requiredBondLevel: 3,
      description: '甘兴霸纵横大江所佩系铃锦缎与百步飞抓，水陆飞檐走壁。',
      figureId: 'gan_ning',
      figureName: '甘宁',
      statBonus: { martial: 5, fortune: 4, health: 2 },
      specialEffect: '水路贩运与夜行免遭一切强盗水贼侵扰',
    },
    {
      id: 'boon_gan_ning_blade',
      name: '【百骑裹白双刀】',
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: '夜袭曹营百骑毫发无伤所用之斩马短双刀，刀柄嵌白羽，豪烈无双。',
      figureId: 'gan_ning',
      figureName: '甘宁',
      statBonus: { martial: 8, health: 4, fortune: 3 },
      specialEffect: '战阵突袭逢战必胜，江东悍勇之名播于天下',
    },
  ],

  xun_yu: [
    {
      id: 'boon_xun_yu_brief',
      name: '【荀氏王佐策府要略】',
      type: 'INTEL',
      typeLabel: '战略情报',
      requiredBondLevel: 3,
      description: '尚书令荀文若居中调度汉室州郡民政与官考之枢密文案，字字珠玑。',
      figureId: 'xun_yu',
      figureName: '荀彧',
      statBonus: { intellect: 6, virtue: 4 },
      specialEffect: '文职官场仕途升迁神速，解锁公府名士举荐',
    },
    {
      id: 'boon_xun_yu_jade',
      name: '【尚书令佩玉 · 留香香囊】',
      type: 'TREASURE',
      typeLabel: '传世奇珍',
      requiredBondLevel: 4,
      description: '荀令君坐处三日香之温润白玉佩与清香锦囊，象征汉家纯臣至清名节。',
      figureId: 'xun_yu',
      figureName: '荀彧',
      statBonus: { intellect: 7, virtue: 8, fortune: 4 },
      specialEffect: '海内名流闻名拜谒，朝廷特使降旨旌表清忠',
    },
  ],
};

/**
 * 获取指定历史人物的所有赐予项（带领受状态）
 */
export function getBoonsForFigure(
  figure: HistoricalFigureBond,
  collectedBoonIds: string[] = []
): NobleBoon[] {
  const catalogList = NOBLE_BOONS_CATALOG[figure.id];
  const figureClaimedIds = new Set([
    ...(figure.unlockedGifts || []),
    ...collectedBoonIds,
  ]);

  if (catalogList && catalogList.length > 0) {
    return catalogList.map((boon) => ({
      ...boon,
      claimed: figureClaimedIds.has(boon.id),
    }));
  }

  // 通用备用赐予（针对动态或未在名册中的人物）
  const fallbackList: NobleBoon[] = [
    {
      id: `boon_${figure.id}_letter`,
      name: `【${figure.name}亲题修身手卷】`,
      type: 'MANUAL',
      typeLabel: '经世秘卷',
      requiredBondLevel: 3,
      description: `${figure.name}与足下莫逆相知，亲笔题赠之格言警句与阅世心得。`,
      figureId: figure.id,
      figureName: figure.name,
      statBonus: { intellect: 3, virtue: 3 },
      specialEffect: '识见通达，声名受士林乡里敬慕',
      claimed: figureClaimedIds.has(`boon_${figure.id}_letter`),
    },
    {
      id: `boon_${figure.id}_sword`,
      name: `【${figure.name}赠生死古剑】`,
      type: 'WEAPON',
      typeLabel: '名剑神兵',
      requiredBondLevel: 4,
      description: `故友生死相托，分赠随身防身宝剑，剑身铭刻二人同生共死之盟。`,
      figureId: figure.id,
      figureName: figure.name,
      statBonus: { martial: 5, fortune: 3, health: 2 },
      specialEffect: '临危护身，增益武略勇略与气数',
      claimed: figureClaimedIds.has(`boon_${figure.id}_sword`),
    },
  ];

  return fallbackList;
}

/**
 * 获取羁绊等级与星级、描述
 */
export function getIntimacyLevelInfo(intimacy: number = 25) {
  const bounded = Math.max(0, Math.min(100, intimacy));
  if (bounded < 30) {
    return {
      level: 1,
      title: '初识微交',
      stars: '★☆☆☆',
      color: 'text-[#a89b8d]',
      progressPercent: Math.round((bounded / 30) * 100),
      nextThreshold: 30,
      nextTitle: '相熟故交',
    };
  } else if (bounded < 60) {
    return {
      level: 2,
      title: '相熟故交',
      stars: '★★☆☆',
      color: 'text-amber-400',
      progressPercent: Math.round(((bounded - 30) / 30) * 100),
      nextThreshold: 60,
      nextTitle: '莫逆同道',
    };
  } else if (bounded < 90) {
    return {
      level: 3,
      title: '莫逆同道',
      stars: '★★★☆',
      color: 'text-emerald-400',
      progressPercent: Math.round(((bounded - 60) / 30) * 100),
      nextThreshold: 90,
      nextTitle: '生死托付',
    };
  } else {
    return {
      level: 4,
      title: '生死托付',
      stars: '★★★★',
      color: 'text-[#d4af37]',
      progressPercent: 100,
      nextThreshold: 100,
      nextTitle: '至高契盟',
    };
  }
}

/**
 * 拜访与互动名士的最低生理年岁门槛 (汉制束发成丁之年)
 * 幼童（0~13岁）骨软神萌，尚在童蒙，根本不具备独立游历、备杜康厚礼设宴或登门论道之资。
 * 必须年满14岁及冠成丁，方可作为自立士子游学结纳名仕。
 */
export const MIN_INTERACTION_AGE = 14;

/**
 * 检查当前季节是否能与该名士互动 (包含年龄礼制与时令冷却)
 */
export function canInteractThisSeason(
  figure: HistoricalFigureBond,
  currentYear: number,
  currentSeason: SeasonIndex,
  playerAge?: number
): { canInteract: boolean; reason?: string } {
  if (typeof playerAge === 'number' && playerAge < MIN_INTERACTION_AGE) {
    return {
      canInteract: false,
      reason: `年岁尚幼（现年${playerAge}岁，未满十四岁及冠成丁）。尚在童蒙，骨软神弱，不可自立登门切磋战法、置酒设宴或尺素传书。待及冠成丁后方可游学结交。`,
    };
  }

  if (!figure.isAlive) {
    return {
      canInteract: false,
      reason: '该名士已乘鹤西去，仅余史册遗芳，不可复言。',
    };
  }

  if (
    figure.lastInteractedYear === currentYear &&
    figure.lastInteractedSeason === currentSeason
  ) {
    return {
      canInteract: false,
      reason: '本季已曾寻访叙晤。时令轮转，待下季可再度修书过访。',
    };
  }

  return { canInteract: true };
}

/**
 * 检查玩家是否具备领受该名士传世赐予的资格
 */
export function canClaimBoon(
  figure: HistoricalFigureBond,
  boon: NobleBoon,
  playerAge?: number
): { canClaim: boolean; reason?: string } {
  if (typeof playerAge === 'number' && playerAge < MIN_INTERACTION_AGE) {
    return {
      canClaim: false,
      reason: `未满十四岁及冠成丁（现年${playerAge}岁）。稚子骨肉未固、心智未定，不可执持当世名剑神兵或参悟兵法阵图。`,
    };
  }

  if (figure.bondLevel < boon.requiredBondLevel) {
    return {
      canClaim: false,
      reason: `羁绊未达【${boon.requiredBondLevel === 3 ? '莫逆同道' : '生死托付'}】，名士尚不肯托付重宝。`,
    };
  }

  return { canClaim: true };
}

/**
 * 根据名士流派与身份生成互动选项
 */
export function getInteractionOptions(
  figure: HistoricalFigureBond,
  currentStats: Attributes
): InteractionOption[] {
  // 1. 切磋/请益 (消耗体魄)
  let sparTitle = '切磋论道 · 登门请益';
  let sparDesc = '执礼登门拜谒，与名士共坐长谈，切磋武略才学。';
  let sparTag = '【求学修道】';
  const archetypeGains: Partial<Record<keyof Attributes, number>> = {};

  switch (figure.archetype) {
    case 'MARTIAL':
      sparTitle = '试弓论槊 · 切磋战法';
      sparDesc = `与${figure.name}演练枪棒马术，聆听先登陷阵与沙场驭兵之法。`;
      sparTag = '【兵戎切磋】';
      archetypeGains.martial = 1;
      archetypeGains.health = 1;
      break;
    case 'STRATEGIST':
      sparTitle = '弈棋论势 · 研读韬略';
      sparDesc = `与${figure.name}对弈纵横，剖析中原与江东大势，推演奇正经纬。`;
      sparTag = '【韬略清谈】';
      archetypeGains.intellect = 1;
      break;
    case 'WEALTHY':
      sparTitle = '踏勘商路 · 请益货殖';
      sparDesc = `随${figure.name}巡历坊市盐铁商栈，洞悉谷贱伤农与转运之机。`;
      sparTag = '【货殖经营】';
      archetypeGains.wealth = 1;
      break;
    case 'HEALER':
      sparTitle = '采药调息 · 请教岐黄';
      sparDesc = `随${figure.name}辨识本草经方，受针石调气之法，舒展筋脉。`;
      sparTag = '【岐黄调理】';
      archetypeGains.health = 1;
      archetypeGains.virtue = 1;
      break;
    case 'HERMIT':
      sparTitle = '林泉煎茗 · 考订经训';
      sparDesc = `在${figure.name}山中草堂围炉煎茶，研读周易春秋，超然名利之外。`;
      sparTag = '【林下高致】';
      archetypeGains.virtue = 1;
      break;
  }

  const options: InteractionOption[] = [
    {
      type: 'SPAR_STUDY',
      title: sparTitle,
      tag: sparTag,
      description: sparDesc,
      costDescription: '消耗 体魄 3 点',
      statCosts: { health: 3 },
      intimacyGainMin: 12,
      intimacyGainMax: 18,
      archetypeGains,
    },
    {
      type: 'FEAST_GIFT',
      title: '设宴备礼 · 倾囊厚交',
      tag: '【厚礼款待】',
      description: `备置陈年杜康美酒、江东名茶与厚缎，在雅肆设席开怀畅饮，敦笃情义。`,
      costDescription: '消耗 家财 3 点',
      statCosts: { wealth: 3 },
      intimacyGainMin: 18,
      intimacyGainMax: 26,
      archetypeGains: { virtue: 1 },
    },
    {
      type: 'LETTER_GREETING',
      title: '托鸿修书 · 尺素致意',
      tag: '【尺素传书】',
      description: `关山迢递，托往来行商捎去家信一封致候问安，言辞诚挚，以叙契阔。`,
      costDescription: '消耗 体魄 1 点',
      statCosts: { health: 1 },
      intimacyGainMin: 7,
      intimacyGainMax: 12,
      archetypeGains: { intellect: 1 },
    },
  ];

  return options;
}

/**
 * 互动成功后的名士定制回应文案
 */
export function getInteractionQuote(
  figure: HistoricalFigureBond,
  type: 'SPAR_STUDY' | 'FEAST_GIFT' | 'LETTER_GREETING',
  newBondLevel: number
): string {
  if (type === 'FEAST_GIFT') {
    switch (figure.archetype) {
      case 'WEALTHY':
        return `“哈哈！你我知己何必如此客气？今日且痛饮此瓮杜康，凡江东商路与资财调度，君若有用处只管开口！”`;
      case 'STRATEGIST':
        return `“投我以木桃，报之以琼瑶。承蒙厚意设宴，乱世之中得逢君这般长者知己，天下大计正宜同心谋之！”`;
      case 'MARTIAL':
        return `“好酒！军中戒严难得这等畅快！足下真乃至诚君子，某这条性命与手中长兵，日后誓与足下同进退！”`;
      case 'HEALER':
        return `“盛情难却！老夫虽不善饮酒，然感足下赤诚。此酒性温，少酌亦通血脉，足下善自珍摄！”`;
      case 'HERMIT':
        return `“山野粗疏，承蒙君备重礼登门。世人皆趋炎附势，唯足下情笃于故交，老夫心甚慰藉。”`;
    }
  }

  if (type === 'SPAR_STUDY') {
    switch (figure.archetype) {
      case 'MARTIAL':
        return `“好身手！步履沉着，进退有据！若持此勇烈之气久历战阵，何愁不能平定乱世立万世功名！”`;
      case 'STRATEGIST':
        return `“妙哉！弈棋如用兵，急则失势，缓则生变。方才足下这一着暗藏奇兵之机，令亮/孤大为赞赏。”`;
      case 'WEALTHY':
        return `“经商治产首重识势。如今北方战乱阻隔，淮扬水运正是良机。足下慧眼独具，日后定成巨擘。”`;
      case 'HEALER':
        return `“诊脉见君精气饱满。依老夫所授吐纳导引之功，每日清晨调息三十六息，必能却病延年。”`;
      case 'HERMIT':
        return `“高山仰止，景行行止。君于草堂席地静听《周易》，知进退存亡而不失其正，真通达之士也。”`;
    }
  }

  // LETTER_GREETING
  return `“关山万里，展读尺素如面。得闻故友平安康健，心甚释然。乱世珍重，期来日相见共话沧桑！”`;
}
