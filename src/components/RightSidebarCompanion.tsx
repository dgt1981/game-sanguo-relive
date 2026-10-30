import React, { useState } from 'react';
import {
  HistoricalFigureBond,
  Attributes,
  SeasonIndex,
  SeasonLogEntry,
} from '../types/game';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import { PixelFigureAvatar } from './PixelFigureAvatar';
import { getIntimacyLevelInfo } from '../services/nobleInteraction';
import { sound } from '../services/sound';
import {
  Users,
  Award,
  ChevronRight,
  Clock,
  Send,
  Hourglass,
  ScrollText,
} from 'lucide-react';

interface RightSidebarCompanionProps {
  knownFigures: HistoricalFigureBond[];
  profile: PersonProfile;
  currentYear: number;
  currentSeason: SeasonIndex;
  currentStats: Attributes;
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
              天下人脉与知交
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
            title="打开群雄谱全屏大卷"
          >
            <span>群雄谱</span>
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
            <span>知交 ({knownFigures.length})</span>
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
            <span>重宝 ({collectedBoons.length})</span>
          </button>
        </div>

        {/* 知交列表 */}
        {activeSideTab === 'FIGURES' && (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {knownFigures.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#14100c] border border-[#2b2016] text-center space-y-2">
                <Users className="w-6 h-6 mx-auto text-[#5a4635]" />
                <p className="text-xs text-[#b8a794]">尚未结识历史名士</p>
                <p className="text-[11px] text-[#7d6c5c] leading-relaxed">
                  随四季流转出游、从军或游历郡县，自会与赵云、关羽、华佗、诸葛亮等当世豪杰偶遇结交。
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

                    {/* 特权与快速拜谒 */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#2d2217] text-[11px]">
                      <span className="text-[#e5c158] truncate text-[10px]" title={fig.perkEffect}>
                        {fig.perkTitle}
                      </span>

                      {onInteractFigure && (
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
                          title={isCooldownThisSeason ? '本季已拜谒修好，下季方可再访' : '过访修好'}
                        >
                          {isCooldownThisSeason ? (
                            <>
                              <Hourglass className="w-2.5 h-2.5" />
                              <span>已访</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-2.5 h-2.5" />
                              <span>过访</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 重宝列表 */}
        {activeSideTab === 'BOONS' && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {collectedBoons.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#14100c] border border-[#2b2016] text-center space-y-2">
                <Award className="w-6 h-6 mx-auto text-[#5a4635]" />
                <p className="text-xs text-[#b8a794]">行囊尚无传世重宝</p>
                <p className="text-[11px] text-[#7d6c5c] leading-relaxed">
                  与名士结交至【莫逆同道】（60点）或【生死托付】（90点），便可获赠青釭剑、八阵图、伤寒经方等重宝。
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
                        {boon.figureName} 赠
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

      {/* 模块二：平生近事（原“近事”独立移至下方空白板块） */}
      <div className="bg-[#1a1612] border border-[#3e3024] rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#33261a] pb-2.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-calligraphy text-base text-[#faece0] tracking-wider">
              平生近事
            </span>
            <span className="text-[10px] text-[#8c7b6a] font-classical px-1.5 py-0.2 rounded bg-[#1f1812] border border-[#36271a]">
              近历岁时
            </span>
          </div>

          {onOpenChronicleTab && (
            <button
              onClick={() => {
                sound.playPluck(587);
                onOpenChronicleTab();
              }}
              className="text-[11px] text-[#38bdf8] hover:text-[#7dd3fc] flex items-center gap-0.5 cursor-pointer transition-colors"
              title="打开完整平生编年史卷"
            >
              <ScrollText className="w-3 h-3" />
              <span>编年史</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 倒序展示最近几个季度的经历 */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {recentLogs.length === 0 ? (
            <div className="p-4 rounded-lg bg-[#14100c] border border-[#2b2016] text-center text-xs text-[#7d6c5c]">
              岁月方兴，长卷待书。
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
                      <span className="text-[#a4917d]">决断：</span>
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
