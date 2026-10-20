import {
  ProvinceId,
  SocialClass,
  Attributes,
  YearlyEvent,
  RealisticEnding,
  LifeChoice,
} from '../types/game';
import { PROVINCES } from '../data/regions';

export interface PersonProfile {
  name: string;
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

export function generateRandomBirth(): PersonProfile {
  const surnames = [
    '王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
    '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
    '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
    '程', '曹', '袁', '荀', '陆', '顾', '邓', '姜', '崔', '司马',
  ];
  const givenNamesMale = ['安', '顺', '福', '保', '生', '牛', '广', '平', '富', '康', '寿', '松', '山', '林', '义', '良', '定', '延', '崇', '道'];
  const givenNamesFemale = ['娣', '娘', '花', '秀', '英', '兰', '凤', '巧', '姑', '春', '梅', '月', '环', '青', '贞', '慧'];

  const isMale = Math.random() > 0.4;
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = isMale
    ? givenNamesMale[Math.floor(Math.random() * givenNamesMale.length)]
    : givenNamesFemale[Math.floor(Math.random() * givenNamesFemale.length)];

  // Province distribution: weighted towards historical major population zones
  const provincePick = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
  const commanderyPick = provincePick.commanderies[Math.floor(Math.random() * provincePick.commanderies.length)];
  const countyPick = provincePick.counties[Math.floor(Math.random() * provincePick.counties.length)];

  // Social class distribution (vast majority are poor peasants and town folk)
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
    socialClass = 'NOBLE_GENTRY'; // ~1.5% rare birth
  }

  const initialOccupation = '襁褓幼童';

  return {
    name: `${surname}${givenName}`,
    gender: isMale ? 'MALE' : 'FEMALE',
    birthProvince: provincePick.id,
    currentProvince: provincePick.id,
    commandery: commanderyPick,
    county: countyPick,
    socialClass,
    occupation: initialOccupation,
    fatherName: `${surname}大郎`,
    fatherAlive: true,
    motherName: '陈氏',
    motherAlive: true,
    siblingCount: Math.floor(Math.random() * 4),
    childrenCount: 0,
  };
}

export function generateInitialAttributes(socialClass: SocialClass): Attributes {
  // Base attributes (1-100 scale, with baseline around 30-60 for ordinary folk)
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

  // Clamping
  Object.keys(base).forEach((k) => {
    const key = k as keyof Attributes;
    base[key] = Math.max(10, Math.min(95, base[key]));
  });

  return base;
}

/**
 * Generates the event narrative and choice (if applicable) for a specific year and age
 */
export function getYearlyEvent(
  year: number,
  age: number,
  profile: PersonProfile,
  stats: Attributes
): YearlyEvent {
  const province = PROVINCES.find((p) => p.id === profile.currentProvince) || PROVINCES[0];

  // 1. Lunar calendar mapping
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

  const lunarYear = lunarMap[year] || `公元${year}年`;

  // Macro Historical Chronicle for that year
  const macroEvents: Record<number, string> = {
    184: '巨鹿张角自称“大贤良师”，三十六方同日俱起，黄巾之乱爆发，海内震裂。朝廷大赦党人，发天下精兵剿捕。',
    185: '黑山贼张燕聚众百万劫掠冀州并州；凉州边章、韩遂引羌兵破金城，边疆糜烂。',
    186: '江夏赵慈反叛，六州大水，汉廷鬻官卖爵，四海流民塞道。',
    187: '前中山相张纯与乌桓丘力居叛乱，略蓟中，杀护乌桓校尉。天下兵乱无宁日。',
    188: '汉灵帝改刺史为州牧，重臣分据一方。朝廷于洛阳平乐观设西园八校尉，曹操为典军校尉。',
    189: '四月灵帝驾崩，大将军何进召西凉刺史董卓带兵入洛。宦官诛何进，袁绍尽杀宦官。董卓引铁骑进京，废少帝，立陈留王为汉献帝。',
    190: '曹操发矫诏，关东十八路诸侯歃血起兵讨董卓。董卓纵火焚烧洛阳两百里宫室，驱数百万百姓迁都长安，死者盈沟。',
    191: '关东诸侯各怀异心，自相并吞。孙坚破洛阳得传国玉玺，旋即中流矢死于岘山；袁绍袭取冀州。',
    192: '司徒王允与吕布诛杀董卓于未央宫。董卓部将李傕、郭汜引凉州兵反攻长安，屠杀百官，关中大饥，民相食。',
    193: '曹操父曹嵩于徐州遭戕，曹操借故大举东征徐州，拔十余城，坑杀男女数十万于泗水，泗水为之断流。',
    194: '兖州大蝗灾，食尽草木，人相食，白骨蔽野。吕布袭取兖州，曹操仅余甄城、范县、东阿三城。',
    195: '李傕郭汜在长安互相攻杀，汉献帝东归洛阳，沿途荆棘载途，百官冻馁，粮尽食草根。',
    196: '曹操迎汉献帝迁都许县，奉天子以令诸侯；定屯田之制以赡军民。',
    197: '袁术于寿春僭号称帝，建号仲家。天下共讨之。淮南大饥，民食草木螺蚌。',
    198: '曹操水淹下邳，生擒吕布缢杀于白门楼。张辽降曹，徐州悉平。',
    199: '袁绍消灭公孙瓒，尽并幽、并、青、冀四州，带甲数十万，准备南下与曹操争夺天下。',
    200: '官渡之战爆发。曹操兵少粮尽，相持数月，夜袭乌巢焚尽袁绍万车粮草，袁绍全军土崩瓦解。',
    207: '曹操北征乌桓，白狼山阵斩蹋顿，统一北方。刘备于新野三顾茅庐，得诸葛孔明。',
    208: '秋，曹操引大军南下荆州，刘表卒，刘琮降。冬，孙刘联军火烧赤壁，曹操败走华容，天下三分之形奠定。',
    211: '曹操西征马超、韩遂，大战潼关。刘备应刘璋之邀引兵入益州。',
    214: '刘备围成都，刘璋开城出降。刘备据有益州天府之国。',
    217: '建安二十二年，中原大疫流行，家家有僵尸之痛，室室有号泣之哀。建安七子中徐干、陈琳、应玚、刘桢同卒于疫。',
    219: '关羽水淹七军威震华夏，曹操几欲迁都。吕蒙白衣渡江袭取荆州，关羽走麦城身亡。刘备自立为汉中王。',
    220: '正月魏王曹操卒于洛阳。冬十月，汉献帝禅位于曹丕，改国号魏，东汉四百余年国祚告终。',
    221: '刘备于成都即皇帝位，国号汉，改元章武。誓师伐吴，为关羽张飞雪恨。',
    222: '夷陵之战，陆逊火烧蜀军连营七百里，刘备兵败退保永安白帝城。',
    223: '四月刘备病逝于白帝城永安宫，托孤于诸葛亮。后主刘禅即位。',
    228: '诸葛亮上《出师表》首次北伐，街亭失守，斩马谡，引军还汉中。',
    234: '诸葛亮第五次北伐，与司马懿相持于五丈原百余日。秋八月，星落五丈原，孔明病逝，享年五十四。',
    249: '司马懿趁大将军曹爽陪帝谒高平陵，发动政变诛杀曹爽三族，魏室大权尽归司马氏。',
  };

  const macroText = macroEvents[year] || '天下烽烟未熄，诸侯兵戈征伐，黎民辗转沟壑，各自求全。';

  // Regional impact based on province
  let regionalText = '';
  if (province.id === 'JIZHOU' && year <= 186) {
    regionalText = `巨鹿一带村村戴黄巾，你所在的【${profile.county}】常有持九节杖的太平道徒走村穿巷，官兵与贼寇拉锯拉扯，田亩荒废。`;
  } else if (province.id === 'XUZHOU' && (year === 193 || year === 194)) {
    regionalText = `曹操大军由东莞南下，所过拔取屠戮。【${profile.county}】城外泗水漂满浮尸，哭号震天，四野鸡犬不闻。`;
  } else if (province.id === 'YANZHOU' && (year === 194 || year === 195)) {
    regionalText = `飞蝗蔽天自东来，草木叶甚至树皮全被啃尽。郡内斗米值五十万钱，人相食，乡邻为争一口野菜打得头破血流。`;
  } else if (province.id === 'LUOYANG' && (year === 189 || year === 190)) {
    regionalText = `董卓西凉兵横行坊市，白昼杀人掠货。洛阳九龙门火光冲天，官道上被驱赶西行的百姓哭声数月不绝。`;
  } else if (province.id === 'JIAOZHOU') {
    regionalText = `交州在士使君治下安静若世外桃源，番舶停泊番禺海岸，市集上尽是胡椒、翡翠与沉香，不知中原兵马战阵。`;
  } else if (province.id === 'JINGZHOU' && year >= 190 && year <= 207) {
    regionalText = `刘表招徕流移，立学官抚万民。襄阳与江陵一带稻米丰足，北来名士高冠博带，四野常闻弦歌读书之声。`;
  } else if (province.id === 'LIANGZHOU') {
    regionalText = `塞外长风卷黄沙，韩遂马腾兵马与西凉羌骑常在关隘集结，边民皆腰佩短刀，夜里巡更防范偷营。`;
  } else {
    regionalText = `【${profile.county}】差役催课甚急，官仓常闭，街市粮价日日攀升，偶有从北方逃难来的蓬头垢面流民沿路乞讨。`;
  }

  // Personal story & choices based on age
  let personalStory = '';
  let choice: { prompt: string; options: LifeChoice[] } | undefined = undefined;

  if (age === 0) {
    personalStory = `公元184年（中平元年），你在【${province.provinceName}·${profile.commandery}·${profile.county}】降生。接生婆用热水洗净你身上的血污，父亲${profile.fatherName}在堂前焚了一束草香祈祷。母亲${profile.motherName}脸色苍白地将你抱入怀中。这一年，你只是浩荡乱世里微不足道的一个婴儿。`;
  } else if (age === 1) {
    personalStory = `刚满一岁，天寒大雪，家中柴炭不足，母亲整夜把你裹在胸口温热的旧絮棉袍里。你因水土不服腹泻数日，险些未能撑过中平二年的严冬。`;
  } else if (age === 3) {
    personalStory = `你在泥地里学会了小跑。父亲在后园挖野草根，母亲在檐下纺粗麻。偶尔有官府的飞马使者从村前官道疾驰而过，马蹄扬起半天黄尘。`;
  } else if (age === 5) {
    personalStory = `五岁这年，你跟着邻家小孩去捉蛐蛐。在村口枯树下，你看见一队佩刀带弓的败军经过，其中一人将咬了一半的干硬麦饼扔在地上，几个饥民扑上去撕咬。`;
  } else if (age === 7) {
    // Choice 1: Boyhood path
    personalStory = `你年满七岁，按汉家规矩已到辨识是非之年。家里商量你的出路。`;
    choice = {
      prompt: '七岁这一年，面对飘摇的家境，你更愿意把心思放在何处？',
      options: [
        {
          id: 'c_age7_farm',
          label: '帮家里放牛割草，扛起农活与生计',
          description: '做个懂事的苦力孩子，分担父母艰辛，强筋健骨。',
          statChanges: { health: 8, martial: 4, virtue: 4 },
          outcomeText: '你晒得黝黑壮实，手脚麻利，村里长辈都夸你是个孝顺肯吃苦的好后生。',
        },
        {
          id: 'c_age7_read',
          label: '在乡里私塾窗下偷听老先生讲《孝经》与识字',
          description: '借树枝在泥地上画字，即便买不起简牍，也渴望明白道理。',
          requirements: { intellect: 35 },
          statChanges: { intellect: 10, virtue: 6, wealth: -2 },
          outcomeText: '私塾老先生见你心诚，破例免你修脯，教你辨识了两百个常用篆隶汉字。',
        },
        {
          id: 'c_age7_play_fight',
          label: '召集村里野小子玩“官军捉贼”，练习削木刀木弓',
          description: '天生好勇斗狠，爱听行脚商人讲名将勇冠三军的传奇故事。',
          statChanges: { martial: 8, health: 6, virtue: -2 },
          outcomeText: '你成了村里十几个野小子的孩子王，爬树掷石百发百中，胆气渐长。',
        },
      ],
    };
  } else if (age === 10) {
    personalStory = `十岁这年，天下大乱日深，十室九空。母亲患了咳喘之疾，家中拿不出两百钱买草药。你在县城药铺门口徘徊。`;
    choice = {
      prompt: '母亲久病不愈，药铺掌柜不肯赊账，你将如何应对？',
      options: [
        {
          id: 'c_age10_gather_herbs',
          label: '上荒山峭壁，照着图样亲自去寻采野生桔梗与柴胡',
          description: '冒着滑落山崖与野兽的危险，为母亲采药。',
          statChanges: { health: -4, virtue: 12, intellect: 4, fortune: 5 },
          outcomeText: '你的鞋底磨穿了，满手荆棘血痕，终于采得两株老草药煎汤，母亲喝下后热退神清，抱你痛哭。',
        },
        {
          id: 'c_age10_apprentice',
          label: '在药铺跪下给掌柜磕头，自愿充当三年杂役挑水切药',
          description: '以童工之身换取药资，顺便偷学切药煎汤的本事。',
          statChanges: { intellect: 8, wealth: 4, virtue: 4, health: 2 },
          outcomeText: '掌柜叹了口气，给了你一副柴胡汤，自此你在药坊里做了三年药童，辨识了百余味本草。',
        },
        {
          id: 'c_age10_beg',
          label: '向邻近的大户豪强门前哀告叩头乞求施舍',
          description: '放下尊严乞讨，只求救活至亲。',
          statChanges: { virtue: 4, wealth: 2, fortune: -2 },
          outcomeText: '大户门丁扔出几个铜钱将你轰走，虽解了燃眉之急，但豪强家奴的冷眼让你刻骨铭心。',
        },
      ],
    };
  } else if (age === 14) {
    personalStory = `十四岁成丁前夕，官府清查户籍簿。北方曹公行屯田，徐扬割据自守，到处需要青壮劳力与戍卒。`;
    choice = {
      prompt: '行将弱冠之年，面对乱世茫茫前路，你打算迈出哪一步？',
      options: [
        {
          id: 'c_age14_blacksmith',
          label: '去县里铁匠铺打杂，学习锻造刀矛与农具',
          description: '乱世之中，铁匠最受各方尊重，既能修犁锄，也能打刀甲。',
          statChanges: { martial: 8, health: 8, wealth: 6 },
          outcomeText: '你在铁炉旁挥锤三年，膀臂练得粗壮如铁，打造的环首短刀锋利耐磨，渐有名声。',
        },
        {
          id: 'c_age14_caravan',
          label: '跟随同乡行商的骡队，走水路往南方贩运土产',
          description: '走南闯北，多见世面，虽有匪患水贼之险，但利市丰厚。',
          statChanges: { wealth: 14, intellect: 8, health: -4, fortune: 4 },
          outcomeText: '你顺江而下见识了荆襄的繁华与江东的水网，学会了与市吏差役周旋，兜里有了几块碎银。',
        },
        {
          id: 'c_age14_clerk',
          label: '投效县衙户曹，帮老书吏抄写户籍与钱粮账目',
          description: '吃公家一口杂粮粥，结交县里三老与亭长。',
          requirements: { intellect: 45 },
          statChanges: { intellect: 12, wealth: 6, virtue: 4 },
          outcomeText: '你写得一手端正汉隶，算盘粮账毫厘不差，连县丞都记住了你的名字。',
        },
      ],
    };
  } else if (age === 18) {
    // Conscription or Refuge crisis
    personalStory = `十八岁这年，诸侯征兵檄文下达，每个村落必须出丁二人随大军运粮。或者，你也可以选择逃荒远离兵戈。`;
    choice = {
      prompt: '征兵鼓声在村头敲响，县吏带着刀手按籍捉人，你作何决断？',
      options: [
        {
          id: 'c_age18_serve_soldier',
          label: '慨然应征入伍，扛起长矛做一名行伍步卒',
          description: '好男儿去战阵上博个前程，哪怕马革裹尸，也比饿死强！',
          statChanges: { martial: 12, health: 4, wealth: 4, fortune: -4 },
          outcomeText: '你披上粗布号衣，手持丈二白蜡杆长矛，排着队列踏出城门。母亲追了三里地，往你怀里塞了两个粗面馒头。',
          fatalCheck: (st) => {
            if (st.health < 25 && st.martial < 35) {
              return { isFatal: true, deathReason: '入伍第一年随军远征，因霍乱暴病阵亡于军中。' };
            }
            return null;
          },
        },
        {
          id: 'c_age18_serve_logistics',
          label: '主动申请充当后方运粮夫，推独轮小车转运军粮',
          description: '运粮虽苦虽累，但不直面敌阵刀枪，存活机会稍大。',
          statChanges: { health: 6, virtue: 6, wealth: 2 },
          outcomeText: '你推着吱呀作响的独轮车，日行五十里运送麦米，脚板起满老茧，在后勤营地结识了各州民夫。',
        },
        {
          id: 'c_age18_flee_south',
          label: '变卖家当，连夜携全家老小南逃荆襄避难',
          description: '不掺和中原诸侯厮杀，南渡汉水投奔刘表治下的襄阳。',
          statChanges: { wealth: -10, virtue: 8, fortune: 8, health: -4 },
          outcomeText: '历经两千里艰难跋涉，你终于带全家逃到了襄阳城外。虽丢了故土田宅，但全家人得以在草亭下安顿下来。',
        },
      ],
    };
  } else if (age === 24) {
    // Marriage / Family Life
    personalStory = `二十四岁。乱世人命苦短，乡邻见你勤恳踏实，有老翁上门为你提亲。女家是邻村的刘氏女，勤俭温柔。`;
    choice = {
      prompt: '面对媒妁提亲，你是否成家？',
      options: [
        {
          id: 'c_age24_marry',
          label: '欣然应允，拿出积攒多年的两千钱与布匹下聘成婚',
          description: '成家立业，在这风雨飘摇的乱世里寻一个温暖的归宿。',
          statChanges: { virtue: 10, health: 6, wealth: -12 },
          outcomeText: '青芦草席，两杯浊酒。红烛下你与刘氏结为夫妻，次年为你生下一个白胖的儿子，茅屋中有了欢声笑语。',
        },
        {
          id: 'c_age24_postpone',
          label: '天下未定身家飘摇，婉拒婚事，专注积蓄钱粮防荒',
          description: '深知兵祸无常，养活自己尚且艰难，不敢轻易拖累妇孺。',
          statChanges: { wealth: 14, intellect: 6, virtue: -2 },
          outcomeText: '你将钱财换购了数石麦米与十斤干腊肉藏于地窖中，一心防备未来的荒年。',
        },
      ],
    };
  } else if (age === 33) {
    // Epidemic or Historical Encounter
    personalStory = `三十三岁（建安年间）。中原流行大疫（伤寒病），十户之中九户发热，邻近数村哭声相闻，连朝廷名流都未能幸免。`;
    choice = {
      prompt: '瘟疫在县内蔓延，你与家人也隐隐感到发热体虚，该如何自救？',
      options: [
        {
          id: 'c_age33_zhang_remedy',
          label: '按南阳张仲景流传的“当归生姜羊肉汤/麻黄汤”古方煎熬草药',
          description: '相信名医方剂，不信巫鬼符水，采买生姜干葱重汤发汗。',
          requirements: { intellect: 40 },
          statChanges: { health: 12, intellect: 8, wealth: -6 },
          outcomeText: '一碗热汤灌下，大汗淋漓！次日烧退神清，你还用此法救治了隔壁三户邻里，乡里尊你为长者。',
        },
        {
          id: 'c_age33_seal_doors',
          label: '闭门锁户，杜绝走访，在门外泼洒石灰与艾草烟熏',
          description: '采取最严格的防避隔离之策，耐心等待瘟疫平息。',
          statChanges: { health: 8, wealth: -4 },
          outcomeText: '虽然家中存粮耗尽大半，但全家老小无一人染上恶疾，平安渡过了这场建安大劫。',
        },
        {
          id: 'c_age33_pray',
          label: '前往道观求取符水与神符焚化吞服',
          description: '随大流求神拜佛，祈祷上苍保佑。',
          statChanges: { health: -14, fortune: -4 },
          outcomeText: '符水无用，你发热卧床整整两个月，形销骨立，险些一命呜呼，大病初愈后落下了气喘的毛病。',
          fatalCheck: (st) => {
            if (st.health < 28) {
              return { isFatal: true, deathReason: '建安年间伤寒暴发，病重无药，高热抽搐而终。' };
            }
            return null;
          },
        },
      ],
    };
  } else if (age === 45) {
    // Midlife milestone
    personalStory = `四十五岁。大汉已亡，魏蜀吴三分天下。你的鬓角渐渐花白，儿女渐渐长大。村里的年轻人都来向你请教当年黄巾董卓旧事。`;
    choice = {
      prompt: '步入知命之年，你打算如何安度余生？',
      options: [
        {
          id: 'c_age45_village_elder',
          label: '出任乡里三老，主持乡饮酒礼与调解田宅争端',
          description: '为人公允，积德行善，成为地方上德高望重的老前辈。',
          statChanges: { virtue: 14, intellect: 6, wealth: 4 },
          outcomeText: '县令每逢巡乡都要下轿向你揖礼问政，邻里有纷争只要你一句话便能和息，威望极高。',
        },
        {
          id: 'c_age45_trade_farm',
          label: '扩建屋舍田垄，督促子孙勤恳耕织屯粮',
          description: '置办了二十亩水浇地与一间榨油坊，为子孙打下踏实家底。',
          statChanges: { wealth: 18, health: 4 },
          outcomeText: '家道殷实，仓有余粮，鸡犬相闻。在历经百年离乱的土地上，你创造了一片安稳的小天地。',
        },
        {
          id: 'c_age45_woodcarve',
          label: '闲暇时用桑木雕刻玩具与乐器，教村童唱汉末民谣',
          description: '笑看人间几多英雄梦，都付浊酒笑谈中。',
          statChanges: { virtue: 10, health: 8, fortune: 6 },
          outcomeText: '村头老槐树下，你手抚短笛，夕阳将你的影子拉得很长很长。孩子们围着你拍手唱跳。',
        },
      ],
    };
  } else if (age >= 60) {
    // Old age
    personalStory = `六十有余。三国末期，故人多半雕零。你坐在屋前藤椅上晒着温暖的冬阳，膝下已有孙儿绕膝奔跑。你亲眼目睹了东汉王朝的崩塌、三国的角逐与历史的风云变幻。`;
    if (age === 60) {
      choice = {
        prompt: '花甲之年，孙儿好奇地问起当年赤壁与官渡的大战，你叹息着说道：',
        options: [
          {
            id: 'c_age60_peace',
            label: '“什么霸业雄图，都不如家家烟囱有米饭香。”',
            description: '看透了征伐的虚妄，唯愿后代永不再经兵燹之苦。',
            statChanges: { virtue: 12, intellect: 8 },
            outcomeText: '孙儿似懂非懂地点了点头。那一晚，你睡得格外安详香甜。',
          },
          {
            id: 'c_age60_chronicle',
            label: '拿出一卷泛黄的羊皮残卷，将自己一生的亲历写成《家训》留给后世',
            description: '以普通人的双眼，记录这六十年的真实血泪与坚持。',
            statChanges: { intellect: 14, virtue: 8 },
            outcomeText: '这卷写在粗麻纸上的文字，后来被收录进《后汉草民别录》中，成为后代史官了解民间最珍贵的一手文献。',
          },
        ],
      };
    }
  } else {
    // Normal year progression
    const normalPhrases = [
      `这一年风调雨顺，你与家人抢收了秋麦，交完官租后，地窖里还有两缸麦子。体魄+2，家资+1。`,
      `这一年夏大旱，县里水渠干涸，你通宵在田头守水车车水浇禾，虽然疲惫，但禾苗保住了。体魄+1，家资+2。`,
      `县里新来了一任刺史，加征了绢帛税。你帮着邻舍修理了破败的屋顶，邻舍送了你半篓干鱼。仁厚+2。`,
      `这一年春寒料峭，你偶感风寒，卧床半月，喝了村口姜老汉的红糖葱白汤才渐渐好转。体魄-1。`,
      `远处又在打仗，官府征发民夫的差役在邻村抓人，好在你所在的地方因修河堤得以缓役。家资+1。`,
      `你起早贪黑在集市上卖掉了几捆编织的竹篾筐，换得了三斤盐和半斤生铁。家资+2，识见+1。`,
      `秋夜微凉，你坐在门槛上听过路的走方郎中闲聊，听说魏王曹丕称帝，蜀主刘备也登基了。识见+2。`,
      `这一年安宁无事，冬日大雪封门，一家人围着炭火盆烤红薯，听老人讲当年光武皇帝中兴的旧话。仁厚+2，体魄+2。`,
    ];
    personalStory = normalPhrases[age % normalPhrases.length];
  }

  return {
    year,
    lunarYear,
    age,
    macroHistory: macroText,
    regionalImpact: regionalText,
    personalStory,
    choice,
  };
}

/**
 * Generates the authentic, moving realistic ending for a completed life
 */
export function generateRealisticEnding(
  profile: PersonProfile,
  stats: Attributes,
  deathAge: number,
  deathYear: number,
  deathReason?: string
): RealisticEnding {
  const province = PROVINCES.find((p) => p.id === profile.currentProvince) || PROVINCES[0];

  // Tragic early death
  if (deathAge <= 3) {
    return {
      title: `${profile.county}殇子 · 享年${deathAge}岁`,
      epitaphTitle: '中平襁褓孤魂',
      summary: `生于公元184年汉末大乱之始，殁于公元${deathYear}年。因${deathReason || '寒冬恶疾'}夭折于襁褓。母亲陈氏将其葬于村后老榆树下，岁岁清明以野花为祭。`,
      historianNote: '汉季大乱，天下户口减耗十之八九。襁褓之殇，不绝于道，斯民之苦，何其极也！',
      tier: 'TRAGIC',
    };
  }

  if (deathReason && deathReason.includes('阵亡')) {
    return {
      title: `${profile.county}随军戍卒 · 享年${deathAge}岁`,
      epitaphTitle: '乱世白骨生还无期',
      summary: `被征召入伍十余载，转战中原数千里，殁于公元${deathYear}年战阵之中。死时怀中尚揣着一包未寄出的故乡泥土与母亲缝制的旧布鞋底。`,
      historianNote: '可怜无定河边骨，犹是春闺梦里人。横槊之雄今安在，枯骨荒草伴残阳。',
      tier: 'TRAGIC',
    };
  }

  if (deathAge < 30) {
    return {
      title: `${profile.county}短折良民 · 享年${deathAge}岁`,
      epitaphTitle: '荒岁悲歌',
      summary: `勤劳朴实，孝悌著于里闾。然而天命难测，于公元${deathYear}年因${deathReason || '疫病饥寒'}离世。乡邻皆为之挥泪，合力将其殡葬。`,
      historianNote: '天地不仁，以万物为刍狗。在东汉建安的巨浪之下，一个普通生灵的陨落，悄无声息。',
      tier: 'COMMON',
    };
  }

  // Surviving into middle or old age (A true heroic feat in Eastern Han!)
  if (deathAge >= 60) {
    return {
      title: `${profile.county}寿考耆宿 · 享年${deathAge}岁`,
      epitaphTitle: '乱世人瑞 · 乡党长者',
      summary: `生于公元184年黄巾初起之时，历经董卓乱政、曹袁官渡、火烧赤壁与天下鼎分。一介布衣，凭勤勉谨慎与仁厚之德保全一家老小。殁于公元${deathYear}年，子孙满堂，寿终正寝。`,
      historianNote: '大乱之世，公以匹夫之身，全生保家，寿越花甲，见三国盛衰，其坚韧胜过万乘之尊！',
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

  // Standard ordinary civilian ending
  return {
    title: `${profile.county}田舍耕夫 · 享年${deathAge}岁`,
    epitaphTitle: '汉末平凡春秋',
    summary: `生于汉季，耕于乡野。一辈子没有见过天子与曹刘名将，只识春耕夏耘、秋收冬藏。在战火波及的缝隙里，他顽强地活过了${deathAge}个春秋，给后代留下了一片熟田与三间瓦舍。`,
    historianNote: '太史公书多记将相王侯，然支撑这万里山河与四百年汉家天下的，正是无数如他这般默默耕耘的无名草木。',
    tier: 'COMMON',
  };
}
