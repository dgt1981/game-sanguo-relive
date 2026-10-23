import {
  ProvinceId,
  SocialClass,
  Attributes,
  SeasonalEvent,
  RealisticEnding,
  LifeChoice,
  SeasonIndex,
} from '../types/game';
import { PROVINCES } from '../data/regions';

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
  };
}

export function generateInitialAttributes(socialClass: SocialClass): Attributes {
  const base: Attributes = {
    health: 50 + Math.floor(Math.random() * 20) - 10,
    intellect: 40 + Math.floor(Math.random() * 20) - 10,
    martial: 35 + Math.floor(Math.random() * 20) - 10,
    virtue: 50 + Math.floor(Math.random() * 15),
    wealth: 25 + Math.floor(Math.random() * 15),
    fortune: 45 + Math.floor(Math.random() * 20),
  };

  switch (socialClass) {
    case 'PEASANT':
      base.health += 8;
      base.wealth -= 10;
      base.martial += 4;
      break;
    case 'TOWN_ARTISAN':
      base.wealth += 5;
      base.intellect += 6;
      break;
    case 'FISHER_BOATMAN':
      base.health += 10;
      base.martial += 6;
      base.wealth -= 5;
      break;
    case 'FRONTIER_ARMY':
      base.martial += 15;
      base.health += 8;
      base.wealth -= 5;
      break;
    case 'SCHOLAR_CLERK':
      base.intellect += 20;
      base.virtue += 12;
      base.health -= 5;
      base.wealth += 10;
      break;
    case 'MERCHANT':
      base.wealth += 25;
      base.intellect += 10;
      base.virtue -= 5;
      break;
    case 'NOBLE_GENTRY':
      base.wealth += 45;
      base.intellect += 22;
      base.virtue += 15;
      base.fortune += 15;
      break;
  }

  Object.keys(base).forEach((k) => {
    const key = k as keyof Attributes;
    base[key] = Math.max(10, Math.min(95, base[key]));
  });

  return base;
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
  const province = PROVINCES.find((p) => p.id === profile.currentProvince) || PROVINCES[0];
  const seasonCfg = SEASONS_CONFIG[season];
  const lunarYear = getLunarYearName(year);

  // 1. Macro History lookup or procedural fallback
  const macroKey = `${year}-${season}`;
  let macroText = SEASONAL_MACRO_EVENTS[macroKey];
  if (!macroText) {
    const genericSeasonalMacros: Record<SeasonIndex, string[]> = {
      0: [
        '初春雪融，各州郡春耕发种，诸侯安民葺甲，烽火暂敛。',
        '春回大地，官府行春令催办户籍农课，草莽盗贼稍歇。',
        '孟春之岁，朝廷大射祈谷，天下饥民盼得一载丰润。',
      ],
      1: [
        '盛夏烈日焦土，江南江北汛水偶涨，四方军马休养士卒于阴凉营寨。',
        '夏日多暴雨溽热，郡县防洪筑堤，市集丝布盐酪交易繁密。',
        '溽暑炎炎，各方斥候飞骑于官道往来探查敌情，边境关卡盘查严密。',
      ],
      2: [
        '金风肃杀，秋麦割尽归仓，各路诸侯征粮充实府库，常闻边塞战马长嘶。',
        '秋高气爽，塞外胡马草肥，幽并凉州防边甚急，中原军民忙于秋收纳赋。',
        '霜降木落，四野萧疏，郡县兵马调发演阵，兵戈之气渐浓。',
      ],
      3: [
        '朔风凛冽，大雪纷飞，四野冰封。军马收营过冬，百姓闭门围炉烤火。',
        '岁暮严寒，各家宰牲除祟备迎元旦，天寒流民乞求片瓦藏身。',
        '冬日河封，南北漕运暂停，乡民合族分粮祭祖，共度严冬残岁。',
      ],
    };
    const arr = genericSeasonalMacros[season];
    macroText = arr[(year + season) % arr.length];
  }

  // 2. Regional Impact
  let regionalText = '';
  if (province.id === 'JIZHOU' && year <= 185) {
    regionalText = `${seasonCfg.name}日里，巨鹿四野皆是裹黄头巾之人，官军与道徒攻杀不停，【${profile.county}】城门白昼紧闭。`;
  } else if (province.id === 'XUZHOU' && (year === 193 || year === 194) && season >= 2) {
    regionalText = `曹公东征徐州，拔数十城，【${profile.county}】城外泗水漂浮死尸，鸡犬不鸣，四境凄风惨雨。`;
  } else if (province.id === 'YANZHOU' && year === 194 && season === 1) {
    regionalText = `夏日飞蝗自东狂卷而来，树皮草根食尽，郡内大饥，人相食，乡邻为争一捧草籽拔刀相向。`;
  } else if (province.id === 'LUOYANG' && year === 190 && season === 1) {
    regionalText = `洛阳宫阙火势连绵两百里，烟焰蔽日，董卓驱赶数百万老弱西行，哭声盈野，家园毁于一旦。`;
  } else if (province.id === 'JIAOZHOU') {
    regionalText = `${seasonCfg.name}节的交州海风习习，士使君保境安民，番禺港舶船带来南洋象牙与胡椒，百姓不知北国兵燹。`;
  } else if (province.id === 'JINGZHOU' && year >= 191 && year <= 207) {
    regionalText = `荆襄九郡土地膏腴，刘使君抚循流民，【${profile.county}】水稻桑麻丰茂，避乱名士在溪桥书声琅琅。`;
  } else if (province.id === 'LIANGZHOU') {
    regionalText = `边关${seasonCfg.name}风卷寒沙，韩遂马腾骑队巡掠要隘，郡中民户皆带弓箭自卫，不敢轻出长城。`;
  } else {
    regionalText = `【${profile.county}】这一${seasonCfg.name}季物价稍有起伏，县吏差徭按期征发，乡老在村头槐树下议论天下战事。`;
  }

  // 3. Personal Story & Life Choices
  let personalStory = '';
  let choice: { prompt: string; options: LifeChoice[] } | undefined = undefined;

  // Age 0: Birth season & infant survival
  if (age === 0) {
    if (season === 0) {
      personalStory = `公元184年孟春正月，你在【${province.provinceName}·${profile.commandery}·${profile.county}】一间破瓦草屋中呱呱坠地。父亲${profile.fatherName}在门首插了一根柳枝驱邪，母亲${profile.motherName}虚弱地给你喂了一口温米汤。外头春寒未散，冰凌滴水，你来到这个人世间了。`;
    } else if (season === 1) {
      personalStory = `四月入夏，天气转热。母亲${profile.motherName}抱着你坐在槐树荫下纳凉赶蚊。隔壁村子传来黄巾贼打劫大户的喧闹声，父亲把门板用粗木死死顶住。`;
    } else if (season === 2) {
      personalStory = `秋风初起，高粱熟了。村里被官府抽走两人去广宗前线推车，母亲把你背在后背上在麦场拾麦穗，你睁着大眼睛咿呀学语。`;
    } else {
      personalStory = `冬雪纷飞，你度过了人生的第一个年关。天寒地冻，柴炭稀缺，父亲在土灶里烧野草给你烘热襁褓，全家人紧挨在一起取暖。`;
    }
  } else if (age === 3 && season === 0) {
    personalStory = `三岁春，你迈着小短腿跟在姐姐身后在田埂上捉泥鳅。泥水溅了一身，母亲笑着拿粗布替你擦洗小花脸。体魄+2。`;
  } else if (age === 5 && season === 2) {
    personalStory = `五岁秋，洛阳大乱的消息传到乡间。一队疲惫不堪的败兵穿过村子，抢走了邻居家的两只老母鸡。你躲在柴垛后屏住呼吸，第一次见到了明晃晃的环首刀。`;
  } else if (age === 7 && season === 0) {
    // Choice: 7yo path
    personalStory = `七岁春，汉家有“七岁学书数”之制。家里商量你的出路。`;
    choice = {
      prompt: '七岁阳春，面对艰辛的家境，你打算如何打发童年岁月？',
      options: [
        {
          id: 'c_age7_cattle',
          label: '在山坡田头替大户放牛割草，补贴家用',
          description: '做个踏实懂事的苦力孩子，强筋健骨，分担父母重担。',
          statChanges: { health: 6, martial: 4, virtue: 4 },
          outcomeText: '你在日光下晒得黝黑壮实，熟知山野草木，村中老少都夸你是个本分孝顺的好孩子。',
        },
        {
          id: 'c_age7_study',
          label: '站在乡里私塾窗外偷听老秀才讲授《孝经》与《千字文》',
          description: '用枯树枝在地上划土练字，渴望明晓是非经义。',
          requirements: { intellect: 35 },
          statChanges: { intellect: 10, virtue: 6, wealth: -2 },
          outcomeText: '塾师见你心诚，收了你两斤干红薯作修脯，教你辨认了三百个隶书汉字。',
        },
        {
          id: 'c_age7_brawl',
          label: '领着村里顽童削木刀演练“官军捉贼”，争当孩子王',
          description: '生性胆壮，喜好听客商讲述吕布、关张万人敌的英雄故事。',
          statChanges: { martial: 8, health: 6, virtue: -2 },
          outcomeText: '你成了四乡八邻顽童的领头，上树摸鸟、下水摸鱼，胆魄过人。',
        },
      ],
    };
  } else if (age === 10 && season === 2) {
    // Choice: 10yo Autumn crisis
    personalStory = `十岁金秋，母亲染上了咳喘虚热之疾，日渐消瘦。县城药铺掌柜索银六百钱，家中断无积蓄。`;
    choice = {
      prompt: '母亲久病咳血，家中无银购药，面对危局你作何打算？',
      options: [
        {
          id: 'c_age10_herb',
          label: '腰缚草绳攀爬荒山绝壁，亲自搜寻野生桔梗与柴胡',
          description: '冒跌落悬崖与猛兽毒蛇之险，全凭一片赤诚孝心。',
          statChanges: { health: -4, virtue: 12, intellect: 4, fortune: 6 },
          outcomeText: '手脚划出道道血口，终于采得数株陈年紫草与金银花，煎汤服下后母亲热退神清，抱你垂泪。',
        },
        {
          id: 'c_age10_apprentice',
          label: '跪在城内济世药铺门前，求掌柜收为三年杂役挑水切药换药材',
          description: '以三年童工之身换取汤药，顺便偷学药理本草。',
          statChanges: { intellect: 8, wealth: 4, virtue: 6 },
          outcomeText: '掌柜感你仁孝，赠了三副柴胡汤，并在药坊传授你辨认川贝、当归与黄芪的本草之术。',
        },
        {
          id: 'c_age10_borrow',
          label: '向乡里放高利贷的豪强大户立下借券借粮换药',
          description: '先救至亲性命，哪怕日后加倍做牛做马偿还。',
          statChanges: { wealth: -8, virtue: 4, fortune: -2 },
          outcomeText: '解了燃眉之急，但也欠下大户沉重债务，从此每年秋后都须去豪强田庄无偿做苦工。',
        },
      ],
    };
  } else if (age === 14 && season === 1) {
    // Choice: 14yo Adult path
    personalStory = `十四岁夏，行将成丁束发。官府查验户籍簿，各方诸侯四处征收力役。`;
    choice = {
      prompt: '成丁立身之际，你打算以何等行当开始养家糊口？',
      options: [
        {
          id: 'c_age14_blacksmith',
          label: '在县城铁匠铺拜师，学习锻造环首长刀与农耕犁头',
          description: '乱世铁匠吃香，既能打造农具，亦能修造兵甲。',
          statChanges: { martial: 8, health: 8, wealth: 6 },
          outcomeText: '炉火映红了你的脸膛，三年抡锤练得浑身精肉，打造的短刀削铁如泥，备受好评。',
        },
        {
          id: 'c_age14_boatman',
          label: '投效江河船帮，随运粮商船南下江东贩卖土特',
          description: '走南闯北，多长见识，江河虽有风浪，但利钱颇丰。',
          statChanges: { wealth: 14, intellect: 8, health: -4, fortune: 4 },
          outcomeText: '你随船历经长江与汉水，熟悉了水流暗礁，还学会了与水贼及关税差役打交道。',
        },
        {
          id: 'c_age14_scribe',
          label: '在县衙户曹当一名书办抄手，登记粮库流水账目',
          description: '吃官家一口薄粥，结交里正亭长，明晓律令规矩。',
          requirements: { intellect: 45 },
          statChanges: { intellect: 12, wealth: 6, virtue: 4 },
          outcomeText: '你写得一手整饬的汉隶，账目明晰，县丞夸你是个可用之才。',
        },
      ],
    };
  } else if (age === 18 && season === 2) {
    // Choice: 18yo Conscription
    personalStory = `十八岁秋，战火逼近。县里铜锣敲响，长官按籍点卯，一村之中必须抽丁两人随军出征。`;
    choice = {
      prompt: '点兵鼓声震天，差役腰悬皮鞭按名拿人，你作何决断？',
      options: [
        {
          id: 'c_age18_frontline',
          label: '扛起丈二长矛应征入伍，做一名冲锋陷阵的行伍步卒',
          description: '男儿横刀走战阵，博个军功光宗耀祖，总胜过饿死沟壑！',
          statChanges: { martial: 14, health: 4, wealth: 4, fortune: -4 },
          outcomeText: '穿上破旧皮甲，端起长枪开拔出营。母亲追着队列送了十里，将一包故乡热土塞入你怀里。',
          fatalCheck: (st) => {
            if (st.health < 25 && st.martial < 35) {
              return { isFatal: true, deathReason: '从军第一年随大军远征，因暴发水土不服霍乱，殁于荒野大营。' };
            }
            return null;
          },
        },
        {
          id: 'c_age18_logistics',
          label: '主动申请充当后方运粮夫，推独轮小车跋涉山川运米',
          description: '运粮虽苦不堪言，但无需首当其冲面对敌军刀矛箭雨。',
          statChanges: { health: 6, virtue: 6, wealth: 2 },
          outcomeText: '车轮吱呀响彻古道，你脚磨起无数血泡，在后营运粮数月，结识了各方豪爽民夫。',
        },
        {
          id: 'c_age18_flee_south',
          label: '典当破房薄田，连夜护持全家老少南逃荆襄避乱',
          description: '避开诸侯混战泥潭，前往刘景升治下的安宁乐土。',
          statChanges: { wealth: -10, virtue: 8, fortune: 8, health: -4 },
          outcomeText: '跋山涉水两千里，终于安然抵达襄阳。一家人在水边搭起茅屋，免去兵戈杀戮之苦。',
        },
      ],
    };
  } else if (age === 24 && season === 0) {
    // Choice: 24yo Marriage
    personalStory = `二十四岁阳春。乡邻见你为人诚笃勤奋，有村老主动为你做媒，说合邻庄勤谨温厚的刘氏女子。`;
    choice = {
      prompt: '草民成家之机，你是否应允这门亲事？',
      options: [
        {
          id: 'c_age24_marry',
          label: '拿出多年积攒的二千铜钱与四匹粗布，下聘迎娶刘氏为妻',
          description: '在这风雨飘摇的人间，为自己寻一个相濡以沫的温存港湾。',
          statChanges: { virtue: 10, health: 6, wealth: -12 },
          outcomeText: '两盏浊酒，红烛摇曳。你与刘氏结发为夫妻，茅屋之中从此有了炊烟笑语。次年为你添了麟儿。',
        },
        {
          id: 'c_age24_hoard_grain',
          label: '婉言谢绝媒人，专心置办地窖藏购干粮肉干以防荒乱',
          description: '世道险恶战乱无常，不敢轻易拖累妻儿妇孺。',
          statChanges: { wealth: 16, intellect: 6, virtue: -2 },
          outcomeText: '你将积蓄换成了数十石高粱大麦深埋地窖，在这乱世为自己攒下了一道保命屏障。',
        },
      ],
    };
  } else if (age === 33 && season === 3) {
    // Choice: 33yo Great Epidemic (Winter)
    personalStory = `三十三岁严冬（建安年间）。中原大疫暴发，家家户户高烧不退，棺木售空，哭声连夜不绝。你与家人也浑身酸痛发热。`;
    choice = {
      prompt: '伤寒恶疾袭来，全家高热战栗，你该如何救全家人性命？',
      options: [
        {
          id: 'c_age33_soup',
          label: '遵南阳张仲景医书所传“当归生姜羊肉汤 / 麻黄汤”熬煮浓汁痛饮',
          description: '信名医方剂，重姜葱发汗退热，不事巫鬼。',
          requirements: { intellect: 40 },
          statChanges: { health: 12, intellect: 8, wealth: -6 },
          outcomeText: '一碗浓汤灌下，通体大汗淋漓！次日热退骨安，你还将此法传授给隔壁邻舍，活人无数。',
        },
        {
          id: 'c_age33_quarantine',
          label: '闭门绝客，庭院遍洒生石灰，燃艾草熏蒸屋角',
          description: '坚决执行严苛隔离之策，耐心挨过冬寒疫期。',
          statChanges: { health: 8, wealth: -4 },
          outcomeText: '虽然家中存粮耗损大半，但一家老小无一人病殁，安然熬过了这场建安大劫。',
        },
        {
          id: 'c_age33_pray',
          label: '随众去道观求取黄纸符水焚化吞服祈福',
          description: '求神问卜，听天由命。',
          statChanges: { health: -14, fortune: -4 },
          outcomeText: '符水无济于事，你连烧了二十日，险些一命呜呼，病愈后落下了肺经喘咳之疾。',
          fatalCheck: (st) => {
            if (st.health < 28) {
              return { isFatal: true, deathReason: '建安伤寒大疫蔓延，高热抽搐无药可医，殁于榻上。' };
            }
            return null;
          },
        },
      ],
    };
  } else if (age === 45 && season === 2) {
    // Choice: 45yo Mature Autumn
    personalStory = `四十五岁秋。大汉已终，魏蜀吴各自立国。你的双鬓渐染秋霜，儿女业已成人，乡邻遇事常来听取你的主见。`;
    choice = {
      prompt: '步入知命之年，你打算如何安顿往后春秋？',
      options: [
        {
          id: 'c_age45_elder',
          label: '出任乡党三老，秉公主持乡饮与调息邻里争端',
          description: '立德行仁，成为地方受人敬重的大长辈。',
          statChanges: { virtue: 14, intellect: 6, wealth: 4 },
          outcomeText: '县长巡行过村亦下车揖手相问，邻里田宅口角只要你一言便冰释前嫌，威望日隆。',
        },
        {
          id: 'c_age45_farm_expand',
          label: '督导子孙辛勤整修水田，建起榨油碾米水磨坊',
          description: '为子孙打下扎实家私产业，家道殷实。',
          statChanges: { wealth: 18, health: 4 },
          outcomeText: '家中谷满仓、猪羊满圈。在数十载离乱沧桑之后，你守护住了一大家子的安稳烟火。',
        },
        {
          id: 'c_age45_music',
          label: '手刻竹笛短箫，常在老槐树下为村童吹奏汉末民谣',
          description: '浮名利禄皆浮云，寄情山水乐道知命。',
          statChanges: { virtue: 10, health: 8, fortune: 6 },
          outcomeText: '夕阳斜照，箫声悠扬穿过田野，孩子们拍手欢唱，你心中一片宁静淡泊。',
        },
      ],
    };
  } else if (age >= 60 && season === 3) {
    // Choice: 60yo Winter retrospective
    personalStory = `年逾花甲，寒冬初雪。三国的枭雄老将皆已作古，你坐在柴火盆旁烤红薯，膝下孙儿拉着你的衣襟，问起当年赤壁与官渡的烽火。`;
    if (age === 60) {
      choice = {
        prompt: '孙儿仰着稚嫩的小脸问：“爷爷，当年那些大英雄大人物到底争的是什么呀？”',
        options: [
          {
            id: 'c_age60_ordinary',
            label: '“什么开疆拓土，都比不上一锅热饭、一家齐整。”',
            description: '看透了霸业功名背后的森森白骨，深知平淡之珍贵。',
            statChanges: { virtue: 12, intellect: 8 },
            outcomeText: '孙儿似懂非懂地咬着红薯重重点头。那一晚，你睡得格外平静香甜。',
          },
          {
            id: 'c_age60_record',
            label: '取出珍藏多年的粗麻纸，就着油灯把六十年真实见闻口述记为家谱',
            description: '以一个平凡生灵的双眼，留存这大乱甲子最真实的血泪印记。',
            statChanges: { intellect: 14, virtue: 8 },
            outcomeText: '这卷写在粗纸上的草民笔记，后来成为后世史官考求汉末民间世相最弥足珍贵的文献。',
          },
        ],
      };
    } else {
      personalStory = `岁末严寒，子孙绕膝端茶添炭。你见证了大汉的倾覆与群雄的凋零，在这动荡乱世中安度晚年，实乃天之大幸。仁厚+2，体魄-1。`;
    }
  } else {
    // Normal seasonal civilian experiences
    const seasonalLifePhrases: Record<SeasonIndex, string[]> = {
      0: [
        `初春细雨润麦苗，你扛着农具在晨雾中除草培土，双手布满老茧，但麦穗长势喜人。体魄+1，家资+1。`,
        `春风吹开漫山野花，你与邻家伙伴在溪边采得鲜嫩荠菜与春笋，煮了一锅热腾腾的野菜汤。仁厚+1。`,
        `县城开春集市，你随车去卖了几篓竹编器具，换得一升粗盐与半匹土布。家资+1，识见+1。`,
        `春寒料峭，偶染小恙，母亲煎了姜汤葱白，发了一场大汗便好了。体魄+1。`,
      ],
      1: [
        `入夏雷雨连绵，山溪暴涨，你与乡邻连夜挑土加固堤坝，护住了全村百亩秧田。体魄+1，仁厚+1。`,
        `盛夏酷暑难耐，你在树荫下编制蒲草凉席，偶有南来客商在井边讨水喝，送了你几个北方干枣。识见+1。`,
        `梅雨季节屋顶漏雨，你冒雨爬上屋顶换上新茅草，虽然衣衫湿透，但屋内安然无恙。体魄+1。`,
        `夏日田头捕得几条大鲤鱼，全家人大快朵颐，晚风吹拂稻香四溢。家资+1。`,
      ],
      2: [
        `金秋霜降，黄澄澄的谷子割倒了一片又一片，连枷声声响彻晒谷场，全家抢收归仓。体魄+1，家资+2。`,
        `秋风萧瑟，官府差役进村征收算赋，幸得家中余粮充足，顺利交齐租赋。家资-1，名望+1。`,
        `重阳佳节，你与亲友登上北山采茱萸，饮了一杯自酿的菊花浊酒，遥望远方烽燧长烟。仁厚+1，识见+1。`,
        `秋高气爽，收割完毕后你在麦茬地里放牧牛羊，望着大雁往南飞去。心境怡然，体魄+1。`,
      ],
      3: [
        `初雪覆瓦，檐下垂冰。全家人围在火盆前烤干苞谷，听祖辈讲述当年光武皇帝昆阳大战的传奇。仁厚+1。`,
        `岁末腊月，乡中合杀了一头年猪，家家分得两斤肥肉，腌制腊肉以备新年。家资+1。`,
        `大雪封路数日，你在草棚中修补耕犁与板车，静待来年开春。识见+1。`,
        `除夕之夜，村中燃起爆竹驱除山魈恶鬼，全家围坐饮椒柏酒，祈愿来年风调雨顺、少有兵火。体魄+1，气数+1。`,
      ],
    };

    const phrases = seasonalLifePhrases[season];
    personalStory = phrases[(year * 4 + season) % phrases.length];
  }

  return {
    year,
    season,
    seasonName: seasonCfg.fullName,
    seasonMonths: seasonCfg.months,
    lunarYear,
    age,
    macroHistory: macroText,
    regionalImpact: regionalText,
    personalStory,
    choice,
  };
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

  if (deathReason && deathReason.includes('阵亡')) {
    return {
      title: `${profile.county}随军戍卒 · 享年${deathAge}岁`,
      epitaphTitle: '乱世白骨生还无期',
      summary: `应征入伍十数载，转战中原数千里，殁于公元${deathYear}年战阵之中。死时怀中尚揣着一包未寄出的故乡泥土与母亲缝制的旧布鞋底。`,
      historianNote: '可怜无定河边骨，犹是春闺梦里人。横槊之雄今安在，枯骨荒草伴残阳。',
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
