import React from 'react';
import { SeasonLogEntry } from '../types/game';
import { SEASONS_CONFIG } from '../services/lifeSimulator';
import { Clock, CheckCircle2 } from 'lucide-react';

interface ChronicleTimelineProps {
  logs: SeasonLogEntry[];
  characterName: string;
}

export const ChronicleTimeline: React.FC<ChronicleTimelineProps> = ({
  logs,
  characterName,
}) => {
  if (logs.length === 0) {
    return (
      <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-8 text-center text-[#9c8b78]">
        <Clock className="w-8 h-8 mx-auto mb-2 text-[#786958]" />
        <p className="font-classical text-sm">初生之时，岁月长卷正待书写。</p>
        <p className="text-xs text-[#6e6052] mt-1">四季流转，平生春秋与天下纪事将在此沉淀汇编。</p>
      </div>
    );
  }

  const statLabelMap: Record<string, string> = {
    health: '体魄',
    intellect: '识见',
    martial: '勇略',
    virtue: '仁厚',
    wealth: '家财',
    fortune: '气数',
  };

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2e2319]">
        <div>
          <h2 className="text-lg md:text-xl font-calligraphy text-[#faece0] tracking-wider">
            {characterName} · 四季编年录
          </h2>
          <span className="text-xs text-[#a29280]">
            已亲历 {logs.length} 季之春秋风霜
          </span>
        </div>
        <div className="text-xs text-[#d4af37] font-classical">
          【汉末草民实录】
        </div>
      </div>

      {/* Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#4a3928]">
        {logs.map((entry, index) => {
          const seasonCfg = SEASONS_CONFIG[entry.season] || SEASONS_CONFIG[0];

          return (
            <div key={index} className="relative group">
              <div
                className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-[#271d15] flex items-center justify-center text-[10px] font-classical shadow-sm"
                style={{
                  border: `2px solid ${seasonCfg.color}`,
                  color: seasonCfg.color,
                }}
              >
                {seasonCfg.name}
              </div>

              <div className="bg-[#221a14] border border-[#3b2b1d] rounded-lg p-3 sm:p-4 hover:border-[#634e3a] transition-all space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f59e0b] font-mono">
                      公元 {entry.year} 年
                    </span>
                    <span
                      className="px-1.5 py-0.2 rounded font-classical text-xs"
                      style={{
                        color: seasonCfg.color,
                        backgroundColor: `${seasonCfg.color}15`,
                        border: `1px solid ${seasonCfg.color}40`,
                      }}
                    >
                      {entry.seasonName}
                    </span>
                    <span className="text-[#847565]">·</span>
                    <span className="text-[#a89987] font-classical">{entry.lunarYear}</span>
                    <span className="text-[#847565]">·</span>
                    <span className="text-[#38bdf8] font-mono">{entry.age} 岁</span>
                  </div>
                  <span className="text-[#a39381] font-classical">
                    {entry.location} ({entry.occupation})
                  </span>
                </div>

                {/* Macro summary */}
                <div className="text-[#c5a666] font-classical line-clamp-1">
                  天下：{entry.macroHistory}
                </div>

                {/* Personal story */}
                <p className="text-[#dfd5c8] leading-relaxed font-classical">
                  {entry.storySummary}
                </p>

                {/* Choice made */}
                {entry.choiceMade && (
                  <div className="text-[#d4af37] pt-1 border-t border-[#2d2218] flex items-center gap-1 font-classical">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e5c158]" />
                    <span>当年决断：{entry.choiceMade}</span>
                  </div>
                )}

                {/* Stat Changes */}
                {entry.statChanges && Object.keys(entry.statChanges).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] tabular-nums">
                    {Object.entries(entry.statChanges).map(([k, v]) => {
                      if (!v) return null;
                      const isPos = (v as number) > 0;
                      return (
                        <span
                          key={k}
                          className={`px-1 rounded bg-[#17110d] ${
                            isPos ? 'text-[#4ade80]' : 'text-[#f87171]'
                          }`}
                        >
                          {statLabelMap[k] || k} {isPos ? `+${v}` : v}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
