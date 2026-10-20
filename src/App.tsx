import React, { useState, useEffect, useRef } from 'react';
import {
  ProvinceId,
  SocialClass,
  Attributes,
  YearlyEvent,
  YearLogEntry,
  RealisticEnding,
  CompletedLifeRecord,
  LifeChoice,
} from './types/game';
import {
  PersonProfile,
  generateRandomBirth,
  generateInitialAttributes,
  getYearlyEvent,
  generateRealisticEnding,
} from './services/lifeSimulator';
import { PROVINCES } from './data/regions';
import { sound } from './services/sound';
import { Header } from './components/Header';
import { LifeAttributeHUD } from './components/LifeAttributeHUD';
import { LifeYearCard } from './components/LifeYearCard';
import { ChronicleTimeline } from './components/ChronicleTimeline';
import { BirthModal } from './components/BirthModal';
import { LifeObituaryModal } from './components/LifeObituaryModal';
import { PeopleGallery } from './components/PeopleGallery';
import { ProvincesGuide } from './components/ProvincesGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'SIMULATION' | 'CHRONICLE' | 'PEOPLE_GALLERY' | 'PROVINCES_GUIDE'
  >('SIMULATION');

  const [isBorn, setIsBorn] = useState(false);
  const [profile, setProfile] = useState<PersonProfile>(() => generateRandomBirth());
  const [stats, setStats] = useState<Attributes>(() => generateInitialAttributes('PEASANT'));

  const [year, setYear] = useState(184);
  const [age, setAge] = useState(0);
  const [yearLogs, setYearLogs] = useState<YearLogEntry[]>([]);

  const [currentEvent, setCurrentEvent] = useState<YearlyEvent>(() =>
    getYearlyEvent(184, 0, generateRandomBirth(), generateInitialAttributes('PEASANT'))
  );

  const [isGameOver, setIsGameOver] = useState(false);
  const [activeEnding, setActiveEnding] = useState<RealisticEnding | null>(null);
  const [deathReason, setDeathReason] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  // Handle Birth Setup
  const handleStartLife = (newProfile: PersonProfile) => {
    const initStats = generateInitialAttributes(newProfile.socialClass);
    setProfile(newProfile);
    setStats(initStats);
    setYear(184);
    setAge(0);
    setYearLogs([]);
    setIsGameOver(false);
    setActiveEnding(null);
    setDeathReason(undefined);

    const firstEvt = getYearlyEvent(184, 0, newProfile, initStats);
    setCurrentEvent(firstEvt);

    // Initial Year 0 Log
    const initLog: YearLogEntry = {
      year: 184,
      age: 0,
      lunarYear: firstEvt.lunarYear,
      macroHistory: firstEvt.macroHistory,
      storySummary: firstEvt.personalStory,
      location: `${newProfile.commandery} · ${newProfile.county}`,
      occupation: newProfile.occupation,
    };
    setYearLogs([initLog]);

    setIsBorn(true);
    setActiveTab('SIMULATION');

    // Automatically start time flowing!
    setIsAutoRunning(true);
    setWasAutoPausedForChoice(false);
  };

  const handleToggleSound = () => {
    const m = sound.toggleMute();
    setIsMuted(m);
  };

  // Trigger Ending & Obituary
  const triggerDeath = (reason: string, finalAge: number, finalYear: number, currentStats: Attributes) => {
    setIsAutoRunning(false);
    setWasAutoPausedForChoice(false);

    const ending = generateRealisticEnding(profile, currentStats, finalAge, finalYear, reason);
    setActiveEnding(ending);
    setDeathReason(reason);
    setIsGameOver(true);
    sound.playSealStamp();

    // Record into people gallery
    const newRecord: CompletedLifeRecord = {
      id: `life_${Date.now()}`,
      name: profile.name,
      birthYear: 184,
      deathYear: finalYear,
      deathAge: finalAge,
      birthplace: `${profile.commandery} · ${profile.county}`,
      socialClass: profile.socialClass,
      finalOccupation: profile.occupation,
      ending,
      finalStats: { ...currentStats },
      yearLogsCount: yearLogs.length,
      completedAt: new Date().toLocaleDateString('zh-CN'),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  // Advance 1 Year
  const advanceOneYear = (
    customChoiceMade?: string,
    statDelta?: Partial<Record<keyof Attributes, number>>
  ): boolean => {
    const nextYear = year + 1;
    const nextAge = age + 1;

    // 1. Calculate updated stats
    const updatedStats: Attributes = { ...stats };
    if (statDelta) {
      Object.entries(statDelta).forEach(([k, v]) => {
        const key = k as keyof Attributes;
        updatedStats[key] = Math.max(0, Math.min(100, updatedStats[key] + (v as number)));
      });
    }

    // Natural aging effects past age 45
    if (nextAge > 50) {
      updatedStats.health = Math.max(0, updatedStats.health - 1);
    }
    if (nextAge > 65) {
      updatedStats.health = Math.max(0, updatedStats.health - 2);
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
      triggerDeath('积劳体虚，寿终气竭。', nextAge, nextYear, updatedStats);
      return false;
    }
    if (nextAge >= 85 || nextYear >= 265) {
      triggerDeath('历尽沧桑，见三国归一，寿终正寝。', nextAge, nextYear, updatedStats);
      return false;
    }

    // 3. Generate event
    const nextEvt = getYearlyEvent(nextYear, nextAge, updatedProfile, updatedStats);
    setYear(nextYear);
    setAge(nextAge);
    setStats(updatedStats);
    setCurrentEvent(nextEvt);

    // 4. Record to log
    const logEntry: YearLogEntry = {
      year: nextYear,
      age: nextAge,
      lunarYear: nextEvt.lunarYear,
      macroHistory: nextEvt.macroHistory,
      storySummary: nextEvt.personalStory,
      choiceMade: customChoiceMade,
      statChanges: statDelta,
      location: `${updatedProfile.commandery} · ${updatedProfile.county}`,
      occupation: updatedProfile.occupation,
    };
    setYearLogs((prev) => [...prev, logEntry]);

    // Check if new year requires a choice
    const nextHasChoice = Boolean(nextEvt.choice);
    if (nextHasChoice) {
      // Pause automatic time flow for choice
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

  // Speed-based Automatic Tick Effect
  useEffect(() => {
    if (!isAutoRunning || isGameOver || !isBorn || currentEvent.choice) {
      return;
    }

    // Interval delays according to speed
    const speedDelays: Record<1 | 2 | 4 | 8, number> = {
      1: 1500, // 1.5s per year at 1x
      2: 750,  // 0.75s per year at 2x
      4: 380,  // 0.38s per year at 4x
      8: 180,  // 0.18s per year at 8x
    };

    const delay = speedDelays[playbackSpeed];

    const timer = setTimeout(() => {
      sound.playPluck(500 + (age % 5) * 45);
      advanceOneYear();
    }, delay);

    return () => clearTimeout(timer);
  }, [isAutoRunning, isGameOver, isBorn, currentEvent, playbackSpeed, year, age]);

  // Choice Selection
  const handleSelectChoice = (choice: LifeChoice) => {
    // Check fatal check
    if (choice.fatalCheck) {
      const check = choice.fatalCheck(stats);
      if (check && check.isFatal) {
        triggerDeath(check.deathReason, age, year, stats);
        return;
      }
    }

    // Advance with the choice
    advanceOneYear(choice.label, choice.statChanges);

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

  // Manual Step
  const handleManualNextYear = () => {
    if (currentEvent.choice || isAutoRunning) return;
    advanceOneYear();
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
        onRestart={() => {
          setIsAutoRunning(false);
          setIsBorn(false);
        }}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Birth Modal: "公元184年，你出生了。" */}
        {!isBorn && <BirthModal onStartLife={handleStartLife} />}

        {/* Tab 1: Live Simulation */}
        {activeTab === 'SIMULATION' && isBorn && (
          <div className="space-y-6">
            <LifeAttributeHUD
              stats={stats}
              profile={profile}
              year={year}
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
                onManualNextYear={handleManualNextYear}
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
              age={age}
              lunarYear={currentEvent.lunarYear}
            />
            <ChronicleTimeline logs={yearLogs} characterName={profile.name} />
          </div>
        )}

        {/* Tab 3: People Gallery (万民谱牒) */}
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
            yearLogs={yearLogs}
            deathReason={deathReason}
            onRestart={() => {
              setIsAutoRunning(false);
              setIsBorn(false);
            }}
          />
        )}
      </main>

      {/* Classical Quiet Footer */}
      <footer className="border-t border-[#2e241b] py-6 text-center text-xs text-[#7d6e5d]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-calligraphy text-sm text-[#b09e8b]">公元184年 · 汉末人生录</span>
            <span>·</span>
            <span>“你不知道未来会遇见谁，大多数人终其一生都不会成为名将。”</span>
          </div>
          <div>
            <span>自动岁月流转 (1×/2×/4×/8×) · 遇要冲自歇</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
