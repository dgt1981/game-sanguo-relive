import React, { useState, useMemo } from 'react';
import { RealisticEnding, Attributes, SeasonLogEntry, SeasonIndex } from '../types/game';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import { FunTitleInfo } from '../services/titleGenerator';
import { matchHistoricalFigures, MatchedHistoricalFigure } from '../services/historicalFigures';
import { sound } from '../services/sound';
import { Scroll, RotateCcw, Share2, Check, BookOpen, Sparkles, Compass, UserCheck, Swords, Users, Award } from 'lucide-react';

interface LifeObituaryModalProps {
  ending: RealisticEnding;
  profile: PersonProfile;
  finalStats: Attributes;
  deathAge: number;
  deathYear: number;
  deathSeason: SeasonIndex;
  seasonLogs: SeasonLogEntry[];
  deathReason?: string;
  funTitles: FunTitleInfo;
  matchedFigures?: MatchedHistoricalFigure[];
  onRestart: () => void;
}

export const LifeObituaryModal: React.FC<LifeObituaryModalProps> = ({
  ending,
  profile,
  finalStats,
  deathAge,
  deathYear,
  deathSeason,
  seasonLogs,
  deathReason,
  funTitles,
  matchedFigures: propMatchedFigures,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedFigureIndex, setSelectedFigureIndex] = useState(0);
  const seasonCfg = SEASONS_CONFIG[deathSeason] || SEASONS_CONFIG[0];

  // Calculate or use matched figures
  const matchedFigures = useMemo(() => {
    if (propMatchedFigures && propMatchedFigures.length > 0) {
      return propMatchedFigures;
    }
    return matchHistoricalFigures(
      profile,
      finalStats,
      deathAge,
      deathYear,
      deathReason,
      ending.tier
    );
  }, [propMatchedFigures, profile, finalStats, deathAge, deathYear, deathReason, ending.tier]);

  const currentFigure = matchedFigures[selectedFigureIndex] || matchedFigures[0];

  const handleCopy = () => {
    const text = `【汉末草民实录 · 八十亿分之一人生】
传主：${profile.name}（字${profile.courtesyName} · ${profile.gender === 'MALE' ? '男丁' : '女秀'}）
生卒：公元184年孟春 — 公元${deathYear}年${seasonCfg.name}季（享年${deathAge}岁）
籍贯：${profile.commandery} · ${profile.county}
身前身份：${profile.occupation}
结局称号：${ending.title}
趣味称号：${funTitles.primaryTitle}（${funTitles.folkNickname}）
趣味标签：${funTitles.badges.join(' / ')}
幽默评注：${funTitles.humorousQuote}

【宿命映照历史人物】：${currentFigure ? `${currentFigure.name}（字${currentFigure.courtesyName} · 契合度 ${currentFigure.similarityScore}% · ${currentFigure.titleTag}）` : '无'}
【宿命同道评述】：${currentFigure ? currentFigure.resonanceReason : ''}

【平生总叙】
${ending.summary}

【史家注脚】
${ending.historianNote}
`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#181411] border-2 border-[#544130] rounded-xl max-w-2xl w-full p-6 sm:p-8 text-[#ece2d5] shadow-2xl my-6 relative overflow-hidden">
        {/* Calligraphic Seal Header */}
        <div className="text-center relative pb-5 border-b border-[#36291e]">
          <div className="inline-block seal-stamp px-3 py-0.5 text-xs rounded mb-2">
            {ending.epitaphTitle}
          </div>

          <h1 className="text-2xl sm:text-3xl font-calligraphy text-[#faece0] tracking-widest mt-1">
            {ending.title}
          </h1>

          {/* Fun Titles Banner */}
          <div className="mt-3 bg-[#241c16] border border-[#483726] rounded-lg p-3 max-w-lg mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-calligraphy text-lg sm:text-xl text-[#f59e0b] tracking-wider">
                {funTitles.primaryTitle}
              </span>
              <span className="text-xs text-[#a29280] font-classical">
                ({funTitles.folkNickname})
              </span>
            </div>

            {/* Badges pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {funTitles.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded bg-[#17120e] text-[#d4af37] border border-[#3e3023] font-classical"
                >
                  #{b}
                </span>
              ))}
            </div>

            <p className="text-xs text-[#b8a794] italic font-classical pt-1">
              {funTitles.humorousQuote}
            </p>
          </div>

          <div className="text-xs text-[#a29280] mt-3 flex flex-wrap items-center justify-center gap-2 font-classical">
            <span>{profile.name}（字{profile.courtesyName}）</span>
            <span>·</span>
            <span>生于公元184年春</span>
            <span>·</span>
            <span>殁于公元{deathYear}年{seasonCfg.name}季 (享年{deathAge}岁)</span>
          </div>

          {deathReason && (
            <div className="mt-2 text-xs text-[#f87171] bg-[#2a1313] py-1 px-3 rounded inline-block border border-[#521c1c] font-classical">
              殁因：{deathReason}
            </div>
          )}
        </div>

        {/* Narrative & Historian Note */}
        <div className="py-5 space-y-4 font-classical text-xs sm:text-sm">
          {/* Biography Summary */}
          <div className="bg-[#221a14] border border-[#3f3022] rounded-lg p-4 space-y-2">
            <div className="font-semibold text-[#c5a666] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>【平生总叙】</span>
            </div>
            <p className="text-[#ded4c6] leading-relaxed indent-6">
              {ending.summary}
            </p>
          </div>

          {/* Historian Commentary */}
          <div className="bg-[#241c16] border border-[#483726] rounded-lg p-4 space-y-2">
            <div className="font-semibold text-[#d4af37] flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5" />
              <span>【史家赞曰】</span>
            </div>
            <p className="text-[#ddd0c0] leading-relaxed italic indent-6">
              {ending.historianNote}
            </p>
          </div>

          {/* Stats at death */}
          <div className="bg-[#1f1712] border border-[#362719] rounded-lg p-3">
            <span className="text-xs text-[#9d8d7b] block mb-1.5">平生终局风貌：</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
              <div className="bg-[#16100c] p-1.5 rounded border border-[#2d1f14]">
                <div className="text-[#10b981] text-[10px]">体魄</div>
                <div className="font-bold text-[#faece0]">{finalStats.health}</div>
              </div>
              <div className="bg-[#16100c] p-1.5 rounded border border-[#2d1f14]">
                <div className="text-[#0284c7] text-[10px]">识见</div>
                <div className="font-bold text-[#faece0]">{finalStats.intellect}</div>
              </div>
              <div className="bg-[#16100c] p-1.5 rounded border border-[#2d1f14]">
                <div className="text-[#c2410c] text-[10px]">勇略</div>
                <div className="font-bold text-[#faece0]">{finalStats.martial}</div>
              </div>
              <div className="bg-[#16100c] p-1.5 rounded border border-[#2d1f14]">
                <div className="text-[#ca8a04] text-[10px]">仁厚</div>
                <div className="font-bold text-[#faece0]">{finalStats.virtue}</div>
              </div>
              <div className="bg-[#16100c] p-1.5 rounded border border-[#2d1f14]">
                <div className="text-[#eab308] text-[10px]">家财</div>
                <div className="font-bold text-[#faece0]">{finalStats.wealth}</div>
              </div>
              <div className="bg-[#16100c] p-1.5 rounded border border-[#2d1f14]">
                <div className="text-[#a855f7] text-[10px]">气数</div>
                <div className="font-bold text-[#faece0]">{finalStats.fortune}</div>
              </div>
            </div>
          </div>

          {/* 平生征伐与天下知交 (随军参与历史战役与结识人物总结) */}
          {(profile.militaryAffiliation || (profile.knownFigures && profile.knownFigures.length > 0)) && (
            <div className="bg-[#1f1712] border border-[#3e2e1e] rounded-lg p-3.5 space-y-2 text-xs">
              {profile.militaryAffiliation && profile.militaryAffiliation.camp !== 'NONE' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[#f59e0b] font-semibold">
                    <Swords className="w-3.5 h-3.5" />
                    <span>【投身阵营】{profile.militaryAffiliation.roleTitle}</span>
                  </div>
                  {profile.militaryAffiliation.campaigns.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap text-[11px] text-[#eab308]">
                      <span className="text-[#8c7b6a]">亲历演义战役：</span>
                      {profile.militaryAffiliation.campaigns.map((campName) => (
                        <span
                          key={campName}
                          className="px-1.5 py-0.2 rounded bg-[#2e1d13] border border-[#523820] text-[#fcd34d]"
                        >
                          {campName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profile.knownFigures && profile.knownFigures.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#2e2218]">
                  <div className="flex items-center gap-1.5 text-[#d4af37]">
                    <Users className="w-3.5 h-3.5" />
                    <span>【平生知交】：</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {profile.knownFigures.map((fig) => (
                      <span
                        key={fig.id}
                        className="px-2 py-0.5 rounded bg-[#2b2016] border border-[#4d3824] text-[#faece0] text-[11px] flex items-center gap-1"
                      >
                        <span className="text-[#f59e0b] font-bold">{fig.name}</span>
                        <span className="text-[#8e7e6e]">（{fig.relation}）</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 宿命映照 · 三国历史同道 (NEW) */}
          {currentFigure && (
            <div className="bg-[#201812] border-2 border-[#8b6528]/80 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3e2e1f] pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e5c158]" />
                  <span className="font-calligraphy text-base sm:text-lg text-[#faece0] tracking-wider">
                    宿命映照 · 三国历史同道
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#9c8b7a] font-classical">天命契合指数：</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-[#f59e0b] px-2 py-0.5 rounded bg-[#2b2016] border border-[#5a422a]">
                    {currentFigure.similarityScore}%
                  </span>
                </div>
              </div>

              {/* Selector tabs if multiple matched figures */}
              {matchedFigures.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[#8e7e6e] text-[11px] shrink-0 font-classical">神思相契人物：</span>
                  {matchedFigures.map((fig, idx) => (
                    <button
                      key={fig.id}
                      type="button"
                      onClick={() => {
                        sound.playPluck(520 + idx * 80);
                        setSelectedFigureIndex(idx);
                      }}
                      className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        selectedFigureIndex === idx
                          ? 'bg-[#d4af37] text-[#1a1106] font-bold shadow-md'
                          : 'bg-[#291f17] text-[#a49583] hover:text-[#faece0] border border-[#3e2e20]'
                      }`}
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>{fig.name}</span>
                      <span className="text-[10px] opacity-80">{fig.similarityScore}%</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Hero Card of the selected historical figure */}
              <div className="bg-[#17110c] rounded-lg p-3.5 border border-[#3d2e1f] space-y-3">
                {/* Name, Camp & Lifespan */}
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-calligraphy text-xl sm:text-2xl text-[#f3ece2] tracking-wider">
                      {currentFigure.name}
                    </span>
                    <span className="text-xs text-[#a39482] font-classical">字 {currentFigure.courtesyName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#2c1d13] text-[#e5c158] border border-[#523b26] font-classical">
                      {currentFigure.campLabel}
                    </span>
                  </div>
                  <div className="text-xs text-[#8c7b69] font-classical">
                    {currentFigure.historicLifespan} · {currentFigure.birthplace}
                  </div>
                </div>

                {/* Title tag and resonance title */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-xs text-[#d4af37] font-classical">
                    {currentFigure.titleTag}
                  </span>
                  <span className="text-xs text-[#f59e0b] bg-[#2a1d12] px-2 py-0.5 rounded border border-[#4a3420] font-classical">
                    {currentFigure.resonanceTitle}
                  </span>
                </div>

                {/* Resonance Reason */}
                <p className="text-xs text-[#dcd1c2] leading-relaxed font-classical indent-5">
                  {currentFigure.resonanceReason}
                </p>

                {/* 3 Key Parallels */}
                <div className="bg-[#120d09] p-2.5 rounded border border-[#2e2115] space-y-1.5 text-xs text-[#b8a794] font-classical">
                  {currentFigure.keyParallels.map((parallel, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-[#d4af37] text-xs">◆</span>
                      <span>{parallel}</span>
                    </div>
                  ))}
                </div>

                {/* Historical Quote */}
                <div className="text-[11px] text-[#8e7e6e] italic font-classical pt-1 border-t border-[#2d2015] flex items-center gap-1.5">
                  <span className="text-[#a49583] not-italic font-semibold shrink-0">【史传名言】：</span>
                  <span>{currentFigure.historicQuote}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#36291e]">
          <button
            onClick={handleCopy}
            className="w-full sm:w-1/2 py-2.5 text-xs sm:text-sm font-medium text-[#dcd2c4] bg-[#292019] hover:bg-[#382b22] border border-[#483726] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#4ade80]" />
                <span>生平、称号与历史同道已复制</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>复制 / 分享本生小传与历史同道</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playDrum();
              onRestart();
            }}
            className="w-full sm:w-1/2 py-2.5 text-xs sm:text-sm font-semibold text-[#1f1206] bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] hover:from-[#c29c26] hover:to-[#c29c26] rounded-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 font-classical cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重入轮回 · 降生另一段人生</span>
          </button>
        </div>
      </div>
    </div>
  );
};

