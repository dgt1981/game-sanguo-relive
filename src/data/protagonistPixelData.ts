/**
 * 主角人生各阶段像素风格头像数据与调色板
 * 支持 8 个人生生理阶段 x 2 种性别（共16套独立定制点阵画卷），
 * 随着年龄增长自动呈现阶段性成熟度：
 * 1. INFANT (0~2岁)  : 襁褓幼婴（软帽襁褓、玉雪婴儿、天真懵懂）
 * 2. CHILD (3~6岁)   : 龆龀幼童（双丫角髻、稚气笑颜、发蒙小童）
 * 3. YOUTH (7~13岁)  : 总角成童（总角束发、英气少年、拔节抽条）
 * 4. ADULT (14~19岁) : 及冠成丁（束发葛巾/及笄插簪、青年初立、气力大成）
 * 5. PRIME (20~35岁) : 弱冠壮盛（铜盔锦冠、修髯英姿、风华鼎盛）
 * 6. MIDDLE (36~50岁): 不惑知命（儒冠长袍、沉潜美髯、栋梁威仪）
 * 7. ELDER (51~65岁) : 花甲耳顺（两鬓微霜、灰白长须、慈祥乡老）
 * 8. VENERABLE (66+): 古稀耄耋（鹤发童颜、银须垂胸、百岁人瑞）
 */

import { PhysiologicalStage, CampType, SocialClass } from '../types/game';

export interface ProtagonistPixelData {
  stageKey: PhysiologicalStage['stageKey'];
  stageName: string;
  stageTag: string;
  ageRange: string;
  gender: 'MALE' | 'FEMALE';
  titleTag: string;
  signatureColor: string;
  palette: Record<string, string>;
  matrix: string[]; // 20x20 像素点阵
  appearanceNote: string;
}

// 扩展调色板：增加幼童粉黛、青巾、古铜与银须
export const PROTAGONIST_PALETTE: Record<string, string> = {
  '.': 'transparent', // 透明底
  '0': '#120d0a',     // 墨黑描边 / 瞳孔 / 浓眉
  '1': '#2b2019',     // 深赭阴影
  'w': '#f8f4ec',     // 绢白 / 银冠 / 霜雪白须
  'W': '#ded4c5',     // 浅白阴影 / 素缟
  's': '#fae0cf',     // 稚嫩肤色 / 面颊高光
  'S': '#f1c1a0',     // 肤色正色
  'd': '#cf9575',     // 肤色暗部 / 面颊晕红
  'D': '#9e5a3c',     // 深褐色阴影
  'k': '#fda4af',     // 娇粉 (婴儿襁褓 / 少女发带)
  'K': '#f43f5e',     // 胭脂红
  'r': '#b91c1c',     // 朱砂红袍
  'R': '#ef4444',     // 烈火鲜红
  'g': '#15803d',     // 苍翠锦袍
  'G': '#4ade80',     // 青绿高光
  'c': '#0284c7',     // 碧水青蓝 / 秀才葛巾
  'C': '#38bdf8',     // 苍穹青蓝高光
  'b': '#1d4ed8',     // 靛蓝官袍
  'B': '#60a5fa',     // 湛蓝高光
  'p': '#6b21a8',     // 魏紫
  'P': '#a855f7',     // 绯紫高光
  'y': '#d97706',     // 琥珀金 / 铜簪 / 金线
  'Y': '#facc15',     // 灿金高光 / 珠玉
  'm': '#4b5563',     // 铁甲青铜
  'M': '#cbd5e1',     // 白银高光
  'h': '#1e1b18',     // 乌黑发色
  'H': '#94a3b8',     // 霜鬓微白
  'A': '#e2e8f0',     // 鹤发雪白 (老年纯白)
};

// ==========================================
// 8大人生阶段 x 男丁 (MALE) 像素点阵 (20x20)
// ==========================================
const MALE_MATRICES: Record<PhysiologicalStage['stageKey'], { matrix: string[]; titleTag: string; note: string }> = {
  // 1. 襁褓幼婴 (0~2岁) - 软帽红布裹身，大眼圆嘟嘟，粉颊萌萌
  INFANT: {
    titleTag: '【襁褓幼雏 · 嗷嗷待哺】',
    note: '软枕红襁褓，天真大眼，咿呀学语，极易受风寒之侵。',
    matrix: [
      '....................',
      '......00000000......',
      '....00rrrrrrrr00....',
      '...0rRRRRRRRRRRr0...',
      '..0rRRRRRRRRRRRRr0..',
      '..0000000000000000..',
      '..0ss00ssss00ss00...',
      '..0ss0w0ss0w0ssd0...',
      '..0ss000ss000ssd0...',
      '..0sddss00ssddsd0...',
      '..0ddssssssssddd0...',
      '...0ddddk0kdddd0....',
      '....000000000000....',
      '...0rrr00yy00rrr0...',
      '..0rRRrr0yy0rrRRr0..',
      '..0RRRRrr00rrRRRR0..',
      '..0RRRRRrrrrRRRRR0..',
      '...0RRRRRRRRRRRR0...',
      '....000000000000....',
      '....................',
    ],
  },

  // 2. 龆龀幼童 (3~6岁) - 头扎双丫髻/髫发，欢快调皮，小脸红润
  CHILD: {
    titleTag: '【龆龀幼童 · 戏耍发蒙】',
    note: '头顶两只小小冲天髻，光着小脚满村捉虫，初辨叔伯。',
    matrix: [
      '...00h0......0h00...',
      '..0hhh0......0hhh0..',
      '..0hh0000000000hh0..',
      '...000hhhhhhhh000...',
      '....0hhhhhhhhhh0....',
      '...00000000000000...',
      '...0ssssssssssss0...',
      '...0ss00ssss00ss0...',
      '...0ss0w0ss0w0ss0...',
      '...0ss000ss000ss0...',
      '...0sddssssssdds0...',
      '....0sss0000sss0....',
      '.....0ss0RR0ss0.....',
      '......00000000......',
      '....00gGggggGg00....',
      '...0ggGggggggGgg0...',
      '...0gg000yy000gg0...',
      '...0gg00000000gg0...',
      '....000......000....',
      '....................',
    ],
  },

  // 3. 总角成童 (7~13岁) - 单束总角，系麻布带，身形抽条，眼神清澈
  YOUTH: {
    titleTag: '【总角少年 · 拔节抽条】',
    note: '发束总角，麻带垂后，开始帮衬拾柴放牛，求知若渴。',
    matrix: [
      '........0000........',
      '.......0yyyy0.......',
      '......0yhhhh0.......',
      '.....00hhhhhh00.....',
      '....0hhhhhhhhhh0....',
      '...00000000000000...',
      '...00ssssssssss00...',
      '...0s0000ss0000s0...',
      '...0s0w00ss00w0s0...',
      '...0s0000ss0000s0...',
      '...0ssddssssddss0...',
      '....0ssss00ssss0....',
      '.....0ssssssss0.....',
      '......00000000......',
      '....00cc0000cc00....',
      '...0ccc0wwww0ccc0...',
      '...0cc0wwwwww0cc0...',
      '...0cc000yy000cc0...',
      '....000000000000....',
      '....................',
    ],
  },

  // 4. 及冠成丁 (14~19岁) - 束发葛巾，铜簪插髻，气宇轩昂，气力初成
  ADULT: {
    titleTag: '【及冠成丁 · 气力大成】',
    note: '编入丁册，束发葛巾，挽硬弓荷重犁，自立生计以养家。',
    matrix: [
      '.......000000.......',
      '......0cccccc0......',
      '.....0cccyyycc0.....',
      '....0chhhhhhhc0.....',
      '...0hhhhhhhhhhh0....',
      '...0000000000000....',
      '...0Sssssssssss0....',
      '...0S0000ss00000....',
      '...0S0w00ss00w00....',
      '...0S0000ss00000....',
      '...0Sssddssddss0....',
      '....0Ssss00sss0.....',
      '.....0Sssssss0......',
      '......00000000......',
      '....00mm0000mm00....',
      '...0mmm00cc00mmm0...',
      '..0mmmm0cccc0mmmm0..',
      '..0mmmm00yy00mmmm0..',
      '...00000000000000...',
      '....................',
    ],
  },

  // 5. 弱冠壮盛 (20~35岁) - 兜鍪战甲或儒士高冠，唇髭微蓄，目光如炬
  PRIME: {
    titleTag: '【弱冠壮盛 · 鼎盛春秋】',
    note: '筋骨武略正值人生巅峰，唇蓄修髭，目光坚毅，当立一番功名。',
    matrix: [
      '......00000000......',
      '.....0MMMMMMMM0.....',
      '....0MMMMMMMMMM0....',
      '....0MM00yy00MM0....',
      '...0hhhh0000hhhh0...',
      '...00000000000000...',
      '...0SssssssssssS0...',
      '...0S0000ss0000S0...',
      '...0S0w00ss00w0S0...',
      '...0S0000ss0000S0...',
      '...0SssddssddssS0...',
      '....0S00000000S0....',
      '....0S0hhhhhh0S0....',
      '.....0000000000.....',
      '...00rr000000rr00...',
      '..0rrrr0y00y0rrrr0..',
      '..0rrrr0yyyy0rrrr0..',
      '..0rrrr00yy00rrrr0..',
      '...00000000000000...',
      '....................',
    ],
  },

  // 6. 不惑知命 (36~50岁) - 进贤深冠，蓄威严短须，目光深邃沉静
  MIDDLE: {
    titleTag: '【不惑知命 · 沉潜厚重】',
    note: '世事洞明，处事持重。长须美髯，为宗族后生所仰止。',
    matrix: [
      '.....0000000000.....',
      '....00bbbbbbbb00....',
      '....0bbbbbbbbbb0....',
      '...00bbbyyyybbb00...',
      '...0hhhhhhhhhhhh0...',
      '...00000000000000...',
      '...0SssssssssssS0...',
      '...0S0000ss0000S0...',
      '...0S0w00ss00w0S0...',
      '...0S0000ss0000S0...',
      '...0SssddssddssS0...',
      '....000hhhhhh000....',
      '....00hhhh00hhhh0...',
      '.....0hhhh00hhhh0...',
      '....000hhhhhh000....',
      '...00bb000000bb00...',
      '..0bbbb0yyyy0bbbb0..',
      '..0bbbb00yy00bbbb0..',
      '...00000000000000...',
      '....................',
    ],
  },

  // 7. 花甲耳顺 (51~65岁) - 两鬓霜白，灰白长须，慈祥睿智，尊为乡老
  ELDER: {
    titleTag: '【花甲耳顺 · 气血渐衰】',
    note: '两鬓苍苍霜雪染，气力难挽强弓，而德厚名重，受人敬仰。',
    matrix: [
      '.....0000000000.....',
      '....001111111100....',
      '....011111111110....',
      '...00111yyyy11100...',
      '...0HHHHHHHHHHHH0...',
      '...00000000000000...',
      '...0WssssssssssW0...',
      '...0W0000ss0000W0...',
      '...0W0w00ss00w0W0...',
      '...0WssssssssssW0...',
      '....000000000000....',
      '....00HHHHHHHH00....',
      '....0HHHHHHHHHH0....',
      '....00HHHHHHHH00....',
      '.....000HHHH000.....',
      '...00yy00WW00yy00...',
      '..0yyyy0WWWW0yyyy0..',
      '..0yyyy00yy00yyyy0..',
      '...00000000000000...',
      '....................',
    ],
  },

  // 8. 古稀耄耋 (66+岁) - 纯白长髯垂胸，鹤发童颜，汉家四百年历史见证者
  VENERABLE: {
    titleTag: '【古稀耄耋 · 桑榆暮年】',
    note: '银须垂胸，鹤发松姿。见惯三国纷争兴亡，寿考百岁人瑞。',
    matrix: [
      '.....0000000000.....',
      '....0AAAAAAAAAA0....',
      '...0AAAAAAAAAAAA0...',
      '...0AAAAAAAAAAAA0...',
      '..0000000000000000..',
      '..0WssssssssssssW0..',
      '..0W0000ssss0000W0..',
      '..0W0w00ssss00w0W0..',
      '..0WssssssssssssW0..',
      '..0000000000000000..',
      '..000AAAAAAAAAA000..',
      '...0AAAAAAAAAAAA0...',
      '...0AAAAAAAAAAAA0...',
      '...00AAAAAAAAAA00...',
      '....000AAAAAA000....',
      '...00WW00AA00WW00...',
      '..0WWWW0AAAA0WWWW0..',
      '..0WWWW00AA00WWWW0..',
      '...00000000000000...',
      '....................',
    ],
  },
};

// ============================================
// 8大人生阶段 x 女秀 (FEMALE) 像素点阵 (20x20)
// ============================================
const FEMALE_MATRICES: Record<PhysiologicalStage['stageKey'], { matrix: string[]; titleTag: string; note: string }> = {
  // 1. 襁褓幼女 (0~2岁) - 桃粉锦布裹身，幼嫩小巧，玉雪可爱
  INFANT: {
    titleTag: '【襁褓千金 · 掌中明珠】',
    note: '桃粉锦襁褓裹体，肌肤娇嫩若雪，受父母娇养呵护。',
    matrix: [
      '....................',
      '......00000000......',
      '....00kkkkkkkk00....',
      '...0kKKKKKKKKKKk0...',
      '..0kKKKKKKKKKKKKk0..',
      '..0000000000000000..',
      '..0ss00ssss00ss00...',
      '..0ss0w0ss0w0ssd0...',
      '..0ss000ss000ssd0...',
      '..0skkss00sskkkd0...',
      '..0ddssssssssddd0...',
      '...0ddddk0kdddd0....',
      '....000000000000....',
      '...0kkk00yy00kkk0...',
      '..0kKKkk0yy0kkKKk0..',
      '..0KKKKkk00kkKKKK0..',
      '..0KKKKKkkkkKKKKK0..',
      '...0KKKKKKKKKKKK0...',
      '....000000000000....',
      '....................',
    ],
  },

  // 2. 龆龀幼女 (3~6岁) - 双鬟扎彩结，杏粉小衫，伶俐天真
  CHILD: {
    titleTag: '【龆龀少女 · 闺秀发蒙】',
    note: '头顶双鬟系红绳，巧笑嫣然，采桑折柳，天真烂漫。',
    matrix: [
      '..00kk0......0kk00..',
      '.0khhh0......0hhhk0.',
      '.0khhh00000000hhhk0.',
      '..000hhhhhhhhhh000..',
      '...0hhhhhhhhhhhh0...',
      '..0000000000000000..',
      '..0ssssssssssssss0..',
      '..0ss000ssss000ss0..',
      '..0ss0w0ssss0w0ss0..',
      '..0ss000ssss000ss0..',
      '..0skksssssssskks0..',
      '...0sss000000sss0...',
      '....0ss00KK00ss0....',
      '.....0000000000.....',
      '...00kk000000kk00...',
      '..0kkkk0wwww0kkkk0..',
      '..0kkkk0wwww0kkkk0..',
      '..0kkkk00yy00kkkk0..',
      '...00000000000000...',
      '....................',
    ],
  },

  // 3. 总角豆蔻 (7~13岁) - 垂鬟分髫，骨秀神清，开始研习女红与持家
  YOUTH: {
    titleTag: '【豆蔻年华 · 灵秀端丽】',
    note: '分髫垂后，眉眼初开，巧手纫针，研习温良诗礼。',
    matrix: [
      '.....0000000000.....',
      '....00yykkkkyy00....',
      '...00hhhhhhhhhh00...',
      '..00hhhhhhhhhhhh00..',
      '..0000000000000000..',
      '..0ssssssssssssss0..',
      '..0s0000ssss0000s0..',
      '..0s0w00ssss00w0s0..',
      '..0s0000ssss0000s0..',
      '..0sskksssssskkss0..',
      '...0sss000000sss0...',
      '...00ssssssssss00...',
      '....000000000000....',
      '..000hhhh00hhhh000..',
      '..0GG0000000000GG0..',
      '.0GGGG00wwww00GGGG0.',
      '.0GGGG00wwww00GGGG0.',
      '.0GGGG000yy000GGGG0.',
      '..0000000000000000..',
      '....................',
    ],
  },

  // 4. 及笄成丁 (14~19岁) - 玉簪绾发，聘婷秀雅，自立操持家计
  ADULT: {
    titleTag: '【及笄秀士 · 亭亭玉立】',
    note: '及笄之礼，玉簪绾青丝，端庄秀美，已有当家主事之姿。',
    matrix: [
      '.....0000000000.....',
      '....0yyyhhhhhyyy0...',
      '...00hhhhhhhhhh00...',
      '..00hhhhhhhhhhhh00..',
      '..0000000000000000..',
      '..0Sssssssssssss0...',
      '..0S0000ssss00000...',
      '..0S0w00ssss00w00...',
      '..0S0000ssss00000...',
      '..0Ssskksssskkss0...',
      '...0Ssss0000sss0....',
      '....0Sssssssss0.....',
      '.....0000000000.....',
      '..000hhhh00hhhh000..',
      '..0pp0000000000pp0..',
      '.0pppp00wwww00pppp0.',
      '.0pppp00wwww00pppp0.',
      '.0pppp000yy000pppp0.',
      '..0000000000000000..',
      '....................',
    ],
  },

  // 5. 弱冠风华 (20~35岁) - 翠翘步摇，珠玉相映，英姿飒爽，巾帼当家
  PRIME: {
    titleTag: '【风华绝代 · 巾帼英姿】',
    note: '金钗步摇，容光焕发。持家有道或驰骋乡野，风采动人。',
    matrix: [
      '....000yyyyyy000....',
      '...000YyyyyyyY000...',
      '..00hhhhhhhhhhhh00..',
      '..0hhhhhhhhhhhhhh0..',
      '..0000000000000000..',
      '..0SssssssssssssS0..',
      '..0S0000ssss0000S0..',
      '..0S0w00ssss00w0S0..',
      '..0S0000ssss0000S0..',
      '..0SsskksssskkssS0..',
      '...0Ssss0000sssS0...',
      '....0SssssssssS0....',
      '.....0000000000.....',
      '...000hhhhhhhh000...',
      '..0rr0000000000rr0..',
      '.0rrrr00yyyy00rrrr0.',
      '.0rrrr00yyyy00rrrr0.',
      '.0rrrr000yy000rrrr0.',
      '..0000000000000000..',
      '....................',
    ],
  },

  // 6. 不惑知命 (36~50岁) - 盘龙云髻，碧玉钿饰，稳健雍容，宗族主母
  MIDDLE: {
    titleTag: '【不惑主母 · 雍容端肃】',
    note: '云髻高挽，眼含阅历，治家严整，四邻八里无不称颂贤能。',
    matrix: [
      '...00000000000000...',
      '..0000yyyyyyyy0000..',
      '..00hhhhhhhhhhhh00..',
      '..0hhhhhhhhhhhhhh0..',
      '..0000000000000000..',
      '..0SssssssssssssS0..',
      '..0S0000ssss0000S0..',
      '..0S0w00ssss00w0S0..',
      '..0S0000ssss0000S0..',
      '..0SssssssssssssS0..',
      '...0Ssss0000sssS0...',
      '....0SssssssssS0....',
      '.....0000000000.....',
      '...000hhhhhhhh000...',
      '..0bb0000000000bb0..',
      '.0bbbb00yyyy00bbbb0.',
      '.0bbbb00yyyy00bbbb0.',
      '.0bbbb000yy000bbbb0.',
      '..0000000000000000..',
      '....................',
    ],
  },

  // 7. 花甲慈老 (51~65岁) - 灰发勒子，温慈端庄，见证数代繁衍生息
  ELDER: {
    titleTag: '【花甲慈宿 · 德隆望尊】',
    note: '灰白青丝束锦勒，目光慈和沉稳，历经风雨，子孙承欢。',
    matrix: [
      '...00000000000000...',
      '..0011111111111100..',
      '..00HHHHHHHHHHHH00..',
      '..0HHHHHHHHHHHHHH0..',
      '..0000000000000000..',
      '..0WssssssssssssW0..',
      '..0W0000ssss0000W0..',
      '..0W0w00ssss00w0W0..',
      '..0W0000ssss0000W0..',
      '..0WssssssssssssW0..',
      '...0Wsss0000sssW0...',
      '....0WssssssssW0....',
      '.....0000000000.....',
      '...000HHHHHHHH000...',
      '..0yy0000000000yy0..',
      '.0yyyy00WWWW00yyyy0.',
      '.0yyyy00WWWW00yyyy0.',
      '.0yyyy000yy000yyyy0.',
      '..0000000000000000..',
      '....................',
    ],
  },

  // 8. 古稀寿母 (66+岁) - 银丝如雪，鹤发童颜，福泽深厚，人瑞长寿
  VENERABLE: {
    titleTag: '【古稀寿母 · 百年福瑞】',
    note: '白发如银，慈眉善目。历尽汉末四百年江山更迭，寿逾古稀。',
    matrix: [
      '...00000000000000...',
      '..00AAAAAAAAAAAA00..',
      '..00AAAAAAAAAAAA00..',
      '..0AAAAAAAAAAAAAA0..',
      '..0000000000000000..',
      '..0WssssssssssssW0..',
      '..0W0000ssss0000W0..',
      '..0W0w00ssss00w0W0..',
      '..0W0000ssss0000W0..',
      '..0WssssssssssssW0..',
      '...0Wsss0000sssW0...',
      '....0WssssssssW0....',
      '.....0000000000.....',
      '...000AAAAAAAA000...',
      '..0WW0000000000WW0..',
      '.0WWWW00AAAA00WWWW0.',
      '.0WWWW00AAAA00WWWW0.',
      '.0WWWW000AA000WWWW0.',
      '..0000000000000000..',
      '....................',
    ],
  },
};

/**
 * 根据年龄获取主角生理成长阶段的像素头像数据
 */
export function getProtagonistPixelData(
  stageKey: PhysiologicalStage['stageKey'],
  gender: 'MALE' | 'FEMALE' = 'MALE',
  camp: CampType = 'NONE',
  socialClass?: SocialClass
): ProtagonistPixelData {
  const isMale = gender === 'MALE';
  const stageMap = isMale ? MALE_MATRICES : FEMALE_MATRICES;
  const config = stageMap[stageKey] || stageMap.INFANT;

  const ageRangeMap: Record<PhysiologicalStage['stageKey'], { name: string; tag: string; range: string; color: string }> = {
    INFANT: { name: '襁褓幼婴', tag: '骨软神萌', range: '0~2岁', color: '#38bdf8' },
    CHILD: { name: '龆龀幼童', tag: '戏耍发蒙', range: '3~6岁', color: '#4ade80' },
    YOUTH: { name: '总角成童', tag: '拔节抽条', range: '7~13岁', color: '#22c55e' },
    ADULT: { name: '及冠成丁', tag: '气力大成', range: '14~19岁', color: '#eab308' },
    PRIME: { name: '弱冠壮盛', tag: '鼎盛春秋', range: '20~35岁', color: '#f97316' },
    MIDDLE: { name: '不惑知命', tag: '沉潜厚重', range: '36~50岁', color: '#0ea5e9' },
    ELDER: { name: '花甲耳顺', tag: '气血渐衰', range: '51~65岁', color: '#ca8a04' },
    VENERABLE: { name: '古稀耄耋', tag: '桑榆暮年', range: '66岁以上', color: '#94a3b8' },
  };

  const meta = ageRangeMap[stageKey] || ageRangeMap.INFANT;

  return {
    stageKey,
    stageName: meta.name,
    stageTag: meta.tag,
    ageRange: meta.range,
    gender,
    titleTag: config.titleTag,
    signatureColor: meta.color,
    palette: PROTAGONIST_PALETTE,
    matrix: config.matrix,
    appearanceNote: config.note,
  };
}
