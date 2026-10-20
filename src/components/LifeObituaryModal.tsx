import React, { useState } from 'react';
import { RealisticEnding, Attributes, YearLogEntry } from '../types/game';
import { PersonProfile } from '../services/lifeSimulator';
import { sound } from '../services/sound';
import { Scroll, RotateCcw, Share2, Check, BookOpen, UserCheck } from 'lucide-react';

interface LifeObituaryModalProps {
  ending: RealisticEnding;
  profile: PersonProfile;
  finalStats: Attributes;
  deathAge: number;
  deathYear: number;
  yearLogs: YearLogEntry[];
  deathReason?: string;
  onRestart: () => void;
}

export const LifeObituaryModal: React.FC<LifeObituaryModalProps> = ({
  ending,
  profile,
  finalStats,
  deathAge,
  deathYear,
  yearLogs,
  deathReason,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `【汉末草民实录 · 八十亿分之一人生】
传主：${profile.name}（${profile.gender === 'MALE' ? '男' : '女'}）
生卒：公元184年 — 公元${deathYear}年（享年${deathAge}岁）
籍贯：${profile.commandery} · ${profile.county}
身前身份：${profile.occupation}
结局：${ending.title}
铭文：${ending.epitaphTitle}

【生平小传】
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

          <div className="text-xs text-[#a29280] mt-2 flex flex-wrap items-center justify-center gap-2 font-classical">
            <span>{profile.name}</span>
            <span>·</span>
            <span>生于公元184年</span>
            <span>·</span>
            <span>殁于公元{deathYear}年 (享年{deathAge}岁)</span>
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
                <span>生平小传已复制</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>复制 / 分享本生小传</span>
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
