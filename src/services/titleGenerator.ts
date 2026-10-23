import { Attributes, SeasonIndex } from '../types/game';
import { PersonProfile } from './lifeSimulator';

export interface FunTitleInfo {
  primaryTitle: string; // 核心趣称
  folkNickname: string; // 乡里诨号 / 民间尊称
  badges: string[];     // 趣味标签 (3-4个)
  humorousQuote: string;// 墓志铭搞笑幽默批语
}

export function generateFunTitles(
  profile: PersonProfile,
  stats: Attributes,
  deathAge: number,
  deathYear: number,
  deathSeason: SeasonIndex,
  deathReason?: string
): FunTitleInfo {
  const badges: string[] = [];

  // Age based titles
  let primaryTitle = '「平平无奇乱世人」';
  let folkNickname = `村东头的「${profile.name.slice(0, 1)}老实」`;
  let quote = '生于汉末，长于泥沼。历史的大潮掀起滔天巨浪，而他只关心今天地里长出的麦苗。';

  // 1. Extreme longevity (Age 60+)
  if (deathAge >= 70) {
    primaryTitle = '「熬死曹刘孙的大仙」';
    folkNickname = '全乡公认的「活神仙老祖宗」';
    badges.push('百岁长命锁', '长寿克星', '三国打卡狂人', '坐看天下鼎立');
    quote = '“只要我活得足够久，所有的英雄豪杰最后都得走在我前头。”';
  } else if (deathAge >= 55) {
    primaryTitle = '「乱世苟道至尊」';
    folkNickname = '村头大槐树下的「老懂哥」';
    badges.push('大难不死', '溜之大吉先锋', '知足常乐');
    quote = '“曹操袁绍打得再热闹，关我村头吃两碗热汤面什么事？”';
  } else if (deathAge <= 3) {
    primaryTitle = '「人间匆匆体验卡用户」';
    folkNickname = '天上的「折翼小仙童」';
    badges.push('来去如风', '免受兵戈', '转世光速排队中');
    quote = '“看了一眼汉末这世道，觉得还是回天庭吃蟠桃比较稳妥。”';
  }

  // 2. Attribute based titles
  if (stats.wealth >= 65) {
    primaryTitle = '「村里有矿的土豪员外」';
    badges.push('家里粮仓堆不下', '算盘成精', '大饥荒散粮大善人');
    quote = '“钱财乃身外之物，但乱世里，有粮就是爹。”';
  } else if (stats.martial >= 65) {
    primaryTitle = '「十里八乡单挑无敌霸王」';
    badges.push('铁拳出击', '一拳一个山贼', '猛男本色');
    quote = '“长矛在手，天下我有！虽未当上名将，但村口打架从来没输过。”';
  } else if (stats.intellect >= 65) {
    primaryTitle = '「野生民间小诸葛」';
    badges.push('行走的兵法书', '算无遗策', '看透一切的眼神');
    quote = '“朝廷丞相在算天下，我在算明天该不该开仓卖米。”';
  } else if (stats.virtue >= 70) {
    primaryTitle = '「万家生佛及时雨」';
    badges.push('老好人天花板', '生姜汤大善人', '行善积德福报满满');
    quote = '“人人都在争权夺利，唯有他愿意分给难民半块焦黑的烧饼。”';
  }

  // 3. Death reason specific titles
  if (deathReason && deathReason.includes('伤寒')) {
    badges.push('建安大疫受害者', '生姜羊肉汤狂热信徒', '抗击疫病小斗士');
  } else if (deathReason && deathReason.includes('阵亡')) {
    primaryTitle = '「马革裹尸的热血莽夫」';
    badges.push('虽败犹荣', '硬汉本色', '冲锋永不后退');
    quote = '“下辈子，我还要端着长矛上阵冲锋！”';
  }

  // 4. Regional specific titles
  if (profile.birthProvince === 'XUZHOU') {
    badges.push('泗水浪里白条', '徐州幸存勇者');
  } else if (profile.birthProvince === 'YANZHOU') {
    badges.push('飞蝗堆里嚼草根的狠人');
  } else if (profile.birthProvince === 'JIAOZHOU') {
    badges.push('岭南吃荔枝逍遥客', '不知中原有魏蜀');
  } else if (profile.birthProvince === 'LIANGZHOU') {
    badges.push('大漠孤烟佩刀汉', '西凉铁骑老邻居');
  } else if (profile.birthProvince === 'JINGZHOU') {
    badges.push('水镜先生家门口路过市民', '襄阳名士吹鼓手');
  } else if (profile.birthProvince === 'LUOYANG') {
    badges.push('洛阳吃瓜群众', '汉宫夕照见证者');
  }

  // 5. Profession specific titles
  if (profile.occupation.includes('铁匠')) {
    badges.push('火炉旁的倚天剑圣', '打铁也能打出名堂');
  } else if (profile.occupation.includes('船') || profile.occupation.includes('渔')) {
    badges.push('长江横江水怪', '风浪越大鱼越贵');
  } else if (profile.occupation.includes('书') || profile.occupation.includes('吏')) {
    badges.push('县衙第一笔杆子', '摸鱼写账两不误');
  }

  // Deduplicate and cap badges
  const uniqueBadges = Array.from(new Set(badges)).slice(0, 4);
  if (uniqueBadges.length === 0) {
    uniqueBadges.push('汉季草民', '岁月静好', '人间过客');
  }

  return {
    primaryTitle,
    folkNickname,
    badges: uniqueBadges,
    humorousQuote: quote,
  };
}
