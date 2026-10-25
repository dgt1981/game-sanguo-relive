import { SeasonLogEntry, ChronicleCategory } from '../types/game';

export type TimelineFilter = 'ALL' | 'MILITARY' | 'AGRICULTURE' | 'ENCOUNTER';

/**
 * 军事维度关键词汇 (包含战役、军伍、兵械、阵法、将领、征募)
 */
const MILITARY_KEYWORDS = [
  '战役', '战乱', '行伍', '从军', '军门', '军营', '军阵', '大军', '溃军', '败兵', '散兵', '兵锋',
  '铁骑', '突骑', '弓弩', '强弩', '箭队', '环首刀', '兵甲', '扎甲', '皮胄', '战马', '战驹',
  '破阵', '先登', '斩索', '死战', '突围', '被俘', '降曹', '降吴', '就义', '殉节', '点卯',
  '投效', '征兵', '抽丁', '乡勇', '团练', '斥候', '牙将', '牙门', '校尉', '司马', '都尉',
  '先锋', '大将', '部曲', '虎牢关', '官渡', '乌巢', '赤壁', '华容道', '当阳', '长坂坡',
  '长坂桥', '襄樊', '水淹七军', '麦城', '祁山', '街亭', '王平', '曹操', '袁绍', '周瑜',
  '赵云', '关羽', '张飞', '诸葛亮', '西凉', '董卓', '吕布', '华雄', '马谡', '虎豹骑',
  '蒙冲', '斗舰', '水师', '水寨', '烽火', '狼烟', '暗堡', '壕火', '沙场', '杀伐', '武略',
  '刀矛', '劫掠', '防寇', '刀影', '城池', '拒守', '截击', '设伏', '先锋营', '亲军',
  '革甲', '兵曹', '校场', '金创', '战阵'
];

/**
 * 农耕维度关键词汇 (包含田畴、稼穑、水利、岁稔、桑蚕、谷物、禽畜、灾荒救济)
 */
const AGRICULTURE_KEYWORDS = [
  '耕', '农', '田', '麦', '稻', '谷', '粟', '黍', '秧', '桑', '蚕', '稼穑', '收割', '打谷',
  '连枷', '锄', '犁', '耕牛', '官牛', '水磨', '粮仓', '仓廪', '开垦', '屯田', '荒田', '除草',
  '培土', '春耕', '秋收', '夏收', '大荒', '蝗灾', '大蝗', '捕蝗', '掘葛', '葛根', '榆皮',
  '捉泥', '摸鱼', '泥鳅', '池塘', '水田', '旱田', '水渠', '沟洫', '水车', '竹编', '窑场',
  '陶泥', '皮匠', '猪羊', '瓜果', '菜圃', '苞谷', '红薯', '拾麦', '麦场', '插柳', '丰收',
  '平粜', '散粮', '粮食', '存粮', '地窖藏谷', '耕民', '桑农', '耕丁', '水磨坊', '春笋', '荠菜',
  '木磨', '秸秆', '水稻', '庄稼', '艾草', '羊羹', '冬至'
];

/**
 * 奇遇维度关键词汇 (包含同郡名士相逢、绝巘隐士、游方名医、抓周岁庆、神机异相、市井奇闻)
 */
const ENCOUNTER_KEYWORDS = [
  '奇遇', '相逢', '偶遇', '名士', '大儒', '隐士', '道士', '神仙', '游方', '郎中', '神医',
  '华佗', '张仲景', '本草', '绝巘问道', '问道', '抚琴', '抓周', '晬盘', '试儿', '大傩',
  '傩戏', '傩师', '老卒说古', '老秀才', '说古', '私塾', '瑞雪迎春', '红梅', '烟波水舟',
  '渔舟', '地窖避乱', '柴扉遇犬', '柴扉幼犬', '雷雨山火', '扑火救鸟', '流民过境', '施粥',
  '流亡母子', '八岁踏雪', '荒野伏猎', '雪原发矢', '津渡摆渡', '十四岁榷场', '榷场易市',
  '十三岁秋', '驯伏战驹', '烈驹', '游侠', '结交豪客', '主持市秤', '琴谱', '春秋大义',
  '阴符', '五铢钱', '知己', '相知', '莫逆', '师友', '异兆', '祥瑞', '瑞雪红梅', '方士',
  '市井奇人', '推心置腹', '倾盖如故', '相熟', '采药', '神妙'
];

/**
 * 为单条岁月流水动态评定所属维度标签 (一个事件可能同时富含多重人生印记，如从军屯田或偶遇名将)
 */
export function getEntryTags(entry: SeasonLogEntry): ('MILITARY' | 'AGRICULTURE' | 'ENCOUNTER')[] {
  const tags: Set<'MILITARY' | 'AGRICULTURE' | 'ENCOUNTER'> = new Set();

  if (entry.tags && entry.tags.length > 0) {
    entry.tags.forEach((t) => tags.add(t));
  }
  if (entry.category && entry.category !== 'OTHER') {
    tags.add(entry.category);
  }

  const combinedText = [
    entry.storySummary,
    entry.choiceMade || '',
    entry.macroHistory || '',
    entry.occupation || '',
    entry.location || '',
  ].join(' ');

  // 1. 军事判定
  const isMilitary =
    tags.has('MILITARY') ||
    MILITARY_KEYWORDS.some((kw) => combinedText.includes(kw));
  if (isMilitary) tags.add('MILITARY');

  // 2. 农耕判定
  const isAgriculture =
    tags.has('AGRICULTURE') ||
    AGRICULTURE_KEYWORDS.some((kw) => combinedText.includes(kw));
  if (isAgriculture) tags.add('AGRICULTURE');

  // 3. 奇遇判定
  const isEncounter =
    tags.has('ENCOUNTER') ||
    ENCOUNTER_KEYWORDS.some((kw) => combinedText.includes(kw));
  if (isEncounter) tags.add('ENCOUNTER');

  return Array.from(tags);
}

/**
 * 检验单条记录是否命中指定筛选器
 */
export function matchesChronicleFilter(entry: SeasonLogEntry, filter: TimelineFilter): boolean {
  if (filter === 'ALL') return true;
  const tags = getEntryTags(entry);
  return tags.includes(filter);
}
