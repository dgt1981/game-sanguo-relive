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
    title: '十八及冠 · 点卯征丁',
    priority: 85,
    conditions: { minYear: 202, maxYear: 202, seasons: [2], minAge: 18, maxAge: 18 },
    storyText: '十八岁秋，战火逼近。县里铜锣敲响，长官按籍点卯，一村之中必须抽丁两人随军出征。',
    choice: {
      prompt: '点兵鼓声震天，差役腰悬皮鞭按名拿人，你作何决断？',
      options: [
        {
          id: 'c_age18_frontline',
          label: '扛起丈二长矛应征入伍，做一名冲锋陷阵的行伍步卒',
          description: '男儿横刀走战阵，博个军功光宗耀祖，总胜过饿死沟壑！',
          approachTag: '【投身行伍】',
          requirementHint: '生死搏杀，凶险难测',
          statChanges: { martial: 14, health: 4, wealth: 4, fortune: -4 },
          outcomeText: '穿上破旧皮甲，端起长枪开拔出营。母亲追着队列送了十里，将一包故乡热土塞入你怀里。',
          campaignUnlock: {
            campaignName: '行伍投军',
            camp: 'NEUTRAL',
            commander: '郡守都尉',
            roleTitle: '行伍正卒',
          },
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
          approachTag: '【随军督粮】',
          requirementHint: '任劳任怨，避其锋芒',
          statChanges: { health: 6, virtue: 6, wealth: 2 },
          outcomeText: '车轮吱呀响彻古道，你脚磨起无数血泡，在后营运粮数月，结识了各方豪爽民夫。',
          campaignUnlock: {
            campaignName: '随军押粮',
            camp: 'NEUTRAL',
            commander: '督粮都尉',
            roleTitle: '后营运粮队正',
          },
        },
        {
          id: 'c_age18_flee_south',
          label: '典当破房薄田，连夜护持全家老少南逃荆襄避乱',
          description: '避开诸侯混战泥潭，前往刘景升治下的安宁乐土。',
          approachTag: '【举家避乱】',
          requirementHint: '耗费家资，换得安宁',
          statChanges: { wealth: -10, virtue: 8, fortune: 8, health: -4 },
          outcomeText: '跋山涉水两千里，终于安然抵达襄阳。一家人在水边搭起茅屋，免去兵戈杀戮之苦。',
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
  {
    id: 'evt_campaign_200_guandu',
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
      forbiddenFlags: ['done:evt_campaign_200_guandu'],
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
          campaignUnlock: {
            campaignName: '官渡之战 · 乌巢奇袭',
            camp: 'WEI',
            commander: '曹操',
            roleTitle: '牙门破虏别将',
          },
          eventFlagToSet: 'done:evt_campaign_200_guandu',
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
          eventFlagToSet: 'done:evt_campaign_200_guandu',
        },
      ],
    },
  },
  {
    id: 'evt_campaign_208_changbanpo',
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
      forbiddenFlags: ['done:evt_campaign_208_changbanpo'],
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
          statChanges: { martial: 18, virtue: 16, health: -4, fortune: 10 },
          outcomeText: '长矛刺穿数名追兵，你的战袍尽被血浸透！终于掩护子龙冲出景山合围，刘备携你双手洒泪相迎：“真义士也！”',
          campaignUnlock: {
            campaignName: '当阳长坂护幼主',
            camp: 'SHU',
            commander: '赵云',
            roleTitle: '顺平侯贴身校尉',
          },
          eventFlagToSet: 'done:evt_campaign_208_changbanpo',
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
          eventFlagToSet: 'done:evt_campaign_208_changbanpo',
        },
      ],
    },
  },
  {
    id: 'evt_campaign_208_chibi',
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
      forbiddenFlags: ['done:evt_campaign_208_chibi'],
    },
    storyText:
      '冬十一月，东南风狂啸！黄盖引二十艘蒙冲斗舰，满载芦苇油脂突入曹军水寨，大呼“降曹”，烈焰顺风腾空八百里，江水尽赤！',
    choice: {
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
          eventFlagToSet: 'done:evt_campaign_208_chibi',
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
          eventFlagToSet: 'done:evt_campaign_208_chibi',
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
  {
    id: 'evt_campaign_219_fancheng',
    category: 'HISTORICAL_CAMPAIGN',
    title: '建安二十四年 · 关云长水淹七军',
    priority: 100,
    campaignName: '关云长水淹七军',
    isCampaignEvent: true,
    conditions: {
      minYear: 219,
      maxYear: 219,
      seasons: [2, 3],
      minAge: 16,
      maxAge: 65,
      forbiddenFlags: ['done:evt_campaign_219_fancheng'],
    },
    storyText:
      '秋八月霖雨连绵，汉水暴涨五丈！关羽乘大船浮水攻樊城，于禁七军三万人尽皆沉溺投降，威震华夏，曹操几欲迁都！',
    choice: {
      prompt: '秋八月霖雨暴溢，关羽乘大舰攻樊城，于禁七军三万尽降！你身临汉水前线，如何行事？',
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
          eventFlagToSet: 'done:evt_campaign_219_fancheng',
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
          eventFlagToSet: 'done:evt_campaign_219_fancheng',
        },
      ],
    },
  },
  {
    id: 'evt_campaign_228_qishan',
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
      forbiddenFlags: ['done:evt_campaign_228_qishan'],
    },
    storyText:
      '建兴六年春，诸葛亮上一出师表，汉军北伐出祁山，天水三郡震动归蜀！马谡驻守街亭要塞，魏蜀两军胜负系于一线！',
    choice: {
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
          eventFlagToSet: 'done:evt_campaign_228_qishan',
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
          eventFlagToSet: 'done:evt_campaign_228_qishan',
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
