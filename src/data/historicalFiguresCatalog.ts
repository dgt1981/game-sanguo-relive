import { ProvinceId, Attributes, CampType, FigureArchetype } from '../types/game';

export interface FigureCatalogEntry {
  id: string;
  name: string;
  courtesyName: string;
  birthYear: number;
  deathYear: number;
  birthplace: string;
  provinceId: ProvinceId;
  commandery: string;
  county: string;
  camp: CampType;
  campLabel: string;
  titleTag: string;
  avatarChar: string;
  archetype: FigureArchetype;
  baseStats184: Attributes; // 184年灵帝末期初始属性
  peakStats: Attributes;    // 巅峰期属性
  perk: {
    title: string;
    description: string;
    buffEffect: string;
  };
  dialogues: {
    childhoodGreeting: string; // 自幼结识/同里竹马时的台词
    youthGreeting: string;     // 青年结交时的台词
    primeGreeting: string;     // 巅峰壮年时的台词
    seniorGreeting: string;    // 垂暮晚年时的台词
  };
  historicQuote: string;
  historicalBio: string;
}

export const HISTORICAL_FIGURES_CATALOG: FigureCatalogEntry[] = [
  // 1. 赵云 (常山真定) - 勇武过人
  {
    id: 'zhao_yun',
    name: '赵云',
    courtesyName: '子龙',
    birthYear: 168,
    deathYear: 229,
    birthplace: '幽州常山国真定县',
    provinceId: 'YOUZHOU',
    commandery: '常山郡',
    county: '真定县',
    camp: 'SHU',
    campLabel: '蜀汉镇东将军 · 顺平侯',
    titleTag: '【常胜义将 · 一身是胆】',
    avatarChar: '云',
    archetype: 'MARTIAL',
    baseStats184: { health: 78, intellect: 58, martial: 72, virtue: 82, wealth: 28, fortune: 75 },
    peakStats: { health: 92, intellect: 78, martial: 97, virtue: 95, wealth: 45, fortune: 88 },
    perk: {
      title: '常胜先锋 · 死节庇护',
      description: '战阵之中一身是胆，以银枪护卫左右，使主角沙场阵亡概率归零，大幅提高行伍升迁几率。',
      buffEffect: '免除战场暴毙风险，从军行伍历练勇略成长率+30%，当阳长坂坡触发专属突围护佑。',
    },
    dialogues: {
      childhoodGreeting: '“真定滹沱河畔，你我同饮一河水！来，随云一同练习这路梨花铁枪，日后杀贼报乡！”',
      youthGreeting: '“天下大乱，未知谁是明主。民有倒悬之急，吾等常山儿郎当以仁义为先，保境安民！”',
      primeGreeting: '“子龙一身都是胆！足下既与云结为生死之交，刀山火海，万军重围，云亦护足下周全！”',
      seniorGreeting: '“昔随先帝转战长坂汉水，今虽两鬓成霜，只要三尺长枪在手，犹能为汉家扫荡妖氛。”',
    },
    historicQuote: '“子龙一身都是胆也！益州既定，当以田宅还民，何可分赐诸将。”',
    historicalBio: '常山真定人，初从公孙瓒，后归刘备。两度救护幼主，攻拔益州汉中，号称常胜将军。',
  },

  // 2. 诸葛亮 (琅琊阳都) - 才智过人
  {
    id: 'zhuge_liang',
    name: '诸葛亮',
    courtesyName: '孔明',
    birthYear: 181,
    deathYear: 234,
    birthplace: '徐州琅琊国阳都县',
    provinceId: 'XUZHOU',
    commandery: '琅琊国',
    county: '阳都县',
    camp: 'SHU',
    campLabel: '蜀汉丞相 · 武乡侯',
    titleTag: '【卧龙名相 · 经天纬地】',
    avatarChar: '亮',
    archetype: 'STRATEGIST',
    baseStats184: { health: 45, intellect: 62, martial: 18, virtue: 75, wealth: 38, fortune: 70 },
    peakStats: { health: 65, intellect: 100, martial: 48, virtue: 99, wealth: 55, fortune: 82 },
    perk: {
      title: '八阵奇谋 · 军机运筹',
      description: '胸罗甲兵洞悉兴替，指点主角避开历次战乱浩劫，出任军谋参赞或典农粮官。',
      buffEffect: '识见历练成长率+40%，遭遇天下战役危机自动规避致命伏击，北伐祁山解锁高级军略。',
    },
    dialogues: {
      childhoodGreeting: '“琅琊松下书声朗，亮方总角蒙童，感念同乡故旧之情。天下事，合久必分，书中有天地。”',
      youthGreeting: '“亮隐耕于隆中，每自比于管仲乐毅。若苍生有请，当以天下三分之策开万世之基。”',
      primeGreeting: '“受任于败军之际，奉命于危难之间。足下深明大义，正宜同心赞襄军机，济此艰难。”',
      seniorGreeting: '“五丈原上秋风萧瑟，亮虽身染重疾，然鞠躬尽瘁，死而后已。此八阵图赠予足下以全道义。”',
    },
    historicQuote: '“受任于败军之际，奉命于危难之间。鞠躬尽瘁，死而后已。”',
    historicalBio: '徐州琅琊阳都人，躬耕于南阳隆中。刘备三顾茅庐定天下三分之策，为蜀汉丞相辅政兴汉。',
  },

  // 3. 鲁肃 (临淮东城) - 财富雄厚
  {
    id: 'lu_su',
    name: '鲁肃',
    courtesyName: '子敬',
    birthYear: 172,
    deathYear: 217,
    birthplace: '扬州临淮郡东城县',
    provinceId: 'YANGZHOU',
    commandery: '临淮郡',
    county: '东城县',
    camp: 'WU',
    campLabel: '东吴大都督 · 临淮国士',
    titleTag: '【指囷相赠 · 豪阔国士】',
    avatarChar: '肃',
    archetype: 'WEALTHY',
    baseStats184: { health: 68, intellect: 72, martial: 55, virtue: 85, wealth: 88, fortune: 78 },
    peakStats: { health: 75, intellect: 92, martial: 66, virtue: 96, wealth: 98, fortune: 85 },
    perk: {
      title: '指囷相赠 · 巨贾资粮',
      description: '累代巨富仗义疏财，当主角家贫或遭遇饥荒时，定期赠予数十石麦粟与官金，开通江东商路。',
      buffEffect: '家资不足时每年秋后无偿赠送8~15两家财，彻底免疫因破产欠债沦为农奴之苦。',
    },
    dialogues: {
      childhoodGreeting: '“东城老家院里有两大仓粮，你若饿了尽管来搬！大丈夫处世，岂能因几斗杂粮让邻友受困？”',
      youthGreeting: '“汉家陵替，海内鼎沸。肃虽有一府资财，亦当倾资结纳四海豪杰，共谋天下大计。”',
      primeGreeting: '“公瑾乃当世奇英，足下亦是长者！赤壁锁江烈火在前，合孙刘以拒曹贼，大势成矣！”',
      seniorGreeting: '“天下未定，两军对峙益繁。单刀之会亦不过为江南赤子求一席安宁之地尔。”',
    },
    historicQuote: '“肃虽不敏，愿为足下画鼎足之计，建号帝王以图天下。”',
    historicalBio: '临淮东城人，家富于财，性好施与。周瑜匮乏引兵求粮，肃指巨廪之一赠之，后佐孙权开东吴基业。',
  },

  // 4. 华佗 (沛国谯县) - 妙手医圣
  {
    id: 'hua_tuo',
    name: '华佗',
    courtesyName: '元化',
    birthYear: 145,
    deathYear: 208,
    birthplace: '豫州沛国谯县',
    provinceId: 'YUZHOU',
    commandery: '沛国',
    county: '谯县',
    camp: 'NEUTRAL',
    campLabel: '汉末神医 · 杏林宗师',
    titleTag: '【青囊妙术 · 五禽延生】',
    avatarChar: '佗',
    archetype: 'HEALER',
    baseStats184: { health: 80, intellect: 88, martial: 32, virtue: 96, wealth: 45, fortune: 76 },
    peakStats: { health: 85, intellect: 96, martial: 40, virtue: 98, wealth: 50, fortune: 80 },
    perk: {
      title: '青囊回春 · 疾疫免疫',
      description: '传授五禽导引戏与麻沸神散，主角及其至亲完全免疫建安伤寒大疫与肺经顽疾，大幅延寿。',
      buffEffect: '健康自然流失率减半，大疫事件直接触发保全奇遇，每年春季额外恢复体魄+5。',
    },
    dialogues: {
      childhoodGreeting: '“谯县水土多湿热，幼童易受风寒。持此艾草与柴胡干汤，早起随老夫学熊经鸟申之法。”',
      youthGreeting: '“古人云上医医国，中医医人。世人争相佩印为官，老夫唯愿携青囊药箱行天下以全活人命。”',
      primeGreeting: '“人体欲得劳动，血脉流通则病不得生。此五禽之戏乃老夫穷究之理，授与足下延年益寿。”',
      seniorGreeting: '“曹公头风痼疾，欲以利刃开颅取涎，险象环生。此卷青囊遗稿，若老夫不归，请足下代传杏林。”',
    },
    historicQuote: '“人体欲得劳动，但不当使极耳。动摇则谷气得销，血脉流通，病不得生。”',
    historicalBio: '沛国谯人，精研医理方术，创麻沸散施剖腹重疾外科，制五禽之戏导引强身，世称神医。',
  },

  // 5. 曹操 (沛国谯县) - 才智过人 / 雄主
  {
    id: 'cao_cao',
    name: '曹操',
    courtesyName: '孟德',
    birthYear: 155,
    deathYear: 220,
    birthplace: '豫州沛国谯县',
    provinceId: 'YUZHOU',
    commandery: '沛国',
    county: '谯县',
    camp: 'WEI',
    campLabel: '曹魏武皇帝 · 魏王丞相',
    titleTag: '【治世能臣 · 唯才是举】',
    avatarChar: '操',
    archetype: 'STRATEGIST',
    baseStats184: { health: 76, intellect: 88, martial: 82, virtue: 62, wealth: 72, fortune: 88 },
    peakStats: { health: 82, intellect: 97, martial: 90, virtue: 68, wealth: 92, fortune: 95 },
    perk: {
      title: '青梅论雄 · 唯才是举',
      description: '同乡提拔与军屯赏拔，凡投身曹营者免除贬斥，直接任典农督粮或牙门别将，封邑赏帛。',
      buffEffect: '曹魏从军直接免除入伍考核门槛，官渡与屯田事件获取威望与战功奖励翻倍。',
    },
    dialogues: {
      childhoodGreeting: '“谯县老乡！当年我与袁本初在乡中戏耍放鹰，便知凡人碌碌无为。大丈夫当立大功名于天地！”',
      youthGreeting: '“洛阳设五色棒诛杀贵戚，今引骑兵讨黄巾！天下盗贼何足惧，唯才是举，当安海内！”',
      primeGreeting: '“对酒当歌，人生几何！设使国家无有孤，不知当几人称帝，几人称王！与孤同饮此爵！”',
      seniorGreeting: '“老骥伏枥，志在千里；烈士暮年，壮心不已。天下大势已有定局，足下随孤亦无悔矣。”',
    },
    historicQuote: '“宁我负人，毋人负我？不，吾之志，在使海内安宁、天下大定耳！”',
    historicalBio: '沛国谯人，汉末杰出军事家、政治家、文学家。挟天子以令不臣，扫平北方群雄，奠定曹魏大业。',
  },

  // 6. 糜竺 (东海朐县) - 财富雄厚
  {
    id: 'mi_zhu',
    name: '糜竺',
    courtesyName: '子仲',
    birthYear: 165,
    deathYear: 221,
    birthplace: '徐州东海郡朐县',
    provinceId: 'XUZHOU',
    commandery: '东海郡',
    county: '朐县',
    camp: 'SHU',
    campLabel: '蜀汉安汉将军 · 东海义商',
    titleTag: '【僮客万家 · 输财报国】',
    avatarChar: '竺',
    archetype: 'WEALTHY',
    baseStats184: { health: 70, intellect: 76, martial: 52, virtue: 90, wealth: 96, fortune: 75 },
    peakStats: { health: 75, intellect: 84, martial: 58, virtue: 95, wealth: 99, fortune: 80 },
    perk: {
      title: '僮客万家 · 输财资军',
      description: '东海巨富僮仆万人，资助主角建立商业运粮商队，经商货殖收益增加50%，遭遇败兵提供义仆护送。',
      buffEffect: '商业贩运收益大幅提升，投效刘备军营直接被授予安汉从事，享有免税优待。',
    },
    dialogues: {
      childhoodGreeting: '“朐县滨海盐铁之利，皆在糜氏。然商人重利轻义，竺独慕仁义君子。同乡小友常来府上吃炙肉！”',
      youthGreeting: '“陶徐州待我不薄，玄德公更有长者之风。乱世之中，唯有辅佐仁德之主，方能全家安民。”',
      primeGreeting: '“主公兵败海西，困顿无依。竺已将僮客二千、金银绢帛全数充入军旅，誓与汉室共存亡！”',
      seniorGreeting: '“入蜀定都，官位虽尊于诸葛孔明，然芳弟背盟失荆州，竺愧见玄德公……幸得故友相慰。”',
    },
    historicQuote: '“先主转侧东海，困窘乏绝，竺进妹于先主，并致奴客二千，赀帛亿万以充军资。”',
    historicalBio: '东海朐县人，祖世货殖，资产巨亿。倾家助刘备起兵，蜀汉建立官居安汉将军，位在诸葛亮之上。',
  },

  // 7. 关羽 (河东解县) - 勇武过人
  {
    id: 'guan_yu',
    name: '关羽',
    courtesyName: '云长',
    birthYear: 160,
    deathYear: 220,
    birthplace: '并州河东郡解县',
    provinceId: 'BINGZHOU',
    commandery: '河东郡',
    county: '解县',
    camp: 'SHU',
    campLabel: '蜀汉前将军 · 汉寿亭侯',
    titleTag: '【美髯武圣 · 义薄云天】',
    avatarChar: '羽',
    archetype: 'MARTIAL',
    baseStats184: { health: 85, intellect: 72, martial: 88, virtue: 86, wealth: 30, fortune: 78 },
    peakStats: { health: 94, intellect: 80, martial: 98, virtue: 92, wealth: 45, fortune: 82 },
    perk: {
      title: '青龙偃月 · 威震华夏',
      description: '水陆战阵勇冠当世，军阵中威势滔天，襄樊水战时免于沉溺，直接被收为亲军别部司马。',
      buffEffect: '主角行伍威望获取提升50%，樊城水战触发神勇助阵，解锁麦城突围生死逆袭选项。',
    },
    dialogues: {
      childhoodGreeting: '“解县盐池虽沃，恶霸横行！某手刃豪强逃奔幽燕，足下若有刚烈风骨，关某引为知己！”',
      youthGreeting: '“涿郡桃园誓同生死，关某一生唯忠义二字！沙场逢敌，三尺青龙刀未尝逢对手！”',
      primeGreeting: '“白马坡刺颜良于万众之中，万军莫当！曹公虽待某厚，然玄德恩厚如天，誓不背弃！”',
      seniorGreeting: '“借八月秋霖水淹七军，擒于禁斩庞德，此战当使曹贼迁都避锋！随某同上樊城要隘！”',
    },
    historicQuote: '“玉可碎而不可改其白，竹可焚而不可毁其节，身虽殒，名可垂于竹帛也。”',
    historicalBio: '河东解县人，与刘备、张飞情同手足。斩颜良诛文丑，水淹七军威震华夏，世奉为武圣。',
  },

  // 8. 贾诩 (武威姑臧) - 才智过人 / 苟道真仙
  {
    id: 'jia_xu',
    name: '贾诩',
    courtesyName: '文和',
    birthYear: 147,
    deathYear: 223,
    birthplace: '凉州武威郡姑臧县',
    provinceId: 'LIANGZHOU',
    commandery: '武威郡',
    county: '姑臧县',
    camp: 'WEI',
    campLabel: '曹魏太尉 · 魏寿乡侯',
    titleTag: '【算无遗策 · 隐忍保身】',
    avatarChar: '诩',
    archetype: 'STRATEGIST',
    baseStats184: { health: 65, intellect: 86, martial: 35, virtue: 48, wealth: 55, fortune: 88 },
    peakStats: { health: 75, intellect: 98, martial: 42, virtue: 58, wealth: 76, fortune: 96 },
    perk: {
      title: '算无遗策 · 闭门自保',
      description: '乱世自全大智慧，传授趋利避害密旨，彻底规避被诸侯清洗、诛连灭族之厄运。',
      buffEffect: '遭遇阵营内讧、诸侯猜忌时必定安全隐退，气数属性保底维持在70以上。',
    },
    dialogues: {
      childhoodGreeting: '“凉州黄沙漫天，羌胡杂处。老夫年少游历，深知保全有用之身方是根本。来，学学这避害之法。”',
      youthGreeting: '“天下纷扰，强梁者先毙。顺应大势，不出虚谋，算人之所算，方能在乱世屹立不倒。”',
      primeGreeting: '“张绣依诩计拒曹公，官渡之战劝绣归曹，曹公抚诩背曰：使我信重于天下者，子也！”',
      seniorGreeting: '“入魏以来深自结纳，闭门自守，不结权贵私交，男女嫁娶不攀高门，故能终全家业也。”',
    },
    historicQuote: '“天下纷扰，唯文和算无遗策；深自结纳，闭门自守，终全其家。”',
    historicalBio: '武威姑臧人，曹魏开国谋首。历仕董卓、李傕、张绣、曹操，官至太尉，算无遗策，善终高寿。',
  },

  // 9. 张仲景 (南阳涅阳) - 妙手医圣
  {
    id: 'zhang_zhongjing',
    name: '张机',
    courtesyName: '仲景',
    birthYear: 150,
    deathYear: 219,
    birthplace: '荆州南阳郡涅阳县',
    provinceId: 'JINGZHOU',
    commandery: '南阳郡',
    county: '涅阳县',
    camp: 'NEUTRAL',
    campLabel: '长沙太守 · 医圣',
    titleTag: '【万民医圣 · 经方立命】',
    avatarChar: '机',
    archetype: 'HEALER',
    baseStats184: { health: 75, intellect: 86, martial: 25, virtue: 95, wealth: 52, fortune: 75 },
    peakStats: { health: 80, intellect: 97, martial: 30, virtue: 99, wealth: 62, fortune: 82 },
    perk: {
      title: '伤寒杂病 · 万方济世',
      description: '撰写经方活人无数，传授当归生姜羊肉汤与麻黄汤方，直接消除冬寒虚损。',
      buffEffect: '建安二十二年大疫必定研制出救世汤剂，拯救邻里乡党，仁厚声望飙升+30。',
    },
    dialogues: {
      childhoodGreeting: '“南阳多秀民，奈何兵荒马乱之际，亲族死于伤寒者十居其七。机立誓必精研本草以活万民！”',
      youthGreeting: '“虽为孝廉守长沙，然坐堂施诊不可荒废。官位虚名何足道，能全百姓一命才是实功。”',
      primeGreeting: '“勤求古训，博采众方。撰成《伤寒杂病论》十六卷，此经方药方，足下好生收执度世。”',
      seniorGreeting: '“感往昔之沦丧，伤横夭之莫救。老朽行将入土，愿此书流传于天下草民之手，永不绝音。”',
    },
    historicQuote: '“感往昔之沦丧，伤横夭之莫救，乃勤求古训，博采众方，作《伤寒杂病论》。”',
    historicalBio: '南阳涅阳人，曾举孝廉任长沙太守，后辞官行医，著《伤寒杂病论》，被后世尊为医圣。',
  },

  // 10. 周瑜 (庐江舒县) - 才智过人 / 风流儒将
  {
    id: 'zhou_yu',
    name: '周瑜',
    courtesyName: '公瑾',
    birthYear: 175,
    deathYear: 210,
    birthplace: '扬州庐江郡舒县',
    provinceId: 'YANGZHOU',
    commandery: '庐江郡',
    county: '舒县',
    camp: 'WU',
    campLabel: '东吴大都督 · 偏将军',
    titleTag: '【江东周郎 · 烈火长河】',
    avatarChar: '瑜',
    archetype: 'STRATEGIST',
    baseStats184: { health: 65, intellect: 78, martial: 60, virtue: 82, wealth: 80, fortune: 72 },
    peakStats: { health: 72, intellect: 96, martial: 82, virtue: 90, wealth: 88, fortune: 78 },
    perk: {
      title: '水师总督 · 火攻连环',
      description: '江东水师大都督，精通长江水道战船调度，赤壁火攻时直接拔擢为主力蒙冲统带官。',
      buffEffect: '在南方扬州荆州水域历练时，水战生存率100%，赤壁战事直接领受东吴高级军功。',
    },
    dialogues: {
      childhoodGreeting: '“庐江舒城钟灵毓秀，瑜幼年即习琴书射猎。曲有误，周郎顾，足下亦知琴中雅意否？”',
      youthGreeting: '“与伯符义结金兰，升堂拜母，江东草昧，正是英雄乘风破浪、开疆拓土之秋！”',
      primeGreeting: '“曹操老贼引铁索锁江，何足惧哉！瑜乘东南狂风纵火，八百里烈焰倾覆北军！随瑜破敌！”',
      seniorGreeting: '“天妒英才，瑜中流矢箭创未愈。未能取益州而并天下，人生短折，然赤壁一火，无愧于江东！”',
    },
    historicQuote: '“方今大地未定，此天下英雄用武之时也，岂可使曹公得逞其志！”',
    historicalBio: '庐江舒人，名门望族。辅策定江东，赤壁之战统帅吴蜀联军大破曹操，奠定天下三分格局。',
  },

  // 11. 荀彧 (颍川颍阴) - 才智过人 / 王佐清流
  {
    id: 'xun_yu',
    name: '荀彧',
    courtesyName: '文若',
    birthYear: 163,
    deathYear: 212,
    birthplace: '豫州颍川郡颍阴县',
    provinceId: 'YUZHOU',
    commandery: '颍川郡',
    county: '颍阴县',
    camp: 'WEI',
    campLabel: '汉侍中 · 尚书令 · 汉室名臣',
    titleTag: '【王佐之才 · 颍川香冠】',
    avatarChar: '彧',
    archetype: 'STRATEGIST',
    baseStats184: { health: 60, intellect: 90, martial: 30, virtue: 92, wealth: 65, fortune: 78 },
    peakStats: { health: 68, intellect: 97, martial: 35, virtue: 96, wealth: 75, fortune: 84 },
    perk: {
      title: '王佐深策 · 门阀辟举',
      description: '天下清流领袖，尚书令举荐贤才，使主角直接获得朝廷文职与太学修学机缘。',
      buffEffect: '文官文吏升迁速度倍增，解锁许昌官署朝廷正职，大幅增进名望与识见。',
    },
    dialogues: {
      childhoodGreeting: '“颍川八达，荀氏代有清声。幼年读经学礼，深知汉家四百年纲常不可废坠。”',
      youthGreeting: '“天下纷崩，当迎天子以从民望，秉公义以聚英才。足下雅量，堪为栋梁。”',
      primeGreeting: '“坐镇后方调配兵粮二十年，官渡粮尽，彧力劝曹公坚守以待机变，终成大业。”',
      seniorGreeting: '“本为匡扶汉室而起兵，今见九锡王封……一介汉臣，空食盒下，唯存名节于青史。”',
    },
    historicQuote: '“奉天子以从民望，秉至公以服天下。”',
    historicalBio: '颍川颍阴人，官至侍中守尚书令，被曹操赞为“吾之子房”，居中筹划二十载，终为汉室守节。',
  },

  // 12. 庞德公 (荆州襄阳) - 经学名士 / 隐逸高格
  {
    id: 'pang_degong',
    name: '庞德公',
    courtesyName: '山民',
    birthYear: 140,
    deathYear: 220,
    birthplace: '荆州南郡襄阳县',
    provinceId: 'JINGZHOU',
    commandery: '南郡',
    county: '襄阳县',
    camp: 'NEUTRAL',
    campLabel: '鹿门高隐 · 荆襄师表',
    titleTag: '【鹿门采药 · 品藻英豪】',
    avatarChar: '庞',
    archetype: 'HERMIT',
    baseStats184: { health: 78, intellect: 90, martial: 20, virtue: 98, wealth: 45, fortune: 90 },
    peakStats: { health: 82, intellect: 95, martial: 25, virtue: 99, wealth: 50, fortune: 94 },
    perk: {
      title: '鹿门隐道 · 品藻知命',
      description: '鹿门山采药隐士，曾品藻孔明为卧龙、士元为凤雏，传授主角恬淡知命、达观延寿心境。',
      buffEffect: '仁厚与气数加成大幅提升，晚年寿数保障，超然物外免于任何政治漩涡。',
    },
    dialogues: {
      childhoodGreeting: '“襄阳水畔，鹿门松下。红尘杀伐万种，皆不如草堂一壶浊酒、一卷《周易》自适。”',
      youthGreeting: '“诸葛孔明、庞士元，皆常过访吾庐，席地倾谈。足下心存至纯，亦吾家清客也。”',
      primeGreeting: '“刘表数次备车马延请入城，吾携妻儿隐入深山采药。鸿鹄翔于九天，何苦受牢笼羁绊。”',
      seniorGreeting: '“留万贯家财于子孙，莫若留清白耕读之家训。平生不羡王侯印，白首林泉得安闲。”',
    },
    historicQuote: '“鸿鹄巢于高林之上，暮而宿之，各得其所而已，岂可强使入笼圈！”',
    historicalBio: '襄阳人，居岘山南鹿门山。品藻卧龙凤雏，刘表躬自请之不能屈，遂携妻子登鹿门山采药不知所终。',
  },

  // 13. 孙策 (吴郡富春) - 勇武过人
  {
    id: 'sun_ce',
    name: '孙策',
    courtesyName: '伯符',
    birthYear: 175,
    deathYear: 200,
    birthplace: '扬州吴郡富春县',
    provinceId: 'YANGZHOU',
    commandery: '吴郡',
    county: '富春县',
    camp: 'WU',
    campLabel: '东吴长沙桓王 · 讨逆将军',
    titleTag: '【江东小霸王 · 辟地千里】',
    avatarChar: '策',
    archetype: 'MARTIAL',
    baseStats184: { health: 70, intellect: 68, martial: 75, virtue: 70, wealth: 65, fortune: 60 },
    peakStats: { health: 88, intellect: 78, martial: 96, virtue: 78, wealth: 78, fortune: 65 },
    perk: {
      title: '霸王横戈 · 扬鞭江东',
      description: '勇冠三军所向披靡，平定扬州诸郡时获封亲随别将，战力暴增。',
      buffEffect: '勇略成长大幅加快，参与江东战事时战力倍增，声名震动东南。',
    },
    dialogues: {
      childhoodGreeting: '“富春江潮浩荡！吾幼年随先父征讨，誓要提长槊荡平六合，江东儿郎不可屈服！”',
      youthGreeting: '“以传国玉玺质袁术，借得兵马数千渡江！周瑜随我同心，数年之间席卷江东六郡！”',
      primeGreeting: '“天下英雄谁敌手？决机于两陈之间，驰骋于万夫之表，大丈夫生当作万人之敌！”',
      seniorGreeting: '“丹徒遇刺，伤势渐笃。若举江东之众，决机两阵，卿不如我；招贤纳士，我不如卿。”',
    },
    historicQuote: '“决机于两陈之间，驰骋于万夫之表，卿不如我；招贤纳士，我不如卿。”',
    historicalBio: '吴郡富春人，孙坚长子。借兵渡江，辟地千里创江东基业，勇猛如项羽，人称小霸王。',
  },

  // 14. 甘宁 (巴郡临江) - 勇武过人 / 锦帆游侠
  {
    id: 'gan_ning',
    name: '甘宁',
    courtesyName: '兴霸',
    birthYear: 170,
    deathYear: 215,
    birthplace: '益州巴郡临江县',
    provinceId: 'YIZHOU',
    commandery: '巴郡',
    county: '临江县',
    camp: 'WU',
    campLabel: '东吴折冲将军 · 西陵太守',
    titleTag: '【锦帆豪客 · 百骑劫营】',
    avatarChar: '宁',
    archetype: 'MARTIAL',
    baseStats184: { health: 80, intellect: 62, martial: 80, virtue: 65, wealth: 60, fortune: 75 },
    peakStats: { health: 90, intellect: 75, martial: 95, virtue: 75, wealth: 70, fortune: 80 },
    perk: {
      title: '锦帆夜袭 · 水陆豪侠',
      description: '长江绿林水匪避让，夜袭曹营百骑毫发无伤，传授游侠短刃与水战突袭之法。',
      buffEffect: '水道船帮贩运行商时免除水贼骚扰，行伍夜袭斩获战功加倍。',
    },
    dialogues: {
      childhoodGreeting: '“巴山蜀水汉江头！宁少有气力，好游侠任气，佩双刀缀铜铃，两岸水客闻铃皆知甘兴霸至矣！”',
      youthGreeting: '“读诸子书通晓大略，不愿为碌碌盗寇。提刀出三峡归江东，随都督破黄祖、攻南郡！”',
      primeGreeting: '“孟德数十万兵屯濡须坞，至尊赐某白羽鹅翎！某提百骑衔枚夜袭敌营，拔旗斩首，毫发未伤归！”',
      seniorGreeting: '“孟德有张辽，孤有甘兴霸，足相敌也！生逢知己之主，临江儿郎死得其所！”',
    },
    historicQuote: '“天下未定，宁当提百骑裹白羽夜袭曹寨，折冲御侮，不让北军长驱！”',
    historicalBio: '巴郡临江人，少好游侠佩铜铃号锦帆贼，后归东吴屡建奇功，百骑劫曹营，名震孙权帐下。',
  },
];
