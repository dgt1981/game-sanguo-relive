import React, { useState, useMemo } from 'react';
import { SeasonLogEntry } from '../types/game';
import { SEASONS_CONFIG } from '../services/lifeSimulator';
import {
  Clock,
  CheckCircle2,
  Swords,
  Wheat,
  Sparkles,
  BookOpen,
  RotateCcw,
  Filter,
} from 'lucide-react';
import {
  TimelineFilter,
  matchesChronicleFilter,
  getEntryTags,
} from '../utils/chronicleFilter';

interface ChronicleTimelineProps {
  logs: SeasonLogEntry[];
  characterName: string;
}

export const ChronicleTimeline: React.FC<ChronicleTimelineProps> = ({
  logs,
  characterName,
}) => {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>('ALL');

  // 统计各维度在过往岁月中的发生频次
  const counts = useMemo(() => {
    let military = 0;
    let agriculture = 0;
    let encounter = 0;

    logs.forEach((entry) => {
      const tags = getEntryTags(entry);
      if (tags.includes('MILITARY')) military++;
      if (tags.includes('AGRICULTURE')) agriculture++;
      if (tags.includes('ENCOUNTER')) encounter++;
    });

    return {
      all: logs.length,
      military,
      agriculture,
      encounter,
    };
  }, [logs]);

  // 根据当前筛选标签过滤出的记录
  const filteredLogs = useMemo(() => {
    if (activeFilter === 'ALL') return logs;
    return logs.filter((entry) => matchesChronicleFilter(entry, activeFilter));
  }, [logs, activeFilter]);

  if (logs.length === 0) {
    return (
      <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-8 text-center text-[#9c8b78]">
        <Clock className="w-8 h-8 mx-auto mb-2 text-[#786958]" />
        <p className="font-classical text-sm">初生之时，岁月长卷正待书写。</p>
        <p className="text-xs text-[#6e6052] mt-1">
          四季流转，平生春秋与天下纪事将在此沉淀汇编。
        </p>
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

  const filterConfigs: {
    key: TimelineFilter;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    activeClass: string;
    inactiveClass: string;
    badgeClass: string;
  }[] = [
    {
      key: 'ALL',
      label: '全部生平',
      sublabel: '编年总览',
      icon: BookOpen,
      count: counts.all,
      activeClass:
        'bg-[#382617] text-[#faece0] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)]',
      inactiveClass:
        'bg-[#1e1712] text-[#a49381] border-[#3a2c20] hover:border-[#685038] hover:text-[#faece0]',
      badgeClass: 'bg-[#291c12] text-[#d4af37] border-[#4a3524]',
    },
    {
      key: 'MILITARY',
      label: '军事',
      sublabel: '行伍战阵',
      icon: Swords,
      count: counts.military,
      activeClass:
        'bg-[#3b1212] text-[#fecaca] border-[#dc2626] shadow-[0_0_12px_rgba(220,38,38,0.25)]',
      inactiveClass:
        'bg-[#1e1712] text-[#a49381] border-[#3a2c20] hover:border-[#7f1d1d] hover:text-[#fca5a5]',
      badgeClass: 'bg-[#2b0e0e] text-[#f87171] border-[#5c1d1d]',
    },
    {
      key: 'AGRICULTURE',
      label: '农耕',
      sublabel: '田亩稼穑',
      icon: Wheat,
      count: counts.agriculture,
      activeClass:
        'bg-[#122b18] text-[#bbf7d0] border-[#16a34a] shadow-[0_0_12px_rgba(22,163,74,0.25)]',
      inactiveClass:
        'bg-[#1e1712] text-[#a49381] border-[#3a2c20] hover:border-[#14532d] hover:text-[#86efac]',
      badgeClass: 'bg-[#0f2314] text-[#4ade80] border-[#1f4a29]',
    },
    {
      key: 'ENCOUNTER',
      label: '奇遇',
      sublabel: '名士机缘',
      icon: Sparkles,
      count: counts.encounter,
      activeClass:
        'bg-[#2d123d] text-[#f3e8ff] border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.25)]',
      inactiveClass:
        'bg-[#1e1712] text-[#a49381] border-[#3a2c20] hover:border-[#581c87] hover:text-[#d8b4fe]',
      badgeClass: 'bg-[#230f2f] text-[#c084fc] border-[#4c1d63]',
    },
  ];

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* 头部标题与草民实录标 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2e2319] gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-calligraphy text-[#faece0] tracking-wider">
            {characterName} · 四季编年录
          </h2>
          <span className="text-xs text-[#a29280]">
            已亲历 {logs.length} 季之春秋风霜 · 录此生喜怒悲欢
          </span>
        </div>
        <div className="text-xs text-[#d4af37] font-classical self-start sm:self-auto bg-[#241a13] px-3 py-1 rounded-full border border-[#4a3826]">
          【汉末草民实录】
        </div>
      </div>

      {/* 筛选标签栏 (军事 / 农耕 / 奇遇 / 全部) */}
      <div className="bg-[#16110d] border border-[#332519] rounded-xl p-2.5 sm:p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-classical font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#e5a84b]" />
            <span>轨迹分类筛选</span>
          </div>
          {activeFilter !== 'ALL' && (
            <button
              onClick={() => setActiveFilter('ALL')}
              className="text-[11px] text-[#f59e0b] hover:text-[#fde68a] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>显示全部轨迹</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filterConfigs.map((cfg) => {
            const Icon = cfg.icon;
            const isActive = activeFilter === cfg.key;
            return (
              <button
                key={cfg.key}
                onClick={() => setActiveFilter(cfg.key)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-classical transition-all cursor-pointer ${
                  isActive ? cfg.activeClass : cfg.inactiveClass
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold leading-tight">{cfg.label}</div>
                    <div className="text-[10px] opacity-70 leading-tight">
                      {cfg.sublabel}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                    isActive ? 'bg-white/10 border-white/20' : cfg.badgeClass
                  }`}
                >
                  {cfg.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 筛选激活提示条 */}
      {activeFilter !== 'ALL' && (
        <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-[#241a13] border border-[#4a3524] text-[#cfc2b2]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span>
              正在查看
              <span className="text-[#f59e0b] font-semibold mx-1">
                【{filterConfigs.find((c) => c.key === activeFilter)?.label}】
              </span>
              的人生轨迹
            </span>
            <span className="text-[#847565]">·</span>
            <span className="text-[#a49381]">
              筛选出 {filteredLogs.length} / {logs.length} 季生平记录
            </span>
          </div>
          <button
            onClick={() => setActiveFilter('ALL')}
            className="text-[11px] text-[#f59e0b] hover:underline cursor-pointer"
          >
            还原全部
          </button>
        </div>
      )}

      {/* 空状态：当前分类下未曾经历对应事件 */}
      {filteredLogs.length === 0 && (
        <div className="bg-[#201812] border border-[#3b2b1d] rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#17110c] border border-[#4a3625] flex items-center justify-center text-[#d4af37]">
            {activeFilter === 'MILITARY' && <Swords className="w-6 h-6 text-[#ef4444]" />}
            {activeFilter === 'AGRICULTURE' && <Wheat className="w-6 h-6 text-[#22c55e]" />}
            {activeFilter === 'ENCOUNTER' && <Sparkles className="w-6 h-6 text-[#a855f7]" />}
          </div>
          <h3 className="font-calligraphy text-base text-[#faece0]">
            {activeFilter === 'MILITARY' && '过往岁月，未染兵戈征尘'}
            {activeFilter === 'AGRICULTURE' && '过往岁月，未有农桑稼穑之迹'}
            {activeFilter === 'ENCOUNTER' && '岁月静好，暂未逢名士奇遇'}
          </h3>
          <p className="text-xs text-[#a29280] font-classical max-w-sm mx-auto leading-relaxed">
            {activeFilter === 'MILITARY' &&
              '平生远离乱世杀伐，隐于乡野市井，虽未建功沙场，亦是一番难得的平淡清安。待及冠成丁或战乱骤起，或将投效行伍。'}
            {activeFilter === 'AGRICULTURE' &&
              '此生未曾执犁荷锄躬耕南亩，更多岁月流转于市井营生、行伍征途或求道远游。'}
            {activeFilter === 'ENCOUNTER' &&
              '天命机缘尚待时日。多往四方郡县游历，或寻访名山大川，自有机缘偶遇当世豪杰与名家宿学。'}
          </p>
          <button
            onClick={() => setActiveFilter('ALL')}
            className="px-4 py-1.5 text-xs rounded-lg bg-[#332215] hover:bg-[#4a3220] border border-[#5c4028] text-[#e5c158] font-classical transition-colors cursor-pointer"
          >
            返回查看全部四季编年
          </button>
        </div>
      )}

      {/* 编年时间流水轴 Stream */}
      {filteredLogs.length > 0 && (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#4a3928]">
          {filteredLogs.map((entry, index) => {
            const seasonCfg = SEASONS_CONFIG[entry.season] || SEASONS_CONFIG[0];
            const tags = getEntryTags(entry);

            return (
              <div key={index} className="relative group">
                {/* 季节圆形标记 */}
                <div
                  className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-[#271d15] flex items-center justify-center text-[10px] font-classical shadow-sm transition-transform group-hover:scale-110"
                  style={{
                    border: `2px solid ${seasonCfg.color}`,
                    color: seasonCfg.color,
                  }}
                >
                  {seasonCfg.name}
                </div>

                {/* 记录主卡片 */}
                <div className="bg-[#221a14] border border-[#3b2b1d] rounded-lg p-3 sm:p-4 hover:border-[#634e3a] transition-all space-y-2 text-xs">
                  {/* 头部元数据行 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                      <span className="text-[#a89987] font-classical">
                        {entry.lunarYear}
                      </span>
                      <span className="text-[#847565]">·</span>
                      <span className="text-[#38bdf8] font-mono">
                        {entry.age} 岁
                      </span>
                      {entry.physiologicalStageName && (
                        <span className="px-1.5 py-0.2 rounded bg-[#332215] text-[#e5a84b] font-classical text-[10px] border border-[#523722]">
                          {entry.physiologicalStageName}
                        </span>
                      )}

                      {/* 维度徽章 (军事 / 农耕 / 奇遇) */}
                      {tags.includes('MILITARY') && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-classical bg-[#381010] text-[#fca5a5] border border-[#7f1d1d]">
                          <Swords className="w-2.5 h-2.5" />
                          军事
                        </span>
                      )}
                      {tags.includes('AGRICULTURE') && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-classical bg-[#0e2413] text-[#86efac] border border-[#166534]">
                          <Wheat className="w-2.5 h-2.5" />
                          农耕
                        </span>
                      )}
                      {tags.includes('ENCOUNTER') && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-classical bg-[#280e36] text-[#d8b4fe] border border-[#6b21a8]">
                          <Sparkles className="w-2.5 h-2.5" />
                          奇遇
                        </span>
                      )}
                    </div>

                    <span className="text-[#a39381] font-classical text-[11px]">
                      {entry.location} ({entry.occupation})
                    </span>
                  </div>

                  {/* 天下大事 */}
                  <div className="text-[#c5a666] font-classical line-clamp-1">
                    天下：{entry.macroHistory}
                  </div>

                  {/* 个人生平实录 */}
                  <p className="text-[#dfd5c8] leading-relaxed font-classical">
                    {entry.storySummary}
                  </p>

                  {/* 生理自然生长与岁月衰老足迹 */}
                  {entry.naturalChangeNote && (
                    <div className="text-[11px] text-[#86af8b] bg-[#141d16] px-2.5 py-1 rounded border border-[#233827] font-classical flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                      <span>{entry.naturalChangeNote}</span>
                    </div>
                  )}

                  {/* 当年所做抉择 */}
                  {entry.choiceMade && (
                    <div className="text-[#d4af37] pt-1 border-t border-[#2d2218] flex items-center gap-1 font-classical">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#e5c158]" />
                      <span>当年抉择：{entry.choiceMade}</span>
                    </div>
                  )}

                  {/* 抉择属性影响数值 */}
                  {entry.statChanges && Object.keys(entry.statChanges).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 font-mono text-[11px] tabular-nums">
                      <span className="text-[10px] text-[#baa996] font-classical">
                        【抉择影响】
                      </span>
                      {Object.entries(entry.statChanges).map(([k, v]) => {
                        if (!v) return null;
                        const isPos = (v as number) > 0;
                        return (
                          <span
                            key={k}
                            className={`px-1.5 py-0.2 rounded bg-[#17110d] border border-[#33261a] ${
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
      )}
    </div>
  );
};
