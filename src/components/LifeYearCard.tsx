import React from 'react';
import { SeasonalEvent, LifeChoice, Attributes, SeasonIndex } from '../types/game';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import { sound } from '../services/sound';
import {
  Flame,
  Compass,
  Play,
  Pause,
  StepForward,
  ChevronRight,
  AlertCircle,
  Clock,
  Zap,
  Calendar,
} from 'lucide-react';

interface LifeYearCardProps {
  currentEvent: SeasonalEvent;
  profile: PersonProfile;
  stats: Attributes;
  isAutoRunning: boolean;
  playbackSpeed: 1 | 2 | 4 | 8;
  wasAutoPausedForChoice: boolean;
  onToggleAutoRun: () => void;
  onChangeSpeed: (speed: 1 | 2 | 4 | 8) => void;
  onManualNextSeason: () => void;
  onSelectChoice: (choice: LifeChoice) => void;
  isProcessing: boolean;
}

export const LifeYearCard: React.FC<LifeYearCardProps> = ({
  currentEvent,
  profile,
  stats,
  isAutoRunning,
  playbackSpeed,
  wasAutoPausedForChoice,
  onToggleAutoRun,
  onChangeSpeed,
  onManualNextSeason,
  onSelectChoice,
  isProcessing,
}) => {
  const hasChoice = Boolean(currentEvent.choice);
  const seasonCfg = SEASONS_CONFIG[currentEvent.season];

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl overflow-hidden shadow-2xl space-y-0">
      {/* 1. Header bar of the current season & location */}
      <div className="bg-[#231b15] border-b border-[#3b2b1d] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-[#f59e0b]">
            公元 {currentEvent.year} 年
          </span>
          <span className="text-[#847565]">·</span>
          <span
            className="font-semibold font-classical px-2 py-0.5 rounded text-xs"
            style={{
              color: seasonCfg.color,
              backgroundColor: `${seasonCfg.color}15`,
              border: `1px solid ${seasonCfg.color}40`,
            }}
          >
            {seasonCfg.name}季 ({currentEvent.seasonMonths})
          </span>
          <span className="text-[#847565]">·</span>
          <span className="text-[#a89987] font-classical">{currentEvent.lunarYear}</span>
          <span className="text-[#847565]">·</span>
          <span className="text-[#38bdf8] font-mono font-semibold">{currentEvent.age} 岁</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#d4af37] font-classical">
          <Compass className="w-3.5 h-3.5" />
          <span>身处：{profile.commandery} · {profile.county}</span>
          <span className="text-[#8c7b69]">({profile.occupation})</span>
        </div>
      </div>

      {/* 2. Automated Time Flow & Speed Controller Bar */}
      <div className="bg-[#16120f] border-b border-[#33261a] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={() => {
              sound.playPluck(isAutoRunning ? 440 : 660);
              onToggleAutoRun();
            }}
            disabled={hasChoice || isProcessing}
            className={`px-3 py-1.5 rounded-md text-xs font-classical flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              hasChoice
                ? 'bg-[#291f16] text-[#786959] cursor-not-allowed border border-[#382b1e]'
                : isAutoRunning
                ? 'bg-[#b91c1c] text-[#fef2f2] hover:bg-[#991b1b] border border-[#dc2626]'
                : 'bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#241306] hover:from-[#c5a028] hover:to-[#d8bc55] font-semibold'
            }`}
          >
            {isAutoRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>暂停岁月</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>自动流转</span>
              </>
            )}
          </button>

          {/* Manual Step Button: +1季 */}
          <button
            onClick={() => {
              sound.playPluck(523);
              onManualNextSeason();
            }}
            disabled={hasChoice || isAutoRunning || isProcessing}
            className={`px-2.5 py-1.5 rounded-md text-xs font-classical flex items-center gap-1 transition-colors border ${
              hasChoice || isAutoRunning
                ? 'bg-[#1a1410] border-[#291e15] text-[#5e5142] cursor-not-allowed'
                : 'bg-[#251d16] border-[#443324] text-[#dcd1c2] hover:text-[#faece0] hover:bg-[#32261d] cursor-pointer'
            }`}
            title="手动单步推进一步（一季）"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>+1季</span>
          </button>
        </div>

        {/* Speed Selector (1x, 2x, 4x, 8x) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#8e7f6e] font-classical mr-1 hidden sm:inline">
            流逝倍速：
          </span>
          <div className="flex items-center gap-1 p-0.5 bg-[#201812] rounded-lg border border-[#3b2c1d]">
            {([1, 2, 4, 8] as const).map((spd) => {
              const isActive = playbackSpeed === spd;
              return (
                <button
                  key={spd}
                  onClick={() => {
                    sound.playPluck(400 + spd * 60);
                    onChangeSpeed(spd);
                  }}
                  className={`px-2 py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#d4af37] text-[#1c1208] shadow-sm'
                      : 'text-[#9e8e7d] hover:text-[#faece0]'
                  }`}
                >
                  {spd}×
                </button>
              );
            })}
          </div>
        </div>

        {/* Running Status Indicator */}
        <div className="text-xs font-classical">
          {hasChoice ? (
            <span className="text-[#f59e0b] flex items-center gap-1 bg-[#2b1f14] px-2 py-0.5 rounded border border-[#523c26]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>逢要冲已暂停 · 抉择后将以 {playbackSpeed}× 自动流转</span>
            </span>
          ) : isAutoRunning ? (
            <span className="text-[#4ade80] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#22c55e] animate-pulse" />
              <span>四季流逝中 · {playbackSpeed}× 速</span>
            </span>
          ) : (
            <span className="text-[#8c7b69] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>岁月已静止</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Main Narrative Area */}
      <div className="p-4 sm:p-6 md:p-8 space-y-5">
        {/* Macro History (天下大势) */}
        <div className="bg-[#181310] border-l-2 border-[#d4af37] p-3.5 sm:p-4 rounded-r text-xs sm:text-sm text-[#ded3c5] leading-relaxed">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#d4af37] font-classical">
              <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>【天下大势 · {seasonCfg.name}季】</span>
            </div>
            <span className="text-[11px] text-[#7a6a59] font-classical">
              {seasonCfg.solarTerm}
            </span>
          </div>
          <p className="text-[#cfc3b4]">{currentEvent.macroHistory}</p>
        </div>

        {/* Regional Impact (本地风物) */}
        <div className="bg-[#201813] border border-[#3b2c1e] p-3.5 sm:p-4 rounded-lg text-xs sm:text-sm leading-relaxed space-y-1">
          <div className="font-semibold text-[#c5a666] font-classical">
            【郡县风物 · {profile.commandery}】
          </div>
          <p className="text-[#b9a997]">{currentEvent.regionalImpact}</p>
        </div>

        {/* Personal Story (平生纪事) */}
        <div className="bg-[#241c16] border border-[#443324] p-4 sm:p-5 rounded-lg text-sm sm:text-base text-[#f5eee4] leading-relaxed font-classical shadow-inner">
          <div className="font-semibold text-[#faece0] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seasonCfg.color }} />
            <span>【平生纪事 · {seasonCfg.name}令】</span>
          </div>
          <p className="indent-8 text-justify tracking-wide leading-relaxed">
            {currentEvent.personalStory}
          </p>
        </div>

        {/* Branching Choice (if any this season) */}
        {hasChoice && currentEvent.choice && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#f0e4d3] font-classical flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                <span>{currentEvent.choice.prompt}</span>
              </h3>
              <span className="text-xs text-[#9d8d7b]">
                {wasAutoPausedForChoice ? '抉择后按原倍速继续流转' : '请做出抉择'}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentEvent.choice.options.map((opt, idx) => {
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sound.playDrum();
                      onSelectChoice(opt);
                    }}
                    className="w-full text-left p-3.5 sm:p-4 rounded-lg bg-[#221a14] border border-[#443324] hover:bg-[#2c2119] hover:border-[#d4af37] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#332418] border border-[#543b27] flex items-center justify-center text-xs font-mono text-[#d4af37] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-[#f5eee4] group-hover:text-[#f8e096] transition-colors">
                          {opt.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>

                    <p className="text-xs text-[#a0907f] pl-7 leading-relaxed">
                      {opt.description}
                    </p>

                    {/* Stat hint */}
                    <div className="flex items-center gap-2 pl-7 pt-2 text-[11px] font-mono tabular-nums text-[#8c7c6a]">
                      {Object.entries(opt.statChanges).map(([k, v]) => {
                        if (!v) return null;
                        const isPos = (v as number) > 0;
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
                            className={isPos ? 'text-[#4ade80]' : 'text-[#f87171]'}
                          >
                            {labelMap[k] || k} {isPos ? `+${v}` : v}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
