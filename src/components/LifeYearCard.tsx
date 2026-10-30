import React from 'react';
import { SeasonalEvent, LifeChoice, Attributes, SeasonIndex } from '../types/game';
import { PersonProfile, SEASONS_CONFIG, getPhysiologicalStage } from '../services/lifeSimulator';
import { PixelFigureAvatar } from './PixelFigureAvatar';
import { ProtagonistPixelAvatar } from './ProtagonistPixelAvatar';
import { sound } from '../services/sound';
import {
  Flame,
  ChevronRight,
  MessageSquare,
  Swords,
  Award,
  Sparkles,
  AlertCircle,
  EyeOff,
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
  const stage = getPhysiologicalStage(currentEvent.age);

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl overflow-hidden shadow-2xl space-y-0">
      {/* Main Narrative Area */}
      <div className="p-4 sm:p-6 md:p-8 space-y-5">
        {/* Major Campaign Banner if actively participating */}
        {currentEvent.isCampaignEvent && currentEvent.campaignName && (
          <div className="bg-gradient-to-r from-[#3f1912] via-[#2a130e] to-[#1d100d] border border-[#a13b28] p-3.5 sm:p-4 rounded-lg flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#7f1d1d] border border-[#ef4444] flex items-center justify-center text-[#fef2f2] shadow-inner">
                <Swords className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-calligraphy text-base sm:text-lg text-[#fecaca] font-bold">
                    【演义史诗 · {currentEvent.campaignName}】
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#991b1b] text-[#fee2e2] font-classical">
                    随军亲历
                  </span>
                </div>
                <p className="text-xs text-[#fca5a5]">
                  你正跟随麾下名将亲临历史与演义风暴的核心，一举一动皆系天下存亡！
                </p>
              </div>
            </div>
            <Award className="w-6 h-6 text-[#f59e0b] shrink-0 hidden sm:block opacity-80" />
          </div>
        )}

        {/* Historical Figure Dialogue Box (认识与对话同地区历史人物) */}
        {currentEvent.figureDialogue && (
          <div className="bg-[#1e1713] border border-[#6d5138] rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#3e2e22] pb-2.5">
              <div className="flex items-center gap-2.5">
                {/* Pixel Art Avatar Badge */}
                <PixelFigureAvatar
                  figureId={currentEvent.figureDialogue.figureId}
                  name={currentEvent.figureDialogue.speaker}
                  courtesyName={currentEvent.figureDialogue.courtesyName}
                  camp={currentEvent.figureDialogue.camp}
                  size="md"
                  showCampBadge={true}
                  showCampBorder={true}
                  avatarChar={currentEvent.figureDialogue.avatarChar}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-calligraphy text-base text-[#faece0] font-bold">
                      {currentEvent.figureDialogue.speaker}
                    </span>
                    {currentEvent.figureDialogue.courtesyName && (
                      <span className="text-xs text-[#c5a666]">
                        字 {currentEvent.figureDialogue.courtesyName}
                      </span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#332419] text-[#eab308] border border-[#523c28] font-classical">
                      {currentEvent.figureDialogue.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9c8976] flex items-center gap-1 font-classical mt-0.5">
                    <MessageSquare className="w-3 h-3 text-[#d4af37]" />
                    <span>同郡知交 · 驿道会面</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#d4af37] font-classical hidden sm:inline">
                【名士引路】
              </span>
            </div>

            {/* Spoken Quote Balloon */}
            <div className="bg-[#271d17] border-l-2 border-[#d4af37] p-3 rounded-r text-sm text-[#f5eee4] font-classical leading-relaxed relative">
              <p className="italic text-[#f2e6d6] tracking-wide">
                {currentEvent.figureDialogue.quote}
              </p>
            </div>
          </div>
        )}

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

        {/* Personal Story (平生纪事 - 随人生阶段呈现专属像素容貌) */}
        <div className="bg-[#241c16] border border-[#443324] p-4 sm:p-5 rounded-lg text-sm sm:text-base text-[#f5eee4] leading-relaxed font-classical shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-[#36271c] pb-2">
            <div className="font-semibold text-[#faece0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seasonCfg.color }} />
              <span>【平生纪事 · {seasonCfg.name}令】</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#e5a84b] font-semibold">【{stage.stageName} · {stage.tag}】</span>
              <span className="text-[#8c7b69] font-mono">（{currentEvent.age}岁）</span>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4">
            <ProtagonistPixelAvatar
              stageKey={stage.stageKey}
              gender={profile.gender}
              age={currentEvent.age}
              camp={profile.militaryAffiliation?.camp || 'NONE'}
              socialClass={profile.socialClass}
              name={profile.name}
              size="lg"
              showAgeBadge={true}
              showCampBorder={true}
              showTooltip={true}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#a89582] mb-1.5 flex items-center gap-2 flex-wrap">
                <span className="text-[#f59e0b] font-semibold">{profile.name}</span>
                <span>·</span>
                <span className="text-[#c5a666]">字 {profile.courtesyName}</span>
                <span>·</span>
                <span className="text-[#38bdf8]">{stage.ageRange}</span>
                <span>·</span>
                <span className="text-[#9c8976] italic">{stage.description}</span>
              </div>
              <p className="text-justify tracking-wide leading-relaxed text-[#f3ece2]">
                {currentEvent.personalStory}
              </p>
            </div>
          </div>
        </div>

        {/* Branching Choice (if any this season) */}
        {hasChoice && currentEvent.choice && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-[#f0e4d3] font-classical flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                <span>{currentEvent.choice.prompt}</span>
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-[#a89582] font-classical">
                <EyeOff className="w-3.5 h-3.5 text-[#e5a84b]" />
                <span>暗投决断 · 影响值已隐藏（抉择后将于年谱显现）</span>
              </div>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded-full bg-[#332418] border border-[#543b27] flex items-center justify-center text-xs font-mono text-[#d4af37] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-[#f5eee4] group-hover:text-[#f8e096] transition-colors">
                          {opt.label}
                        </span>
                        {opt.approachTag && (
                          <span className="text-[11px] font-classical px-2 py-0.5 rounded bg-[#2e1f14] text-[#d4af37] border border-[#523b26]">
                            {opt.approachTag}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>

                    <p className="text-xs text-[#b8a795] pl-7 leading-relaxed">
                      {opt.description}
                    </p>

                    {/* Subtle Requirement Hint without numeric spoiler */}
                    <div className="flex items-center justify-between pl-7 pt-2 text-[11px] text-[#8c7c6a] font-classical">
                      {opt.requirementHint ? (
                        <span className="text-[#eab308] flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{opt.requirementHint}</span>
                        </span>
                      ) : (
                        <span className="text-[#786959]">祸福唯心 · 顺逆由命</span>
                      )}
                      <span className="text-[10px] text-[#6b5d4e]">听凭本心立决</span>
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
