import {
  ProvinceId,
  Attributes,
  SeasonalEvent,
  LifeChoice,
  SeasonIndex,
  HistoricalFigureBond,
  MilitaryAffiliation,
  HistoricalDialogue,
} from '../types/game';
import { PersonProfile } from './lifeSimulator';

export interface RegionalFigureData {
  id: string;
  name: string;
  courtesyName: string;
  title: string;
  provinceId: ProvinceId;
  camp: 'WEI' | 'SHU' | 'WU' | 'NEUTRAL';
  campLabel: string;
  avatarChar: string;
  activeYears: [number, number]; // e.g. [184, 229]
  greeting: string;
  historicRole: string;
}

export const REGIONAL_HISTORICAL_FIGURES: RegionalFigureData[] = [
  // 幽州
  {
    id: 'zhao_yun',
    name: '赵云',
    courtesyName: '子龙',
    title: '常山真定壮士 · 银枪义士',
    provinceId: 'YOUZHOU',
    camp: 'SHU',
    campLabel: '蜀汉镇东将军 · 顺平侯',
    avatarChar: '云',
    activeYears: [184, 229],
    greeting: '“天下大乱，未知谁是明主。民有倒悬之急，吾等当以仁政为先，何惜此躯！”',
    historicRole: '一身是胆常胜将军',
  },
  {
    id: 'liu_bei',
    name: '刘备',
    courtesyName: '玄德',
    title: '涿郡义民首领 · 汉景帝阁下玄孙',
    provinceId: 'YOUZHOU',
    camp: 'SHU',
    campLabel: '蜀汉昭烈皇帝',
    avatarChar: '备',
    activeYears: [184, 223],
    greeting: '“同为汉家儿郎，生于斯世，苟全性命亦可，若能扶危济困，保全桑梓，岂不快哉！”',
    historicRole: '仁德兼备汉室之雄',
  },
  {
    id: 'zhang_fei',
    name: '张飞',
    courtesyName: '翼德',
    title: '涿郡豪绅 · 燕颔虎须豪士',
    provinceId: 'YOUZHOU',
    camp: 'SHU',
    campLabel: '蜀汉车骑将军',
    avatarChar: '飞',
    activeYears: [184, 221],
    greeting: '“俺在涿县杀猪贩酒，素喜结交天下勇义汉子！来，满饮此碗粗酒！”',
    historicRole: '万人敌猛将',
  },

  // 冀州
  {
    id: 'yuan_shao',
    name: '袁绍',
    courtesyName: '本初',
    title: '四世三公 · 邺城雄主',
    provinceId: 'JIZHOU',
    camp: 'NEUTRAL',
    campLabel: '河北大将军 · 冀州牧',
    avatarChar: '绍',
    activeYears: [184, 202],
    greeting: '“吾袁氏累世公卿，海内名士无不倾心投奔。足下可愿随本初平定海内？”',
    historicRole: '关东盟主',
  },
  {
    id: 'ju_shou',
    name: '沮授',
    courtesyName: '监军',
    title: '冀州广平名士 · 奇谋监军',
    provinceId: 'JIZHOU',
    camp: 'NEUTRAL',
    campLabel: '冀州别驾 · 奋威将军监军',
    avatarChar: '授',
    activeYears: [184, 200],
    greeting: '“势在蓄势，理当奉天子以令诸侯、劝农积谷，奈何众意纷纭！”',
    historicRole: '河北第一谋臣',
  },

  // 并州
  {
    id: 'zhang_liao',
    name: '张辽',
    courtesyName: '文远',
    title: '雁门马邑猛士 · 边关骁骑',
    provinceId: 'BINGZHOU',
    camp: 'WEI',
    campLabel: '曹魏前将军 · 晋阳侯',
    avatarChar: '辽',
    activeYears: [184, 222],
    greeting: '“边关朔风凛冽，男儿立于天地间，当跨铁马斩胡虏，护我中原百姓！”',
    historicRole: '威震逍遥津一代良将',
  },
  {
    id: 'lu_bu',
    name: '吕布',
    courtesyName: '奉先',
    title: '五原九原飞将 · 弓马绝伦',
    provinceId: 'BINGZHOU',
    camp: 'NEUTRAL',
    campLabel: '温侯 · 飞将军',
    avatarChar: '布',
    activeYears: [184, 198],
    greeting: '“大丈夫生居天地间，岂能郁郁久居人下！识得我方天画戟否？”',
    historicRole: '天下第一骁将',
  },

  // 凉州
  {
    id: 'jia_xu',
    name: '贾诩',
    courtesyName: '文和',
    title: '武威姑臧隐士 · 算无遗策',
    provinceId: 'LIANGZHOU',
    camp: 'WEI',
    campLabel: '曹魏开国太尉',
    avatarChar: '诩',
    activeYears: [184, 223],
    greeting: '“凉州四野兵凶战危。多看、少言、不逞强，保全己身与亲友，方是乱世至道。”',
    historicRole: '算无遗策谋己高人',
  },
  {
    id: 'ma_chao',
    name: '马超',
    courtesyName: '孟起',
    title: '扶风茂陵少帅 · 神威天将军',
    provinceId: 'LIANGZHOU',
    camp: 'SHU',
    campLabel: '蜀汉骠骑将军 · 斄乡侯',
    avatarChar: '超',
    activeYears: [190, 222],
    greeting: '“西凉健儿控弦十万，驰骋大漠黄沙，谁敢犯我河西关陇之地！”',
    historicRole: '西凉锦马超',
  },

  // 司隶 · 洛阳
  {
    id: 'sima_yi',
    name: '司马懿',
    courtesyName: '仲达',
    title: '河内温县世家 · 深藏若虚',
    provinceId: 'LUOYANG',
    camp: 'WEI',
    campLabel: '曹魏太傅 · 宣皇帝',
    avatarChar: '懿',
    activeYears: [195, 251],
    greeting: '“善为将者，先为不可胜，以待敌之可胜。春华秋实，唯耐者能收其成。”',
    historicRole: '隐忍极智辅政重臣',
  },
  {
    id: 'cai_wenji',
    name: '蔡文姬',
    courtesyName: '琰',
    title: '陈留才女 · 焦尾琴宗',
    provinceId: 'LUOYANG',
    camp: 'NEUTRAL',
    campLabel: '汉中郎蔡邕之女',
    avatarChar: '姬',
    activeYears: [184, 230],
    greeting: '“胡笳声咽，汉宫烟灭。纵有万卷诗书在胸，亦难抵离乱秋风之凄凉。”',
    historicRole: '千古才女琴律宗匠',
  },

  // 豫州 & 颍川
  {
    id: 'xun_yu',
    name: '荀彧',
    courtesyName: '文若',
    title: '颍川名士 · 王佐之才',
    provinceId: 'YINGCHUAN',
    camp: 'WEI',
    campLabel: '汉尚书令 · 万岁亭侯',
    avatarChar: '彧',
    activeYears: [184, 212],
    greeting: '“匡弼汉室，抚循黎庶，使四海重见承平，乃吾辈读书人毕生之志。”',
    historicRole: '留香荀令王佐谋主',
  },
  {
    id: 'guo_jia',
    name: '郭嘉',
    courtesyName: '奉孝',
    title: '颍川奇才 · 鬼才军谋',
    provinceId: 'YINGCHUAN',
    camp: 'WEI',
    campLabel: '曹操军师祭酒 · 洧阳亭侯',
    avatarChar: '嘉',
    activeYears: [184, 207],
    greeting: '“兵贵神速，机不可失！饮下此斗春醪，天下兴亡不过掌中弈局。”',
    historicRole: '算无遗策天生奇佐',
  },
  {
    id: 'hua_tuo',
    name: '华佗',
    courtesyName: '元化',
    title: '沛国谯县神医 · 杏林扁鹊',
    provinceId: 'YUZHOU',
    camp: 'NEUTRAL',
    campLabel: '汉末悬壶神医',
    avatarChar: '佗',
    activeYears: [184, 208],
    greeting: '“人体欲得劳动，血脉流通，百病不生。草木金石皆能疗疮救苦，性命重于泰山。”',
    historicRole: '麻沸散五禽戏医圣',
  },
  {
    id: 'cao_cao',
    name: '曹操',
    courtesyName: '孟德',
    title: '沛国谯县名将 · 治世能臣',
    provinceId: 'YUZHOU',
    camp: 'WEI',
    campLabel: '魏武帝 · 大丞相',
    avatarChar: '操',
    activeYears: [184, 220],
    greeting: '“对酒当歌，人生几何！周公吐哺，天下归心。足下有何高见安顿苍生？”',
    historicRole: '魏武雄主文学巨擘',
  },

  // 兖州
  {
    id: 'dian_wei',
    name: '典韦',
    courtesyName: '勇烈',
    title: '陈留己吾壮士 · 古之恶来',
    provinceId: 'YANZHOU',
    camp: 'WEI',
    campLabel: '曹操亲军都尉',
    avatarChar: '韦',
    activeYears: [184, 197],
    greeting: '“俺有一双八十斤精铁大戟，单手能拔牙门大旗！遇敌只管躲在俺身后！”',
    historicRole: '舍生护主第一义士',
  },

  // 青州
  {
    id: 'tai_shi_ci',
    name: '太史慈',
    courtesyName: '子义',
    title: '东莱黄县义士 · 猿臂神射',
    provinceId: 'QINGZHOU',
    camp: 'WU',
    campLabel: '东吴建昌都尉',
    avatarChar: '慈',
    activeYears: [184, 206],
    greeting: '“大丈夫生于乱世，当带三尺之剑，立不世之功！信诺二字，不可负也。”',
    historicRole: '信义笃诚弓马名将',
  },

  // 徐州
  {
    id: 'zhuge_liang_child',
    name: '诸葛亮',
    courtesyName: '孔明',
    title: '琅琊阳都书童 · 幼年卧龙',
    provinceId: 'XUZHOU',
    camp: 'SHU',
    campLabel: '蜀汉丞相 · 武乡侯',
    avatarChar: '亮',
    activeYears: [184, 234],
    greeting: '“大乱之世，徐州兵燹日甚。避祸自守，多读圣贤农桑之策，来日方能安邦济世。”',
    historicRole: '两朝开济万古一人',
  },
  {
    id: 'lu_su',
    name: '鲁肃',
    courtesyName: '子敬',
    title: '临淮东城巨商 · 指囷相赠',
    provinceId: 'XUZHOU',
    camp: 'WU',
    campLabel: '东吴大都督 · 临淮侯',
    avatarChar: '肃',
    activeYears: [184, 217],
    greeting: '“家财千仓，若不能救济饥寒邻里，与土石何异？来人，开仓分米百石！”',
    historicRole: '东吴榻上策大都督',
  },
  {
    id: 'mi_zhu',
    name: '糜竺',
    courtesyName: '子仲',
    title: '东海朐县巨贾 · 散财纾难',
    provinceId: 'XUZHOU',
    camp: 'SHU',
    campLabel: '蜀汉安汉将军',
    avatarChar: '竺',
    activeYears: [184, 221],
    greeting: '“汉室板荡，行商四方皆不安。唯有仁义明公，方可保天下商民安生乐业。”',
    historicRole: '倾资助刘东海义商',
  },

  // 荆州
  {
    id: 'pang_tong',
    name: '庞统',
    courtesyName: '士元',
    title: '襄阳名士 · 凤雏先生',
    provinceId: 'JINGZHOU',
    camp: 'SHU',
    campLabel: '蜀汉军师中郎将',
    avatarChar: '统',
    activeYears: [184, 214],
    greeting: '“论治乱兴衰，知人论世，天下谁能出鹿门书院左右？足下貌虽朴素，目光甚清。”',
    historicRole: '凤雏奇谋名士',
  },
  {
    id: 'zhang_zhongjing',
    name: '张仲景',
    courtesyName: '机',
    title: '南阳涅阳名医 · 伤寒太守',
    provinceId: 'JINGZHOU',
    camp: 'NEUTRAL',
    campLabel: '汉长沙太守 · 医圣',
    avatarChar: '机',
    activeYears: [184, 219],
    greeting: '“感往昔之沦丧，伤横夭之莫救。此乃《伤寒杂病论》残卷，足下若能熟读，可活万家。”',
    historicRole: '千古中医医圣',
  },
  {
    id: 'guan_yu',
    name: '关羽',
    courtesyName: '云长',
    title: '河东解良名将 · 威震华夏',
    provinceId: 'JINGZHOU',
    camp: 'SHU',
    campLabel: '蜀汉前将军 · 汉寿亭侯',
    avatarChar: '羽',
    activeYears: [184, 220],
    greeting: '“玉可碎而不可改其白，竹可焚而不可毁其节！关某青龙偃月刀下，不斩无义之辈。”',
    historicRole: '义薄云天武圣',
  },

  // 扬州
  {
    id: 'zhou_yu',
    name: '周瑜',
    courtesyName: '公瑾',
    title: '庐江舒县名将 · 美周郎',
    provinceId: 'YANGZHOU',
    camp: 'WU',
    campLabel: '东吴大都督 · 偏将军',
    avatarChar: '瑜',
    activeYears: [184, 210],
    greeting: '“大江东去，浪淘尽千古风流人物！操水军楼船者，需心平气和，顺水推舟。”',
    historicRole: '赤壁破曹英姿美周郎',
  },
  {
    id: 'sun_ce',
    name: '孙策',
    courtesyName: '伯符',
    title: '吴郡富春少帅 · 江东小霸王',
    provinceId: 'YANGZHOU',
    camp: 'WU',
    campLabel: '讨逆将军 · 吴侯',
    avatarChar: '策',
    activeYears: [184, 200],
    greeting: '“带三尺青锋扫荡江东六郡，男儿当如烈火横卷荒原！可敢与策同行？”',
    historicRole: '江东霸业奠基人',
  },
  {
    id: 'lu_xun',
    name: '陆逊',
    courtesyName: '伯言',
    title: '吴郡望族名士 · 儒雅帅才',
    provinceId: 'YANGZHOU',
    camp: 'WU',
    campLabel: '东吴大都督 · 江陵侯',
    avatarChar: '逊',
    activeYears: [195, 245],
    greeting: '“忍耐一时之进退，察地利风候之变。胜负之道，在于顺时量力。”',
    historicRole: '火烧连营夷陵破刘大都督',
  },

  // 益州
  {
    id: 'fa_zheng',
    name: '法正',
    courtesyName: '孝直',
    title: '扶风智囊 · 奇谋算主',
    provinceId: 'YIZHOU',
    camp: 'SHU',
    campLabel: '蜀汉尚书令 · 护军将军',
    avatarChar: '正',
    activeYears: [190, 220],
    greeting: '“蜀道之难，难于上青天。然关塞险隘，正乃智者布下天罗地网之所。”',
    historicRole: '汉中定策奇谋主',
  },

  // 交州
  {
    id: 'shi_xie',
    name: '士燮',
    courtesyName: '威彦',
    title: '苍梧广信使君 · 岭南化被',
    provinceId: 'JIAOZHOU',
    camp: 'NEUTRAL',
    campLabel: '交趾太守 · 龙度亭侯',
    avatarChar: '燮',
    activeYears: [184, 226],
    greeting: '“中原逐鹿白骨蔽野，交州偏处南服，教民耕织诵读，可保数十年无兵戈之灾。”',
    historicRole: '岭南学统开创者',
  },
];

/**
 * 依据玩家当前所在省份和年代，检索同地区历史人物
 */
export function getRegionalFigure(
  provinceId: ProvinceId,
  year: number
): RegionalFigureData | undefined {
  const matches = REGIONAL_HISTORICAL_FIGURES.filter(
    (f) => f.provinceId === provinceId && year >= f.activeYears[0] && year <= f.activeYears[1]
  );
  if (matches.length === 0) return undefined;
  return matches[(year * 3 + provinceId.length) % matches.length];
}

/**
 * 检查玩家是否满足参加重大演义/历史战役的条件
 */
export function checkHistoricalCampaignEligibility(
  profile: PersonProfile,
  year: number,
  season: SeasonIndex,
  age: number,
  stats: Attributes
): {
  campaignName: string;
  commander: string;
  camp: 'WEI' | 'SHU' | 'WU';
  roleTitle: string;
  prompt: string;
  options: LifeChoice[];
} | null {
  // 年龄太小或太老无法出战
  if (age < 15 || age > 65) return null;

  const affiliation = profile.militaryAffiliation;
  const knownFigIds = new Set((profile.knownFigures || []).map((f) => f.id));
  const flags = profile.eventFlags || {};

  // 1. 公元190年 春/夏: 虎牢关十八路诸侯讨董
  if (year === 190 && (season === 0 || season === 1) && !flags['campaign_190_done']) {
    const isEnlisted = affiliation && affiliation.camp !== 'NONE';
    const knowsHero = knownFigIds.has('cao_cao') || knownFigIds.has('zhao_yun') || knownFigIds.has('liu_bei') || knownFigIds.has('sun_ce');
    if (isEnlisted || knowsHero || stats.martial >= 30) {
      return {
        campaignName: '初平元年 · 虎牢关会盟讨董',
        commander: isEnlisted ? affiliation.commanderName : '联军盟主',
        camp: affiliation?.camp === 'WEI' ? 'WEI' : affiliation?.camp === 'WU' ? 'WU' : 'SHU',
        roleTitle: '讨董联军先锋健卒',
        prompt: '初平元年，十八路诸侯歃血讨董，华雄搦战，温酒斩将！你身在行伍，当如何立功？',
        options: [
          {
            id: 'c_hulao_charge',
            label: '执大纛随先锋大队直扑虎牢关隘，迎战西凉铁骑',
            description: '擂鼓震天，箭石如雨。不惧生死，立下先登之功！',
            approachTag: '【先登陷阵】',
            requirementHint: '需体魄与勇略出众',
            statChanges: { martial: 12, health: 4, virtue: 6, wealth: 8 },
            outcomeText: '你挥枪击落两名西凉飞熊骑兵，夺得一面敌旗！军候为你记大功一次，赏铜钱千文。',
            campaignUnlock: {
              campaignName: '虎牢关会盟讨董',
              camp: 'SHU',
              commander: '赵云',
              roleTitle: '帐前陷阵勇卒',
            },
            eventFlagToSet: 'campaign_190_done',
          },
          {
            id: 'c_hulao_scout',
            label: '潜入汴水两岸密林，打探董卓后军粮道与伏兵',
            description: '依仗敏锐机警，为后方大营预警徐荣伏兵。',
            approachTag: '【机敏游哨】',
            requirementHint: '需识见通达',
            statChanges: { intellect: 10, fortune: 8, virtue: 4 },
            outcomeText: '你在汴水树丛中发觉徐荣伏兵痕迹，疾驰回营报信，使得数百友军幸免于全军覆没！',
            campaignUnlock: {
              campaignName: '虎牢关会盟讨董',
              camp: 'WEI',
              commander: '曹操',
              roleTitle: '机警斥候队长',
            },
            eventFlagToSet: 'campaign_190_done',
          },
        ],
      };
    }
  }

  // 2. 公元200年 秋/冬: 官渡之战 · 乌巢奇袭
  if (year === 200 && (season === 2 || season === 3) && !flags['campaign_200_done']) {
    const isWei = affiliation?.camp === 'WEI' || knownFigIds.has('cao_cao') || knownFigIds.has('xun_yu') || knownFigIds.has('guo_jia');
    if (isWei || stats.martial >= 40 || stats.intellect >= 40) {
      return {
        campaignName: '建安五年 · 官渡奇袭乌巢',
        commander: '曹操',
        camp: 'WEI',
        roleTitle: '曹公衔枚夜袭精骑',
        prompt: '许攸深夜献粮道密图，曹公亲提五千轻骑衔枚夜行，疾袭乌巢万车军粮！',
        options: [
          {
            id: 'c_guandu_fire',
            label: '手持火把麻油，冒矢石冲入袁军粮囤放火',
            description: '烈焰映红官渡长空，彻底焚毁袁绍十万大军之命脉！',
            approachTag: '【火焚粮仓】',
            requirementHint: '需勇略过人',
            statChanges: { martial: 14, intellect: 6, wealth: 12, fortune: 6 },
            outcomeText: '万囤军粮化作滚滚火海！淳于琼溃败，袁军十万大军闻粮尽皆土崩瓦解。曹公亲自抚慰将士，赏帛十匹。',
            campaignUnlock: {
              campaignName: '官渡之战 · 乌巢奇袭',
              camp: 'WEI',
              commander: '曹操',
              roleTitle: '牙门破虏别将',
            },
            eventFlagToSet: 'campaign_200_done',
          },
          {
            id: 'c_guandu_guard',
            label: '于大营前沿操作发石霹雳车，轰击袁绍高橹敌楼',
            description: '乱石横空飞渡，以器械之力压制河北弓弩手。',
            approachTag: '【操持重械】',
            requirementHint: '需识见精巧',
            statChanges: { intellect: 12, martial: 6, wealth: 6 },
            outcomeText: '巨石腾空呼啸，将袁军木质敌楼砸得粉碎！前锋士卒士气大振，你被擢升为军械司马。',
            campaignUnlock: {
              campaignName: '官渡之战 · 乌巢奇袭',
              camp: 'WEI',
              commander: '曹操',
              roleTitle: '军械营司马',
            },
            eventFlagToSet: 'campaign_200_done',
          },
        ],
      };
    }
  }

  // 3. 公元208年 秋: 当阳长坂坡 · 携民渡江
  if (year === 208 && season === 2 && !flags['campaign_208_changban_done']) {
    const isShu = affiliation?.camp === 'SHU' || knownFigIds.has('zhao_yun') || knownFigIds.has('liu_bei') || knownFigIds.has('zhang_fei');
    if (isShu || stats.virtue >= 45) {
      return {
        campaignName: '建安十三年 · 当阳长坂护幼主',
        commander: '赵云 / 刘备',
        camp: 'SHU',
        roleTitle: '常山赵子龙帐前亲军',
        prompt: '曹操五千纯血虎豹骑一日一夜疾驰三百里追及！十万襄阳难民号哭奔逃，赵子龙单骑回马破阵救幼主！',
        options: [
          {
            id: 'c_changban_with_zhaoyun',
            label: '跟随赵子龙策马折返重围，死命掩护怀抱阿斗的常山银枪',
            description: '浑身是胆，于曹营百万军中七进七出，不负仁德忠义之名！',
            approachTag: '【死命护幼】',
            requirementHint: '需绝大勇气与体魄',
            statChanges: { martial: 18, virtue: 16, health: -4, fortune: 10 },
            outcomeText: '长矛刺穿数名追兵，你的战袍尽被血浸透！终于掩护子龙冲出景山合围，刘备携你双手洒泪相迎：“真义士也！”',
            campaignUnlock: {
              campaignName: '当阳长坂护幼主',
              camp: 'SHU',
              commander: '赵云',
              roleTitle: '顺平侯贴身校尉',
            },
            eventFlagToSet: 'campaign_208_changban_done',
          },
          {
            id: 'c_changban_bridge',
            label: '随张飞据水断桥，横矛立马于长坂桥头作怒目金刚吼',
            description: '“身是张翼德也，可来共决死！”拆断木桥阻绝曹军前锋。',
            approachTag: '【据水断桥】',
            requirementHint: '需胆魄非凡',
            statChanges: { martial: 12, intellect: 6, virtue: 10 },
            outcomeText: '桥头巨吼如雷，曹操疑有伏兵按辔不前。趁此间隙，数万残存百姓与将士终于安然退至汉津口登船。',
            campaignUnlock: {
              campaignName: '当阳长坂护幼主',
              camp: 'SHU',
              commander: '张飞',
              roleTitle: '长坂桥卫士长',
            },
            eventFlagToSet: 'campaign_208_changban_done',
          },
        ],
      };
    }
  }

  // 4. 公元208年 冬: 赤壁之战 · 烈火连环
  if (year === 208 && season === 3 && !flags['campaign_208_chibi_done']) {
    return {
      campaignName: '建安十三年冬 · 赤壁鏖兵火烧连环',
      commander: affiliation?.camp === 'WEI' ? '曹操' : '周瑜 / 诸葛亮',
      camp: affiliation?.camp === 'WEI' ? 'WEI' : 'WU',
      roleTitle: affiliation?.camp === 'WEI' ? '水寨防汛水卒' : '黄盖先锋蒙冲火攻义士',
      prompt: '东南风骤起！黄盖引二十艘蒙冲快船满载干柴鱼膏疾驰曹军水寨，大呼“降曹”，烈焰瞬息腾空！',
      options: [
        {
          id: 'c_chibi_fire_ship',
          label: '跃上满载油脂干苇的蒙冲快船，引火撞击曹营锁江巨舰',
          description: '乘东南狂风突进，烈焰横江八百里，樯橹灰飞烟灭！',
          approachTag: '【烈火冲阵】',
          requirementHint: '需通晓水性或勇略',
          statChanges: { martial: 16, virtue: 8, wealth: 10, fortune: 8 },
          outcomeText: '赤壁烈焰冲天，大火连延曹军水旱双营，江水尽赤！周郎引数万精锐大破敌阵，天下三分自此底定。',
          campaignUnlock: {
            campaignName: '赤壁鏖兵火烧连环',
            camp: 'WU',
            commander: '周瑜',
            roleTitle: '破曹水师牙门将',
          },
          eventFlagToSet: 'campaign_208_chibi_done',
        },
        {
          id: 'c_chibi_flee_save',
          label: '在华容道泥泞芦苇荡中搭救落水百姓与溃卒伤员',
          description: '大火滔天生灵涂炭，在江边放生竹筏救护生灵。',
          approachTag: '【慈航救民】',
          requirementHint: '需仁厚仁义',
          statChanges: { virtue: 18, intellect: 8, fortune: 10 },
          outcomeText: '你撑着扁舟从浓烟中救起三十余名落水号哭的士卒妇孺。两岸百姓合掌赞你为“大江活菩萨”。',
          campaignUnlock: {
            campaignName: '赤壁鏖兵火烧连环',
            camp: 'NEUTRAL',
            commander: '天下黎庶',
            roleTitle: '江汉慈心义士',
          },
          eventFlagToSet: 'campaign_208_chibi_done',
        },
      ],
    };
  }

  // 5. 公元219年 秋/冬: 襄樊水淹七军 / 威震华夏
  if (year === 219 && (season === 2 || season === 3) && !flags['campaign_219_done']) {
    return {
      campaignName: '建安二十四年 · 关云长水淹七军',
      commander: '关羽',
      camp: 'SHU',
      roleTitle: '荆州水军校刀手',
      prompt: '秋八月霖雨连绵，汉水暴涨五丈！关羽乘大船浮水攻樊城，于禁七军三万人尽皆沉溺投降，威震华夏！',
      options: [
        {
          id: 'c_fancheng_boat',
          label: '操持大舰战船，冒大雨围猎被困土丘的敌军大将庞德',
          description: '长矛搭弦射杀抵抗之顽敌，擒获三万魏卒。',
          approachTag: '【水战围猎】',
          requirementHint: '需通晓水性与射艺',
          statChanges: { martial: 14, wealth: 8, virtue: 4 },
          outcomeText: '白波荡漾，关君侯横刀立于船头，称赞你操舟沉稳、弓不虚发。',
          campaignUnlock: {
            campaignName: '关云长水淹七军',
            camp: 'SHU',
            commander: '关羽',
            roleTitle: '前将军亲随校尉',
          },
          eventFlagToSet: 'campaign_219_done',
        },
        {
          id: 'c_fancheng_guard_grain',
          label: '驻守江陵后方粮库，督办救济襄阳两岸淹田难民',
          description: '治水排涝，安置水难黎庶，防范江东商船异动。',
          approachTag: '【安后防患】',
          requirementHint: '需识见通达',
          statChanges: { intellect: 12, virtue: 14, fortune: 6 },
          outcomeText: '你察觉江东商客鬼祟行径，提前遣送难民入城避祸，保全万口生灵。',
          campaignUnlock: {
            campaignName: '关云长水淹七军',
            camp: 'SHU',
            commander: '关羽',
            roleTitle: '江陵督粮从事',
          },
          eventFlagToSet: 'campaign_219_done',
        },
      ],
    };
  }

  // 6. 公元228年 春: 诸葛亮北伐 · 一出祁山
  if (year === 228 && season === 0 && !flags['campaign_228_done']) {
    return {
      campaignName: '建兴六年 · 武乡侯一出祁山',
      commander: '诸葛亮',
      camp: 'SHU',
      roleTitle: '蜀汉北伐护粮牙将',
      prompt: '武乡侯上一出师表，汉军出祁山，天水三郡响应归蜀！马谡据街亭当道扎营，军情十万火急！',
      options: [
        {
          id: 'c_qishan_transport',
          label: '在崎岖秦岭蜀道上推运新制木牛流马，确保前线粮秣无绝',
          description: '蜀道虽难，粮道是胜负之机。夜以继日运送高粱麦米。',
          approachTag: '【督运木牛】',
          requirementHint: '需坚韧体魄与责任心',
          statChanges: { health: 6, virtue: 12, intellect: 8, wealth: 6 },
          outcomeText: '木牛流马机关灵便，你冒雨把三千石军粮按期送达祁山大营。诸葛丞相亲手为你斟上一盏温米酒以示嘉许。',
          campaignUnlock: {
            campaignName: '武乡侯一出祁山',
            camp: 'SHU',
            commander: '诸葛亮',
            roleTitle: '丞相府参军督粮吏',
          },
          eventFlagToSet: 'campaign_228_done',
        },
        {
          id: 'c_qishan_guard_pass',
          label: '在街亭山下当道要塞死守水源，拼死劝谏分兵扎营',
          description: '力阻马谡舍水上山之误，构筑当道营垒死顶张郃精骑。',
          approachTag: '【死守当道】',
          requirementHint: '需通晓兵法与坚毅胆略',
          statChanges: { martial: 14, intellect: 10, fortune: 8 },
          outcomeText: '你率残部据守山下泉水三日三夜，终使蜀军大队从容收整物资退还汉中，全军无一人陷于绝境。',
          campaignUnlock: {
            campaignName: '武乡侯一出祁山',
            camp: 'SHU',
            commander: '诸葛亮',
            roleTitle: '汉中卫戌牙门将',
          },
          eventFlagToSet: 'campaign_228_done',
        },
      ],
    };
  }

  return null;
}
