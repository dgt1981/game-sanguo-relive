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
} from './types/game';
import {
  PersonProfile,
  generateRandomBirth,
  generateInitialAttributes,
  getSeasonalEvent,
  generateRealisticEnding,
  SEASONS_CONFIG,
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
import { BookmarkCheck, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'SIMULATION' | 'CHRONICLE' | 'PEOPLE_GALLERY' | 'PROVINCES_GUIDE'
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

  // Handle Birth Setup with Custom Name & Hometown
  const handleStartLife = (newProfile: PersonProfile) => {
    const initStats = generateInitialAttributes(newProfile.socialClass);
    setProfile(newProfile);
    setStats(initStats);
    setYear(184);
    setSeason(0);
    setAge(0);
    setIsGameOver(false);
    setActiveEnding(null);
    setDeathReason(undefined);
    setFunTitles(null);
    setResumeSaveData(null);

    const firstEvt = getSeasonalEvent(184, 0, 0, newProfile, initStats);
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
    statDelta?: Partial<Record<keyof Attributes, number>>
  ): boolean => {
    let nextYear = year;
    let nextAge = age;
    const nextSeason = ((season + 1) % 4) as SeasonIndex;

    // If wrapping from Winter to Spring, advance year and age
    if (nextSeason === 0) {
      nextYear += 1;
      nextAge += 1;
    }

    // 1. Calculate updated stats
    const updatedStats: Attributes = { ...stats };
    if (statDelta) {
      Object.entries(statDelta).forEach(([k, v]) => {
        const key = k as keyof Attributes;
        updatedStats[key] = Math.max(0, Math.min(100, updatedStats[key] + (v as number)));
      });
    }

    // Natural aging effects past age 50 (subtle winter decay)
    if (nextAge > 50 && nextSeason === 3) {
      updatedStats.health = Math.max(0, updatedStats.health - 1);
    }
    if (nextAge > 65 && (nextSeason === 1 || nextSeason === 3)) {
      updatedStats.health = Math.max(0, updatedStats.health - 1);
    }

    // Dynamic Occupation changes
    let nextOccupation = profile.occupation;
    if (nextAge === 4) nextOccupation = '总角稚子';
    if (nextAge === 7) nextOccupation = '放牛/学步童蒙';
    if (nextAge === 14) nextOccupation = '及笄成丁';
    if (nextAge === 18 && profile.occupation === '及笄成丁') nextOccupation = '乡里耕丁';
    if (nextAge >= 50 && profile.occupation === '乡里耕丁') nextOccupation = '乡党长者';

    const updatedProfile = { ...profile, occupation: nextOccupation };
    setProfile(updatedProfile);

    // 2. Health & Old age check
    if (updatedStats.health <= 0) {
      triggerDeath('积劳体虚，寿终气竭。', nextAge, nextYear, nextSeason, updatedStats);
      return false;
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

    // 4. Record to log
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
      location: `${updatedProfile.commandery} · ${updatedProfile.county}`,
      occupation: updatedProfile.occupation,
    };
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
    if (choice.fatalCheck) {
      const check = choice.fatalCheck(stats);
      if (check && check.isFatal) {
        triggerDeath(check.deathReason, age, year, season, stats);
        return;
      }
    }

    // Advance with the choice made
    advanceOneSeason(choice.label, choice.statChanges);

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

  return (
    <div className="min-h-screen bg-[#120f0c] text-[#e8ded2] flex flex-col font-classical paper-pattern selection:bg-[#d4af37] selection:text-[#19130d]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRestart={handleRestartLife}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
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
