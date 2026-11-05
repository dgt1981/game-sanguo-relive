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
import { SEASONS_CONFIG, getLunarYearName, SEASONAL_MACRO_EVENTS } from './lifeSimulator';
import { generateContextualFigureEncounter } from './figuresSimulation';

export { SEASONAL_MACRO_EVENTS };

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
    // 关键防重复检查：一生仅触发一次 (onceOnly 默认为 true，若明确为 false 才允许重复触发)
    // 彻底杜绝已经选择或经历过的事件在后续季节中连续或重复出现一模一样的选项
    const isOnceOnly = c.onceOnly !== false;
    if (isOnceOnly && (flags[`done:${row.id}`] || flags[row.id])) {
      return false;
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

  // 若存在多个同等最高优先级的候选事件，进行随机抽选，大幅提升重玩丰富度与分支多样性
  let selectedRow: EventTableRow | undefined = undefined;
  if (eligibleEvents.length > 0) {
    const topPriority = eligibleEvents[0].priority;
    const topCandidates = eligibleEvents.filter((e) => e.priority === topPriority);
    selectedRow = topCandidates[Math.floor(Math.random() * topCandidates.length)];
  }

  let personalStory = '';
  let choice: { prompt: string; options: LifeChoice[] } | undefined = undefined;
  let figureDialogue: HistoricalDialogue | undefined = undefined;
  let campaignName: string | undefined = undefined;
  let isCampaignEvent = false;

  // 4. 若无特定脚本战役或阶段抉择，适度触发有深度、合因果的名士奇遇或故友重逢
  const lastFigYear = Number(flags['last_figure_year'] || 0);
  const yearsSinceLastFig = year - lastFigYear;

  // 严格避免频繁对话同一个人：两次名士相会至少间隔 3 年（12个季节），并在关键成丁节点（16, 21, 28, 36, 48）或适当节律触发
  const isMilestoneAge = age === 16 || age === 21 || age === 28 || age === 36 || age === 48;
  const shouldCheckFigure =
    !selectedRow &&
    age >= 13 &&
    age <= 60 &&
    yearsSinceLastFig >= 3 &&
    (isMilestoneAge || ((year * 4 + season) % 7 === 0 && Math.random() < 0.45));

  if (shouldCheckFigure) {
    const contextualEncounter = generateContextualFigureEncounter(profile, year, season, age, stats);
    if (contextualEncounter) {
      figureDialogue = contextualEncounter.figureDialogue;
      personalStory = contextualEncounter.personalStory;
      choice = contextualEncounter.choice;
      // 记录最近对话年份与人物，保障冷却与历史连贯性
      flags['last_figure_year'] = year;
      flags['last_figure_spoken'] = contextualEncounter.figureDialogue.figureId;
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

  // 6. 若本季无特殊战役、名士对话或大事件，依据当前生理年龄段，从四季民间日常库读取真实流转
  if (!personalStory) {
    if (age <= 6) {
      // 襁褓与龆龀幼童 (0~6岁): 贴近幼童天真日常与家庭温情
      const infantToddlerPhrases: Record<SeasonIndex, string[]> = {
        0: [
          `春草萌绿，微风拂柳，你坐在门槛上拿小树枝划泥土，看院中黄蝶在油菜花间翩翩起舞。体魄+1，仁厚+1。`,
          `初春细雨蒙蒙，母亲给你换上干净的麻布小单衣。你咿呀学语，学着家犬吠叫，逗得父母忍俊不禁。体魄+1。`,
          `孟春向暖，你跟在长姐身后去村口溪滩拔嫩荠菜，迈着小短腿跑得两颊通红。体魄+1，仁厚+1。`,
          `早春桃花初绽，祖父抱你在怀里指认院前老槐与飞燕，教你唤出‘春来燕归’。识见+1。`,
        ],
        1: [
          `入夏溽暑渐至，老槐浓荫蔽日。母亲摇着蒲扇为你驱赶蚊蚋，你在凉席上吮指安然酣睡。体魄+1。`,
          `夏日午后雷雨骤歇，屋檐水滴如琴鸣。你拿粗陶小碗在阶下接水玩泥巴，乐不可支。识见+1。`,
          `初夏溪水浅暖，父亲带你在浅滩濯足洗手，几尾小泥鳅从你脚趾缝间滑过。体魄+1，仁厚+1。`,
          `盛夏酷热，全家在柴棚瓜架下分食一瓣清甜脆瓜，你啃得满脸瓜汁，咯咯欢笑。体魄+1。`,
        ],
        2: [
          `金秋八月，晒谷场上谷香四溢。你在金黄的草垛间翻滚捉迷藏，沾了满头满身的干草屑。体魄+1。`,
          `秋风初凉，熟透的红枣落满院落，你捡起满满一小兜甜枣分给村里伙伴吃。仁厚+1，家资+1。`,
          `秋高气爽，成群大雁自长空向南飞掠。你仰着小脑袋手指长空，学着雁鸣清啼。识见+1。`,
          `白露凝霜，父亲自县城集市带回一小块饴糖，掰了半块喂入你口中，满口甘甜。仁厚+1，气数+1。`,
        ],
        3: [
          `初冬飞雪落瓦檐，全家围在土灶前烤干红薯。母亲用温热的布巾为你擦拭冻红的小手。体魄+1。`,
          `岁暮大雪纷飞，你与邻家孩童在雪地上踩脚印、滚小雪球，玩得小脸红扑扑。勇略+1，体魄+1。`,
          `除夕岁除，门扉换上新桃木符。你穿着厚棉袍向长辈拜岁，得了一枚压岁建武五铢钱。家资+1，气数+1。`,
          `腊月风寒凛冽，你在纸窗前看红梅傲雪盛放，心神纯澈安定。仁厚+1，气数+1。`,
        ],
      };
      const phrases = infantToddlerPhrases[season];
      personalStory = phrases[(year * 4 + season) % phrases.length];
    } else if (age <= 14) {
      // 总角束发成童 (7~14岁): 少年劳作、启蒙与乡里历练
      const youthPhrases: Record<SeasonIndex, string[]> = {
        0: [
          `春耕发种，你帮父亲挑水浇灌菜畦，稚嫩的肩膀磨出了薄茧，但身体愈发结实挺拔。体魄+1，勇略+1。`,
          `初春细雨润麦苗，你在私塾窗外静听塾师讲授《论语》，默默用树枝在沙盘上默写字句。识见+1，仁厚+1。`,
          `春山草长，你与同龄少年在后山采得数篓肥嫩山野菜与干柴，换得几文铜钱补贴家用。家资+1，体魄+1。`,
          `孟春之节，你在河滩跟村中猎户练习投石与削竹枪，准头日见长进。勇略+1，识见+1。`,
        ],
        1: [
          `入夏雷雨连绵，山溪暴涨，你扛着铁锹协助父兄加固田埂与排水渠，保住了自家秧苗。体魄+1，仁厚+1。`,
          `盛夏酷暑难耐，你在树荫下编制蒲草凉席与斗笠，手艺渐趋熟练。家资+1，识见+1。`,
          `梅雨季节屋顶漏雨，你爬上矮梯协助父亲换上新茅草，身手十分敏捷利落。体魄+1，勇略+1。`,
          `夏日田头捕得几条大鲤鱼，你细心烹煮了一锅鲜鱼羹侍奉双亲，邻里称赞你孝悌懂事。仁厚+1，体魄+1。`,
        ],
        2: [
          `金秋霜降，麦场上连枷声此起彼伏。你挥动木叉翻晒谷麦，晒得浑身古铜健美。体魄+1，家资+1。`,
          `秋风萧瑟，官府差役催征算赋。你帮里正核算斗斛升量，条理清晰不差分文。识见+1，家资+1。`,
          `重阳佳节，你随乡老登高采茱萸，聆听前朝光武平定天下的传奇往事，暗立宏愿。仁厚+1，识见+1。`,
          `秋高气爽，你在山坡上放牧耕牛，手持短笛吹出悠扬曲调，声动原野。识见+1，心境恬然。`,
        ],
        3: [
          `初雪覆瓦，你在柴棚中细心修补耕犁、锄头与竹篾板车，静待来春开犁。识见+1，家资+1。`,
          `岁末腊月，乡中合宰肥猪，你手脚勤快帮屠户挑水褪毛，分得一小块精肉孝敬双亲。体魄+1，仁厚+1。`,
          `大雪封路数日，你在炉火旁伴着跳动油灯抄录古书竹简，识得不少天文舆地之学。识见+1。`,
          `风雪除夕，村中更夫巡夜鸣锣，你与青壮一同巡防栅栏，警惕流寇出没。勇略+1，气数+1。`,
        ],
      };
      const phrases = youthPhrases[season];
      personalStory = phrases[(year * 4 + season) % phrases.length];
    } else {
      // 及冠壮年与花甲耆老 (15岁以上): 成熟草民、兵役百业与乡党长者日常
      const adultPhrases: Record<SeasonIndex, string[]> = {
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
      const phrases = adultPhrases[season];
      personalStory = phrases[(year * 4 + season) % phrases.length];
    }
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
    eventFlagTriggered: selectedRow ? `done:${selectedRow.id}` : (figureDialogue ? `met_fig_${figureDialogue.figureId}_${year}` : undefined),
    choice,
  };
}
