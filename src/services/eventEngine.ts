import {
  SeasonalEvent,
  LifeChoice,
  SeasonIndex,
  HistoricalDialogue,
  Attributes,
} from '../types/game';
import { EventTableRow, EventQueryContext } from '../types/eventTable';
import { EVENTS_DATA_TABLE } from '../data/eventsCatalog';
import { PROVINCES } from '../data/regions';
import { SEASONS_CONFIG, getLunarYearName } from './lifeSimulator';
import { getRegionalFigure } from './historicalEncounters';

/**
 * 宏观历史大事年表 (公元184 ~ 265年)
 */
export const SEASONAL_MACRO_EVENTS: Record<string, string> = {
  // 184 Yellow Turban
  '184-0': '中平元年春二月，巨鹿张角自称“天公将军”，三十六方数十万太平道信众皆头裹黄巾同日揭竿反汉，四海震动。天下刺史太守各开私家府库募兵拒敌。',
  '184-1': '夏四月黄巾大将波才破朱儁于颍川，围皇甫嵩于长社。皇甫嵩乘夜纵火焚烧黄巾草营，曹操引骑兵飞马驰援，斩首数万级。',
  '184-2': '秋八月右中郎将朱儁大破张宝于宛城，皇甫嵩进击广宗。张角病卒，汉军发掘其棺椁戮尸枭首，首级飞传洛阳。',
  '184-3': '冬十月皇甫嵩、郭典大破张梁于下曲阳，斩杀黄巾十万人，筑京观于城南。黄巾主力虽溃，黑山、白波余部啸聚山林，汉室自此千疮百孔。',

  // 189 Dong Zhuo Enter Capital
  '189-0': '汉灵帝病笃于洛阳南宫嘉德殿。蹇硕欲谋杀何进未果，大将军何进掌握禁军，两宫宿卫甲兵森严。',
  '189-1': '四月灵帝驾崩，皇子辩即位为少帝。何进与袁绍密谋诛灭中官，何进阴召西凉刺史董卓引兵逼京。',
  '189-2': '八月何进伏诛于长乐宫，袁绍袁术引禁军尽杀宦官二千人，宫室大火。董卓率三千西凉飞熊铁骑趁夜入洛阳，并吞何进部曲。',
  '189-3': '董卓专权，废少帝封弘农王，立九岁陈留王为汉献帝。夜宿龙床，鸩杀何太后，毒杀弘农王，西凉兵劫掠洛阳士庶。',

  // 190 Coalition against Dong
  '190-0': '关东州郡起兵讨董，袁绍为盟主，曹操、孙坚等十八路诸侯歃血结盟，分屯酸枣、河内。董卓部将华雄迎战诸侯。',
  '190-1': '二月董卓惧关东兵锋，纵火焚烧洛阳两百里宫阙陵墓，悉发数百万百姓西迁长安，老弱相践踏于道，号泣震天。',
  '190-2': '诸侯进军迟疑，曹操荥阳汴水遇徐荣伏击兵败，曹洪让马救脱。酸枣大营日日置酒高会，盟军貌合神离。',
  '190-3': '孙坚率江东孤军破梁县斩华雄，率先收复洛阳废墟，扫除汉家宗庙，于建章殿残井中得传国玉玺。',

  // 192 Lu Bu kills Dong Zhuo
  '192-0': '孙坚跨江攻刘表，于岘山被黄祖部将流矢射杀。袁术与袁绍兄弟反目，天下诸侯各起兵吞并。',
  '192-1': '四月司徒王允与吕布设连环计，在未央宫斩杀董卓，弃尸于市，万民点灯相庆。贾诩献策李傕郭汜反扑长安。',
  '192-2': '六月李傕郭汜破长安，杀王允，吕布东奔。关中大饥，死者数十万，白骨蔽野，人相食。',
  '192-3': '曹操在兖州收编青州百万黄巾余部，择其精锐号为“青州兵”，威镇中原。',

  // 193-194 Cao Cao conquest of Xuzhou
  '193-2': '曹操因父曹嵩遇害于徐州，引大军大举东征陶谦，拔十余城，坑杀男女数十万人于泗水，泗水为之断流。',
  '194-1': '陈宫、张邈反曹操，迎吕布袭据兖州，夏秋飞蝗蔽天，食草木叶俱尽，中原大饥人相食。',
  '194-3': '陶谦病笃，临终三让徐州于平原相刘备，刘备领徐州牧。',

  // 196 Emperor to Xuchang
  '196-2': '汉献帝历尽千辛万苦自长安乱军中东归洛阳，宫室尽毁，百官食野草。曹操依荀彧之谋，亲引大军迎驾迁都许县。',
  '196-3': '曹操颁布“屯田令”，召集流民耕种许昌荒田，公私丰足，中原军民免于饥馑。',

  // 198 Fall of Lu Bu
  '198-3': '曹操围吕布于下邳，决泗水沂水灌城月余。吕布白门楼受缢，张辽降曹，徐州底定。',

  // 200 Battle of Guandu
  '200-0': '董承衣带诏事泄被族诛。曹操东征刘备，刘备奔邺城投袁绍，关羽下邳被围暂降曹操。',
  '200-1': '白马之战关羽策马刺颜良于万众之中；延津之战曹操以诱饵斩文丑。关羽挂印封金千里走单骑。',
  '200-2': '八月袁绍进逼官渡，筑土楼俯射曹营，曹军造发石霹雳车摧毁敌楼。两军堑壕相持，曹军粮少兵疲。',
  '200-3': '十月许攸叛降，曹操跣足相迎。曹操亲引五千精骑夜袭乌巢焚尽万车军粮，袁军十万大军土崩瓦解。',

  // 208 Red Cliffs
  '208-2': '曹操南征荆州，刘琮降曹。刘备携十万襄樊百姓南渡汉水，赵云当阳单骑救幼主，张飞据水断桥。',
  '208-3': '冬十一月孙刘联军火烧赤壁。黄盖引蒙冲火船突撞曹军水寨，长江烈焰八百里，天下三分之势成型。',

  // 214 Liu Bei enters Chengdu
  '214-1': '庞统落凤坡阵亡，诸葛亮溯江西进。刘备大军合围成都数十日，刘璋开门降汉，刘备据有天府之国。',

  // 217 Jian'an Great Epidemic
  '217-3': '建安二十二年冬，中原伤寒大疫暴发，家家有僵尸之痛，室室有号泣之哀。建安七子中四人同卒于疫。',

  // 219 Guan Yu flood & Fall of Jingzhou
  '219-2': '秋八月霖雨暴溢，关羽水淹于禁七军，斩庞德，擒于禁，威震华夏，曹操欲迁都避其锋芒。',
  '219-3': '冬十月吕蒙白衣渡江偷袭荆州，糜芳降吴。关羽败走麦城突围中伏遇害。',

  // 220 Han Dynasty Ends
  '220-0': '正月魏王曹操卒于洛阳，享年六十六岁。曹丕嗣位为魏王丞相。',
  '220-3': '冬十月汉献帝于受禅台禅让，曹丕即位建立魏国。四百年大汉天下正式告终。',

  // 222 Battle of Yiling
  '222-1': '章武二年盛夏，刘备伐吴连营七百里。吴大都督陆逊夜半顺风纵火，蜀汉大军瓦解，先主退走白帝城。',

  // 223 Liu Bei passes at Baidi
  '223-0': '夏四月汉昭烈帝刘备病笃于永安宫，托孤于诸葛亮：“君才十倍曹丕，必能安国，若嗣子可辅，辅之；如其不才，君可自取。”',

  // 228 Zhuge Liang Northern Expedition
  '228-0': '建兴六年春，诸葛亮上一出师表率军出祁山，天水姜维归汉。张郃拔街亭，马谡违节失道，孔明拔西县民还汉中，挥泪斩马谡。',

  // 234 Wuzhang Plains
  '234-2': '秋八月，诸葛亮第五次北伐相持于五丈原百余日。陨星如斗坠于蜀营，武乡侯病殁五丈原，蜀军从容退回汉中。',

  // 249 Gaoping Tomb Incident
  '249-0': '正月初六，魏少帝谒高平陵。太傅司马懿称病发难，闭城门指洛水为誓，旋即夷曹爽三族，魏柄尽归司马。',
};

/**
 * 结构化查询核心引擎：从预置事件数据表读取并严格匹配当前时序与因果链
 */
export function querySeasonalEventFromTable(context: EventQueryContext): SeasonalEvent {
  const { year, season, age, profile, stats } = context;
  const province = PROVINCES.find((p) => p.id === profile.currentProvince) || PROVINCES[0];
  const seasonCfg = SEASONS_CONFIG[season];
  const lunarYear = getLunarYearName(year);
  const flags = profile.eventFlags || {};

  // 1. 宏观天下大事检索
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

  // 2. 本地郡县风物
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

  // 3. 从预存数据表中检索匹配当前时空、生理年龄及前置因果链的事件
  const eligibleEvents = EVENTS_DATA_TABLE.filter((row) => {
    const c = row.conditions;
    // 严格年代检查
    if (year < c.minYear || year > c.maxYear) return false;
    // 严格生理年龄检查 (彻底避免幼童参战或老人当童工的时机混乱)
    if (age < c.minAge || age > c.maxAge) return false;
    // 季节检查
    if (c.seasons && !c.seasons.includes(season)) return false;
    // 地区检查
    if (c.provinces && !c.provinces.includes(profile.currentProvince)) return false;
    // 前置因果链检查 (所有 requiredFlags 必须具备)
    if (c.requiredFlags) {
      const hasAll = c.requiredFlags.every((rf) => Boolean(flags[rf]));
      if (!hasAll) return false;
    }
    // 冲突排他检查 (所有 forbiddenFlags 不能具备，防止重复触发战役)
    if (c.forbiddenFlags) {
      const hasAnyForbidden = c.forbiddenFlags.some((ff) => Boolean(flags[ff]));
      if (hasAnyForbidden) return false;
    }
    // 阵营严格限制检查 (确保从军后只参与本阵营事务，平民只触发平民视角，避免越阵营乱跳)
    if (c.requiredCamp) {
      const playerCamp = profile.militaryAffiliation?.camp || 'NONE';
      if (c.requiredCamp === 'CIVILIAN_ONLY') {
        if (playerCamp !== 'NONE') return false;
      } else if (c.requiredCamp === 'MILITARY_ANY') {
        if (playerCamp === 'NONE') return false;
      } else {
        if (playerCamp !== c.requiredCamp) return false;
      }
    }
    // 属性门槛检查
    if (c.minStats) {
      for (const [k, v] of Object.entries(c.minStats)) {
        if (stats[k as keyof Attributes] < (v as number)) return false;
      }
    }
    return true;
  });

  // 按优先级排序 (战役 100 > 危机 95 > 成长 85 > 日常 70)
  eligibleEvents.sort((a, b) => b.priority - a.priority);

  let selectedRow: EventTableRow | undefined = eligibleEvents[0];
  let personalStory = '';
  let choice: { prompt: string; options: LifeChoice[] } | undefined = undefined;
  let figureDialogue: HistoricalDialogue | undefined = undefined;
  let campaignName: string | undefined = undefined;
  let isCampaignEvent = false;

  // 4. 若无特定脚本战役或阶段抉择，检查同郡历史名士相逢事件 (13~52岁之间，根据历史年代与州郡检索)
  const encounterYearKey = `encounter_${year}_${profile.currentProvince}`;
  const shouldCheckFigure =
    !selectedRow &&
    age >= 13 &&
    age <= 55 &&
    !flags[encounterYearKey] &&
    ((year * 3 + season) % 7 === 1 || age === 16 || age === 21 || age === 31);

  if (shouldCheckFigure) {
    const figure = getRegionalFigure(profile.currentProvince, year);
    if (figure) {
      figureDialogue = {
        figureId: figure.id,
        speaker: figure.name,
        courtesyName: figure.courtesyName,
        title: figure.title,
        camp: figure.camp,
        avatarChar: figure.avatarChar,
        quote: figure.greeting,
        replyPrompt: `你于【${profile.county}】市井驿道偶遇同郡名士【${figure.name}（字${figure.courtesyName}）】。`,
      };

      personalStory = `这一日，你在【${profile.county}】驿亭集市间，忽见一人器宇轩昂、举止非凡，正是名闻海内的同郡名士【${figure.name}（字${figure.courtesyName}）】。他驻足与你交谈，言辞中尽显对当今天下大势与百姓生计的关切。`;

      choice = {
        prompt: `偶遇同郡名士【${figure.name}】，对方驻足与你攀谈，你当如何应对？`,
        options: [
          {
            id: `c_encounter_${figure.id}_learn`,
            label: `恭敬拱手请教世道风云与安身之策，聆听教诲`,
            description: `虚心受教，以诚相待，聆听当世英杰的高见。`,
            approachTag: '【虚怀请益】',
            requirementHint: '崇德慕义，增进识见',
            statChanges: { intellect: 10, virtue: 6, fortune: 4 },
            outcomeText: `【${figure.name}】见你目光清澈、虚心好学，抚须欣然传授了你诸多经史要诀与度世法度，二人遂结为相知！`,
            figureBond: {
              figureId: figure.id,
              figureName: figure.name,
              courtesyName: figure.courtesyName,
              title: figure.title,
              camp: figure.camp,
              campLabel: figure.campLabel,
              relation: '推心置腹之师友',
              dialogue: figure.greeting,
            },
            eventFlagToSet: encounterYearKey,
          },
          {
            id: `c_encounter_${figure.id}_treat`,
            label: `倾囊置办一角老酒与干粮薄礼，邀其于凉棚下促膝对饮`,
            description: `仗义疏财，以乡党邻里之情温厚相待。`,
            approachTag: '【倾盖如故】',
            requirementHint: '需家资或仁厚',
            statChanges: { virtue: 10, wealth: -4, fortune: 6 },
            outcomeText: `二人就着粗碗浊酒畅叙桑梓风物，【${figure.name}】大赞你为人敦厚慷慨，引为莫逆同道！`,
            figureBond: {
              figureId: figure.id,
              figureName: figure.name,
              courtesyName: figure.courtesyName,
              title: figure.title,
              camp: figure.camp,
              campLabel: figure.campLabel,
              relation: '同道莫逆知己',
              dialogue: figure.greeting,
            },
            eventFlagToSet: encounterYearKey,
          },
          {
            id: `c_encounter_${figure.id}_join`,
            label: `长揖及地，坦陈愿投身其麾下，誓作部曲随行从军`,
            description: `天下大乱，良禽择木而栖。跟随当世英豪共同投身大业！`,
            approachTag: '【效死相随】',
            requirementHint: '需勇略或识见出众',
            requirements: { martial: 25 },
            statChanges: { martial: 10, intellect: 8, fortune: 8 },
            outcomeText: `【${figure.name}】握住你的双手欣然大笑：“得足下相助，何愁大事不成！”当即收你入其亲兵随行帐幕！`,
            figureBond: {
              figureId: figure.id,
              figureName: figure.name,
              courtesyName: figure.courtesyName,
              title: figure.title,
              camp: figure.camp,
              campLabel: figure.campLabel,
              relation: '麾下托付心腹',
              dialogue: figure.greeting,
            },
            campaignUnlock: {
              campaignName: `${figure.name}麾下从军`,
              camp: figure.camp,
              commander: figure.name,
              roleTitle: `${figure.name}帐前亲随牙将`,
            },
            eventFlagToSet: encounterYearKey,
          },
        ],
      };
    }
  }

  // 5. 若有预置数据表匹配项，组装事件内容
  if (selectedRow) {
    campaignName = selectedRow.campaignName;
    isCampaignEvent = Boolean(selectedRow.isCampaignEvent);

    if (typeof selectedRow.storyText === 'function') {
      personalStory = selectedRow.storyText(profile, stats, season);
    } else {
      personalStory = selectedRow.storyText;
    }

    if (selectedRow.macroHistoryOverride) {
      macroText = selectedRow.macroHistoryOverride;
    }

    if (selectedRow.figureDialogue) {
      figureDialogue =
        typeof selectedRow.figureDialogue === 'function'
          ? selectedRow.figureDialogue(profile, year)
          : selectedRow.figureDialogue;
    }

    if (selectedRow.choice) {
      choice = selectedRow.choice;
    }
  }

  // 6. 若本季无特殊战役、名士对话或大事件，从四季民间日常库读取真实流转
  if (!personalStory) {
    const seasonalLifePhrases: Record<SeasonIndex, string[]> = {
      0: [
        `初春细雨润麦苗，你扛着农具在晨雾中除草培土，双手布满老茧，但麦穗长势喜人。体魄+1，家资+1。`,
        `春风吹开漫山野花，你与邻家伙伴在溪边采得鲜嫩荠菜与春笋，煮了一锅热腾腾的野菜汤。仁厚+1。`,
        `县城开春集市，你随车去卖了几篓竹编器具，换得一升粗盐与半匹土布。家资+1，识见+1。`,
        `春寒料峭，偶染小恙，母亲煎了姜汤葱白，发了一场大汗便好了。体魄+1。`,
        `官道上驶过一队征募良马的斥候轻骑，马蹄翻滚黄尘，你在路边拱手避让，暗自赞叹塞北神骏。勇略+1。`,
        `村里老塾师在桃花树下教授童蒙背诵《周礼》，你驻足静听良久，心有所悟。识见+1。`,
      ],
      1: [
        `入夏雷雨连绵，山溪暴涨，你与乡邻连夜挑土加固堤坝，护住了全村百亩秧田。体魄+1，仁厚+1。`,
        `盛夏酷暑难耐，你在树荫下编制蒲草凉席，偶有南来客商在井边讨水喝，送了你几个北方干枣。识见+1。`,
        `梅雨季节屋顶漏雨，你冒雨爬上屋顶换上新茅草，虽然衣衫湿透，但屋内安然无恙。体魄+1。`,
        `夏日田头捕得几条大鲤鱼，全家人大快朵颐，晚风吹拂稻香四溢。家资+1。`,
        `烈日当空，县衙差役催征夏税，乡民聚在槐树下叹息，你沉着协助里正点清斛斗，免受苛扣。识见+1，仁厚+1。`,
        `邻村猎户进山打得一头野猪，分赠给你一条后腿，你用井水冰镇后与街坊分食。体魄+1，仁厚+1。`,
      ],
      2: [
        `金秋霜降，黄澄澄的谷子割倒了一片又一片，连枷声声响彻晒谷场，全家抢收归仓。体魄+1，家资+2。`,
        `秋风萧瑟，官府差役进村征收算赋，幸得家中余粮充足，顺利交齐租赋。家资-1，名望+1。`,
        `重阳佳节，你与亲友登上北山采茱萸，饮了一杯自酿的菊花浊酒，遥望远方烽燧长烟。仁厚+1，识见+1。`,
        `秋高气爽，收割完毕后你在麦茬地里放牧牛羊，望着大雁往南飞去。心境怡然，体魄+1。`,
        `北风骤起，四野枫红。有客商自边塞运来关外皮毛，你以土布交换得一张暖和的羊皮坎肩。家资+1。`,
        `秋夜明月如盘，全村老幼聚在打谷场，听退伍老卒讲述当年随皇甫嵩平定广宗的大战。勇略+1，识见+1。`,
      ],
      3: [
        `初雪覆瓦，檐下垂冰。全家人围在火盆前烤干苞谷，听祖辈讲述当年光武皇帝昆阳大战的传奇。仁厚+1。`,
        `岁末腊月，乡中合杀了一头年猪，家家分得两斤肥肉，腌制腊肉以备新年。家资+1。`,
        `大雪封路数日，你在草棚中修补耕犁与板车，静待来年开春。识见+1。`,
        `除夕之夜，村中燃起爆竹驱除山魈恶鬼，全家围坐饮椒柏酒，祈愿来年风调雨顺、少有兵火。体魄+1，气数+1。`,
        `数九严冬，河面结冰三尺，你在冰上凿窟窿垂钓，竟钓得两条金鳞肥鲤，家人皆喜。家资+1，气数+1。`,
        `风雪夜宿，有投宿的流浪僧道在檐下避寒，你端出一碗热粟米粥相赠，道士合掌称善。仁厚+2。`,
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
    figureDialogue,
    campaignName,
    isCampaignEvent,
    choice,
  };
}
