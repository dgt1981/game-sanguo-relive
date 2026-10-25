import { EventTableRow } from '../types/eventTable';

/**
 * 三国四季演义 · 事件数据总表 (Event Catalog Data Table)
 * 作用：
 * 1. 结构化预置所有人生阶段、历史战役、名士对话、灾厄危机及日常风貌事件；
 * 2. 严格规范年代 (minYear, maxYear)、年龄 (minAge, maxAge)、季节 (seasons) 与因果链前置条件 (requiredFlags, forbiddenFlags)；
 * 3. 彻底杜绝时机错乱与事件冲突。
 */
export const EVENTS_DATA_TABLE: EventTableRow[] = [
  // =========================================================================
  // 1. 襁褓与孩提生长表 (0~5岁)
  // =========================================================================
  {
    id: 'evt_infant_184_spring',
    category: 'INFANT_SURVIVAL',
    title: '降临乱世 · 孟春插柳',
    priority: 95,
    conditions: { minYear: 184, maxYear: 184, seasons: [0], minAge: 0, maxAge: 0 },
    storyText: (profile) =>
      `公元184年孟春正月，你在【${profile.commandery}·${profile.county}】一间破瓦草屋中呱呱坠地。父亲${profile.fatherName}在门首插了一根柳枝驱邪，母亲${profile.motherName}虚弱地给你喂了一口温米汤。外头春寒未散，冰凌滴水，你来到这个人世间了。`,
  },
  {
    id: 'evt_infant_184_summer',
    category: 'INFANT_SURVIVAL',
    title: '苦夏溽热 · 门后防寇',
    priority: 95,
    conditions: { minYear: 184, maxYear: 184, seasons: [1], minAge: 0, maxAge: 0 },
    storyText: (profile) =>
      `四月入夏，天气转热。母亲${profile.motherName}抱着你坐在槐树荫下纳凉赶蚊。隔壁村子传来黄巾余党打劫大户的喧闹声，父亲把门板用粗木死死顶住。`,
  },
  {
    id: 'evt_infant_184_autumn',
    category: 'INFANT_SURVIVAL',
    title: '金秋拾麦 · 襁褓学语',
    priority: 95,
    conditions: { minYear: 184, maxYear: 184, seasons: [2], minAge: 0, maxAge: 0 },
    storyText: (profile) =>
      `秋风初起，高粱熟了。村里被官府抽走两人去广宗前线推车运粮，母亲把你背在后背上在麦场拾麦穗，你睁着大眼睛咿呀学语。`,
  },
  {
    id: 'evt_infant_184_winter',
    category: 'INFANT_SURVIVAL',
    title: '冬雪寒夜 · 围灶相偎',
    priority: 95,
    conditions: { minYear: 184, maxYear: 184, seasons: [3], minAge: 0, maxAge: 0 },
    storyText: (profile) =>
      `冬雪纷飞，你度过了人生的第一个年关。天寒地冻，柴炭稀缺，父亲在土灶里烧野草给你烘热襁褓，全家人紧挨在一起取暖。`,
  },
  {
    id: 'evt_toddler_3_mudfish',
    category: 'INFANT_SURVIVAL',
    title: '三岁田埂 · 捉泥摸鱼',
    priority: 70,
    conditions: { minYear: 187, maxYear: 187, seasons: [0], minAge: 3, maxAge: 3 },
    storyText:
      '三岁春，你迈着小短腿跟在姐姐身后在田埂上捉泥鳅。泥水溅了一身，母亲笑着拿粗布替你擦洗小花脸。',
  },
  {
    id: 'evt_child_5_soldiers',
    category: 'CHILDHOOD',
    title: '五岁初见 · 兵锋刀影',
    priority: 70,
    conditions: { minYear: 189, maxYear: 189, seasons: [2], minAge: 5, maxAge: 5 },
    storyText:
      '五岁秋，洛阳大乱的消息传到乡间。一队疲惫不堪的败兵穿过村子，抢走了邻居家的两只老母鸡。你躲在柴垛后屏住呼吸，第一次见到了明晃晃的环首刀。',
  },

  // =========================================================================
  // 2. 成童启蒙与家难因果链表 (7~13岁)
  // =========================================================================
  {
    id: 'evt_child_7_education',
    category: 'CHILDHOOD',
    title: '七岁阳春 · 学书出路',
    priority: 85,
    conditions: { minYear: 191, maxYear: 191, seasons: [0], minAge: 7, maxAge: 7 },
    storyText: '七岁春，汉家有“七岁学书数”之制。面对艰辛的家境，家里商量你的童年出路。',
    choice: {
      prompt: '七岁阳春，面对艰辛的家境，你打算如何打发童年岁月？',
      options: [
        {
          id: 'c_age7_cattle',
          label: '在山坡田头替大户放牛割草，补贴家用',
          description: '做个踏实懂事的苦力孩子，强筋健骨，分担父母重担。',
          approachTag: '【勤苦耐劳】',
          requirementHint: '朴实守分，强健体魄',
          statChanges: { health: 6, martial: 4, virtue: 4 },
          outcomeText: '你在日光下晒得黝黑壮实，熟知山野草木，村中老少都夸你是个本分孝顺的好孩子。',
          eventFlagToSet: 'peasant_child',
        },
        {
          id: 'c_age7_study',
          label: '站在乡里私塾窗外偷听老秀才讲授《孝经》与《千字文》',
          description: '用枯树枝在地上划土练字，渴望明晓是非经义。',
          approachTag: '【潜心向学】',
          requirementHint: '需识见悟性',
          statChanges: { intellect: 10, virtue: 6, wealth: -2 },
          outcomeText: '塾师见你心诚，收了你两斤干红薯作修脯，教你辨认了三百个隶书汉字。',
          eventFlagToSet: 'studied_classics',
        },
        {
          id: 'c_age7_brawl',
          label: '领着村里顽童削木刀演练“官军捉贼”，争当孩子王',
          description: '生性胆壮，喜好听客商讲述吕布、关张万人敌的英雄故事。',
          approachTag: '【崇武好斗】',
          requirementHint: '敢打敢拼，勇略过人',
          statChanges: { martial: 8, health: 6, virtue: -2 },
          outcomeText: '你成了四乡八邻顽童的领头，上树摸鸟、下水摸鱼，胆魄过人。',
          eventFlagToSet: 'kid_leader',
        },
      ],
    },
  },
  {
    id: 'evt_child_10_illness',
    category: 'CHILDHOOD',
    title: '十岁金秋 · 母亲染疾',
    priority: 85,
    conditions: { minYear: 194, maxYear: 194, seasons: [2], minAge: 10, maxAge: 10 },
    storyText: '十岁金秋，母亲染上了咳喘虚热之疾，日渐消瘦。县城药铺掌柜索银六百钱，家中断无积蓄。',
    choice: {
      prompt: '母亲久病咳血，家中无银购药，面对危局你作何打算？',
      options: [
        {
          id: 'c_age10_herb',
          label: '腰缚草绳攀爬荒山绝壁，亲自搜寻野生桔梗与柴胡',
          description: '冒跌落悬崖与猛兽毒蛇之险，全凭一片赤诚孝心。',
          approachTag: '【舍身采药】',
          requirementHint: '纯孝至性，开通本草医理因果',
          statChanges: { health: -4, virtue: 12, intellect: 4, fortune: 6 },
          outcomeText: '手脚划出道道血口，终于采得数株野生紫草与金银花，煎汤服下后母亲热退神清，抱你垂泪。',
          eventFlagToSet: 'learned_herbs',
        },
        {
          id: 'c_age10_apprentice',
          label: '跪在城内济世药铺门前，求掌柜收为三年杂役挑水切药换药材',
          description: '以三年童工之身换取汤药，顺便偷学药理本草。',
          approachTag: '【入肆学医】',
          requirementHint: '识辨本草，开通医道因果',
          statChanges: { intellect: 8, wealth: 4, virtue: 6 },
          outcomeText: '掌柜感你仁孝，赠了三副柴胡汤，并在药坊传授你辨认川贝、当归与黄芪的本草之术。',
          eventFlagToSet: 'learned_herbs',
        },
        {
          id: 'c_age10_borrow',
          label: '向乡里放高利贷的豪强大户立下借券借粮换药',
          description: '先救至亲性命，哪怕日后加倍做牛做马偿还。',
          approachTag: '【负债救亲】',
          requirementHint: '权宜救急，代价沉重',
          statChanges: { wealth: -8, virtue: 4, fortune: -2 },
          outcomeText: '解了燃眉之急，但也欠下大户沉重债务，从此每年秋后都须去豪强田庄无偿做苦工。',
        },
      ],
    },
  },

  // =========================================================================
  // 3. 束发成丁与谋生立身表 (14~24岁)
  // =========================================================================
  {
    id: 'evt_adult_14_vocation',
    category: 'RITE_OF_PASSAGE',
    title: '束发成丁 · 谋生行当',
    priority: 85,
    conditions: { minYear: 198, maxYear: 198, seasons: [1], minAge: 14, maxAge: 14 },
    storyText: '十四岁夏，行将成丁束发。官府查验户籍簿，各方诸侯四处征收力役，正需自立谋生。',
    choice: {
      prompt: '成丁立身之际，你打算以何等行当开始养家糊口？',
      options: [
        {
          id: 'c_age14_blacksmith',
          label: '在县城铁匠铺拜师，学习锻造环首长刀与农耕犁头',
          description: '乱世铁匠吃香，既能打造农具，亦能修造兵甲。',
          approachTag: '【铁匠精工】',
          requirementHint: '淬火锻钢，强健身骨',
          statChanges: { martial: 8, health: 8, wealth: 6 },
          outcomeText: '炉火映红了你的脸膛，三年抡锤练得浑身精肉，打造的短刀削铁如泥，备受好评。',
          eventFlagToSet: 'blacksmith_master',
        },
        {
          id: 'c_age14_boatman',
          label: '投效江河船帮，随运粮商船南下江东贩卖土特',
          description: '走南闯北，多长见识，江河虽有风浪，但利钱颇丰。',
          approachTag: '【舟楫商贩】',
          requirementHint: '涉险风浪，博取商资',
          statChanges: { wealth: 14, intellect: 8, health: -4, fortune: 4 },
          outcomeText: '你随船历经长江与汉水，熟悉了水流暗礁，还学会了与水贼及关税差役打交道。',
          eventFlagToSet: 'boatman_master',
        },
        {
          id: 'c_age14_scribe',
          label: '在县衙户曹当一名书办抄手，登记粮库流水账目',
          description: '吃官家一口薄粥，结交里正亭长，明晓律令规矩。',
          approachTag: '【笔墨文吏】',
          requirementHint: '需识见聪敏',
          statChanges: { intellect: 12, wealth: 6, virtue: 4 },
          outcomeText: '你写得一手整饬的汉隶，账目明晰，县丞夸你是个可用之才。',
          eventFlagToSet: 'scribe_clerk',
        },
      ],
    },
  },
  {
    id: 'evt_adult_18_conscription',
    category: 'RITE_OF_PASSAGE',
    title: '十八及冠 · 点卯从军投效',
    priority: 85,
    conditions: { minYear: 200, maxYear: 202, seasons: [1, 2], minAge: 16, maxAge: 20, forbiddenFlags: ['done:evt_adult_18_conscription'] },
    storyText: '天下诸侯割据争锋，各地广发从军召募文告，铜锣声震动四野。值此及冠成丁之际，正是决定投效何方阵营的关键时刻！',
    choice: {
      prompt: '天下诸侯纷争，营门大开召募勇士，你决定投身何方阵营，或自留乡间务农？',
      options: [
        {
          id: 'c_enlist_yuan_shao',
          label: '【投效河北袁绍军】投奔河北大将军袁本初麾下，入编大戟先锋亲骑',
          description: '袁绍坐拥幽青并冀四州，带甲数十万，兵精粮足，为天下第一霸主！',
          approachTag: '【河北大军】',
          requirementHint: '需体魄筋骨强健',
          statChanges: { martial: 12, health: 6, wealth: 8, fortune: 4 },
          outcomeText: '你领到一具精铁扎甲与丈八硬槊，被编入袁大将军帐前前锋营，士气如虹！',
          campaignUnlock: {
            campaignName: '行伍投军 · 河北',
            camp: 'YUAN_SHAO',
            commander: '袁绍',
            roleTitle: '河北袁绍帐前亲骑',
          },
          eventFlagToSet: 'done:evt_adult_18_conscription',
        },
        {
          id: 'c_enlist_cao_cao',
          label: '【投效中原曹魏营】投奔司空曹公兖州大营，立志做一名破阵步骑',
          description: '曹公奉天子以令不臣，唯才是举，治军森严，乃中原雄主！',
          approachTag: '【曹魏雄师】',
          requirementHint: '需勇略过人',
          statChanges: { martial: 14, intellect: 6, wealth: 6, fortune: -2 },
          outcomeText: '你通过军门校阅，被编入曹公麾下正规战兵，发放环首长刀与皮胄。',
          campaignUnlock: {
            campaignName: '行伍投军 · 曹营',
            camp: 'WEI',
            commander: '曹操',
            roleTitle: '曹公帐前亲兵步卒',
          },
          eventFlagToSet: 'done:evt_adult_18_conscription',
        },
        {
          id: 'c_enlist_liu_bei',
          label: '【投效刘玄德义师】投奔以仁德著称的刘玄德与常山赵子龙',
          description: '刘备虽屡经屯邅，然仁厚得民，关张赵皆万人敌，誓保汉家山河！',
          approachTag: '【仁德义从】',
          requirementHint: '需仁厚仁义',
          statChanges: { virtue: 16, martial: 10, health: 4, wealth: -4 },
          outcomeText: '刘玄德亲握你手好言相慰，赵子龙为你正衣冠。虽军容简朴，然将士同心同德！',
          campaignUnlock: {
            campaignName: '行伍投军 · 刘义师',
            camp: 'SHU',
            commander: '赵云',
            roleTitle: '玄德亲军义从步卒',
          },
          eventFlagToSet: 'done:evt_adult_18_conscription',
        },
        {
          id: 'c_enlist_leave_civilian',
          label: '【下野拒绝入伍】托请里正通融，宁愿多缴赋税，留在家乡耕织安生',
          description: '远离诸侯杀伐征战的绞肉机，做一个本分安生的乡野耕民。',
          approachTag: '【躬耕避战】',
          requirementHint: '耗费微财，求得安宁',
          statChanges: { wealth: -8, virtue: 6, fortune: 6 },
          outcomeText: '你躲过了官府抽丁的鞭梢，安心留在家乡耕种一亩三分地，免去沙场尸骨无存之苦。',
          leaveMilitary: true,
          eventFlagToSet: 'done:evt_adult_18_conscription',
        },
      ],
    },
  },
  {
    id: 'evt_adult_24_marriage',
    category: 'RITE_OF_PASSAGE',
    title: '二十四岁 · 成家立室',
    priority: 80,
    conditions: { minYear: 208, maxYear: 208, seasons: [0], minAge: 24, maxAge: 24 },
    storyText: '二十四岁阳春。乡邻见你为人诚笃勤奋，有村老主动为你做媒，说合邻庄勤谨温厚的刘氏女子。',
    choice: {
      prompt: '草民成家之机，你是否应允这门亲事？',
      options: [
        {
          id: 'c_age24_marry',
          label: '拿出多年积攒的二千铜钱与四匹粗布，下聘迎娶刘氏为妻',
          description: '在这风雨飘摇的人间，为自己寻一个相濡以沫的温存港湾。',
          approachTag: '【结发同心】',
          requirementHint: '需备薄资下聘',
          statChanges: { virtue: 10, health: 6, wealth: -12 },
          outcomeText: '两盏浊酒，红烛摇曳。你与刘氏结发为夫妻，茅屋之中从此有了炊烟笑语。次年为你添了麟儿。',
          eventFlagToSet: 'married',
        },
        {
          id: 'c_age24_hoard_grain',
          label: '婉言谢绝媒人，专心置办地窖藏购干粮肉干以防荒乱',
          description: '世道险恶战乱无常，不敢轻易拖累妻儿妇孺。',
          approachTag: '【积谷防饥】',
          requirementHint: '独善其身，积蓄资粮',
          statChanges: { wealth: 16, intellect: 6, virtue: -2 },
          outcomeText: '你将积蓄换成了数十石高粱大麦深埋地窖，在这乱世为自己攒下了一道保命屏障。',
          eventFlagToSet: 'hoarded_grain',
        },
      ],
    },
  },

  // =========================================================================
  // 4. 重大编年演义战役与从军亲历表 (严格时间与因果时机)
  // =========================================================================
  {
    id: 'evt_campaign_190_hulao',
    category: 'HISTORICAL_CAMPAIGN',
    title: '初平元年 · 虎牢关会盟讨董',
    priority: 100,
    campaignName: '虎牢关会盟讨董',
    isCampaignEvent: true,
    conditions: {
      minYear: 190,
      maxYear: 190,
      seasons: [0, 1],
      minAge: 15,
      maxAge: 65,
      forbiddenFlags: ['done:evt_campaign_190_hulao'],
    },
    storyText:
      '初平元年，关东十八路诸侯歃血结盟讨董！华雄在关前连斩联军数将，西凉铁骑威压洛阳要隘。战鼓震天动地，你亲临前沿营阵！',
    choice: {
      prompt: '十八路诸侯歃血讨董，华雄搦战，温酒斩将！你身在行伍，当如何立功？',
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
          eventFlagToSet: 'done:evt_campaign_190_hulao',
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
          eventFlagToSet: 'done:evt_campaign_190_hulao',
        },
      ],
    },
  },
  {
    id: 'evt_campaign_196_xuchang_tuntian',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安元年 · 许昌迁都屯田令',
    priority: 95,
    campaignName: '许昌大兴屯田',
    isCampaignEvent: true,
    conditions: {
      minYear: 196,
      maxYear: 197,
      seasons: [1, 2],
      minAge: 16,
      maxAge: 65,
      forbiddenFlags: ['done:evt_campaign_196_tuntian'],
    },
    storyText:
      '建安元年曹操奉天子迁都许昌，颁布天下闻名的“屯田令”，召募流民百姓开垦淮北荒田，官府供耕牛农具，分岁收获利！',
    choice: {
      prompt: '曹公屯田令下达，许昌四野大开屯田，你作何决算？',
      options: [
        {
          id: 'c_tuntian_clerk',
          label: '应募出任典农校尉麾下督粮小吏，度量荒田分配牛种',
          description: '协助官府规划水渠与粮仓，保一方军民糊口。',
          approachTag: '【典农法度】',
          requirementHint: '需识见通晓文墨',
          statChanges: { intellect: 12, wealth: 10, virtue: 6 },
          outcomeText: '你划分沟洫公允整饬，当年许下大熟，得谷百万斛！典农中郎将任峻嘉奖你的治政才干。',
          campaignUnlock: {
            campaignName: '许昌大兴屯田',
            camp: 'WEI',
            commander: '曹操',
            roleTitle: '典农都尉督粮官',
          },
          eventFlagToSet: 'done:evt_campaign_196_tuntian',
        },
        {
          id: 'c_tuntian_farm',
          label: '领下官牛三十亩荒田，带领宗族开荒深耕',
          description: '脚踏实地耕作，在这个兵荒马乱的乱世为全家争取稳定的粮食与片瓦遮风。',
          approachTag: '【躬耕安民】',
          requirementHint: '勤力稼穑，保障口粮',
          statChanges: { health: 8, wealth: 14, virtue: 4 },
          outcomeText: '汗水浇灌之下，荒地变良田！秋后谷粒堆满草仓，一家老小再无断顿饥馑之忧。',
          eventFlagToSet: 'done:evt_campaign_196_tuntian',
        },
      ],
    },
  },
  // -------------------------------------------------------------------------
  // 4.1 建安五年 (200年) · 官渡之战分阵营事件
  // -------------------------------------------------------------------------
  // [袁绍阵营 · 乌巢守护与被俘/下野/战死]
  {
    id: 'evt_guandu_200_yuanshao_wuchao',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安五年冬 · 官渡决战 · 乌巢烈火',
    priority: 100,
    campaignName: '官渡之战 · 乌巢生死',
    isCampaignEvent: true,
    conditions: {
      minYear: 200,
      maxYear: 200,
      seasons: [2, 3],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'YUAN_SHAO',
      forbiddenFlags: ['done:evt_guandu'],
    },
    storyText:
      '建安五年冬十月，两军对峙官渡半年。你随大将淳于琼驻守袁绍军粮命脉——乌巢万车粮囤。夜半三更，曹操亲统五千精锐轻骑衔枚夜袭，四面纵火，万车军粮顿陷火海！淳于琼惊起披甲，大营溃乱，曹骑铁蹄呼啸而至！',
    choice: {
      prompt: '乌巢烈火连天，万车粮囤尽毁，曹公亲提精骑四面围杀，你身陷重围，当作何决断？',
      options: [
        {
          id: 'c_wuchao_fight_death',
          label: '【誓死守护】挺枪冲入烈火与曹军突骑决一死战，誓保万车粮仓',
          description: '面对曹操虎豹骑突击，死战不退！若武略体魄不足将当场战死，壮烈殉节。',
          approachTag: '【忠烈死节】',
          requirementHint: '需极高体魄与勇略',
          statChanges: { martial: 14, virtue: 10, health: -15 },
          outcomeText: '你持枪格杀数名曹军精骑，然烈火四合、寡不敌众，身负重伤倒地，被曹军擒获押解至营前！',
          fatalCheck: (st) => {
            if (st.martial < 50 || st.health < 45) {
              return {
                isFatal: true,
                deathReason: '建安五年冬，官渡乌巢大营遭曹公突袭，浴血死战不退，身中数枪阵亡于烈火万囤之间。',
              };
            }
            return null;
          },
          followUpChoice: {
            prompt: '你力战身负重创，被缚于曹操大帐辕门之下。曹公按剑而视，面临生死关口！',
            options: [
              {
                id: 'c_wuchao_sub_surrender',
                label: '【俯首降曹】向曹公下拜愿降，誓效犬马之劳',
                description: '识时务者为俊杰，脱离河北败军，编入曹营效命。',
                approachTag: '【归顺新主】',
                requirementHint: '保全性命，洗刷旧籍',
                statChanges: { intellect: 8, wealth: 6, virtue: -6 },
                outcomeText: '曹操亲手为你解开绳索，赐酒一口，赞你守囤之勇，擢升为曹军步营牙门正卒！自此改属曹魏。',
                campaignUnlock: {
                  campaignName: '官渡归降曹公',
                  camp: 'WEI',
                  commander: '曹操',
                  roleTitle: '曹营降将牙门卒',
                },
                eventFlagToSet: 'done:evt_guandu',
              },
              {
                id: 'c_wuchao_sub_escape_civilian',
                label: '【趁乱下野】趁押解松懈脱掉皮甲弃械，趁夜色荒草逃回故里务农',
                description: '抛弃刀兵浮名，脱离军伍归隐田园，保全余生。',
                approachTag: '【解甲归田】',
                requirementHint: '下野还乡，保全性命',
                statChanges: { virtue: 6, wealth: -4, fortune: 8 },
                outcomeText: '你趁曹军忙于抢缴粮秣看守松懈，滚入芦苇荡潜逃，隐姓埋名逃回故里，免去随袁军被坑杀之祸！',
                leaveMilitary: true,
                eventFlagToSet: 'done:evt_guandu',
              },
              {
                id: 'c_wuchao_sub_die_martyr',
                label: '【痛骂就义】挺胸怒斥曹瞒乃汉贼，宁死不降',
                description: '引颈受戮，誓死不从国贼，尽显河北男儿刚烈风骨！',
                approachTag: '【成仁取义】',
                requirementHint: '舍生取义，名留青史',
                statChanges: { virtue: 25 },
                outcomeText: '你慷慨痛骂曹操，刀斧手挥刃就戮，从容赴死。',
                isDirectFatal: true,
                fatalDeathReason: '官渡乌巢战后被俘，誓死不从曹贼，慷慨就义于辕门。',
              },
            ],
          },
        },
        {
          id: 'c_wuchao_captured_branch',
          label: '【兵败被俘】拼死突围但身负重创力竭被擒，押解至曹营大帐',
          description: '突围不及陷入重围，沦为曹军俘虏，面临命运抉择。',
          approachTag: '【临阵受缚】',
          requirementHint: '被俘待决',
          statChanges: { health: -10, martial: 4 },
          outcomeText: '你拼死突围却被绊马索绊倒，曹军甲士将你五花大绑押至曹操辕门大营！',
          followUpChoice: {
            prompt: '你被押至曹公帐前，曹操问：“降否？”你作何决断？',
            options: [
              {
                id: 'c_wuchao_cap_surrender',
                label: '【俯首降曹】叩首愿降，改换门庭转投曹公麾下',
                description: '投入曹魏阵营，保全性命与一身本领。',
                approachTag: '【改投明主】',
                requirementHint: '改换阵营',
                statChanges: { intellect: 6, wealth: 8, virtue: -4 },
                outcomeText: '曹操颔首收纳，将你编入曹营先锋队正，自此成为曹魏一员。',
                campaignUnlock: {
                  campaignName: '官渡乌巢降曹',
                  camp: 'WEI',
                  commander: '曹操',
                  roleTitle: '曹营行伍步卒',
                },
                eventFlagToSet: 'done:evt_guandu',
              },
              {
                id: 'c_wuchao_cap_resign',
                label: '【下野求生】谎称后勤伙夫求免一死，趁夜翻出营墙下野还乡',
                description: '从此脱离军旅，不再过问诸侯厮杀，隐入田舍。',
                approachTag: '【脱甲还乡】',
                requirementHint: '恢复平民身份',
                statChanges: { virtue: 4, wealth: -6, fortune: 6 },
                outcomeText: '你假扮役夫脱身逃遁，昼伏夜行跋涉千里潜回河北故里，做一个平头百姓度日。',
                leaveMilitary: true,
                eventFlagToSet: 'done:evt_guandu',
              },
              {
                id: 'c_wuchao_cap_martyr',
                label: '【誓死不从】破口痛骂，慷慨就义',
                description: '绝不屈膝事敌，以死全节。',
                approachTag: '【浩气长存】',
                requirementHint: '从容就义',
                statChanges: { virtue: 20 },
                outcomeText: '刀光过处，血溅辕门，终不失河北忠勇之名！',
                isDirectFatal: true,
                fatalDeathReason: '官渡被俘后坚贞不屈，大骂曹贼，慷慨就义于辕门。',
              },
            ],
          },
        },
        {
          id: 'c_wuchao_resign_escape',
          label: '【见机下野】眼见粮仓焚尽、大势已去，趁夜色火光脱下军服潜逃回河北故里',
          description: '审时度势，脱离已溃散的袁军死地，避免被围歼坑杀。',
          approachTag: '【潜逃脱身】',
          requirementHint: '脱离军伍，保全性命',
          statChanges: { intellect: 8, fortune: 8, martial: -2 },
          outcomeText: '你趁四野混乱脱掉军甲潜入芦苇沼泽，借着夜色一路向北奔逃，终于安然返回河北老家务农。',
          leaveMilitary: true,
          eventFlagToSet: 'done:evt_guandu',
        },
      ],
    },
  },

  // [曹操阵营 · 官渡奇袭乌巢与前线轰城]
  {
    id: 'evt_guandu_200_caocao_attack',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安五年 · 官渡奇袭乌巢',
    priority: 100,
    campaignName: '官渡之战 · 乌巢奇袭',
    isCampaignEvent: true,
    conditions: {
      minYear: 200,
      maxYear: 200,
      seasons: [2, 3],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'WEI',
      forbiddenFlags: ['done:evt_guandu'],
    },
    storyText:
      '官渡相持半年，两军粮少兵疲！许攸深夜脱逃来降，献乌巢屯粮虚实。曹操亲提五千轻骑，人衔枚马缚口，趁夜直扑袁绍粮囤！',
    choice: {
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
          fatalCheck: (st) => {
            if (st.health < 28 && st.martial < 35) {
              return { isFatal: true, deathReason: '随曹公夜袭乌巢，在烈火中突击淳于琼精锐中箭阵亡。' };
            }
            return null;
          },
          campaignUnlock: {
            campaignName: '官渡之战 · 乌巢奇袭',
            camp: 'WEI',
            commander: '曹操',
            roleTitle: '牙门破虏别将',
          },
          eventFlagToSet: 'done:evt_guandu',
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
          eventFlagToSet: 'done:evt_guandu',
        },
      ],
    },
  },

  // [刘备阵营 · 汝南侧翼游击]
  {
    id: 'evt_guandu_200_shu_runan',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安五年 · 汝南侧击袭扰',
    priority: 95,
    campaignName: '官渡之战 · 汝南策应',
    isCampaignEvent: true,
    conditions: {
      minYear: 200,
      maxYear: 200,
      seasons: [2, 3],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'SHU',
      forbiddenFlags: ['done:evt_guandu'],
    },
    storyText:
      '建安五年官渡决战之际，刘玄德引军进驻汝南，联络刘辟、龚都余部，从侧翼袭扰许昌郊野，牵制曹军后路！',
    choice: {
      prompt: '刘备于汝南策应北方，曹仁大军逼近，你当如何行事？',
      options: [
        {
          id: 'c_runan_ambush',
          label: '随赵子龙埋伏于山谷密林，截击曹仁前哨骑兵',
          description: '神出鬼没，袭扰敌军粮草辎重。',
          approachTag: '【密林奇袭】',
          requirementHint: '需敏锐与勇略',
          statChanges: { martial: 12, intellect: 8, fortune: 6 },
          outcomeText: '伏兵四起，曹仁斥候受创撤退。赵云夸你弓马熟练，引荐你为玄德帐前哨官。',
          campaignUnlock: {
            campaignName: '官渡汝南策应',
            camp: 'SHU',
            commander: '赵云',
            roleTitle: '玄德帐前哨探长',
          },
          eventFlagToSet: 'done:evt_guandu',
        },
        {
          id: 'c_runan_leave_civilian',
          label: '【战乱下野】战局动荡颠沛流离，向刘玄德垂泪请辞还乡务农',
          description: '刘玄德仁厚，赠你三斗大米放你还乡。',
          approachTag: '【辞军为民】',
          requirementHint: '下野还乡',
          statChanges: { virtue: 10, wealth: 4 },
          outcomeText: '刘备挥泪相送：“百姓艰难，君归乡好生度日。”你脱离军籍，返回老家躬耕。',
          leaveMilitary: true,
          eventFlagToSet: 'done:evt_guandu',
        },
      ],
    },
  },

  // [平民视角 · 官渡大征粮与避难]
  {
    id: 'evt_guandu_200_civilian_grain',
    category: 'CIVILIAN_DAILY',
    title: '建安五年 · 官渡战云 · 草民命如纸',
    priority: 85,
    conditions: {
      minYear: 200,
      maxYear: 200,
      seasons: [2, 3],
      minAge: 12,
      maxAge: 75,
      requiredCamp: 'CIVILIAN_ONLY',
      forbiddenFlags: ['done:evt_guandu'],
    },
    storyText:
      '建安五年秋冬，官渡数十万大军交锋。两军差役四出搜刮，无论曹袁，皆挨家挨户索要军粮壮丁，里邻啼哭震野。',
    choice: {
      prompt: '官渡战云笼罩，差役挨户索粮抓丁，你该如何保全一家口粮？',
      options: [
        {
          id: 'c_civ_hide_grain',
          label: '在屋后枯井深挖暗窖，将麦米埋于地下，仅留秕糠应付搜查',
          description: '斗智斗勇，保护活命口粮。',
          approachTag: '【秘窖藏谷】',
          requirementHint: '需机敏谋略',
          statChanges: { intellect: 10, wealth: 6, fortune: 4 },
          outcomeText: '差役搜走了一袋烂秕糠悻悻离去，一家人靠着窖藏麦粒熬过了大荒之冬。',
          eventFlagToSet: 'done:evt_guandu',
        },
        {
          id: 'c_civ_flee_mountains',
          label: '收拾细软铺盖，举家躲入深山密林结寨自保',
          description: '宁居山林受冻，不逢兵灾乱刃。',
          approachTag: '【隐入深山】',
          requirementHint: '勤劳忍苦',
          statChanges: { health: 6, virtue: 8, wealth: -6 },
          outcomeText: '在山中搭建草庵采野栗充饥，避开了两军拉夫之祸，全家安好。',
          eventFlagToSet: 'done:evt_guandu',
        },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // 4.2 建安十三年 (208年) · 长坂坡与赤壁之战分阵营事件
  // -------------------------------------------------------------------------
  // [蜀汉阵营 · 当阳长坂护幼主]
  {
    id: 'evt_campaign_208_changbanpo_shu',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安十三年 · 当阳长坂护幼主',
    priority: 100,
    campaignName: '当阳长坂护幼主',
    isCampaignEvent: true,
    conditions: {
      minYear: 208,
      maxYear: 208,
      seasons: [2],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'SHU',
      forbiddenFlags: ['done:evt_changbanpo'],
    },
    storyText:
      '曹操五千精锐纯血虎豹骑日夜兼程追及当阳景山！十万随刘备撤退的荆襄百姓号哭奔逃，赵子龙银枪白马回身杀入重围救护阿斗！',
    choice: {
      prompt: '曹操五千纯血虎豹骑一日一夜疾驰三百里追及！十万襄阳难民号哭奔逃，赵子龙单骑回马破阵救幼主！',
      options: [
        {
          id: 'c_changban_with_zhaoyun',
          label: '跟随赵子龙策马折返重围，死命掩护怀抱阿斗的常山银枪',
          description: '浑身是胆，于曹营百万军中七进七出，不负仁德忠义之名！',
          approachTag: '【死命护幼】',
          requirementHint: '需绝大勇气与体魄',
          statChanges: { martial: 18, virtue: 16, health: -8, fortune: 10 },
          outcomeText: '长矛刺穿数名追兵，你的战袍尽被血浸透！终于掩护子龙冲出景山合围，刘备携你双手洒泪相迎：“真义士也！”',
          fatalCheck: (st) => {
            if (st.health < 30 && st.martial < 40) {
              return { isFatal: true, deathReason: '在长坂坡乱军中拼死掩护赵云撤退，身中数枪阵亡于景山。' };
            }
            return null;
          },
          campaignUnlock: {
            campaignName: '当阳长坂护幼主',
            camp: 'SHU',
            commander: '赵云',
            roleTitle: '顺平侯贴身校尉',
          },
          eventFlagToSet: 'done:evt_changbanpo',
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
          eventFlagToSet: 'done:evt_changbanpo',
        },
      ],
    },
  },

  // [曹魏阵营 · 赤壁铁索连环大火]
  {
    id: 'evt_campaign_208_chibi_wei',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安十三年冬 · 赤壁铁索浩劫',
    priority: 100,
    campaignName: '赤壁鏖兵 · 锁江火海',
    isCampaignEvent: true,
    conditions: {
      minYear: 208,
      maxYear: 208,
      seasons: [3],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'WEI',
      forbiddenFlags: ['done:evt_chibi'],
    },
    storyText:
      '建安十三年冬十一月，东南狂风骤起！黄盖引数十艘火船撞入水寨，曹公战船铁索相连难解，瞬息化作一片火海！曹军水寨江水沸腾，全线大溃！',
    choice: {
      prompt: '赤壁烈焰冲天，铁索连环战船尽陷火海，吴军火箭如雨，你当如何突围？',
      options: [
        {
          id: 'c_chibi_wei_cut_chains',
          label: '【冒火斩索】手持巨斧冒着箭雨冲上船头劈砍铁索，抢救后营战船',
          description: '极度凶险，若体魄与勇略不济，恐当场葬身滔天烈火！',
          approachTag: '【火海死拼】',
          requirementHint: '需极高体魄与勇略',
          statChanges: { martial: 16, virtue: 8, health: -14 },
          outcomeText: '你劈断两根铁索，救下两艘中型战船，护送中军突围南撤！曹公亲自赐你青釭佩剑以嘉其勇。',
          fatalCheck: (st) => {
            if (st.health < 35 || st.martial < 45) {
              return { isFatal: true, deathReason: '建安十三年冬赤壁之战，于铁索战船之上冒火劈缆，被东南狂风烈焰吞噬阵亡。' };
            }
            return null;
          },
          campaignUnlock: {
            campaignName: '赤壁突围死士',
            camp: 'WEI',
            commander: '曹操',
            roleTitle: '破火先锋校尉',
          },
          eventFlagToSet: 'done:evt_chibi',
        },
        {
          id: 'c_chibi_wei_jump_water',
          label: '【弃船泅渡】弃船跳入冰冷江水，泅渡至南岸，护卫曹公败走华容道',
          description: '江水冰刺刺骨，避开烈火直奔南岸陆路。',
          approachTag: '【泅渡突围】',
          requirementHint: '通晓水性，坚韧耐寒',
          statChanges: { health: -8, intellect: 8, fortune: 6 },
          outcomeText: '你在严冬刺骨的江水中拼力泅水登岸，跟随曹公冒大雨穿过泥泞华容道脱险还北！',
          eventFlagToSet: 'done:evt_chibi',
        },
        {
          id: 'c_chibi_wei_captured',
          label: '【战乱被俘】泅水不及被东吴巡逻艨艟用铁钩锁拿，成为吴军俘虏',
          description: '落入东吴水军之手，面临命运转折。',
          approachTag: '【兵败被俘】',
          requirementHint: '生死抉择',
          statChanges: { health: -6, fortune: -4 },
          outcomeText: '吴军将你捞上战船押解至柴桑大营！',
          followUpChoice: {
            prompt: '周郎中军大帐点验俘虏，令曹军降者不杀。你作何抉择？',
            options: [
              {
                id: 'c_chibi_cap_join_wu',
                label: '【归降东吴】愿投吴大帝孙权水师效力',
                description: '换上吴军战袍，成为江东水师一员。',
                approachTag: '【降吴效命】',
                requirementHint: '阵营转为东吴',
                statChanges: { intellect: 8, wealth: 6, virtue: -4 },
                outcomeText: '周瑜赏识你通晓北方战阵，留任水寨操练降兵，自此改属东吴！',
                campaignUnlock: {
                  campaignName: '赤壁归降东吴',
                  camp: 'WU',
                  commander: '周瑜',
                  roleTitle: '江东水师降阵牙将',
                },
                eventFlagToSet: 'done:evt_chibi',
              },
              {
                id: 'c_chibi_cap_leave',
                label: '【下野还乡】谎称荆州强征平民，求周郎放还故里',
                description: '从此解甲归田，不再涉足兵戈。',
                approachTag: '【下野为民】',
                requirementHint: '脱离军伍',
                statChanges: { virtue: 6, wealth: -4, fortune: 8 },
                outcomeText: '吴军核实你为苦役，发还路引。你千恩万谢渡江北返，回乡做个踏实农夫。',
                leaveMilitary: true,
                eventFlagToSet: 'done:evt_chibi',
              },
              {
                id: 'c_chibi_cap_die',
                label: '【宁死不降】挺胸怒斥碧眼儿孙权背叛朝廷',
                description: '尽显忠节，舍身成仁。',
                approachTag: '【慷慨取义】',
                requirementHint: '忠烈就义',
                statChanges: { virtue: 20 },
                outcomeText: '周瑜感叹其忠勇，斩首厚葬。',
                isDirectFatal: true,
                fatalDeathReason: '赤壁战败被俘后宁死不从东吴，慷慨就义于江畔。',
              },
            ],
          },
        },
      ],
    },
  },

  // [东吴阵营 · 赤壁大胜]
  {
    id: 'evt_campaign_208_chibi_wu',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安十三年冬 · 赤壁鏖兵火烧连环',
    priority: 100,
    campaignName: '赤壁鏖兵火烧连环',
    isCampaignEvent: true,
    conditions: {
      minYear: 208,
      maxYear: 208,
      seasons: [3],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'WU',
      forbiddenFlags: ['done:evt_chibi'],
    },
    storyText:
      '冬十一月，东南风狂啸！黄盖引二十艘蒙冲斗舰，满载芦苇油脂突入曹军水寨，大呼“降曹”，烈焰顺风腾空八百里，江水尽赤！',
    choice: {
      prompt: '东南风骤起！黄盖引二十艘蒙冲快船满载干柴鱼膏疾驰曹军水寨，烈焰腾空！',
      options: [
        {
          id: 'c_chibi_wu_fire_ship',
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
          eventFlagToSet: 'done:evt_chibi',
        },
      ],
    },
  },

  // [平民视角 · 江汉大难与避火]
  {
    id: 'evt_campaign_208_chibi_civilian',
    category: 'CIVILIAN_DAILY',
    title: '建安十三年冬 · 江汉烽火草民叹',
    priority: 85,
    conditions: {
      minYear: 208,
      maxYear: 208,
      seasons: [2, 3],
      minAge: 12,
      maxAge: 75,
      requiredCamp: 'CIVILIAN_ONLY',
      forbiddenFlags: ['done:evt_chibi'],
    },
    storyText:
      '建安十三年曹公大军南下荆襄，水陆数十万兵马扎营赤壁。江上战火将天空烧得通红，两岸渔民与流民四散避匿。',
    choice: {
      prompt: '江汉战事汹涌，大火照彻百里，你作何避难决断？',
      options: [
        {
          id: 'c_chibi_civ_boat_save',
          label: '摇动乌篷小舟，在江汉浅滩搭救落水百姓与伤兵',
          description: '慈悲为怀，广积阴德。',
          approachTag: '【慈航救生】',
          requirementHint: '需仁厚仁义',
          statChanges: { virtue: 18, intellect: 8, fortune: 10 },
          outcomeText: '你在浓烟中捞救了二十余口落水妇孺，两岸乡党尊称你为江上活佛。',
          eventFlagToSet: 'done:evt_chibi',
        },
        {
          id: 'c_chibi_civ_stay_hills',
          label: '藏身云梦泽深处芦苇荡，静待天下大势平息',
          description: '不问兵戈，但求阖家安康。',
          approachTag: '【隐匿湖泽】',
          requirementHint: '安分守常',
          statChanges: { health: 6, wealth: 6, fortune: 6 },
          outcomeText: '春暖花开，曹操北撤，你在湖边修补茅屋，日子重归平静。',
          eventFlagToSet: 'done:evt_chibi',
        },
      ],
    },
  },
  {
    id: 'evt_crisis_217_epidemic',
    category: 'CRISIS_ORDEAL',
    title: '建安二十二年 · 中原伤寒大疫',
    priority: 95,
    conditions: {
      minYear: 217,
      maxYear: 217,
      seasons: [3],
      minAge: 12,
      maxAge: 75,
      forbiddenFlags: ['done:evt_217_epidemic'],
    },
    storyText:
      '建安二十二年严冬，中原暴发空前伤寒大疫，家家有僵尸之痛，室室有号泣之哀！建安七子中四人同卒于疫。全家高热战栗，危在旦夕！',
    choice: {
      prompt: '伤寒恶疾袭来，全家高热战栗，你该如何救全家人性命？',
      options: [
        {
          id: 'c_age33_soup',
          label: '遵南阳张仲景医书所传“当归生姜羊肉汤 / 麻黄汤”熬煮浓汁痛饮',
          description: '信名医方剂，重姜葱发汗退热，不事巫鬼。',
          approachTag: '【按方发汗】',
          requirementHint: '需识见明辨',
          statChanges: { health: 12, intellect: 8, wealth: -6 },
          outcomeText: '一碗浓汤灌下，通体大汗淋漓！次日热退骨安，你还将此法传授给隔壁邻舍，活人无数。',
          eventFlagToSet: 'done:evt_217_epidemic',
        },
        {
          id: 'c_age33_quarantine',
          label: '闭门绝客，庭院遍洒生石灰，燃艾草熏蒸屋角',
          description: '坚决执行严苛隔离之策，耐心挨过冬寒疫期。',
          approachTag: '【严密隔离】',
          requirementHint: '坚忍克制，谨守门房',
          statChanges: { health: 8, wealth: -4 },
          outcomeText: '虽然家中存粮耗损大半，但一家老小无一人病殁，安然熬过了这场建安大劫。',
          eventFlagToSet: 'done:evt_217_epidemic',
        },
        {
          id: 'c_age33_pray',
          label: '随众去道观求取黄纸符水焚化吞服祈福',
          description: '求神问卜，听天由命。',
          approachTag: '【迷信符水】',
          requirementHint: '吉凶难卜，易误病机',
          statChanges: { health: -14, fortune: -4 },
          outcomeText: '符水无济于事，你连烧了二十日，险些一命呜呼，病愈后落下了肺经喘咳之疾。',
          eventFlagToSet: 'done:evt_217_epidemic',
          fatalCheck: (st) => {
            if (st.health < 28) {
              return { isFatal: true, deathReason: '建安伤寒大疫蔓延，高热抽搐无药可医，殁于榻上。' };
            }
            return null;
          },
        },
      ],
    },
  },
  // -------------------------------------------------------------------------
  // 4.3 建安二十四年 (219年) · 襄樊之战与荆州之变
  // -------------------------------------------------------------------------
  // [蜀汉阵营 · 关羽水淹七军与败走麦城]
  {
    id: 'evt_campaign_219_fancheng_shu',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安二十四年 · 关云长水淹七军',
    priority: 100,
    campaignName: '襄樊鏖兵 · 水淹七军',
    isCampaignEvent: true,
    conditions: {
      minYear: 219,
      maxYear: 219,
      seasons: [2, 3],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'SHU',
      forbiddenFlags: ['done:evt_fancheng'],
    },
    storyText:
      '秋八月霖雨连绵，汉水暴涨五丈！关羽乘大船浮水攻樊城，于禁七军三万人尽皆沉溺投降，威震华夏！然而冬十月吕蒙白衣渡江偷袭荆州，后路断绝，大军退守麦城！',
    choice: {
      prompt: '汉水滔天淹七军，后方江陵却遭吕蒙袭破！四面楚歌之际，你当如何决断？',
      options: [
        {
          id: 'c_fancheng_maicheng_breakout',
          label: '【死战麦城】随关君侯与关平突围决死，阻截吴军层层绊马索与伏兵',
          description: '面对数万吴军合围，拼死护卫君侯！若勇力不足恐力竭殉节。',
          approachTag: '【义薄云天】',
          requirementHint: '需绝大勇略与忠诚',
          statChanges: { martial: 16, virtue: 18, health: -15 },
          outcomeText: '临沮小道伏兵尽起，你挺枪搏杀数人掩护君侯突围，身中三矢负创坠马，被益州山民冒死救入深山。',
          fatalCheck: (st) => {
            if (st.health < 35 || st.martial < 45) {
              return { isFatal: true, deathReason: '建安二十四年冬麦城突围，于临沮小道死战断后，身中数箭阵亡于寒雪之中。' };
            }
            return null;
          },
          campaignUnlock: {
            campaignName: '麦城死战突围',
            camp: 'SHU',
            commander: '关羽',
            roleTitle: '忠勇先锋牙门校尉',
          },
          eventFlagToSet: 'done:evt_fancheng',
        },
        {
          id: 'c_fancheng_escape_sichuan',
          label: '【潜入西川】抄小道翻越崇山峻岭，跋涉千里逃往西川成都报信',
          description: '避开吴军盘查，为先主刘备带回荆州前线机密军情。',
          approachTag: '【翻山还蜀】',
          requirementHint: '需识见机敏与坚毅',
          statChanges: { intellect: 12, health: -6, virtue: 8 },
          outcomeText: '你历经千难万险翻越巴山蜀水抵达成都，先主刘备痛哭抚你背脊，拔擢你为禁军卫尉。',
          campaignUnlock: {
            campaignName: '襄樊突围还蜀',
            camp: 'SHU',
            commander: '刘备',
            roleTitle: '成都宿卫牙门校尉',
          },
          eventFlagToSet: 'done:evt_fancheng',
        },
        {
          id: 'c_fancheng_leave_civilian',
          label: '【下野避难】战局崩裂荆州异主，脱下铠甲隐入汉水民舍务农',
          description: '远离蜀吴争斗旋涡，做个本分乡民。',
          approachTag: '【藏身草莽】',
          requirementHint: '脱离军伍',
          statChanges: { virtue: 6, wealth: -4, fortune: 6 },
          outcomeText: '你将兵刃埋于竹林，重做布衣耕汉水肥田，安然度过荆州易主之劫。',
          leaveMilitary: true,
          eventFlagToSet: 'done:evt_fancheng',
        },
      ],
    },
  },

  // [平民视角 · 汉水大洪灾]
  {
    id: 'evt_campaign_219_fancheng_civilian',
    category: 'CIVILIAN_DAILY',
    title: '建安二十四年 · 汉水洪灾与兵戈',
    priority: 85,
    conditions: {
      minYear: 219,
      maxYear: 219,
      seasons: [2, 3],
      minAge: 12,
      maxAge: 75,
      requiredCamp: 'CIVILIAN_ONLY',
      forbiddenFlags: ['done:evt_fancheng'],
    },
    storyText:
      '建安二十四年秋，襄樊大水漫灌城墙，平地积水数丈，沿江庄稼瓦舍漂没无数，关羽与曹军在水中激战，百姓流离失所。',
    choice: {
      prompt: '大水浸漫屋舍，大批淹死人畜漂过，你如何带领家人度过洪荒？',
      options: [
        {
          id: 'c_flood_raft',
          label: '连夜扎结木筏高搭窝棚，划水捞救浮木与落水邻舍',
          description: '互助共济，熬过水灾。',
          approachTag: '【扎筏救民】',
          requirementHint: '需仁厚仁义',
          statChanges: { virtue: 16, health: 4, wealth: -4 },
          outcomeText: '全村靠你的大木筏保全了二十余户性命，水退后乡邻合力替你重修房舍。',
          eventFlagToSet: 'done:evt_fancheng',
        },
        {
          id: 'c_flood_high_ground',
          label: '背负存粮举家逃往荆山高岗，避开下流瘟疫与乱兵',
          description: '登高避水，防范时疫。',
          approachTag: '【登高远避】',
          requirementHint: '机敏谨慎',
          statChanges: { health: 6, intellect: 8, fortune: 6 },
          outcomeText: '你在高山干燥处度过灾期，无一人受湿热恶疾感染，秋后重返田舍。',
          eventFlagToSet: 'done:evt_fancheng',
        },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // 4.4 建兴六年 (228年) · 诸葛亮一出祁山与街亭之战
  // -------------------------------------------------------------------------
  // [蜀汉阵营 · 北伐出祁山与街亭要塞]
  {
    id: 'evt_campaign_228_qishan_shu',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建兴六年 · 武乡侯一出祁山',
    priority: 100,
    campaignName: '武乡侯一出祁山',
    isCampaignEvent: true,
    conditions: {
      minYear: 228,
      maxYear: 228,
      seasons: [0],
      minAge: 16,
      maxAge: 65,
      requiredCamp: 'SHU',
      forbiddenFlags: ['done:evt_qishan'],
    },
    storyText:
      '建兴六年春，诸葛丞相上一出师表，率三军出祁山，天水三郡震动降蜀！张郃引魏军精骑直扑要道街亭，马谡违规舍水扎营于孤山，胜负系于一线！',
    choice: {
      prompt: '街亭前线，马谡欲舍水上山扎营，张郃大军转瞬即至，你当如何行事？',
      options: [
        {
          id: 'c_qishan_guard_pass',
          label: '【随王平据道】随裨将军王平坚守山下当道筑垒，死守水源防线',
          description: '力遵丞相方略，严防魏军切断汲水道。',
          approachTag: '【死守要冲】',
          requirementHint: '需识见沉稳与武略',
          statChanges: { martial: 14, intellect: 10, fortune: 8 },
          outcomeText: '张郃四面围山放火，马谡大溃！唯你随王平鸣钲勒兵拒守，徐徐整队击退追兵，保全大队退回汉中，丞相特嘉奖升赏！',
          campaignUnlock: {
            campaignName: '街亭断后立功',
            camp: 'SHU',
            commander: '诸葛亮',
            roleTitle: '汉中统军牙门正将',
          },
          eventFlagToSet: 'done:evt_qishan',
        },
        {
          id: 'c_qishan_transport',
          label: '【督运粮草】在险峻秦岭栈道督运粮秣，协助迁移天水千户百姓入蜀',
          description: '运送三军命脉，接济北伐军民。',
          approachTag: '【秦岭督粮】',
          requirementHint: '任劳任怨，善抚百姓',
          statChanges: { health: 6, virtue: 12, intellect: 8, wealth: 6 },
          outcomeText: '你冒雨运送数千石麦米，妥善安顿天水迁蜀千余户百姓，丞相亲赐锦袍以旌其劳。',
          campaignUnlock: {
            campaignName: '祁山督粮安民',
            camp: 'SHU',
            commander: '诸葛亮',
            roleTitle: '丞相府督粮从事',
          },
          eventFlagToSet: 'done:evt_qishan',
        },
      ],
    },
  },

  // [平民视角 · 陇右移民]
  {
    id: 'evt_campaign_228_qishan_civilian',
    category: 'CIVILIAN_DAILY',
    title: '建兴六年 · 陇右移民风云',
    priority: 85,
    conditions: {
      minYear: 228,
      maxYear: 228,
      seasons: [0],
      minAge: 12,
      maxAge: 75,
      requiredCamp: 'CIVILIAN_ONLY',
      forbiddenFlags: ['done:evt_qishan'],
    },
    storyText:
      '建兴六年春诸葛亮收拔天水三郡，后因街亭失利，丞相下令拔西县千余家百姓迁居汉中盆地。四野百姓收拾锅碗推车南渡栈道。',
    choice: {
      prompt: '蜀军护送百姓南迁汉中，路途险峻但免于曹魏战后报复，你作何决断？',
      options: [
        {
          id: 'c_qishan_civ_migrate',
          label: '跟随大队官兵南迁汉中天府，分领熟田瓦舍耕种',
          description: '前往安宁少战的蜀中立业。',
          approachTag: '【南迁安家】',
          requirementHint: '搬迁立业',
          statChanges: { wealth: 8, virtue: 8, fortune: 6 },
          outcomeText: '官府在汉中平原为你拨付良田三十亩与耕牛一头，全家在益州安稳扎下根来。',
          eventFlagToSet: 'done:evt_qishan',
        },
        {
          id: 'c_qishan_civ_stay',
          label: '故土难离，留守陇右老宅修复麦田',
          description: '守望桑梓，不离家山。',
          approachTag: '【守望故土】',
          requirementHint: '安土重迁',
          statChanges: { health: 6, wealth: 4 },
          outcomeText: '战事暂歇，魏军重新进驻，你在旧田上继续春耕劳作。',
          eventFlagToSet: 'done:evt_qishan',
        },
      ],
    },
  },

  // =========================================================================
  // 5. 晚年见证、花甲感怀与人瑞表 (45~80岁)
  // =========================================================================
  {
    id: 'evt_mature_45_elder',
    category: 'MATURE_SENIOR',
    title: '知命之年 · 乡党三老',
    priority: 85,
    conditions: { minYear: 229, maxYear: 235, seasons: [2], minAge: 45, maxAge: 50, forbiddenFlags: ['done:evt_mature_45'] },
    storyText: '步入知命之年。三国各自立国，烽烟稍敛。你的双鬓渐染秋霜，儿女业已成人，乡邻遇事常来听取你的主见。',
    choice: {
      prompt: '步入知命之年，你打算如何安顿往后春秋？',
      options: [
        {
          id: 'c_age45_elder',
          label: '出任乡党三老，秉公主持乡饮与调息邻里争端',
          description: '立德行仁，成为地方受人敬重的大长辈。',
          approachTag: '【乡党宗长】',
          requirementHint: '崇德厚望，泽被桑梓',
          statChanges: { virtue: 14, intellect: 6, wealth: 4 },
          outcomeText: '县长巡行过村亦下车揖手相问，邻里田宅口角只要你一言便冰释前嫌，威望日隆。',
          eventFlagToSet: 'done:evt_mature_45',
        },
        {
          id: 'c_age45_farm_expand',
          label: '督导子孙辛勤整修水田，建起榨油碾米水磨坊',
          description: '为子孙打下扎实家私产业，家道殷实。',
          approachTag: '【厚殖家业】',
          requirementHint: '子孙守业，仓廪殷实',
          statChanges: { wealth: 18, health: 4 },
          outcomeText: '家中谷满仓、猪羊满圈。在数十载离乱沧桑之后，你守护住了一大家子的安稳烟火。',
          eventFlagToSet: 'done:evt_mature_45',
        },
        {
          id: 'c_age45_music',
          label: '手刻竹笛短箫，常在老槐树下为村童吹奏汉末民谣',
          description: '浮名利禄皆浮云，寄情山水乐道知命。',
          approachTag: '【寄情山野】',
          requirementHint: '淡泊明志，宁静致远',
          statChanges: { virtue: 10, health: 8, fortune: 6 },
          outcomeText: '夕阳斜照，箫声悠扬穿过田野，孩子们拍手欢唱，你心中一片宁静淡泊。',
          eventFlagToSet: 'done:evt_mature_45',
        },
      ],
    },
  },
  {
    id: 'evt_senior_60_retrospective',
    category: 'MATURE_SENIOR',
    title: '耳顺花甲 · 见证始终',
    priority: 85,
    conditions: { minYear: 244, maxYear: 255, seasons: [3], minAge: 60, maxAge: 65, forbiddenFlags: ['done:evt_senior_60'] },
    storyText: '年逾花甲，寒冬初雪。三国的枭雄老将皆已作古，你坐在柴火盆旁烤红薯，膝下孙儿拉着你的衣襟，问起当年赤壁与官渡的烽火。',
    choice: {
      prompt: '孙儿仰着稚嫩的小脸问：“爷爷，当年那些大英雄大人物到底争的是什么呀？”',
      options: [
        {
          id: 'c_age60_ordinary',
          label: '“什么开疆拓土，都比不上一锅热饭、一家齐整。”',
          description: '看透了霸业功名背后的森森白骨，深知平淡之珍贵。',
          approachTag: '【大智若愚】',
          requirementHint: '返璞归真，了悟浮生',
          statChanges: { virtue: 12, intellect: 8 },
          outcomeText: '孙儿似懂非懂地咬着红薯重重点头。那一晚，你睡得格外平静香甜。',
          eventFlagToSet: 'done:evt_senior_60',
        },
        {
          id: 'c_age60_record',
          label: '取出珍藏多年的粗麻纸，就着油灯把六十年真实见闻口述记为家谱',
          description: '以一个平凡生灵的双眼，留存这大乱甲子最真实的血泪印记。',
          approachTag: '【笔录沧桑】',
          requirementHint: '文心传世，青史留存',
          statChanges: { intellect: 14, virtue: 8 },
          outcomeText: '这卷写在粗纸上的草民笔记，后来成为后世史官考求汉末民间世相最弥足珍贵的文献。',
          eventFlagToSet: 'done:evt_senior_60',
        },
      ],
    },
  },
];
