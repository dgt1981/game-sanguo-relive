import React, { useState, useEffect } from 'react';
import {
  ProvinceId,
  Attributes,
  SeasonalEvent,
  SeasonLogEntry,
  RealisticEnding,
  CompletedLifeRecord,
  LifeChoice,
  SeasonIndex,
  NobleBoon,
  HistoricalFigureBond,
} from './types/game';
import {
  PersonProfile,
  generateRandomBirth,
  generateInitialAttributes,
  getSeasonalEvent,
  generateRealisticEnding,
  SEASONS_CONFIG,
  calculateNaturalPhysiologicalChange,
  getPhysiologicalStage,
} from './services/lifeSimulator';
import { PROVINCES } from './data/regions';
import { sound } from './services/sound';
import { FunTitleInfo, generateFunTitles } from './services/titleGenerator';
import { matchHistoricalFigures, MatchedHistoricalFigure } from './services/historicalFigures';
import { storage, MidGameSaveData } from './services/storage';
import { Header } from './components/Header';
import { LifeAttributeHUD } from './components/LifeAttributeHUD';
import { LifeYearCard } from './components/LifeYearCard';
import { ChronicleTimeline } from './components/ChronicleTimeline';
import { BirthModal } from './components/BirthModal';
import { LifeObituaryModal } from './components/LifeObituaryModal';
import { PeopleGallery } from './components/PeopleGallery';
import { ProvincesGuide } from './components/ProvincesGuide';
import { FiguresNetwork } from './components/FiguresNetwork';
import {
  updateKnownFiguresForSeason,
  evaluateFigurePerks,
  createFigureBond,
} from './services/figuresSimulation';
import { HISTORICAL_FIGURES_CATALOG } from './data/historicalFiguresCatalog';
import { BookmarkCheck, LogOut } from 'lucide-react';
import { getEntryTags } from './utils/chronicleFilter';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'SIMULATION' | 'FIGURES' | 'CHRONICLE' | 'PEOPLE_GALLERY' | 'PROVINCES_GUIDE'
  >('SIMULATION');

  const [isBorn, setIsBorn] = useState(false);
  const [profile, setProfile] = useState<PersonProfile>(() => generateRandomBirth());
  const [stats, setStats] = useState<Attributes>(() => generateInitialAttributes('PEASANT'));

  // Seasonal Time Tracking
  const [year, setYear] = useState(184);
  const [season, setSeason] = useState<SeasonIndex>(0); // 0:春, 1:夏, 2:秋, 3:冬
  const [age, setAge] = useState(0);
  const [seasonLogs, setSeasonLogs] = useState<SeasonLogEntry[]>([]);

  const [currentEvent, setCurrentEvent] = useState<SeasonalEvent>(() =>
    getSeasonalEvent(184, 0, 0, generateRandomBirth(), generateInitialAttributes('PEASANT'))
  );

  const [isGameOver, setIsGameOver] = useState(false);
  const [activeEnding, setActiveEnding] = useState<RealisticEnding | null>(null);
  const [deathReason, setDeathReason] = useState<string | undefined>(undefined);
  const [funTitles, setFunTitles] = useState<FunTitleInfo | null>(null);
  const [matchedFigures, setMatchedFigures] = useState<MatchedHistoricalFigure[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Resume checkpoint from local/PHP storage
  const [resumeSaveData, setResumeSaveData] = useState<MidGameSaveData | null>(() =>
    storage.loadMidGameProgress()
  );

  // Auto-Progression & Speed State
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4 | 8>(1);
  const [wasAutoPausedForChoice, setWasAutoPausedForChoice] = useState(false);

  // Past Lives Records from LocalStorage
  const [records, setRecords] = useState<CompletedLifeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('3k_civilian_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('3k_civilian_records', JSON.stringify(records));
    } catch {}
  }, [records]);

  const handleStartLife = (newProfile: PersonProfile) => {
    const freshProfile: PersonProfile = {
      ...newProfile,
      knownFigures: newProfile.knownFigures || [],
      collectedBoons: newProfile.collectedBoons || [],
      eventFlags: newProfile.eventFlags || {},
    };
    const initStats = generateInitialAttributes(freshProfile.socialClass);
    setProfile(freshProfile);
    setStats(initStats);
    setYear(184);
    setSeason(0);
    setAge(0);
    setIsGameOver(false);
    setActiveEnding(null);
    setDeathReason(undefined);
    setFunTitles(null);
    setResumeSaveData(null);

    const firstEvt = getSeasonalEvent(184, 0, 0, freshProfile, initStats);
    setCurrentEvent(firstEvt);

    // Initial Year 184 Spring Log
    const initLog: SeasonLogEntry = {
      year: 184,
      season: 0,
      seasonName: firstEvt.seasonName,
      age: 0,
      lunarYear: firstEvt.lunarYear,
      macroHistory: firstEvt.macroHistory,
      storySummary: firstEvt.personalStory,
      naturalChangeNote: '【降生人世】初临乱世，襁褓骨软神萌，全赖父母悉心哺育。',
      physiologicalStageName: '襁褓幼婴',
      location: `${newProfile.commandery} · ${newProfile.county}`,
      occupation: newProfile.occupation,
    };
    const initialLogs = [initLog];
    setSeasonLogs(initialLogs);

    setIsBorn(true);
    setActiveTab('SIMULATION');

    // Automatically start seasonal time flowing
    setIsAutoRunning(true);
    setWasAutoPausedForChoice(false);

    // Save initial progress
    storage.saveMidGameProgress({
      playerName: newProfile.name,
      currentYear: 184,
      currentSeason: 0,
      currentAge: 0,
      profile: newProfile,
      stats: initStats,
      seasonLogs: initialLogs,
      currentEvent: firstEvt,
      isAutoRunning: true,
      playbackSpeed: 1,
    });
  };

  const handleToggleSound = () => {
    const m = sound.toggleMute();
    setIsMuted(m);
  };

  // Trigger Ending & Obituary
  const triggerDeath = (
    reason: string,
    finalAge: number,
    finalYear: number,
    finalSeason: SeasonIndex,
    currentStats: Attributes
  ) => {
    setIsAutoRunning(false);
    setWasAutoPausedForChoice(false);

    const ending = generateRealisticEnding(profile, currentStats, finalAge, finalYear, reason);
    setActiveEnding(ending);
    setDeathReason(reason);
    setIsGameOver(true);
    sound.playSealStamp();

    // Generate humorous and distinct titles & badges
    const generatedTitles = generateFunTitles(
      profile,
      currentStats,
      finalAge,
      finalYear,
      finalSeason,
      reason
    );
    setFunTitles(generatedTitles);

    // Calculate matched Three Kingdoms historical figures based on attributes & life course
    const figures = matchHistoricalFigures(
      profile,
      currentStats,
      finalAge,
      finalYear,
      reason,
      ending.tier
    );
    setMatchedFigures(figures);
    const topMatch = figures[0];

    const deathSeasonName = SEASONS_CONFIG[finalSeason]?.name
      ? `${SEASONS_CONFIG[finalSeason].name}季`
      : '冬令';

    // Record into people gallery with historical figure parallels
    const newRecord: CompletedLifeRecord = {
      id: `life_${Date.now()}`,
      name: profile.name,
      courtesyName: profile.courtesyName,
      gender: profile.gender,
      birthYear: 184,
      deathYear: finalYear,
      deathSeason: deathSeasonName,
      deathAge: finalAge,
      birthplace: `${profile.commandery} · ${profile.county}`,
      socialClass: profile.socialClass,
      finalOccupation: profile.occupation,
      ending,
      finalStats: { ...currentStats },
      seasonLogsCount: seasonLogs.length,
      completedAt: new Date().toLocaleDateString('zh-CN'),
      matchedFigureName: topMatch?.name,
      matchedFigureSimilarity: topMatch?.similarityScore,
      matchedFigureTitle: topMatch?.titleTag,
      knownFiguresList: (profile.knownFigures || []).map((f) => `${f.name}（${f.relation}）`),
      militaryCamp: profile.militaryAffiliation?.roleTitle || '乡野布衣',
      campaignsList: profile.militaryAffiliation?.campaigns || [],
      collectedBoonsList: (profile.collectedBoons || []).map((b) => b.name),
    };
    setRecords((prev) => [newRecord, ...prev]);

    // Save & publish to community gallery and clear mid-game resume checkpoint
    storage.publishCompletedLife(newRecord, generatedTitles);
    setResumeSaveData(null);
  };

  // Restart life into another reincarnation (Fix for Issue #1)
  const handleRestartLife = () => {
    sound.playDrum();
    setIsAutoRunning(false);
    setWasAutoPausedForChoice(false);
    setIsGameOver(false);
    setActiveEnding(null);
    setDeathReason(undefined);
    setFunTitles(null);
    setMatchedFigures([]);
    setIsBorn(false);
    storage.clearMidGameProgress();
    setResumeSaveData(null);
    setActiveTab('SIMULATION');
  };

  // Resume mid-game progress
  const handleResumeProgress = () => {
    const save = storage.loadMidGameProgress();
    if (!save) return;
    setProfile(save.profile);
    setStats(save.stats);
    setYear(save.currentYear);
    setSeason(save.currentSeason);
    setAge(save.currentAge);
    setSeasonLogs(save.seasonLogs);
    setCurrentEvent(save.currentEvent);
    setPlaybackSpeed(save.playbackSpeed || 1);
    setIsAutoRunning(false); // start paused so player can orient themselves
    setWasAutoPausedForChoice(false);
    setIsGameOver(false);
    setActiveEnding(null);
    setDeathReason(undefined);
    setFunTitles(null);
    setIsBorn(true);
    setResumeSaveData(null);
    setActiveTab('SIMULATION');
    sound.playSealStamp();
  };

  // Discard mid-game progress
  const handleDiscardResume = () => {
    storage.clearMidGameProgress();
    setResumeSaveData(null);
  };

  // Mid-game manual pause and exit to title
  const handlePauseAndExit = () => {
    sound.playPluck(440);
    setIsAutoRunning(false);
    storage.saveMidGameProgress({
      playerName: profile.name,
      currentYear: year,
      currentSeason: season,
      currentAge: age,
      profile,
      stats,
      seasonLogs,
      currentEvent,
      isAutoRunning: false,
      playbackSpeed,
    });
    setResumeSaveData(storage.loadMidGameProgress());
    setIsBorn(false);
  };

  // Advance 1 Season (四季流转核心逻辑)
  const advanceOneSeason = (
    customChoiceMade?: string,
    statDelta?: Partial<Record<keyof Attributes, number>>,
    overrideProfile?: PersonProfile
  ): boolean => {
    let nextYear = year;
    let nextAge = age;
    const nextSeason = ((season + 1) % 4) as SeasonIndex;

    const currentProf = overrideProfile || profile;

    // If wrapping from Winter to Spring, advance year and age
    if (nextSeason === 0) {
      nextYear += 1;
      nextAge += 1;
    }

    // 1. 先行计算并施加生理年龄与季节自然更迭的基础变化 (Natural Growth & Senescence)
    const naturalRes = calculateNaturalPhysiologicalChange(nextAge, nextSeason, stats);
    const updatedStats: Attributes = { ...stats };

    if (naturalRes.delta) {
      Object.entries(naturalRes.delta).forEach(([k, v]) => {
        const key = k as keyof Attributes;
        updatedStats[key] = Math.max(0, Math.min(100, updatedStats[key] + (v as number)));
      });
    }

    // 2. 然后在自然生长的基础上，叠加重大事件发生与玩家自主抉择的影响 (Event Choices & Consequences)
    if (statDelta) {
      Object.entries(statDelta).forEach(([k, v]) => {
        const key = k as keyof Attributes;
        updatedStats[key] = Math.max(0, Math.min(100, updatedStats[key] + (v as number)));
      });
    }

    // Dynamic Occupation changes according to physiological age and social standing
    let nextOccupation = currentProf.occupation;
    if (nextAge <= 2) {
      nextOccupation = '襁褓幼童';
    } else if (nextAge <= 6) {
      nextOccupation = '龆龀幼子';
    } else if (nextAge <= 13) {
      nextOccupation = '总角童蒙';
    } else if (nextAge <= 18 && (currentProf.occupation === '总角童蒙' || currentProf.occupation === '龆龀幼子' || currentProf.occupation === '襁褓幼童')) {
      nextOccupation = '及冠成丁';
    } else if (nextAge >= 50 && (currentProf.occupation === '及冠成丁' || currentProf.occupation === '乡里耕丁')) {
      nextOccupation = '乡党长者';
    } else if (nextAge >= 65 && currentProf.occupation === '乡党长者') {
      nextOccupation = '里社耆宿';
    }

    // 3. 动态同步已结识名士年岁与五维成长，并结算人脉庇护特权
    const evolvedFigures = updateKnownFiguresForSeason(currentProf.knownFigures || [], nextYear);
    const perks = evaluateFigurePerks(evolvedFigures);

    // 巨贾岁末商道接济
    if (nextSeason === 3 && perks.seasonalWealthYield > 0) {
      updatedStats.wealth = Math.min(100, updatedStats.wealth + perks.seasonalWealthYield);
    }

    const updatedProfile: PersonProfile = {
      ...currentProf,
      occupation: nextOccupation,
      knownFigures: evolvedFigures,
      eventFlags: currentEvent?.eventFlagTriggered
        ? { ...(currentProf.eventFlags || {}), [currentEvent.eventFlagTriggered]: true }
        : currentProf.eventFlags,
    };
    setProfile(updatedProfile);

    // 4. 生死与大寿判定 (含名将救援与神医逆转庇护)
    if (updatedStats.health <= 0) {
      if (perks.fatalDamageProtection && Math.random() < 0.65) {
        updatedStats.health = 24; // 名士挚友舍命驰援护住心脉！
      } else if (perks.epidemicImmunity && Math.random() < 0.7) {
        updatedStats.health = 20; // 杏林神医灵药拔除病根！
      } else {
        triggerDeath('积劳体虚，寿终气竭。', nextAge, nextYear, nextSeason, updatedStats);
        return false;
      }
    }
    if (nextAge >= 85 || nextYear >= 265) {
      triggerDeath('历尽沧桑，见三国归一，寿终正寝。', nextAge, nextYear, nextSeason, updatedStats);
      return false;
    }

    // 3. Generate event
    const nextEvt = getSeasonalEvent(nextYear, nextSeason, nextAge, updatedProfile, updatedStats);
    setYear(nextYear);
    setSeason(nextSeason);
    setAge(nextAge);
    setStats(updatedStats);
    setCurrentEvent(nextEvt);

    // 4. Record to log (包含生理成长足迹与选择影响)
    const logEntry: SeasonLogEntry = {
      year: nextYear,
      season: nextSeason,
      seasonName: nextEvt.seasonName,
      age: nextAge,
      lunarYear: nextEvt.lunarYear,
      macroHistory: nextEvt.macroHistory,
      storySummary: nextEvt.personalStory,
      choiceMade: customChoiceMade,
      statChanges: statDelta,
      naturalChanges: naturalRes.delta,
      naturalChangeNote: naturalRes.naturalNote,
      physiologicalStageName: naturalRes.stage.stageName,
      location: `${updatedProfile.commandery} · ${updatedProfile.county}`,
      occupation: updatedProfile.occupation,
    };
    logEntry.tags = getEntryTags(logEntry);
    const updatedLogs = [...seasonLogs, logEntry];
    setSeasonLogs(updatedLogs);

    // 5. Auto-save mid-game progress
    storage.saveMidGameProgress({
      playerName: updatedProfile.name,
      currentYear: nextYear,
      currentSeason: nextSeason,
      currentAge: nextAge,
      profile: updatedProfile,
      stats: updatedStats,
      seasonLogs: updatedLogs,
      currentEvent: nextEvt,
      isAutoRunning,
      playbackSpeed,
    });

    // Check if new season requires a choice
    const nextHasChoice = Boolean(nextEvt.choice);
    if (nextHasChoice) {
      setIsAutoRunning((currentlyRunning) => {
        if (currentlyRunning) {
          setWasAutoPausedForChoice(true);
          sound.playMilestone();
        }
        return false;
      });
    }

    return nextHasChoice;
  };

  // Speed-based Automatic Tick Effect (Advanced by Season)
  useEffect(() => {
    if (!isAutoRunning || isGameOver || !isBorn || currentEvent.choice) {
      return;
    }

    // Delays per season:
    // 1x: 1100ms per season (~4.4s / year)
    // 2x: 550ms per season (~2.2s / year)
    // 4x: 280ms per season (~1.1s / year)
    // 8x: 130ms per season (~0.5s / year)
    const speedDelays: Record<1 | 2 | 4 | 8, number> = {
      1: 1100,
      2: 550,
      4: 280,
      8: 130,
    };

    const delay = speedDelays[playbackSpeed];

    const timer = setTimeout(() => {
      sound.playPluck(480 + season * 50);
      advanceOneSeason();
    }, delay);

    return () => clearTimeout(timer);
  }, [isAutoRunning, isGameOver, isBorn, currentEvent, playbackSpeed, year, season, age]);

  // Choice Selection
  const handleSelectChoice = (choice: LifeChoice) => {
    // 1. 直接战死/就义判定 (如誓死不降或冲锋阵亡)
    if (choice.isDirectFatal) {
      triggerDeath(choice.fatalDeathReason || '血战沙场，力竭阵亡。', age, year, season, stats);
      return;
    }

    // 2. 基于属性阈值的生死凶险判定
    if (choice.fatalCheck) {
      const check = choice.fatalCheck(stats);
      if (check && check.isFatal) {
        triggerDeath(check.deathReason, age, year, season, stats);
        return;
      }
    }

    // 3. 处理历史人物结交与羁绊 (含动态年岁、五维成长、专属庇护特权)
    let updatedFigures = [...(profile.knownFigures || [])];
    if (choice.figureBond) {
      const fb = choice.figureBond;
      const existIdx = updatedFigures.findIndex((f) => f.id === fb.figureId);
      const catalogEntry = HISTORICAL_FIGURES_CATALOG.find((e) => e.id === fb.figureId);

      if (existIdx >= 0) {
        const curIntimacy = updatedFigures[existIdx].intimacy ?? (updatedFigures[existIdx].bondLevel * 25);
        const nextBond = Math.min(4, updatedFigures[existIdx].bondLevel + 1);
        updatedFigures[existIdx] = {
          ...updatedFigures[existIdx],
          bondLevel: nextBond,
          intimacy: Math.max(nextBond * 25, Math.min(100, curIntimacy + 25)),
          relation: fb.relation,
          lastSpoken: fb.dialogue,
        };
      } else if (catalogEntry) {
        updatedFigures.push(
          createFigureBond(catalogEntry, year, fb.relation, 1, year)
        );
      } else {
        updatedFigures.push({
          id: fb.figureId,
          name: fb.figureName,
          courtesyName: fb.courtesyName,
          title: fb.title,
          camp: fb.camp,
          campLabel: fb.campLabel,
          relation: fb.relation,
          bondLevel: 1,
          intimacy: 25,
          unlockedGifts: [],
          lastSpoken: fb.dialogue,
          metYear: year,
          birthYear: 184 - age,
          deathYear: 245,
          currentAge: age,
          isAlive: true,
          archetype: 'MARTIAL',
          currentStats: { health: 70, intellect: 70, martial: 70, virtue: 70, wealth: 50, fortune: 70 },
          perkTitle: '【义烈相托】',
          perkEffect: '结识汉末同道，共历乱世风云。',
          avatarChar: fb.figureName.slice(-1),
          birthplace: '汉土名城',
          provinceId: profile.currentProvince,
        });
      }
    }

    // 4. 处理军阵所属、从军解锁或下野还乡
    let updatedAffiliation = profile.militaryAffiliation;
    let nextOccupation = profile.occupation;

    if (choice.leaveMilitary) {
      // 玩家主动或被俘后选择下野还乡，恢复平民身份
      updatedAffiliation = undefined;
      nextOccupation = age >= 50 ? '还乡耆宿' : '还乡耕民';
    } else if (choice.campaignUnlock) {
      const cu = choice.campaignUnlock;
      const currentCampaigns = updatedAffiliation?.campaigns || [];
      const nextCampaigns = currentCampaigns.includes(cu.campaignName)
        ? currentCampaigns
        : [...currentCampaigns, cu.campaignName];
      updatedAffiliation = {
        camp: cu.camp,
        commanderName: cu.commander,
        roleTitle: cu.roleTitle,
        enlistYear: updatedAffiliation?.enlistYear || year,
        campaigns: nextCampaigns,
      };
      nextOccupation = cu.roleTitle;
    }

    // 5. 因果链标签增减 (Flags)
    const updatedFlags = { ...(profile.eventFlags || {}) };
    if (choice.eventFlagToSet) {
      if (choice.eventFlagToSet.startsWith('cooldown_fig_')) {
        updatedFlags[choice.eventFlagToSet] = year + 4;
        updatedFlags['last_figure_year'] = year;
        if (choice.figureBond) {
          updatedFlags['last_figure_spoken'] = choice.figureBond.figureId;
        }
      } else {
        updatedFlags[choice.eventFlagToSet] = true;
      }
    }
    if (currentEvent.eventFlagTriggered) {
      updatedFlags[currentEvent.eventFlagTriggered] = true;
    }
    if (choice.eventFlagToRemove) {
      delete updatedFlags[choice.eventFlagToRemove];
    }

    const updatedProf: PersonProfile = {
      ...profile,
      occupation: nextOccupation,
      knownFigures: updatedFigures,
      militaryAffiliation: updatedAffiliation,
      eventFlags: updatedFlags,
    };
    setProfile(updatedProf);

    // 6. 若存在临场生死抉择 (如被俘后是否归降、下野或就义)，留在当前季节供玩家做二次裁决！
    if (choice.followUpChoice) {
      sound.playMilestone();
      const updatedStats: Attributes = { ...stats };
      Object.entries(choice.statChanges).forEach(([k, v]) => {
        const key = k as keyof Attributes;
        updatedStats[key] = Math.max(0, Math.min(100, updatedStats[key] + (v as number)));
      });
      setStats(updatedStats);

      setCurrentEvent((prev) => ({
        ...prev,
        personalStory: `${prev.personalStory}\n\n【局势突变】${choice.outcomeText}`,
        choice: choice.followUpChoice,
      }));
      setIsAutoRunning(false);
      setWasAutoPausedForChoice(true);
      return;
    }

    // 7. 正常推进至下一季
    advanceOneSeason(choice.label, choice.statChanges, updatedProf);

    // If auto-advance was paused for this choice, automatically resume at previous speed!
    if (wasAutoPausedForChoice && !isGameOver) {
      setIsAutoRunning(true);
      setWasAutoPausedForChoice(false);
    }
  };

  // Toggle Auto Run
  const handleToggleAutoRun = () => {
    if (currentEvent.choice) return;
    setIsAutoRunning((prev) => !prev);
    setWasAutoPausedForChoice(false);
  };

  // Change Speed
  const handleChangeSpeed = (newSpeed: 1 | 2 | 4 | 8) => {
    setPlaybackSpeed(newSpeed);
  };

  // Manual Step (+1 Season)
  const handleManualNextSeason = () => {
    if (currentEvent.choice || isAutoRunning) return;
    advanceOneSeason();
  };

  // Province rebirth selection
  const handleSelectProvinceToReborn = (provId: ProvinceId) => {
    const rolled = generateRandomBirth();
    const p = PROVINCES.find((prov) => prov.id === provId);
    if (p) {
      rolled.birthProvince = p.id;
      rolled.currentProvince = p.id;
      rolled.commandery = p.commanderies[Math.floor(Math.random() * p.commanderies.length)];
      rolled.county = p.counties[Math.floor(Math.random() * p.counties.length)];
    }
    handleStartLife(rolled);
  };

  // 名士每季主动互动 (消耗体魄或家财，增进羁绊与自身五维)
  const handleInteractFigure = (
    figureId: string,
    interactionType: 'SPAR_STUDY' | 'FEAST_GIFT' | 'LETTER_GREETING',
    dialogueQuote: string,
    statCosts: Partial<Record<keyof Attributes, number>>,
    statGains: Partial<Record<keyof Attributes, number>>,
    intimacyGain: number
  ) => {
    const figureIndex = (profile.knownFigures || []).findIndex((f) => f.id === figureId);
    if (figureIndex === -1) return;

    const fig = profile.knownFigures[figureIndex];
    const currentIntimacy = fig.intimacy ?? fig.bondLevel * 25;
    const nextIntimacy = Math.min(100, currentIntimacy + intimacyGain);

    let nextBondLevel = fig.bondLevel;
    if (nextIntimacy >= 90) nextBondLevel = 4;
    else if (nextIntimacy >= 60) nextBondLevel = Math.max(3, fig.bondLevel);
    else if (nextIntimacy >= 30) nextBondLevel = Math.max(2, fig.bondLevel);

    const updatedFigure: HistoricalFigureBond = {
      ...fig,
      intimacy: nextIntimacy,
      bondLevel: nextBondLevel,
      lastSpoken: dialogueQuote,
      lastInteractedYear: year,
      lastInteractedSeason: season,
    };

    const nextKnownFigures = [...profile.knownFigures];
    nextKnownFigures[figureIndex] = updatedFigure;

    // Apply stat changes (deduct costs, add gains)
    const nextStats = { ...stats };
    if (statCosts.health) {
      nextStats.health = Math.max(1, nextStats.health - statCosts.health);
    }
    if (statCosts.wealth) {
      nextStats.wealth = Math.max(0, nextStats.wealth - statCosts.wealth);
    }
    Object.entries(statGains).forEach(([k, v]) => {
      const key = k as keyof Attributes;
      nextStats[key] = Math.max(0, Math.min(100, nextStats[key] + (v as number)));
    });

    const updatedProfile: PersonProfile = {
      ...profile,
      knownFigures: nextKnownFigures,
    };

    setStats(nextStats);
    setProfile(updatedProfile);

    // Record an entry in Chronicle so the player's seasonal visits are remembered
    const seasonName = SEASONS_CONFIG[season].name;
    const typeLabelMap = {
      SPAR_STUDY: '切磋论道',
      FEAST_GIFT: '设宴备礼',
      LETTER_GREETING: '修书致意',
    };
    const interactLogNote = `【名士过从】于${seasonName}季寻访${fig.name}（${typeLabelMap[interactionType]}），长谈论世，相知更笃，羁绊值增至 ${nextIntimacy}。`;

    const updatedLogs = [...seasonLogs];
    if (updatedLogs.length > 0) {
      const latestLog = { ...updatedLogs[updatedLogs.length - 1] };
      if (latestLog.year === year && latestLog.season === season) {
        latestLog.storySummary = `${latestLog.storySummary}\n\n${interactLogNote}`;
        updatedLogs[updatedLogs.length - 1] = latestLog;
        setSeasonLogs(updatedLogs);
      }
    }

    // Auto save mid-game progress
    storage.saveMidGameProgress({
      playerName: updatedProfile.name,
      currentYear: year,
      currentSeason: season,
      currentAge: age,
      profile: updatedProfile,
      stats: nextStats,
      seasonLogs: updatedLogs,
      currentEvent,
      isAutoRunning,
      playbackSpeed,
    });
  };

  // 领受名士赐予 (如名剑、秘籍或战略情报)
  const handleClaimBoon = (figureId: string, boon: NobleBoon) => {
    const figureIndex = (profile.knownFigures || []).findIndex((f) => f.id === figureId);
    if (figureIndex === -1) return;

    const fig = profile.knownFigures[figureIndex];
    const claimedList = fig.unlockedGifts || [];
    if (claimedList.includes(boon.id)) return;

    const nextClaimed = [...claimedList, boon.id];
    const updatedFigure: HistoricalFigureBond = {
      ...fig,
      unlockedGifts: nextClaimed,
    };

    const nextKnownFigures = [...profile.knownFigures];
    nextKnownFigures[figureIndex] = updatedFigure;

    // Apply boon's stat bonuses to player
    const nextStats = { ...stats };
    Object.entries(boon.statBonus).forEach(([k, v]) => {
      const key = k as keyof Attributes;
      nextStats[key] = Math.max(0, Math.min(100, nextStats[key] + (v as number)));
    });

    const claimedBoonRecord: NobleBoon = {
      ...boon,
      claimed: true,
      claimedYear: year,
      claimedSeasonName: SEASONS_CONFIG[season].fullName,
    };

    const updatedProfile: PersonProfile = {
      ...profile,
      knownFigures: nextKnownFigures,
      collectedBoons: [...(profile.collectedBoons || []), claimedBoonRecord],
    };

    setStats(nextStats);
    setProfile(updatedProfile);

    // Record this milestone boon in chronicle log
    const boonLogNote = `【名士赐予 · 重宝出世】${fig.name}感念生死契盟，郑重以${boon.name}（${boon.typeLabel}）相赠！${boon.specialEffect}。`;
    const updatedLogs = [...seasonLogs];
    if (updatedLogs.length > 0) {
      const latestLog = { ...updatedLogs[updatedLogs.length - 1] };
      if (latestLog.year === year && latestLog.season === season) {
        latestLog.storySummary = `${latestLog.storySummary}\n\n${boonLogNote}`;
        updatedLogs[updatedLogs.length - 1] = latestLog;
        setSeasonLogs(updatedLogs);
      }
    }

    // Auto save
    storage.saveMidGameProgress({
      playerName: updatedProfile.name,
      currentYear: year,
      currentSeason: season,
      currentAge: age,
      profile: updatedProfile,
      stats: nextStats,
      seasonLogs: updatedLogs,
      currentEvent,
      isAutoRunning,
      playbackSpeed,
    });
  };

  return (
    <div className="min-h-screen bg-[#120f0c] text-[#e8ded2] flex flex-col font-classical paper-pattern selection:bg-[#d4af37] selection:text-[#19130d]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRestart={handleRestartLife}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        knownFiguresCount={profile.knownFigures?.length || 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Birth Modal: "公元184年，你出生了。" (With Mid-Game Resume Checkpoint) */}
        {!isBorn && (
          <BirthModal
            onStartLife={handleStartLife}
            resumeData={resumeSaveData}
            onResume={handleResumeProgress}
            onDiscardResume={handleDiscardResume}
          />
        )}

        {/* Tab 1: Live Simulation */}
        {activeTab === 'SIMULATION' && isBorn && (
          <div className="space-y-5">
            {/* Mid-Game Checkpoint Bar */}
            <div className="flex items-center justify-between text-xs text-[#a29280] px-1 font-classical">
              <span className="flex items-center gap-1.5 text-[#10b981]">
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>已实时存盘 (中途退出可随时继续)</span>
              </span>
              <button
                onClick={handlePauseAndExit}
                className="px-2.5 py-1 rounded bg-[#231b15] hover:bg-[#32251c] border border-[#3e3023] text-[#dcd1c2] hover:text-[#faece0] flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                title="保存当前进度并退出，随时可承接前缘继续"
              >
                <LogOut className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>中途存盘 · 退出到卷首</span>
              </button>
            </div>

            <LifeAttributeHUD
              stats={stats}
              profile={profile}
              year={year}
              season={season}
              age={age}
              lunarYear={currentEvent.lunarYear}
              onNavigateToFigures={() => setActiveTab('FIGURES')}
            />

            {!isGameOver && (
              <LifeYearCard
                currentEvent={currentEvent}
                profile={profile}
                stats={stats}
                isAutoRunning={isAutoRunning}
                playbackSpeed={playbackSpeed}
                wasAutoPausedForChoice={wasAutoPausedForChoice}
                onToggleAutoRun={handleToggleAutoRun}
                onChangeSpeed={handleChangeSpeed}
                onManualNextSeason={handleManualNextSeason}
                onSelectChoice={handleSelectChoice}
                isProcessing={isProcessing}
              />
            )}
          </div>
        )}

        {/* Tab: Figures Network (天下名仕与人脉气运) */}
        {activeTab === 'FIGURES' && isBorn && (
          <div className="space-y-6">
            <LifeAttributeHUD
              stats={stats}
              profile={profile}
              year={year}
              season={season}
              age={age}
              lunarYear={currentEvent.lunarYear}
              onNavigateToFigures={() => setActiveTab('FIGURES')}
            />
            <FiguresNetwork
              knownFigures={profile.knownFigures || []}
              profile={profile}
              currentYear={year}
              currentSeason={season}
              currentStats={stats}
              onInteractFigure={handleInteractFigure}
              onClaimBoon={handleClaimBoon}
            />
          </div>
        )}

        {/* Tab 2: Chronicle Timeline */}
        {activeTab === 'CHRONICLE' && isBorn && (
          <div className="space-y-6">
            <LifeAttributeHUD
              stats={stats}
              profile={profile}
              year={year}
              season={season}
              age={age}
              lunarYear={currentEvent.lunarYear}
              onNavigateToFigures={() => setActiveTab('FIGURES')}
            />
            <ChronicleTimeline logs={seasonLogs} characterName={profile.name} />
          </div>
        )}

        {/* Tab 3: People Gallery (万民谱牒 & PHP+MySQL架构) */}
        {activeTab === 'PEOPLE_GALLERY' && (
          <PeopleGallery records={records} onClearRecords={() => setRecords([])} />
        )}

        {/* Tab 4: Fourteen Provinces Guide */}
        {activeTab === 'PROVINCES_GUIDE' && (
          <ProvincesGuide onSelectProvinceToReborn={handleSelectProvinceToReborn} />
        )}

        {/* Obituary Modal when life ends */}
        {isGameOver && activeEnding && (
          <LifeObituaryModal
            ending={activeEnding}
            profile={profile}
            finalStats={stats}
            deathAge={age}
            deathYear={year}
            deathSeason={season}
            seasonLogs={seasonLogs}
            deathReason={deathReason}
            funTitles={
              funTitles ||
              generateFunTitles(profile, stats, age, year, season, deathReason)
            }
            matchedFigures={matchedFigures}
            onRestart={handleRestartLife}
          />
        )}
      </main>

      {/* Classical Quiet Footer */}
      <footer className="border-t border-[#2e241b] py-6 text-center text-xs text-[#7d6e5d]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-calligraphy text-sm text-[#b09e8b]">公元184年 · 汉末四季人生录</span>
            <span>·</span>
            <span>“你不知道未来会遇见谁，大多数人终其一生都不会成为名将。”</span>
          </div>
          <div>
            <span>四季流转（春·夏·秋·冬）· 1×/2×/4×/8× · 遇要冲自歇</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
