import React, { useState, useEffect } from 'react';
import {
  HistoricalFigureBond,
  FigureArchetype,
  Attributes,
  NobleBoon,
  SeasonIndex,
  BoonType,
} from '../types/game';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import {
  evaluateFigurePerks,
  getUnmetRegionalFigures,
} from '../services/figuresSimulation';
import {
  getBoonsForFigure,
  getIntimacyLevelInfo,
  canInteractThisSeason,
  getInteractionOptions,
  getInteractionQuote,
  InteractionOption,
} from '../services/nobleInteraction';
import {
  Shield,
  Brain,
  Coins,
  HeartPulse,
  BookOpen,
  Users,
  MapPin,
  Sparkles,
  Award,
  Filter,
  MessageSquare,
  Compass,
  Swords,
  Scroll,
  Gem,
  CheckCircle2,
  Lock,
  X,
  Wine,
  Send,
  Flame,
  Check,
  Hourglass,
  Clock,
} from 'lucide-react';
import { sound } from '../services/sound';
import { PixelFigureAvatar, PixelAvatarSize } from './PixelFigureAvatar';

interface FiguresNetworkProps {
  knownFigures: HistoricalFigureBond[];
  profile: PersonProfile;
  currentYear: number;
  currentSeason: SeasonIndex;
  currentStats: Attributes;
  onInteractFigure?: (
    figureId: string,
    interactionType: 'SPAR_STUDY' | 'FEAST_GIFT' | 'LETTER_GREETING',
    dialogueQuote: string,
    statCosts: Partial<Record<keyof Attributes, number>>,
    statGains: Partial<Record<keyof Attributes, number>>,
    intimacyGain: number
  ) => void;
  onClaimBoon?: (figureId: string, boon: NobleBoon) => void;
}

export const FiguresNetwork: React.FC<FiguresNetworkProps> = ({
  knownFigures,
  profile,
  currentYear,
  currentSeason,
  currentStats,
  onInteractFigure,
  onClaimBoon,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<FigureArchetype | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'KNOWN' | 'BOONS' | 'REGIONAL'>('KNOWN');
  const [boonFilter, setBoonFilter] = useState<BoonType | 'ALL'>('ALL');

  // Selected figure for interaction modal
  const [interactingFigure, setInteractingFigure] = useState<HistoricalFigureBond | null>(null);

  // Recently claimed boon for celebration modal
  const [celebrationBoon, setCelebrationBoon] = useState<{
    boon: NobleBoon;
    figureName: string;
  } | null>(null);

  // Interaction feedback toast/modal
  const [interactionResult, setInteractionResult] = useState<{
    figureName: string;
    optionTitle: string;
    quote: string;
    intimacyGain: number;
    statGainsText: string;
    levelUpNotice?: string;
  } | null>(null);

  // 互动冷却追踪状态 (记录名士互动起始时间与倒计时)
  interface CooldownRecord {
    startedAt: number;
    durationMs: number;
    year: number;
    season: SeasonIndex;
  }
  const [cooldowns, setCooldowns] = useState<Record<string, CooldownRecord>>({});
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // 印章动效状态 (名士头像加盖朱红【羁绊加深】印章)
  const [activeStamp, setActiveStamp] = useState<{
    figureId: string;
    figureName: string;
    intimacyGain: number;
    timestamp: number;
  } | null>(null);
  const [isStamping, setIsStamping] = useState<boolean>(false);

  // 定时刷新冷却倒计时与进度显示 (每100ms平滑更新)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // 评估名士当前冷却状态与下季倒计时
  const getFigureCooldownStatus = (figure: HistoricalFigureBond) => {
    const isInteractedThisSeason =
      figure.lastInteractedYear === currentYear &&
      figure.lastInteractedSeason === currentSeason;

    const cd = cooldowns[figure.id];
    const now = currentTime;
    const nextSeasonIndex = ((currentSeason + 1) % 4) as SeasonIndex;
    const nextSeasonConfig = SEASONS_CONFIG[nextSeasonIndex];

    if (cd) {
      const elapsed = Math.max(0, now - cd.startedAt);
      const duration = cd.durationMs || 12000;
      const remainingMs = Math.max(0, duration - elapsed);
      const remainingSec = Math.ceil(remainingMs / 1000);
      const progressPercent = Math.min(100, Math.round((elapsed / duration) * 100));

      if (remainingMs > 0 || isInteractedThisSeason) {
        return {
          inCooldown: true,
          remainingSec,
          progressPercent: remainingMs === 0 ? 100 : progressPercent,
          isSeasonLocked: isInteractedThisSeason,
          nextSeasonName: nextSeasonConfig.name,
          nextSeasonFullName: nextSeasonConfig.fullName,
        };
      }
    }

    if (isInteractedThisSeason) {
      return {
        inCooldown: true,
        remainingSec: 0,
        progressPercent: 100,
        isSeasonLocked: true,
        nextSeasonName: nextSeasonConfig.name,
        nextSeasonFullName: nextSeasonConfig.fullName,
      };
    }

    return {
      inCooldown: false,
      remainingSec: 0,
      progressPercent: 0,
      isSeasonLocked: false,
      nextSeasonName: nextSeasonConfig.name,
      nextSeasonFullName: nextSeasonConfig.fullName,
    };
  };

  // 渲染带有古典【羁绊加深】朱红印章动效的名士头像（支持复古像素画风与墨印古风）
  const renderAvatarWithSeal = (
    figure: HistoricalFigureBond,
    sizeClass: string = 'w-12 h-12',
    textClass: string = 'text-2xl',
    isModal: boolean = false
  ) => {
    const isTargetOfActiveStamp = activeStamp?.figureId === figure.id;
    const cdStatus = getFigureCooldownStatus(figure);
    const showWatermark = !isTargetOfActiveStamp && cdStatus.inCooldown;
    const pixelSize: PixelAvatarSize = isModal
      ? 'lg'
      : sizeClass.includes('14')
      ? 'lg'
      : sizeClass.includes('10')
      ? 'sm'
      : 'md';

    return (
      <div className={`relative ${sizeClass} shrink-0`}>
        <div
          className={`transition-transform duration-300 ${
            isTargetOfActiveStamp
              ? 'animate-stamp-tremor ring-2 ring-red-600/70 shadow-[0_0_12px_rgba(220,38,38,0.7)] rounded'
              : ''
          }`}
        >
          <PixelFigureAvatar
            figureId={figure.id}
            name={figure.name}
            courtesyName={figure.courtesyName}
            camp={figure.camp}
            archetype={figure.archetype}
            size={pixelSize}
            isAlive={figure.isAlive}
            showCampBadge={true}
            showCampBorder={true}
            avatarChar={figure.avatarChar}
          />
        </div>

        {/* 1. 盖印瞬间的古典仪式感动效: 朱砂墨晕震荡 + 金色羁绊升腾 + 朱印下压 */}
        {isTargetOfActiveStamp && (
          <>
            {/* 朱砂墨圈震荡扩散 */}
            <div className="absolute -inset-1 rounded-full border-2 border-red-500 animate-seal-shockwave pointer-events-none" />

            {/* 金色羁绊数值飞升浮动 */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-30 font-calligraphy text-amber-300 text-sm font-bold whitespace-nowrap animate-float-intimacy drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>+{activeStamp.intimacyGain} 羁绊</span>
            </div>

            {/* 核心朱红方印【羁绊加深】瞬间撞击盖印 */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-seal-slam">
              <div className="w-11 h-11 border-2 border-red-600 bg-red-950/92 text-red-200 rounded-xs flex flex-col items-center justify-center font-calligraphy text-[11px] leading-tight shadow-[0_0_16px_rgba(220,38,38,0.95)] rotate-[-6deg] select-none">
                <div className="border border-red-500/80 w-[36px] h-[36px] flex flex-col items-center justify-center p-0.5">
                  <div className="flex gap-0.5 font-bold tracking-tighter text-red-100">
                    <span>羁</span>
                    <span>绊</span>
                  </div>
                  <div className="flex gap-0.5 font-bold tracking-tighter text-red-200 mt-0.5">
                    <span>加</span>
                    <span>深</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 2. 互动后冷却期间保留的朱砂印契水印 */}
        {showWatermark && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300 opacity-90"
            title="本季已结契寻访，朱印为凭"
          >
            <div className="w-9 h-9 border border-red-600/80 bg-red-950/65 text-red-300 rounded-xs flex flex-col items-center justify-center font-calligraphy text-[9px] leading-none rotate-[-6deg] shadow-sm">
              <div className="border border-red-500/50 w-[30px] h-[30px] flex flex-col items-center justify-center p-0.5">
                <div className="flex gap-0.5 font-bold text-red-200">
                  <span>羁</span>
                  <span>绊</span>
                </div>
                <div className="flex gap-0.5 font-bold text-red-300 mt-0.5">
                  <span>加</span>
                  <span>深</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  const perksInfo = evaluateFigurePerks(knownFigures);
  const unmetRegional = getUnmetRegionalFigures(
    profile.currentProvince,
    knownFigures.map((f) => f.id),
    currentYear
  );

  // All collected boons across profile and known figures
  const collectedBoons = profile.collectedBoons || [];

  // Filter known figures
  const filteredFigures = knownFigures.filter((fig) => {
    if (selectedArchetype === 'ALL') return true;
    return fig.archetype === selectedArchetype;
  });

  const getArchetypeBadge = (archetype: FigureArchetype) => {
    switch (archetype) {
      case 'MARTIAL':
        return {
          label: '勇武过人',
          color: 'text-amber-300 border-amber-600/60 bg-amber-950/30',
          icon: Shield,
        };
      case 'STRATEGIST':
        return {
          label: '才智过人',
          color: 'text-cyan-300 border-cyan-600/60 bg-cyan-950/30',
          icon: Brain,
        };
      case 'WEALTHY':
        return {
          label: '财富雄厚',
          color: 'text-yellow-400 border-yellow-500/60 bg-yellow-950/30',
          icon: Coins,
        };
      case 'HEALER':
        return {
          label: '妙手医圣',
          color: 'text-emerald-300 border-emerald-600/60 bg-emerald-950/30',
          icon: HeartPulse,
        };
      case 'HERMIT':
        return {
          label: '经学名士',
          color: 'text-purple-300 border-purple-600/60 bg-purple-950/30',
          icon: BookOpen,
        };
    }
  };

  const getBoonTypeIcon = (type: BoonType) => {
    switch (type) {
      case 'WEAPON':
        return <Swords className="w-3.5 h-3.5 text-amber-400" />;
      case 'MANUAL':
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case 'INTEL':
        return <Scroll className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TREASURE':
        return <Gem className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  // Perform interaction with seal stamp animation & cooldown initiation
  const handlePerformInteraction = (
    figure: HistoricalFigureBond,
    option: InteractionOption
  ) => {
    // Check costs
    if (option.statCosts.health && currentStats.health < option.statCosts.health + 5) {
      sound.playPluck(220);
      return;
    }
    if (option.statCosts.wealth && currentStats.wealth < option.statCosts.wealth) {
      sound.playPluck(220);
      return;
    }

    const currentIntimacy = figure.intimacy ?? figure.bondLevel * 25;
    const gain =
      Math.floor(
        Math.random() * (option.intimacyGainMax - option.intimacyGainMin + 1)
      ) + option.intimacyGainMin;
    const newIntimacy = Math.min(100, currentIntimacy + gain);

    const oldLevel = figure.bondLevel;
    const newLevelInfo = getIntimacyLevelInfo(newIntimacy);
    const newLevel = Math.max(oldLevel, newLevelInfo.level);

    const quote = getInteractionQuote(figure, option.type, newLevel);

    // Audio cue: play interaction sound and vermilion seal stamp impact sound
    if (option.type === 'FEAST_GIFT') {
      sound.playCoin();
    } else {
      sound.playPluck(640);
    }
    sound.playSealStamp();

    // 1. 触发【羁绊加深】朱红印章动效
    setActiveStamp({
      figureId: figure.id,
      figureName: figure.name,
      intimacyGain: gain,
      timestamp: Date.now(),
    });
    setIsStamping(true);

    // 2. 启动防过度交互的冷却倒计时 (12秒冷却进度)
    const durationMs = 12000;
    setCooldowns((prev) => ({
      ...prev,
      [figure.id]: {
        startedAt: Date.now(),
        durationMs,
        year: currentYear,
        season: currentSeason,
      },
    }));

    let levelUpNotice: string | undefined;
    if (newLevel > oldLevel) {
      sound.playMilestone();
      levelUpNotice = `【关系精进】与${figure.name}之羁绊升至【${newLevelInfo.title}】（${newLevelInfo.stars}）！可解锁更高名士赐予！`;
    }

    // Build stat gain text
    const gainsList: string[] = [];
    Object.entries(option.archetypeGains).forEach(([k, v]) => {
      const labelMap: Record<string, string> = {
        health: '体魄',
        intellect: '识见',
        martial: '勇略',
        virtue: '仁厚',
        wealth: '家财',
        fortune: '气数',
      };
      gainsList.push(`${labelMap[k] || k} +${v}`);
    });
    const statGainsText = gainsList.join(' · ') || '心怀开阔';

    if (onInteractFigure) {
      onInteractFigure(
        figure.id,
        option.type,
        quote,
        option.statCosts,
        option.archetypeGains,
        gain
      );
    }

    // 短暂留白展现朱砂印章盖下仪式感 (750ms)，随后过渡至名士对白反馈框
    setTimeout(() => {
      setIsStamping(false);
      setInteractingFigure(null);
      setInteractionResult({
        figureName: figure.name,
        optionTitle: option.title,
        quote,
        intimacyGain: gain,
        statGainsText,
        levelUpNotice,
      });
    }, 750);

    // 盖印动效保持2.5秒后优雅转为静态印契
    setTimeout(() => {
      setActiveStamp((curr) => (curr?.figureId === figure.id ? null : curr));
    }, 2500);
  };


  // Claim a boon
  const handleClaim = (figure: HistoricalFigureBond, boon: NobleBoon) => {
    sound.playMilestone();
    if (onClaimBoon) {
      onClaimBoon(figure.id, boon);
    }
    setCelebrationBoon({
      boon,
      figureName: figure.name,
    });
  };

  const currentSeasonConfig = SEASONS_CONFIG[currentSeason];

  return (
    <div className="space-y-6">
      {/* 顶部总览横幅: 名士人脉与特权庇护 */}
      <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#8b261e]/15 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-sm bg-[#8b261e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae8c8] font-calligraphy text-xl shadow">
                仕
              </span>
              <div>
                <h2 className="text-xl font-calligraphy text-[#fae8c8] tracking-wider flex items-center gap-2">
                  天下名仕谱 · 人脉气运与名士赐予
                </h2>
                <p className="text-xs text-[#a89b8d] font-serif">
                  时令流转：公元 {currentYear} 年 · {currentSeasonConfig.fullName}。每季可过访名士增进羁绊，解锁名剑、秘籍或战略情报。
                </p>
              </div>
            </div>

            {/* 人脉与赐予统计指标 */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-serif mt-3 text-[#d5c7b7]">
              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>结识英豪:</span>
                <span className="font-calligraphy text-base text-[#e5c158] font-bold">
                  {knownFigures.length}
                </span>
                <span className="text-[#8c7e72]">人</span>
              </div>

              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>当前健在:</span>
                <span className="font-calligraphy text-base text-emerald-400 font-bold">
                  {knownFigures.filter((f) => f.isAlive).length}
                </span>
                <span className="text-[#8c7e72]">人</span>
              </div>

              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#8b261e]/70 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>获赠珍品:</span>
                <span className="font-calligraphy text-base text-amber-300 font-bold">
                  {collectedBoons.length}
                </span>
                <span className="text-[#8c7e72]">件</span>
              </div>

              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>同郡待识:</span>
                <span className="font-calligraphy text-base text-blue-400 font-bold">
                  {unmetRegional.length}
                </span>
                <span className="text-[#8c7e72]">人</span>
              </div>
            </div>
          </div>

          {/* 活跃特权与庇护汇总 */}
          <div className="bg-[#15120f]/90 border border-[#4a3d31] rounded p-3 min-w-[280px]">
            <div className="text-xs font-serif text-[#d4af37] flex items-center gap-1.5 mb-2 border-b border-[#3d3228] pb-1 font-semibold">
              <Award className="w-3.5 h-3.5" />
              当前生效的名仕庇护特权
            </div>
            {perksInfo.activePerks.length === 0 ? (
              <p className="text-xs text-[#8c7e72] font-serif py-1">
                尚无名士达成相熟深交。每季多登门切磋论道或设宴厚赠，加深羁绊。
              </p>
            ) : (
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 text-xs">
                {perksInfo.fatalDamageProtection && (
                  <div className="flex items-center gap-1.5 text-amber-300 font-serif">
                    <Shield className="w-3 h-3 shrink-0" />
                    <span>【勇武战阵庇护】危急时刻良将援护，降低战死概率</span>
                  </div>
                )}
                {perksInfo.epidemicImmunity && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-serif">
                    <HeartPulse className="w-3 h-3 shrink-0" />
                    <span>【医圣岐黄护体】神医方药调理，免疫恶疾疫病</span>
                  </div>
                )}
                {perksInfo.seasonalWealthYield > 0 && (
                  <div className="flex items-center gap-1.5 text-yellow-300 font-serif">
                    <Coins className="w-3 h-3 shrink-0" />
                    <span>【巨贾资粮接济】岁末商道贴补家资 +{perksInfo.seasonalWealthYield}</span>
                  </div>
                )}
                {perksInfo.activePerks.slice(0, 3).map((p, i) => (
                  <div key={i} className="text-[#c7baa8] font-serif truncate">
                    <span className="text-[#e5c158] font-medium">{p.figureName}</span> · {p.perkTitle}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 视图切换与分类过滤 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3d3228] pb-3">
        {/* 标签切换: 已结识名士 / 名士赐予珍藏 / 同郡待识 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sound.playPluck(523);
              setActiveTab('KNOWN');
            }}
            className={`px-3 py-1.5 text-xs font-serif rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'KNOWN'
                ? 'bg-[#8b261e] text-[#fae8c8] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#a89b8d] hover:text-[#fae8c8] bg-[#211b17] border border-[#3d3228]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            已结识名仕 ({knownFigures.length})
          </button>

          <button
            onClick={() => {
              sound.playPluck(600);
              setActiveTab('BOONS');
            }}
            className={`px-3 py-1.5 text-xs font-serif rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'BOONS'
                ? 'bg-[#8b261e] text-[#fae8c8] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#a89b8d] hover:text-[#fae8c8] bg-[#211b17] border border-[#3d3228]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            名士赐予珍藏 ({collectedBoons.length})
          </button>

          <button
            onClick={() => {
              sound.playPluck(587);
              setActiveTab('REGIONAL');
            }}
            className={`px-3 py-1.5 text-xs font-serif rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REGIONAL'
                ? 'bg-[#8b261e] text-[#fae8c8] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#a89b8d] hover:text-[#fae8c8] bg-[#211b17] border border-[#3d3228]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            本州待识贤士 ({unmetRegional.length})
          </button>
        </div>

        {/* 贤士类型过滤 (在已结识名仕下显示) */}
        {activeTab === 'KNOWN' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-serif">
            <span className="text-[#8c7e72] flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> 流派:
            </span>
            {(
              [
                { key: 'ALL', label: '全部' },
                { key: 'MARTIAL', label: '勇武' },
                { key: 'STRATEGIST', label: '谋略' },
                { key: 'WEALTHY', label: '巨贾' },
                { key: 'HEALER', label: '医圣' },
                { key: 'HERMIT', label: '经学' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  sound.playPluck(600);
                  setSelectedArchetype(tab.key);
                }}
                className={`px-2 py-1 rounded transition-colors cursor-pointer shrink-0 ${
                  selectedArchetype === tab.key
                    ? 'bg-[#3b2e24] text-[#fae8c8] border border-[#6b5541]'
                    : 'text-[#8c7e72] hover:text-[#c7baa8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* 珍宝流派过滤 (在名士赐予珍藏下显示) */}
        {activeTab === 'BOONS' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-serif">
            <span className="text-[#8c7e72] flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> 品类:
            </span>
            {(
              [
                { key: 'ALL', label: '全部' },
                { key: 'WEAPON', label: '名剑神兵' },
                { key: 'MANUAL', label: '兵法绝学' },
                { key: 'INTEL', label: '战略情报' },
                { key: 'TREASURE', label: '传世奇珍' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  sound.playPluck(550);
                  setBoonFilter(tab.key);
                }}
                className={`px-2 py-1 rounded transition-colors cursor-pointer shrink-0 ${
                  boonFilter === tab.key
                    ? 'bg-[#3b2e24] text-[#fae8c8] border border-[#6b5541]'
                    : 'text-[#8c7e72] hover:text-[#c7baa8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 视图内容区 */}
      {activeTab === 'KNOWN' && (
        filteredFigures.length === 0 ? (
          <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-10 text-center text-[#8c7e72] font-serif space-y-3">
            <Users className="w-10 h-10 mx-auto text-[#4a3d31]" />
            <p className="text-base text-[#c7baa8]">
              {selectedArchetype === 'ALL'
                ? '暂未结识此类型的名士。'
                : '暂无该流派的名士挚友。'}
            </p>
            <p className="text-xs text-[#8c7e72]">
              在四季流转与天下大事中，参与行伍、寻访草庐、拜谒名医，即可结识天下豪杰。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFigures.map((figure) => {
              const badge = getArchetypeBadge(figure.archetype);
              const BadgeIcon = badge.icon;
              const intimacy = figure.intimacy ?? figure.bondLevel * 25;
              const bondInfo = getIntimacyLevelInfo(intimacy);
              const boons = getBoonsForFigure(figure, profile.collectedBoons?.map((b) => b.id));
              const cdStatus = getFigureCooldownStatus(figure);
              const isChildhoodFriend =
                figure.relation.includes('竹马') ||
                figure.relation.includes('总角') ||
                figure.relation.includes('同里');

              return (
                <div
                  key={figure.id}
                  className={`bg-[#1c1815] border rounded-md p-4 transition-all duration-200 shadow-md hover:border-[#6b5541] relative overflow-hidden flex flex-col justify-between ${
                    figure.isAlive ? 'border-[#3d3228]' : 'border-[#2e2620] opacity-80'
                  }`}
                >
                  {/* 背景朱印大字水印 */}
                  <div className="absolute -bottom-6 -right-3 text-7xl font-calligraphy text-[#2b221b]/40 select-none pointer-events-none">
                    {figure.avatarChar}
                  </div>

                  <div>
                    {/* 头部信息栏 */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        {/* 人物汉字头像（含【羁绊加深】朱红印章动效与印契水印） */}
                        {renderAvatarWithSeal(figure, 'w-12 h-12', 'text-2xl')}

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-calligraphy text-[#fae8c8] tracking-wider">
                              {figure.name}
                            </h3>
                            <span className="text-xs font-serif text-[#a89b8d]">
                              字 {figure.courtesyName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#d4af37] font-serif">
                              {figure.campLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 贤士流派徽章 */}
                      <div
                        className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 font-serif ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </div>
                    </div>

                    {/* 羁绊关系、年岁状态与互动触发栏 */}
                    <div className="space-y-2 mb-3 bg-[#15120f] border border-[#2e2620] rounded p-2.5">
                      <div className="flex flex-wrap items-center justify-between text-xs font-serif">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#fae8c8] font-medium">{figure.relation}</span>
                          {isChildhoodFriend && (
                            <span className="text-[10px] bg-[#8b261e]/40 border border-[#8b261e] text-[#fae8c8] px-1 rounded">
                              总角竹马
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={figure.isAlive ? 'text-emerald-400' : 'text-[#7a6f65]'}>
                            {figure.isAlive
                              ? `现年 ${figure.currentAge} 岁`
                              : `已故 · 享年 ${figure.deathYear - figure.birthYear} 岁`}
                          </span>
                        </div>
                      </div>

                      {/* 羁绊度详细刻度与进度条 */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-serif mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-mono ${bondInfo.color}`}>
                              {bondInfo.stars} {bondInfo.title}
                            </span>
                            <span className="text-[#8c7e72]">({intimacy}/100)</span>
                          </div>
                          <span className="text-[#8c7e72] text-[10px]">
                            {intimacy >= 90
                              ? '已达至高生死托付'
                              : `距【${bondInfo.nextTitle}】需 ${bondInfo.nextThreshold - intimacy} 羁绊`}
                          </span>
                        </div>
                        <div className="w-full bg-[#241e19] h-2 rounded-full overflow-hidden border border-[#3e3227]">
                          <div
                            className="bg-gradient-to-r from-[#8b261e] via-[#c28422] to-[#e5c158] h-full transition-all duration-300 rounded-full"
                            style={{ width: `${Math.max(6, intimacy)}%` }}
                          />
                        </div>
                      </div>

                      {/* 互动动作触发按钮与可视化冷却倒计时 */}
                      <div className="pt-2 border-t border-[#292019] flex items-center justify-between">
                        {figure.isAlive ? (
                          cdStatus.inCooldown ? (
                            <div className="w-full relative overflow-hidden rounded bg-[#16120f] border border-[#423328] p-2 shadow-inner space-y-1.5">
                              {/* Animated Cooldown Progress Bar Fill */}
                              <div
                                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#8b261e]/45 via-[#995c23]/40 to-[#c28422]/35 transition-all duration-200 ease-linear pointer-events-none"
                                style={{ width: `${cdStatus.progressPercent}%` }}
                              />
                              <div className="absolute inset-0 cooldown-shimmer-bg pointer-events-none" />

                              {/* Header line of cooldown */}
                              <div className="relative z-10 flex items-center justify-between text-xs font-serif">
                                <div className="flex items-center gap-1.5 text-[#fae8c8]">
                                  {cdStatus.remainingSec > 0 ? (
                                    <Hourglass className="w-3.5 h-3.5 text-[#e5c158] animate-spin" style={{ animationDuration: '3s' }} />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  )}
                                  <span className="font-medium text-[#fae8c8]">
                                    {cdStatus.remainingSec > 0
                                      ? `时令调息中 · 倒计时 ${cdStatus.remainingSec}s`
                                      : `调息已毕 · 待${cdStatus.nextSeasonName}季复至`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-mono text-[#d4af37] font-semibold">
                                    {cdStatus.progressPercent}%
                                  </span>
                                </div>
                              </div>

                              {/* Progress track bar */}
                              <div className="relative z-10 w-full bg-[#0e0c0a]/80 h-1.5 rounded-full overflow-hidden border border-[#382b21]">
                                <div
                                  className="bg-gradient-to-r from-[#8b261e] via-[#c28422] to-[#e5c158] h-full transition-all duration-200 rounded-full"
                                  style={{ width: `${cdStatus.progressPercent}%` }}
                                />
                              </div>

                              {/* Footer status explaining next season */}
                              <div className="relative z-10 flex items-center justify-between text-[10px] text-[#9c8e80] font-serif pt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#7a6d60]" />
                                  每季限修好一次 · 避免过度消耗
                                </span>
                                <span className="text-[#c2983b]">
                                  {cdStatus.remainingSec > 0
                                    ? `距下季约 ${cdStatus.remainingSec} 秒`
                                    : `待推进至【${cdStatus.nextSeasonFullName}】`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                sound.playPluck(540);
                                setInteractingFigure(figure);
                              }}
                              className="w-full py-1.5 px-3 rounded bg-gradient-to-r from-[#382b21] to-[#453427] hover:from-[#4d3a2b] hover:to-[#574332] text-[#fae8c8] hover:text-[#fff5e6] border border-[#d4af37]/40 shadow-sm flex items-center justify-center gap-2 text-xs font-serif cursor-pointer transition-all hover:shadow-[0_0_8px_rgba(212,175,55,0.2)] active:scale-[0.99]"
                            >
                              <Wine className="w-3.5 h-3.5 text-[#e5c158]" />
                              <span>寻访过从 · 登门切磋论道 / 设宴备礼</span>
                            </button>
                          )
                        ) : (
                          <div className="w-full py-1.5 px-2.5 rounded bg-[#171411] text-[#6b5e54] border border-[#241e19] text-center text-[11px] font-serif">
                            该名士已故去，空余史册遗芳
                          </div>
                        )}
                      </div>
                    </div>


                    {/* 名士赐予奖励展示栏 (高羁绊解锁) */}
                    <div className="bg-[#191512] border border-[#382b22] rounded p-2.5 mb-3">
                      <div className="flex items-center justify-between text-xs font-serif text-[#d4af37] mb-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          名士赐予 (莫逆 / 生死托付)
                        </span>
                        <span className="text-[10px] text-[#8c7e72]">
                          达到羁绊门槛即可领受神兵秘籍
                        </span>
                      </div>

                      <div className="space-y-2">
                        {boons.map((boon) => {
                          const isLevelMet = figure.bondLevel >= boon.requiredBondLevel;
                          const isClaimed = Boolean(boon.claimed);

                          return (
                            <div
                              key={boon.id}
                              className={`p-2 rounded border text-xs font-serif flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                isClaimed
                                  ? 'bg-[#1e231d] border-[#2f422e] text-[#b4cca0]'
                                  : isLevelMet
                                  ? 'bg-[#282119] border-[#6b5541] text-[#fae8c8]'
                                  : 'bg-[#151210] border-[#29201a] text-[#7a6f65]'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  {getBoonTypeIcon(boon.type)}
                                  <span className="font-medium text-[#fae8c8]">{boon.name}</span>
                                  <span className="text-[10px] px-1 py-0.2 rounded bg-[#100d0b] border border-[#3d3228] text-[#d4af37]">
                                    {boon.typeLabel}
                                  </span>
                                  <span className="text-[10px] text-[#8c7e72]">
                                    {boon.requiredBondLevel === 3 ? '【需莫逆】' : '【需生死托付】'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#a89b8d] line-clamp-1">
                                  {boon.description}
                                </p>
                                <div className="text-[10px] text-[#c2983b] flex items-center gap-2">
                                  <span>加成: {boon.specialEffect}</span>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isClaimed ? (
                                  <span className="px-2 py-0.5 rounded bg-[#1f2e1d] text-emerald-400 border border-[#2f4a2d] text-[11px] flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> 已领受
                                  </span>
                                ) : isLevelMet ? (
                                  <button
                                    onClick={() => handleClaim(figure, boon)}
                                    className="px-2.5 py-1 rounded bg-[#8b261e] hover:bg-[#a32e24] text-[#fae8c8] border border-[#d4af37]/60 text-xs font-serif cursor-pointer shadow flex items-center gap-1 animate-pulse"
                                  >
                                    <Sparkles className="w-3 h-3 text-yellow-300" />
                                    <span>领受赐予</span>
                                  </button>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-[#14110e] text-[#6b5f54] border border-[#231b15] text-[11px] flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> 未解锁
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 动态成长五维属性条 */}
                    <div className="space-y-1.5 mb-3 bg-[#171310] p-2.5 rounded border border-[#2b221b]">
                      <div className="text-[11px] text-[#8c7e72] font-serif flex justify-between mb-1">
                        <span>岁稔心智 · 当前五维演化</span>
                        <span>{currentYear}年 实况</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-serif">
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">体魄</div>
                          <div className="font-calligraphy text-amber-200">
                            {figure.currentStats.health}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">识见</div>
                          <div className="font-calligraphy text-cyan-200">
                            {figure.currentStats.intellect}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">勇略</div>
                          <div className="font-calligraphy text-red-200">
                            {figure.currentStats.martial}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">仁厚</div>
                          <div className="font-calligraphy text-emerald-200">
                            {figure.currentStats.virtue}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">家财</div>
                          <div className="font-calligraphy text-yellow-200">
                            {figure.currentStats.wealth}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 专属庇护特权 */}
                    <div className="bg-[#211a15] border border-[#423328] rounded p-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#e5c158] font-serif font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                        <span>{figure.perkTitle}</span>
                      </div>
                      <p className="text-[11px] text-[#b3a596] font-serif mt-0.5 leading-relaxed">
                        {figure.perkEffect}
                      </p>
                    </div>

                    {/* 动态年岁交谈对白 */}
                    <div className="bg-[#14110e] border-l-2 border-[#8b261e] p-2 rounded-r text-xs font-serif text-[#dcd1c4] italic flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#8b261e] shrink-0 mt-0.5" />
                      <div>
                        <span className="not-italic text-[#8c7e72] mr-1">言道:</span>
                        “{figure.lastSpoken}”
                      </div>
                    </div>
                  </div>

                  {/* 籍贯信息底栏 */}
                  <div className="mt-3 pt-2 border-t border-[#2b221b] flex items-center justify-between text-[11px] text-[#8c7e72] font-serif">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#6b5541]" />
                      籍贯: {figure.birthplace}
                    </span>
                    <span>于公元 {figure.metYear} 年相识</span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 视图: 名士赐予珍藏阁 */}
      {activeTab === 'BOONS' && (
        <div className="space-y-5">
          <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-4 text-xs font-serif text-[#a89b8d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-calligraphy text-[#fae8c8] tracking-wider mb-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37]" />
                传世珍宝阁 · 名士赠礼录
              </h3>
              <p>
                天下名士感念生死托付之义，所赠名剑、古兵法秘籍与战略舆图皆在此珍藏。
              </p>
            </div>
            <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] shrink-0 text-center">
              <span className="text-[#8c7e72]">已集齐珍品: </span>
              <span className="font-calligraphy text-base text-[#e5c158] font-bold">
                {collectedBoons.length}
              </span>
              <span className="text-[#8c7e72]"> 件</span>
            </div>
          </div>

          {collectedBoons.length === 0 ? (
            <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-12 text-center text-[#8c7e72] font-serif space-y-3">
              <Award className="w-12 h-12 mx-auto text-[#4a3d31]" />
              <p className="text-base text-[#c7baa8]">
                尚无名士赐予的传世珍品。
              </p>
              <p className="text-xs text-[#8c7e72] max-w-md mx-auto">
                在每季流转中，多消耗体力或家财寻访已结识的名士，将羁绊提升至【莫逆同道】（60点）或【生死托付】（90点），即可获赠神兵、秘籍与战略秘札！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectedBoons
                .filter((b) => (boonFilter === 'ALL' ? true : b.type === boonFilter))
                .map((boon) => {
                  return (
                    <div
                      key={boon.id}
                      className="bg-[#1c1815] border border-[#4a3d31] rounded-md p-4 space-y-3 shadow-md relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <PixelFigureAvatar
                              figureId={boon.figureId}
                              name={boon.figureName}
                              size="sm"
                              showCampBadge={false}
                              showCampBorder={true}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1c140e] border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-[10px] shadow">
                              {getBoonTypeIcon(boon.type)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-calligraphy text-base text-[#fae8c8]">
                              {boon.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs font-serif text-[#a89b8d] mt-0.5">
                              <span className="text-[#d4af37]">{boon.typeLabel}</span>
                              <span>·</span>
                              <span>赠予者: {boon.figureName}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-[#1f2b1c] text-emerald-300 border border-[#2f422b] text-[11px] font-serif flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 已领受入行囊
                        </span>
                      </div>

                      <p className="text-xs font-serif text-[#d5c7b7] leading-relaxed bg-[#15120f] p-2.5 rounded border border-[#2c221a]">
                        {boon.description}
                      </p>

                      <div className="space-y-1.5 pt-1 text-xs font-serif">
                        <div className="text-[#e5c158] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                          <span>神物特异: {boon.specialEffect}</span>
                        </div>

                        {/* Stat bonuses preview */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#a89b8d]">
                          <span>属性庇佑:</span>
                          {Object.entries(boon.statBonus).map(([k, v]) => {
                            const labelMap: Record<string, string> = {
                              health: '体魄',
                              intellect: '识见',
                              martial: '勇略',
                              virtue: '仁厚',
                              wealth: '家财',
                              fortune: '气数',
                            };
                            return (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded bg-[#261f18] border border-[#3d3228] text-[#fae8c8]"
                              >
                                {labelMap[k] || k} +{v}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {boon.claimedYear && (
                        <div className="pt-2 border-t border-[#292019] text-[11px] text-[#7a6f65] font-serif flex justify-between">
                          <span>
                            于公元 {boon.claimedYear} 年 {boon.claimedSeasonName || ''} 结契受赠
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* 视图: 本州待识贤士列表 */}
      {activeTab === 'REGIONAL' && (
        <div>
          <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-4 mb-4 text-xs font-serif text-[#a89b8d]">
            当前身处【{profile.currentProvince}】。汉末天下大乱，许多名士尚未涉足朝堂军旅，或结庐隐居，或游历行医，或行商里社。在四季大事或探访中可能偶遇结交。
          </div>

          {unmetRegional.length === 0 ? (
            <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-10 text-center text-[#8c7e72] font-serif">
              当前州域暂无未遇的名士贤达。可待往后游历其他州郡，或投效军旅结交同道。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unmetRegional.map((entry) => {
                const badge = getArchetypeBadge(entry.archetype);
                const BadgeIcon = badge.icon;
                const figureAge = Math.max(0, currentYear - entry.birthYear);

                return (
                  <div
                    key={entry.id}
                    className="bg-[#181412] border border-[#332921] rounded-md p-4 text-xs font-serif space-y-2.5 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <PixelFigureAvatar
                          figureId={entry.id}
                          name={entry.name}
                          courtesyName={entry.courtesyName}
                          camp={entry.camp}
                          size="md"
                          showCampBadge={true}
                          showCampBorder={true}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-calligraphy text-base text-[#fae8c8]">
                              {entry.name}
                            </span>
                            <span className="text-[#8c7e72]">字 {entry.courtesyName}</span>
                          </div>
                          <div className="text-[11px] text-[#d4af37]">{entry.titleTag}</div>
                        </div>
                      </div>

                      <div
                        className={`px-2 py-0.5 rounded border text-[11px] flex items-center gap-1 ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </div>
                    </div>

                    <p className="text-[#b3a596] leading-relaxed line-clamp-2">
                      {entry.historicalBio}
                    </p>

                    <div className="bg-[#1f1915] p-2 rounded border border-[#31251d]">
                      <div className="text-[#e5c158] font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        特权潜质: {entry.perk.title}
                      </div>
                      <div className="text-[#8c7e72] text-[11px] mt-0.5">
                        {entry.perk.buffEffect}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2b221b] flex items-center justify-between text-[#8c7e72] text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {entry.birthplace}
                      </span>
                      <span>当前年岁: 约 {figureAge} 岁</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 弹窗: 寻访互动模态框 */}
      {interactingFigure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#1a1613] border-2 border-[#8b261e] rounded-md max-w-lg w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            {/* 关闭按钮 */}
            <button
              onClick={() => setInteractingFigure(null)}
              className="absolute top-3 right-3 text-[#8c7e72] hover:text-[#fae8c8] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 模态框头部 */}
            <div className="flex items-center gap-3 border-b border-[#3d3228] pb-3">
              {renderAvatarWithSeal(interactingFigure, 'w-14 h-14', 'text-3xl', true)}
              <div>
                <h3 className="font-calligraphy text-lg text-[#fae8c8] tracking-wider flex items-center gap-2">
                  过访拜谒 · {interactingFigure.name}
                  <span className="text-xs font-serif text-[#a89b8d]">
                    （字 {interactingFigure.courtesyName}）
                  </span>
                </h3>
                <p className="text-xs text-[#d4af37] font-serif">
                  {interactingFigure.campLabel} · {interactingFigure.relation}
                </p>
              </div>
            </div>

            {/* 时令流转与每季限制提示 */}
            <div className="bg-[#181310] px-3 py-1.5 rounded border border-[#3e3024] flex items-center justify-between text-[11px] font-serif text-[#c7baa8]">
              <span className="flex items-center gap-1.5 text-[#e5c158]">
                <Clock className="w-3.5 h-3.5" />
                公元 {currentYear} 年 · {currentSeasonConfig.fullName}
              </span>
              <span className="text-[#8c7e72]">
                每季每位名士限修好一次 · 盖印后进入下季前调息倒计时
              </span>
            </div>

            {/* 当前主角体魄与家财状态 */}
            <div className="bg-[#211a15] p-3 rounded border border-[#3e3126] flex items-center justify-between text-xs font-serif text-[#d5c7b7]">
              <span>主角当前身家状态：</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-amber-300">
                  <HeartPulse className="w-3.5 h-3.5" />
                  体魄 {currentStats.health}
                </span>
                <span className="flex items-center gap-1 text-yellow-300">
                  <Coins className="w-3.5 h-3.5" />
                  家财 {currentStats.wealth} 钱
                </span>
              </div>
            </div>

            {/* 互动选项列表 */}
            <div className="space-y-3">
              <div className="text-xs font-serif text-[#8c7e72]">
                选择此季与名士交往之法（每季限行一次）：
              </div>

              {getInteractionOptions(interactingFigure, currentStats).map((opt) => {
                const canAffordHealth =
                  !opt.statCosts.health || currentStats.health >= opt.statCosts.health + 5;
                const canAffordWealth =
                  !opt.statCosts.wealth || currentStats.wealth >= opt.statCosts.wealth;
                const canAfford = canAffordHealth && canAffordWealth;

                return (
                  <div
                    key={opt.type}
                    className={`p-3 rounded border text-xs font-serif space-y-2 transition-colors ${
                      canAfford
                        ? 'bg-[#221c17] border-[#4a3d31] hover:border-[#8b261e]'
                        : 'bg-[#161311] border-[#29221c] opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-[#fae8c8] text-sm flex items-center gap-1.5">
                          <span>{opt.title}</span>
                          <span className="text-[10px] text-[#e5c158] bg-[#14110e] px-1.5 py-0.2 rounded border border-[#3e3125]">
                            {opt.tag}
                          </span>
                        </div>
                        <p className="text-[#a89b8d] mt-1 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <button
                        disabled={!canAfford || isStamping}
                        onClick={() => handlePerformInteraction(interactingFigure, opt)}
                        className={`px-3 py-1.5 rounded text-xs font-serif shrink-0 shadow transition-all ${
                          isStamping && activeStamp?.figureId === interactingFigure.id
                            ? 'bg-[#8b261e] text-[#fae8c8] border border-red-500 cursor-wait animate-pulse'
                            : canAfford
                            ? 'bg-[#8b261e] hover:bg-[#a82e25] text-[#fae8c8] border border-[#d4af37]/60 cursor-pointer active:scale-95'
                            : 'bg-[#211a16] text-[#706459] border border-[#332820] cursor-not-allowed'
                        }`}
                      >
                        {isStamping && activeStamp?.figureId === interactingFigure.id
                          ? '【羁绊加深】朱印落契中...'
                          : canAfford
                          ? '行此交往'
                          : '条件不足'}
                      </button>
                    </div>


                    <div className="pt-2 border-t border-[#2e2620] flex flex-wrap items-center justify-between text-[11px]">
                      <span className="text-[#e07a5f] font-mono">
                        【代价】{opt.costDescription}
                      </span>
                      <span className="text-emerald-400 font-mono">
                        【增益】羁绊 +{opt.intimacyGainMin}~{opt.intimacyGainMax}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-[#8c7e72] font-serif text-center pt-1">
              四季轮转，每季修好一次，深交至莫逆（60点）与生死托付（90点）即可受赠重宝。
            </div>
          </div>
        </div>
      )}

      {/* 弹窗: 互动结果反馈展示 */}
      {interactionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#1c1815] border-2 border-[#d4af37] rounded-md max-w-md w-full p-5 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <div className="w-11 h-11 border-2 border-red-500 bg-red-950/90 text-red-200 rounded-xs flex flex-col items-center justify-center font-calligraphy text-[11px] leading-tight shadow-[0_0_12px_rgba(220,38,38,0.7)] rotate-[-4deg]">
                  <div className="border border-red-400/70 w-[36px] h-[36px] flex flex-col items-center justify-center p-0.5">
                    <div className="flex gap-0.5 font-bold tracking-tighter text-red-100">
                      <span>羁</span>
                      <span>绊</span>
                    </div>
                    <div className="flex gap-0.5 font-bold tracking-tighter text-red-200 mt-0.5">
                      <span>加</span>
                      <span>深</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-calligraphy text-lg text-[#fae8c8] tracking-wider">
                {interactionResult.optionTitle}
              </h3>
              <p className="text-xs text-[#a89b8d] font-serif">
                与 {interactionResult.figureName} 坐谈良久，金石之契已加盖朱印
              </p>
            </div>


            {/* 名士回应引言 */}
            <div className="bg-[#14110e] border-l-2 border-[#d4af37] p-3 rounded-r text-xs font-serif text-[#fae8c8] italic leading-relaxed">
              {interactionResult.quote}
            </div>

            {/* 增益收获 */}
            <div className="bg-[#241e19] p-3 rounded border border-[#3e3126] text-xs font-serif space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400">
                <span>羁绊值提升:</span>
                <span className="font-bold font-mono">+{interactionResult.intimacyGain} 点</span>
              </div>
              <div className="flex items-center justify-between text-[#e5c158]">
                <span>所获造诣成长:</span>
                <span>{interactionResult.statGainsText}</span>
              </div>
              {interactionResult.levelUpNotice && (
                <div className="pt-2 border-t border-[#3b2f24] text-[#fae8c8] text-xs font-medium text-center text-amber-300">
                  {interactionResult.levelUpNotice}
                </div>
              )}
            </div>

            <button
              onClick={() => setInteractionResult(null)}
              className="w-full py-2 rounded bg-[#8b261e] hover:bg-[#a82e25] text-[#fae8c8] border border-[#d4af37]/60 text-xs font-serif cursor-pointer shadow"
            >
              心领神会 · 辞别归舍
            </button>
          </div>
        </div>
      )}

      {/* 弹窗: 领受名士赐予祝捷框 */}
      {celebrationBoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-[#1a1613] border-2 border-[#d4af37] rounded-md max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <PixelFigureAvatar
                  figureId={celebrationBoon.boon.figureId}
                  name={celebrationBoon.figureName}
                  size="lg"
                  showCampBadge={true}
                  showCampBorder={true}
                />
              </div>
              <h3 className="font-calligraphy text-xl text-[#fae8c8] tracking-widest">
                名士赐予 · 传世重宝出世
              </h3>
              <p className="text-xs text-[#d4af37] font-serif">
                {celebrationBoon.figureName} 感念生死相知之契，郑重以宝相赠！
              </p>
            </div>

            <div className="bg-[#241e19] border border-[#5a4837] rounded p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#171310] border border-[#8b261e] flex items-center justify-center text-[#d4af37] shadow">
                  {getBoonTypeIcon(celebrationBoon.boon.type)}
                </div>
                <div>
                  <h4 className="font-calligraphy text-lg text-[#fae8c8]">
                    {celebrationBoon.boon.name}
                  </h4>
                  <span className="text-xs text-[#d4af37] font-serif">
                    【{celebrationBoon.boon.typeLabel}】
                  </span>
                </div>
              </div>

              <p className="text-xs font-serif text-[#e0d6c9] leading-relaxed bg-[#161210] p-3 rounded border border-[#2b211a]">
                {celebrationBoon.boon.description}
              </p>

              <div className="space-y-1 text-xs font-serif">
                <div className="text-[#e5c158] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>神物威能: {celebrationBoon.boon.specialEffect}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#a89b8d]">
                  <span>获得属性加护:</span>
                  {Object.entries(celebrationBoon.boon.statBonus).map(([k, v]) => {
                    const labelMap: Record<string, string> = {
                      health: '体魄',
                      intellect: '识见',
                      martial: '勇略',
                      virtue: '仁厚',
                      wealth: '家财',
                      fortune: '气数',
                    };
                    return (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded bg-[#2e241c] border border-[#524131] text-amber-200 font-mono"
                      >
                        {labelMap[k] || k} +{v}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCelebrationBoon(null)}
              className="w-full py-2.5 rounded bg-[#8b261e] hover:bg-[#a82e25] text-[#fae8c8] border border-[#d4af37] font-serif text-xs cursor-pointer shadow-lg"
            >
              恭敬受赠 · 佩于行囊铭感五内
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
