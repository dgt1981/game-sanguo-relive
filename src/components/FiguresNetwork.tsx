import React, { useState } from 'react';
import {
  HistoricalFigureBond,
  FigureArchetype,
  Attributes,
} from '../types/game';
import { PersonProfile } from '../services/lifeSimulator';
import {
  evaluateFigurePerks,
  getUnmetRegionalFigures,
} from '../services/figuresSimulation';
import {
  Shield,
  Brain,
  Coins,
  HeartPulse,
  BookOpen,
  Users,
  MapPin,
  Sparkles,
  Award,
  Filter,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { sound } from '../services/sound';

interface FiguresNetworkProps {
  knownFigures: HistoricalFigureBond[];
  profile: PersonProfile;
  currentYear: number;
  currentStats: Attributes;
  onInteractFigure?: (figureId: string) => void;
}

export const FiguresNetwork: React.FC<FiguresNetworkProps> = ({
  knownFigures,
  profile,
  currentYear,
  currentStats,
  onInteractFigure,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<FigureArchetype | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'KNOWN' | 'REGIONAL'>('KNOWN');

  const perksInfo = evaluateFigurePerks(knownFigures);
  const unmetRegional = getUnmetRegionalFigures(
    profile.currentProvince,
    knownFigures.map((f) => f.id),
    currentYear
  );

  // Filter known figures
  const filteredFigures = knownFigures.filter((fig) => {
    if (selectedArchetype === 'ALL') return true;
    return fig.archetype === selectedArchetype;
  });

  const getArchetypeBadge = (archetype: FigureArchetype) => {
    switch (archetype) {
      case 'MARTIAL':
        return {
          label: '勇武过人',
          color: 'text-amber-300 border-amber-600/60 bg-amber-950/30',
          icon: Shield,
        };
      case 'STRATEGIST':
        return {
          label: '才智过人',
          color: 'text-cyan-300 border-cyan-600/60 bg-cyan-950/30',
          icon: Brain,
        };
      case 'WEALTHY':
        return {
          label: '财富雄厚',
          color: 'text-yellow-400 border-yellow-500/60 bg-yellow-950/30',
          icon: Coins,
        };
      case 'HEALER':
        return {
          label: '妙手医圣',
          color: 'text-emerald-300 border-emerald-600/60 bg-emerald-950/30',
          icon: HeartPulse,
        };
      case 'HERMIT':
        return {
          label: '经学名士',
          color: 'text-purple-300 border-purple-600/60 bg-purple-950/30',
          icon: BookOpen,
        };
    }
  };

  const getBondLevelDisplay = (level: number) => {
    switch (level) {
      case 1:
        return { text: '初识微交', stars: '★☆☆☆', color: 'text-[#9c8e82]' };
      case 2:
        return { text: '相熟故交', stars: '★★☆☆', color: 'text-amber-400' };
      case 3:
        return { text: '莫逆同道', stars: '★★★☆', color: 'text-emerald-400' };
      case 4:
      default:
        return { text: '生死托付', stars: '★★★★', color: 'text-[#d4af37]' };
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部总览横幅: 名士人脉与特权庇护 */}
      <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#8b261e]/15 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-sm bg-[#8b261e] border border-[#d4af37]/40 flex items-center justify-center text-[#fae8c8] font-calligraphy text-xl shadow">
                仕
              </span>
              <div>
                <h2 className="text-xl font-calligraphy text-[#fae8c8] tracking-wider flex items-center gap-2">
                  天下名仕谱 · 人脉气运
                </h2>
                <p className="text-xs text-[#a89b8d] font-serif">
                  历史名仕与你同历甲子风云，年岁渐长，智勇演化。结交英豪多寡，深系你晚岁成就与存亡。
                </p>
              </div>
            </div>

            {/* 人脉统计指标 */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-serif mt-3 text-[#d5c7b7]">
              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>结识英豪:</span>
                <span className="font-calligraphy text-base text-[#e5c158] font-bold">
                  {knownFigures.length}
                </span>
                <span className="text-[#8c7e72]">人</span>
              </div>

              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>当前健在:</span>
                <span className="font-calligraphy text-base text-emerald-400 font-bold">
                  {knownFigures.filter((f) => f.isAlive).length}
                </span>
                <span className="text-[#8c7e72]">人</span>
              </div>

              <div className="bg-[#241e19] px-3 py-1.5 rounded border border-[#4a3d31] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>同郡待识:</span>
                <span className="font-calligraphy text-base text-blue-400 font-bold">
                  {unmetRegional.length}
                </span>
                <span className="text-[#8c7e72]">人</span>
              </div>
            </div>
          </div>

          {/* 活跃特权与庇护汇总 */}
          <div className="bg-[#15120f]/90 border border-[#4a3d31] rounded p-3 min-w-[280px]">
            <div className="text-xs font-serif text-[#d4af37] flex items-center gap-1.5 mb-2 border-b border-[#3d3228] pb-1 font-semibold">
              <Award className="w-3.5 h-3.5" />
              当前生效的名仕庇护特权
            </div>
            {perksInfo.activePerks.length === 0 ? (
              <p className="text-xs text-[#8c7e72] font-serif py-1">
                尚无名士达成莫逆深交。多参与同郡探访与历史抉择，结交天下英豪。
              </p>
            ) : (
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 text-xs">
                {perksInfo.fatalDamageProtection && (
                  <div className="flex items-center gap-1.5 text-amber-300 font-serif">
                    <Shield className="w-3 h-3 shrink-0" />
                    <span>【勇武战阵庇护】危急时刻有良将援护，降低战死概率</span>
                  </div>
                )}
                {perksInfo.epidemicImmunity && (
                  <div className="flex items-center gap-1.5 text-emerald-300 font-serif">
                    <HeartPulse className="w-3 h-3 shrink-0" />
                    <span>【医圣岐黄护体】神医赠方调理，大幅抵御恶疾疫病</span>
                  </div>
                )}
                {perksInfo.seasonalWealthYield > 0 && (
                  <div className="flex items-center gap-1.5 text-yellow-300 font-serif">
                    <Coins className="w-3 h-3 shrink-0" />
                    <span>【淮商巨贾接济】岁末商道贴补家资 +{perksInfo.seasonalWealthYield}</span>
                  </div>
                )}
                {perksInfo.activePerks.slice(0, 3).map((p, i) => (
                  <div key={i} className="text-[#c7baa8] font-serif truncate">
                    <span className="text-[#e5c158] font-medium">{p.figureName}</span> · {p.perkTitle}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 视图切换与分类过滤 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3d3228] pb-3">
        {/* 标签切换: 已结识名士 / 同郡待寻风云 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPluck(523);
              setActiveTab('KNOWN');
            }}
            className={`px-3 py-1.5 text-xs font-serif rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'KNOWN'
                ? 'bg-[#8b261e] text-[#fae8c8] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#a89b8d] hover:text-[#fae8c8] bg-[#211b17] border border-[#3d3228]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            已结识名仕 ({knownFigures.length})
          </button>
          <button
            onClick={() => {
              sound.playPluck(587);
              setActiveTab('REGIONAL');
            }}
            className={`px-3 py-1.5 text-xs font-serif rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REGIONAL'
                ? 'bg-[#8b261e] text-[#fae8c8] border border-[#d4af37]/40 shadow-sm'
                : 'text-[#a89b8d] hover:text-[#fae8c8] bg-[#211b17] border border-[#3d3228]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            本州待识贤士 ({unmetRegional.length})
          </button>
        </div>

        {/* 贤士类型过滤 */}
        {activeTab === 'KNOWN' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-serif">
            <span className="text-[#8c7e72] flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> 筛选:
            </span>
            {(
              [
                { key: 'ALL', label: '全部' },
                { key: 'MARTIAL', label: '勇武' },
                { key: 'STRATEGIST', label: '谋略' },
                { key: 'WEALTHY', label: '巨贾' },
                { key: 'HEALER', label: '医圣' },
                { key: 'HERMIT', label: '经学' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  sound.playPluck(600);
                  setSelectedArchetype(tab.key);
                }}
                className={`px-2 py-1 rounded transition-colors cursor-pointer shrink-0 ${
                  selectedArchetype === tab.key
                    ? 'bg-[#3b2e24] text-[#fae8c8] border border-[#6b5541]'
                    : 'text-[#8c7e72] hover:text-[#c7baa8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 视图内容区 */}
      {activeTab === 'KNOWN' ? (
        filteredFigures.length === 0 ? (
          <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-10 text-center text-[#8c7e72] font-serif space-y-3">
            <Users className="w-10 h-10 mx-auto text-[#4a3d31]" />
            <p className="text-base text-[#c7baa8]">
              {selectedArchetype === 'ALL'
                ? '暂未结识此类型的名士。'
                : '暂无该流派的名士挚友。'}
            </p>
            <p className="text-xs text-[#8c7e72]">
              在随后的四季流转与历史关隘中，选择参与行伍、寻访草庐、拜谒名医，即可结识天下豪杰。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFigures.map((figure) => {
              const badge = getArchetypeBadge(figure.archetype);
              const bondBadge = getBondLevelDisplay(figure.bondLevel);
              const BadgeIcon = badge.icon;
              const isChildhoodFriend =
                figure.relation.includes('竹马') ||
                figure.relation.includes('总角') ||
                figure.relation.includes('同里');

              return (
                <div
                  key={figure.id}
                  className={`bg-[#1c1815] border rounded-md p-4 transition-all duration-200 shadow-md hover:border-[#6b5541] relative overflow-hidden flex flex-col justify-between ${
                    figure.isAlive ? 'border-[#3d3228]' : 'border-[#2e2620] opacity-80'
                  }`}
                >
                  {/* 背景朱印大字水印 */}
                  <div className="absolute -bottom-6 -right-3 text-7xl font-calligraphy text-[#2b221b]/40 select-none pointer-events-none">
                    {figure.avatarChar}
                  </div>

                  <div>
                    {/* 头部信息栏 */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        {/* 人物汉字头像 */}
                        <div
                          className={`w-12 h-12 rounded bg-[#2a221c] border flex items-center justify-center font-calligraphy text-2xl shadow-inner shrink-0 ${
                            figure.isAlive
                              ? 'border-[#8b261e] text-[#fae8c8]'
                              : 'border-[#4a3d31] text-[#7a6f65]'
                          }`}
                        >
                          {figure.avatarChar}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-calligraphy text-[#fae8c8] tracking-wider">
                              {figure.name}
                            </h3>
                            <span className="text-xs font-serif text-[#a89b8d]">
                              字 {figure.courtesyName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#d4af37] font-serif">
                              {figure.campLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 贤士流派徽章 */}
                      <div
                        className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 font-serif ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </div>
                    </div>

                    {/* 羁绊关系与年岁状态 */}
                    <div className="flex flex-wrap items-center justify-between text-xs font-serif py-1.5 px-2.5 rounded bg-[#15120f] border border-[#2e2620] mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#fae8c8] font-medium">{figure.relation}</span>
                        {isChildhoodFriend && (
                          <span className="text-[10px] bg-[#8b261e]/40 border border-[#8b261e] text-[#fae8c8] px-1 rounded">
                            总角竹马
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs ${bondBadge.color}`}>
                          {bondBadge.stars} {bondBadge.text}
                        </span>
                        <span className="text-[#4a3d31]">|</span>
                        <span className={figure.isAlive ? 'text-emerald-400' : 'text-[#7a6f65]'}>
                          {figure.isAlive
                            ? `现年 ${figure.currentAge} 岁`
                            : `已故 · 享年 ${figure.deathYear - figure.birthYear} 岁`}
                        </span>
                      </div>
                    </div>

                    {/* 动态成长五维属性条 */}
                    <div className="space-y-1.5 mb-3 bg-[#171310] p-2.5 rounded border border-[#2b221b]">
                      <div className="text-[11px] text-[#8c7e72] font-serif flex justify-between mb-1">
                        <span>岁稔心智 · 当前五维演化</span>
                        <span>{currentYear}年 实况</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-serif">
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">体魄</div>
                          <div className="font-calligraphy text-amber-200">
                            {figure.currentStats.health}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">识见</div>
                          <div className="font-calligraphy text-cyan-200">
                            {figure.currentStats.intellect}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">勇略</div>
                          <div className="font-calligraphy text-red-200">
                            {figure.currentStats.martial}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">仁厚</div>
                          <div className="font-calligraphy text-emerald-200">
                            {figure.currentStats.virtue}
                          </div>
                        </div>
                        <div className="bg-[#1f1915] p-1 rounded border border-[#382b22]">
                          <div className="text-[10px] text-[#9c8e82]">家财</div>
                          <div className="font-calligraphy text-yellow-200">
                            {figure.currentStats.wealth}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 专属庇护特权 */}
                    <div className="bg-[#211a15] border border-[#423328] rounded p-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#e5c158] font-serif font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                        <span>{figure.perkTitle}</span>
                      </div>
                      <p className="text-[11px] text-[#b3a596] font-serif mt-0.5 leading-relaxed">
                        {figure.perkEffect}
                      </p>
                    </div>

                    {/* 动态年岁交谈对白 */}
                    <div className="bg-[#14110e] border-l-2 border-[#8b261e] p-2 rounded-r text-xs font-serif text-[#dcd1c4] italic flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#8b261e] shrink-0 mt-0.5" />
                      <div>
                        <span className="not-italic text-[#8c7e72] mr-1">言道:</span>
                        “{figure.lastSpoken}”
                      </div>
                    </div>
                  </div>

                  {/* 籍贯信息底栏 */}
                  <div className="mt-3 pt-2 border-t border-[#2b221b] flex items-center justify-between text-[11px] text-[#8c7e72] font-serif">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#6b5541]" />
                      籍贯: {figure.birthplace}
                    </span>
                    <span>于公元 {figure.metYear} 年相识</span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* 本州待识贤士列表 */
        <div>
          <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-4 mb-4 text-xs font-serif text-[#a89b8d]">
            当前身处【{profile.currentProvince}】。汉末天下大乱，许多名士尚未涉足朝堂军旅，或结庐隐居，或游历行医，或行商里社。在四季大事或探访中可能偶遇结交。
          </div>

          {unmetRegional.length === 0 ? (
            <div className="bg-[#1b1714] border border-[#3d3228] rounded-md p-10 text-center text-[#8c7e72] font-serif">
              当前州域暂无未遇的名士贤达。可待往后游历其他州郡，或投效军旅结交同道。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unmetRegional.map((entry) => {
                const badge = getArchetypeBadge(entry.archetype);
                const BadgeIcon = badge.icon;
                const figureAge = Math.max(0, currentYear - entry.birthYear);

                return (
                  <div
                    key={entry.id}
                    className="bg-[#181412] border border-[#332921] rounded-md p-4 text-xs font-serif space-y-2.5 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#241d18] border border-[#4a3d31] flex items-center justify-center font-calligraphy text-xl text-[#fae8c8]">
                          {entry.avatarChar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-calligraphy text-base text-[#fae8c8]">
                              {entry.name}
                            </span>
                            <span className="text-[#8c7e72]">字 {entry.courtesyName}</span>
                          </div>
                          <div className="text-[11px] text-[#d4af37]">{entry.titleTag}</div>
                        </div>
                      </div>

                      <div
                        className={`px-2 py-0.5 rounded border text-[11px] flex items-center gap-1 ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </div>
                    </div>

                    <p className="text-[#b3a596] leading-relaxed line-clamp-2">
                      {entry.historicalBio}
                    </p>

                    <div className="bg-[#1f1915] p-2 rounded border border-[#31251d]">
                      <div className="text-[#e5c158] font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        特权潜质: {entry.perk.title}
                      </div>
                      <div className="text-[#8c7e72] text-[11px] mt-0.5">
                        {entry.perk.buffEffect}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#2b221b] flex items-center justify-between text-[#8c7e72] text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {entry.birthplace}
                      </span>
                      <span>当前年岁: 约 {figureAge} 岁</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
