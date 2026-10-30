import React, { useEffect } from 'react';
import { SeasonIndex } from '../types/game';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import { sound } from '../services/sound';
import {
  Play,
  Pause,
  StepForward,
  Zap,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export interface TimeFlowControlBarProps {
  year: number;
  season: SeasonIndex;
  age: number;
  lunarYear: string;
  seasonMonths: string;
  profile?: PersonProfile;
  isAutoRunning: boolean;
  playbackSpeed: 1 | 2 | 4 | 8;
  hasChoice: boolean;
  pendingChoiceTitle?: string;
  pendingChoicePrompt?: string;
  isProcessing?: boolean;
  onToggleAutoRun: () => void;
  onChangeSpeed: (speed: 1 | 2 | 4 | 8) => void;
  onManualNextSeason: () => void;
  activeTab: 'SIMULATION' | 'FIGURES' | 'CHRONICLE' | 'PEOPLE_GALLERY' | 'PROVINCES_GUIDE';
  onNavigateToSimulation: () => void;
}

export const TimeFlowControlBar: React.FC<TimeFlowControlBarProps> = ({
  year,
  season,
  age,
  lunarYear,
  seasonMonths,
  isAutoRunning,
  playbackSpeed,
  hasChoice,
  pendingChoiceTitle,
  isProcessing = false,
  onToggleAutoRun,
  onChangeSpeed,
  onManualNextSeason,
  activeTab,
  onNavigateToSimulation,
}) => {
  const seasonCfg = SEASONS_CONFIG[season];

  // Optional keyboard shortcut: Spacebar to toggle Play/Pause when not typing in form inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (!hasChoice && !isProcessing) {
          sound.playPluck(isAutoRunning ? 440 : 660);
          onToggleAutoRun();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChoice, isProcessing, isAutoRunning, onToggleAutoRun]);

  return (
    <section
      aria-label="岁月流转控制栏"
      className="w-full bg-[#16120e]/95 backdrop-blur-md border-b border-[#3b2d20] shadow-md transition-colors relative z-30 select-none"
    >
      {/* Seasonal decorative hairline */}
      <div
        className="h-[2px] w-full transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${seasonCfg.color}90 30%, ${seasonCfg.color} 50%, ${seasonCfg.color}90 70%, transparent)`,
        }}
      />

      <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs whitespace-nowrap overflow-x-auto no-scrollbar">
        {/* Left: Seasonal Time Information (Single Line, No Protagonist Info) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#201812] px-2.5 py-1 rounded border border-[#3f3022]">
            <span className="font-mono font-bold text-[#f59e0b] tracking-wide text-xs sm:text-sm">
              公元 {year} 年
            </span>
            <span className="text-[#6d5e4f]">·</span>
            <span
              className="font-semibold font-classical px-1.5 py-0.2 rounded text-[11px] sm:text-xs"
              style={{
                color: seasonCfg.color,
                backgroundColor: `${seasonCfg.color}18`,
                border: `1px solid ${seasonCfg.color}40`,
              }}
            >
              {seasonCfg.name}季
            </span>
            <span className="text-[11px] text-[#9c8c7a] font-classical hidden sm:inline">
              ({seasonMonths})
            </span>
            <span className="text-[#6d5e4f] hidden sm:inline">·</span>
            <span className="text-[#a89987] font-classical hidden md:inline">
              {lunarYear}
            </span>
            <span className="text-[#6d5e4f]">·</span>
            <span className="text-[#38bdf8] font-mono font-semibold">
              {age} 岁
            </span>
          </div>
        </div>

        {/* Right: Time Controls, Speed Selector & Status (Single Line) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Main Play / Pause Button */}
          <button
            onClick={() => {
              sound.playPluck(isAutoRunning ? 440 : 660);
              onToggleAutoRun();
            }}
            disabled={hasChoice || isProcessing}
            title={
              hasChoice
                ? '临大事要冲，需定夺抉择方可继续'
                : isAutoRunning
                ? '点击暂停岁月流转 (空格键)'
                : '点击开启四季自动流转 (空格键)'
            }
            className={`px-3 py-1.5 rounded-md text-xs font-classical flex items-center gap-1.5 transition-all shadow-sm cursor-pointer select-none active:scale-95 ${
              hasChoice
                ? 'bg-[#291f16] text-[#786959] cursor-not-allowed border border-[#382b1e]'
                : isAutoRunning
                ? 'bg-[#991b1b] text-[#fef2f2] hover:bg-[#b91c1c] border border-[#dc2626]/80 shadow-[0_0_10px_rgba(220,38,38,0.25)]'
                : 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#241306] hover:from-[#c5a028] hover:to-[#d8bc55] font-semibold shadow-[0_0_8px_rgba(212,175,55,0.2)]'
            }`}
          >
            {isAutoRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold">暂停岁月</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold">自动流转</span>
              </>
            )}
          </button>

          {/* Manual Step Forward Button (+1季) */}
          <button
            onClick={() => {
              sound.playPluck(523);
              onManualNextSeason();
            }}
            disabled={hasChoice || isAutoRunning || isProcessing}
            title={
              hasChoice
                ? '需先完成当前大事抉择'
                : isAutoRunning
                ? '当前正自动流转中，暂停后可单季步进'
                : '手动推进一季 (3个月)'
            }
            className={`px-2.5 py-1.5 rounded-md text-xs font-classical flex items-center gap-1 transition-colors border select-none ${
              hasChoice || isAutoRunning
                ? 'bg-[#1a1410] border-[#291e15] text-[#5e5142] cursor-not-allowed'
                : 'bg-[#231b15] border-[#443324] text-[#dcd1c2] hover:text-[#faece0] hover:bg-[#32261d] active:scale-95 cursor-pointer'
            }`}
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>+1季</span>
          </button>

          {/* Speed Selector (1x, 2x, 4x, 8x) */}
          <div className="flex items-center gap-1 bg-[#1e1712] p-0.5 rounded-lg border border-[#3a2c1e]">
            <span className="text-[10px] text-[#8e7f6e] font-classical px-1.5 hidden xl:inline">
              流速：
            </span>
            {([1, 2, 4, 8] as const).map((spd) => {
              const isActive = playbackSpeed === spd;
              return (
                <button
                  key={spd}
                  onClick={() => {
                    sound.playPluck(400 + spd * 60);
                    onChangeSpeed(spd);
                  }}
                  title={`设为 ${spd}× 倍速 (${
                    spd === 1
                      ? '约4.4秒/年, 细品岁月'
                      : spd === 2
                      ? '约2.2秒/年, 畅快流转'
                      : spd === 4
                      ? '约1.1秒/年, 疾速如梭'
                      : '约0.5秒/年, 极速沧海'
                  })`}
                  className={`px-2 py-1 text-xs font-mono font-semibold rounded transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#d4af37] text-[#1c1208] shadow-sm scale-105'
                      : 'text-[#9e8e7d] hover:text-[#faece0] hover:bg-[#2c2118]'
                  }`}
                >
                  {spd}×
                </button>
              );
            })}
          </div>

          {/* State / Alert Indicator */}
          <div className="flex items-center text-xs font-classical">
            {hasChoice ? (
              activeTab === 'SIMULATION' ? (
                <div className="text-[#f59e0b] flex items-center gap-1 bg-[#2b1f14] px-2.5 py-1 rounded border border-[#6d4c2b]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#fbbf24] animate-bounce" />
                  <span className="hidden sm:inline">逢大事暂停 · 待裁决</span>
                  <span className="sm:hidden">待裁决</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    sound.playMilestone();
                    onNavigateToSimulation();
                  }}
                  title="当前有重大人生抉择需要定夺，点击立即前往岁月长卷"
                  className="bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#92400e] hover:to-[#b45309] text-[#fffbeb] px-2.5 py-1 rounded text-xs font-classical flex items-center gap-1.5 shadow-md border border-[#f59e0b]/50 animate-pulse cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-200" />
                  <span className="font-semibold">
                    大事待决{pendingChoiceTitle ? `：${pendingChoiceTitle}` : ''}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-200 font-bold underline">
                    前往定夺 <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              )
            ) : isAutoRunning ? (
              <div className="text-[#4ade80] flex items-center gap-1.5 bg-[#142318] px-2.5 py-1 rounded border border-[#166534]">
                <Zap className="w-3.5 h-3.5 text-[#22c55e] animate-pulse" />
                <span>
                  流转中 · <span className="font-mono font-bold">{playbackSpeed}×</span>
                </span>
              </div>
            ) : (
              <div className="text-[#9c8c7b] flex items-center gap-1.5 bg-[#1b1511] px-2.5 py-1 rounded border border-[#33261a]">
                <Clock className="w-3.5 h-3.5 text-[#7c6d5e]" />
                <span>已暂停</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
