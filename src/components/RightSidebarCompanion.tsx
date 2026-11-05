import React, { useState } from 'react';
import {
  HistoricalFigureBond,
  Attributes,
  SeasonIndex,
  SeasonLogEntry,
} from '../types/game';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import { PixelFigureAvatar } from './PixelFigureAvatar';
import { getIntimacyLevelInfo, MIN_INTERACTION_AGE } from '../services/nobleInteraction';
import { sound } from '../services/sound';
import {
  Users,
  Award,
  ChevronRight,
  Clock,
  Send,
  Hourglass,
  ScrollText,
  Lock,
} from 'lucide-react';

interface RightSidebarCompanionProps {
  knownFigures: HistoricalFigureBond[];
  profile: PersonProfile;
  currentYear: number;
  currentSeason: SeasonIndex;
  currentStats: Attributes;
  age: number;
  seasonLogs: SeasonLogEntry[];
  onInteractFigure?: (figure: HistoricalFigureBond) => void;
  onOpenFiguresTab: () => void;
  onOpenChronicleTab?: () => void;
}

export const RightSidebarCompanion: React.FC<RightSidebarCompanionProps> = ({
  knownFigures,
  profile,
  currentYear,
  currentSeason,
  age,
  seasonLogs,
  onInteractFigure,
  onOpenFiguresTab,
  onOpenChronicleTab,
}) => {
  const [activeSideTab, setActiveSideTab] = useState<'FIGURES' | 'BOONS'>('FIGURES');
  const collectedBoons = profile.collectedBoons || [];
  const recentLogs = seasonLogs.slice(-3).reverse();

  return (
    <div className="space-y-4 text-xs font-classical select-none">
      {/* 模块一：天下人脉与知交 */}
      <div className="bg-[#1a1612] border border-[#3e3024] rounded-xl p-4 shadow-xl space-y-3">
        {/* 栏目标题与切换 */}
        <div className="flex items-center justify-between border-b border-[#33261a] pb-2.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span className="font-calligraphy text-base text-[#faece0] tracking-wider">
              结识的三国名人
            </span>
            <span className="text-[11px] font-mono text-[#f59e0b] px-1.5 py-0.2 rounded bg-[#2a1e15] border border-[#4d3723]">
              {knownFigures.length} 位
            </span>
          </div>
          <button
            onClick={() => {
              sound.playPluck(550);
              onOpenFiguresTab();
            }}
            className="text-[11px] text-[#d4af37] hover:text-[#fde68a] flex items-center gap-0.5 cursor-pointer transition-colors"
            title="打开三国名人全屏大卷"
          >
            <span>名人录</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 选项卡：知交名士 / 传世重宝 */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#14100d] p-1 rounded-lg border border-[#2d2218] text-[11px]">
          <button
            onClick={() => setActiveSideTab('FIGURES')}
            className={`py-1 rounded text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSideTab === 'FIGURES'
                ? 'bg-[#2f2218] text-[#faece0] font-semibold border border-[#5a422d]'
                : 'text-[#8c7b6a] hover:text-[#c7baa8]'
            }`}
          >
            <Users className="w-3 h-3 text-[#d4af37]" />
            <span>名人 ({knownFigures.length})</span>
          </button>
          <button
            onClick={() => setActiveSideTab('BOONS')}
            className={`py-1 rounded text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSideTab === 'BOONS'
                ? 'bg-[#2f2218] text-[#faece0] font-semibold border border-[#5a422d]'
                : 'text-[#8c7b6a] hover:text-[#c7baa8]'
            }`}
          >
            <Award className="w-3 h-3 text-amber-300" />
            <span>礼物 ({collectedBoons.length})</span>
          </button>
        </div>

        {/* 知交列表 */}
        {activeSideTab === 'FIGURES' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {knownFigures.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#14100c] border border-[#2b2016] text-center space-y-2">
                <Users className="w-6 h-6 mx-auto text-[#5a4635]" />
                <p className="text-xs text-[#b8a794]">还没有结识三国名人</p>
                <p className="text-[11px] text-[#7d6c5c] leading-relaxed">
                  随着年纪增长，出游、从军或打工时，有机会遇到赵云、关羽、华佗、诸葛亮等三国人物。
                </p>
              </div>
            ) : (
              knownFigures.map((fig) => {
                const intInfo = getIntimacyLevelInfo(fig.intimacy ?? fig.bondLevel * 25);
                const isCooldownThisSeason =
                  fig.lastInteractedYear === currentYear &&
                  fig.lastInteractedSeason === currentSeason;

                return (
                  <div
                    key={fig.id}
                    className="bg-[#211a14] border border-[#3d2e20] hover:border-[#6b5239] rounded-lg p-2.5 transition-all space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <PixelFigureAvatar
                        figureId={fig.id}
                        name={fig.name}
                        courtesyName={fig.courtesyName}
                        camp={fig.camp}
                        archetype={fig.archetype}
                        size="sm"
                        isAlive={fig.isAlive}
                        showCampBadge={true}
                        showCampBorder={true}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-calligraphy text-sm text-[#faece0] font-bold">
                              {fig.name}
                            </span>
                            {fig.courtesyName && (
                              <span className="text-[10px] text-[#a89b8d]">
                                字{fig.courtesyName}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#eab308] px-1.5 py-0.2 rounded bg-[#2e1d12] border border-[#4d3620] shrink-0">
                            {intInfo.title}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#c5a666] truncate mt-0.5">
                          {fig.campLabel}
                        </div>
                      </div>
                    </div>

                    {/* 羁绊进度 */}
                    <div className="space-y-1 bg-[#16120e] p-1.5 rounded border border-[#2b2017]">
                      <div className="flex items-center justify-between text-[10px] text-[#8e7e6e]">
                        <span className="text-[#a49381]">{fig.relation}</span>
                        <span className="font-mono text-[#f59e0b]">
                          {fig.intimacy ?? fig.bondLevel * 25} / 100 羁绊
                        </span>
                      </div>
                      <div className="w-full bg-[#201812] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] transition-all duration-300"
                          style={{ width: `${Math.min(100, fig.intimacy ?? fig.bondLevel * 25)}%` }}
                        />
                      </div>
                    </div>

                    {/* 技能加成与快速拜访 */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#2d2217] text-[11px]">
                      <span className="text-[#e5c158] truncate text-[10px]" title={fig.perkEffect}>
                        {fig.perkTitle}
                      </span>

                      {onInteractFigure && (
                        age < MIN_INTERACTION_AGE ? (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-classical flex items-center gap-1 bg-[#1a1410] text-[#8c7456] border border-[#2e2218] cursor-not-allowed shrink-0"
                            title={`主角现在才${age}岁，未满14岁还不便独自出门拜访名人`}
                          >
                            <Lock className="w-2.5 h-2.5 text-[#8c7456]" />
                            <span>年纪尚小</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              sound.playPluck(580);
                              onInteractFigure(fig);
                            }}
                            disabled={isCooldownThisSeason}
                            className={`px-2 py-0.5 rounded text-[10px] font-classical flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                              isCooldownThisSeason
                                ? 'bg-[#1e1712] text-[#6d5d4e] border border-[#2f2217] cursor-not-allowed'
                                : 'bg-[#8b261e] hover:bg-[#a32e25] text-[#faece0] border border-[#c4382c] shadow-xs active:scale-95'
                            }`}
                            title={isCooldownThisSeason ? '这季度已经拜访过了，下个季度才能再去' : '前去拜访'}
                          >
                            {isCooldownThisSeason ? (
                              <>
                                <Hourglass className="w-2.5 h-2.5" />
                                <span>本季已访</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-2.5 h-2.5" />
                                <span>拜访</span>
                              </>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 礼物道具列表 */}
        {activeSideTab === 'BOONS' && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {collectedBoons.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#14100c] border border-[#2b2016] text-center space-y-2">
                <Award className="w-6 h-6 mx-auto text-[#5a4635]" />
                <p className="text-xs text-[#b8a794]">目前还没有收到名人礼物</p>
                <p className="text-[11px] text-[#7d6c5c] leading-relaxed">
                  与三国名人搞好关系，好感度达到【知心好友】（60点）或【生死之交】（90点）后，就会收到他们赠送的宝物道具。
                </p>
              </div>
            ) : (
              collectedBoons.map((boon) => (
                <div
                  key={boon.id}
                  className="bg-[#211a14] border border-[#3d2e20] rounded-lg p-2.5 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <PixelFigureAvatar
                      figureId={boon.figureId}
                      name={boon.figureName}
                      size="xs"
                      showCampBorder={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-calligraphy text-sm text-[#fcd34d] font-bold">
                          {boon.name}
                        </span>
                        <span className="text-[10px] text-[#8c7b6a] font-mono">
                          {boon.typeLabel}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#a89b8d]">
                        {boon.figureName} 赠送
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#cfc2b2] leading-snug line-clamp-2">
                    {boon.specialEffect}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 模块二：最近经历 */}
      <div className="bg-[#1a1612] border border-[#3e3024] rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#33261a] pb-2.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-calligraphy text-base text-[#faece0] tracking-wider">
              最近经历
            </span>
            <span className="text-[10px] text-[#8c7b6a] font-classical px-1.5 py-0.2 rounded bg-[#1f1812] border border-[#36271a]">
              最新动态
            </span>
          </div>

          {onOpenChronicleTab && (
            <button
              onClick={() => {
                sound.playPluck(587);
                onOpenChronicleTab();
              }}
              className="text-[11px] text-[#38bdf8] hover:text-[#7dd3fc] flex items-center gap-0.5 cursor-pointer transition-colors"
              title="打开完整生平记录"
            >
              <ScrollText className="w-3 h-3" />
              <span>生平记录</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 倒序展示最近几个季度的经历 */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {recentLogs.length === 0 ? (
            <div className="p-4 rounded-lg bg-[#14100c] border border-[#2b2016] text-center text-xs text-[#7d6c5c]">
              日子才刚开始，往后经历会实时记录在这里。
            </div>
          ) : (
            recentLogs.map((log, idx) => {
              const seasonCfg = SEASONS_CONFIG[log.season];
              return (
                <div
                  key={idx}
                  className="bg-[#211a14] border border-[#382b1d] rounded-lg p-2.5 space-y-1.5 hover:border-[#523e2b] transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: seasonCfg?.color || '#f59e0b' }}
                      />
                      <span className="font-semibold text-[#f59e0b]">
                        公元 {log.year} 年 · {log.seasonName}
                      </span>
                    </div>
                    <span className="font-mono text-[#38bdf8] text-[10px]">
                      {log.age} 岁
                    </span>
                  </div>

                  <p className="text-[11px] text-[#ded3c5] line-clamp-2 leading-relaxed">
                    {log.storySummary}
                  </p>

                  {log.choiceMade && (
                    <div className="text-[10px] text-[#e5c158] truncate pt-1 border-t border-[#2e2216] flex items-center gap-1">
                      <span className="text-[#a4917d]">选择：</span>
                      <span className="font-medium text-[#f6d88a]">{log.choiceMade}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
