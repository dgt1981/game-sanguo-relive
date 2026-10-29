import React from 'react';
import { Attributes, SeasonIndex } from '../types/game';
import { PersonProfile, SEASONS_CONFIG, getPhysiologicalStage } from '../services/lifeSimulator';
import { ProtagonistPixelAvatar } from './ProtagonistPixelAvatar';
import {
  Heart,
  BookOpen,
  Sword,
  Users,
  Coins,
  Sparkles,
  MapPin,
  Activity,
  ShieldCheck,
  Swords,
  Award,
  BookmarkCheck,
  LogOut,
} from 'lucide-react';

interface LifeAttributeHUDProps {
  stats: Attributes;
  profile: PersonProfile;
  year: number;
  season: SeasonIndex;
  age: number;
  lunarYear: string;
  onNavigateToFigures?: () => void;
  sidebarMode?: boolean;
  onExitSave?: () => void;
}

export const LifeAttributeHUD: React.FC<LifeAttributeHUDProps> = ({
  stats,
  profile,
  year,
  season,
  age,
  lunarYear,
  onNavigateToFigures,
  sidebarMode = false,
  onExitSave,
}) => {
  const seasonCfg = SEASONS_CONFIG[season];
  const stage = getPhysiologicalStage(age);

  // Dynamic growth trend label per stat
  const getStatTrend = (key: keyof Attributes): { text: string; color: string } => {
    if (key === 'health') {
      if (age <= 2) return { text: '脆弱萌生 ↑', color: '#38bdf8' };
      if (age <= 13) return { text: '自然抽条 ↑', color: '#4ade80' };
      if (age <= 35) return { text: '筋骨正盛 ★', color: '#10b981' };
      if (age <= 50) return { text: '体魄平稳 ≈', color: '#eab308' };
      if (age <= 65) return { text: '气血渐衰 ↓', color: '#f97316' };
      return { text: '岁暮残喘 ↓', color: '#ef4444' };
    }
    if (key === 'martial') {
      if (age <= 2) return { text: '骨软未行 💤', color: '#9ca3af' };
      if (age <= 6) return { text: '嬉闹微萌 ↑', color: '#a78bfa' };
      if (age <= 19) return { text: '气力大成 ↑', color: '#4ade80' };
      if (age <= 35) return { text: '武略鼎盛 ★', color: '#ea580c' };
      if (age <= 50) return { text: '旧伤微敛 ≈', color: '#ca8a04' };
      return { text: '筋骨退化 ↓', color: '#f97316' };
    }
    if (key === 'intellect') {
      if (age <= 2) return { text: '咿呀学语 🌱', color: '#9ca3af' };
      if (age <= 13) return { text: '发蒙启智 ↑', color: '#38bdf8' };
      if (age <= 35) return { text: '自立历练 ↑', color: '#60a5fa' };
      return { text: '老成洞明 ★', color: '#0284c7' };
    }
    if (key === 'virtue') {
      if (age <= 6) return { text: '纯真天性', color: '#9ca3af' };
      if (age <= 35) return { text: '立德修身 ↑', color: '#ca8a04' };
      return { text: '乡党宗崇 ★', color: '#f59e0b' };
    }
    if (key === 'wealth') {
      if (age <= 6) return { text: '父母口粮', color: '#9ca3af' };
      if (age <= 19) return { text: '做工助耕 ↑', color: '#38bdf8' };
      if (age <= 50) return { text: '积粮置田 ↑', color: '#eab308' };
      return { text: '子孙守成', color: '#ca8a04' };
    }
    // fortune
    return { text: '天命机缘', color: '#c084fc' };
  };

  const statConfig: { key: keyof Attributes; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'health', label: '体魄', icon: <Heart className="w-3.5 h-3.5" />, color: stats.health < 25 ? '#ef4444' : '#10b981' },
    { key: 'intellect', label: '识见', icon: <BookOpen className="w-3.5 h-3.5" />, color: '#0284c7' },
    { key: 'martial', label: '勇略', icon: <Sword className="w-3.5 h-3.5" />, color: '#c2410c' },
    { key: 'virtue', label: '仁厚', icon: <Users className="w-3.5 h-3.5" />, color: '#ca8a04' },
    { key: 'wealth', label: '家财', icon: <Coins className="w-3.5 h-3.5" />, color: '#eab308' },
    { key: 'fortune', label: '气数', icon: <Sparkles className="w-3.5 h-3.5" />, color: '#a855f7' },
  ];

  // ----------------------------------------------------
  // PC 模式下的左栏垂直命盘结构 (Sidebar Mode)
  // ----------------------------------------------------
  if (sidebarMode) {
    return (
      <div className="bg-[#1a1612] border border-[#3e3024] rounded-xl p-4 shadow-xl space-y-4 text-xs font-classical select-none">
        {/* 顶部主角像素头像与身份印契 */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#33261a]">
          <ProtagonistPixelAvatar
            stageKey={stage.stageKey}
            gender={profile.gender}
            age={age}
            camp={profile.militaryAffiliation?.camp || 'NONE'}
            socialClass={profile.socialClass}
            name={profile.name}
            size="lg"
            showAgeBadge={true}
            showCampBorder={true}
            showTooltip={true}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-calligraphy text-xl text-[#faece0] font-bold">
                {profile.name}
              </span>
              <span className="text-xs text-[#a39482]">字 {profile.courtesyName}</span>
            </div>
            <div className="text-[11px] text-[#c5a666] flex items-center gap-1 mt-0.5 truncate">
              <span>{profile.gender === 'MALE' ? '男丁' : '女秀'}</span>
              <span>·</span>
              <span className="text-[#f59e0b] font-semibold">{profile.occupation}</span>
            </div>
            <div className="text-[10px] text-[#8c7b69] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
              <span>{profile.commandery} · {profile.county}</span>
            </div>
          </div>
        </div>

        {/* 纪元时序与享年 */}
        <div className="bg-[#14100c] p-2.5 rounded-lg border border-[#2d2218] space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-[#8e7e6e]">天命纪元</span>
            <div className="flex items-center gap-1.5 font-mono text-[#f59e0b] font-semibold">
              <span>公元 {year} 年</span>
              <span
                className="px-1.5 py-0.2 rounded font-classical text-[10px]"
                style={{
                  color: seasonCfg.color,
                  backgroundColor: `${seasonCfg.color}15`,
                  border: `1px solid ${seasonCfg.color}40`,
                }}
              >
                {seasonCfg.name}季
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8e7e6e]">农历干支</span>
            <span className="text-[#c7baa8]">{lunarYear} · {seasonCfg.solarTerm}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#231a13]">
            <span className="text-[#8e7e6e]">当前享年</span>
            <span className="text-[#38bdf8] font-mono font-bold text-sm">{age} 岁</span>
          </div>
        </div>

        {/* 生理阶段成长律动 */}
        <div className="bg-[#211a14] p-2.5 rounded-lg border border-[#4a3625] space-y-1 text-[11px]">
          <div className="flex items-center justify-between text-[#e5a84b] font-semibold">
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#e5a84b]" />
              <span>【{stage.stageName} · {stage.tag}】</span>
            </div>
            <span className="text-[10px] font-mono text-[#a89985]">{stage.ageRange}</span>
          </div>
          <p className="text-[10px] text-[#c5b7a7] leading-relaxed italic">
            {stage.description}
          </p>
        </div>

        {/* 六维气数垂直计量槽 */}
        <div className="space-y-2">
          <div className="text-[11px] text-[#8e7e6e] flex items-center justify-between">
            <span>身家五维与气数命盘</span>
            <span className="text-[10px] text-[#6b5b4c]">满值 100</span>
          </div>

          <div className="space-y-1.5">
            {statConfig.map(({ key, label, icon, color }) => {
              const val = Math.max(0, Math.min(100, stats[key]));
              const trend = getStatTrend(key);

              return (
                <div
                  key={key}
                  className="bg-[#211a14] border border-[#382d23] rounded-lg p-2 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-classical text-[#ded3c5]">
                      <span style={{ color }}>{icon}</span>
                      <span>{label}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: trend.color }} className="text-[10px]">
                        {trend.text}
                      </span>
                      <span className="font-mono font-bold text-sm text-[#f5ede3] w-6 text-right">
                        {val}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#14100c] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${val}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 阵营与从军情况 */}
        {profile.militaryAffiliation && profile.militaryAffiliation.camp !== 'NONE' && (
          <div className="bg-[#211a14] p-2.5 rounded-lg border border-[#4d3824] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#f59e0b] font-semibold text-xs">
              <Swords className="w-3.5 h-3.5" />
              <span>阵营从军：{profile.militaryAffiliation.roleTitle}</span>
            </div>
            {profile.militaryAffiliation.campaigns.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap text-[10px] text-[#e5a84b]">
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

        {/* 存盘退出按钮 */}
        {onExitSave && (
          <div className="pt-2 border-t border-[#33261a]">
            <button
              onClick={onExitSave}
              className="w-full py-2 rounded-lg bg-[#231b15] hover:bg-[#32251c] border border-[#3e3023] text-[#dcd1c2] hover:text-[#faece0] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="保存当前进度并退出，随时可承接前缘继续"
            >
              <LogOut className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>中途存盘 · 退出到卷首</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 移动端或顶部平铺模式 (Horizontal Mode)
  // ----------------------------------------------------
  return (
    <div className="bg-[#1c1815] border border-[#3b3026] rounded-lg p-3 md:p-4 shadow-lg text-[#e6ded5] space-y-3">
      {/* Top Identity Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2e261e]">
        <div className="flex items-center gap-3">
          <ProtagonistPixelAvatar
            stageKey={stage.stageKey}
            gender={profile.gender}
            age={age}
            camp={profile.militaryAffiliation?.camp || 'NONE'}
            socialClass={profile.socialClass}
            name={profile.name}
            size="md"
            showAgeBadge={true}
            showCampBorder={true}
            showTooltip={true}
          />
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-calligraphy text-lg md:text-xl text-[#f3ece2]">
                {profile.name}
              </span>
              <span className="text-xs text-[#a39482]">字 {profile.courtesyName}</span>
              <span className="text-xs text-[#7d7162]">
                ({profile.gender === 'MALE' ? '男丁' : '女秀'} · {profile.occupation})
              </span>
            </div>
            <div className="text-xs text-[#8c7b69] flex items-center gap-1 font-classical mt-0.5">
              <MapPin className="w-3 h-3 text-[#d4af37]" />
              <span>生于【{profile.commandery} · {profile.county}】</span>
            </div>
          </div>
        </div>

        {/* Date, Age, and Physiological Life Stage Badge */}
        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#dcd1c2] flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#251f1a] px-2.5 py-1 rounded border border-[#3f3428]">
            <span className="text-[#a89985]">纪元</span>
            <span className="text-[#f59e0b] font-semibold">公元 {year} 年</span>
            <span
              className="px-1.5 py-0.2 rounded font-classical text-xs"
              style={{
                color: seasonCfg.color,
                backgroundColor: `${seasonCfg.color}15`,
                border: `1px solid ${seasonCfg.color}40`,
              }}
            >
              {seasonCfg.name}季
            </span>
            <span className="text-[#877868]">({lunarYear})</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#251f1a] px-2.5 py-1 rounded border border-[#3f3428]">
            <span className="text-[#a89985]">享年</span>
            <span className="text-[#38bdf8] font-semibold">{age} 岁</span>
          </div>

          {/* Physiological Life Stage Badge */}
          <div className="flex items-center gap-1.5 bg-[#2c1d12] px-2.5 py-1 rounded border border-[#6b4728] shadow-sm">
            <Activity className="w-3.5 h-3.5 text-[#e5a84b]" />
            <span className="text-[#faece0] font-classical font-semibold">
              【{stage.stageName} · {stage.tag}】
            </span>
          </div>
        </div>
      </div>

      {/* Physiological Stage Sub-Bar */}
      <div className="bg-[#17120e] px-3 py-1.5 rounded border border-[#2d2218] flex flex-wrap items-center justify-between gap-2 text-[11px] font-classical">
        <div className="flex items-center gap-1.5 text-[#bfaea0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5a84b]" />
          <span className="text-[#e5a84b] font-semibold">生理周期（{stage.ageRange}）：</span>
          <span className="italic">{stage.description}</span>
        </div>
        <div className="text-[10px] text-[#8e7e6e]">
          注：随年龄推移自然成长与衰老，事件与抉择在此基础上叠加
        </div>
      </div>

      {/* 6 Core Stats with Physiological Trend Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {statConfig.map(({ key, label, icon, color }) => {
          const val = Math.max(0, Math.min(100, stats[key]));
          const trend = getStatTrend(key);

          return (
            <div
              key={key}
              className="bg-[#241e19] border border-[#382d23] rounded p-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-[#b0a190] mb-0.5">
                <span className="flex items-center gap-1 font-classical">
                  <span style={{ color }}>{icon}</span>
                  {label}
                </span>
                <span className="font-mono tabular-nums font-bold text-sm text-[#f5ede3]">
                  {val}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#171310] h-1.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${val}%`, backgroundColor: color }}
                />
              </div>

              {/* Biological Growth / Aging Trend status */}
              <div className="text-[10px] flex items-center justify-between font-classical">
                <span className="text-[#786b5d]">生理律动</span>
                <span style={{ color: trend.color }} className="font-medium">
                  {trend.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Bonds & Military Affiliation Banner (天下知交与阵营随军) */}
      <div className="bg-[#181310] border border-[#382c20] rounded-lg p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-classical">
        {/* Military / Camp Status */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#2e1d13] border border-[#593922] flex items-center justify-center text-[#d4af37]">
            <Swords className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#8e7f6e]">阵营从军：</span>
              {profile.militaryAffiliation && profile.militaryAffiliation.camp !== 'NONE' ? (
                <span className="font-semibold text-[#f59e0b] bg-[#291b10] px-2 py-0.5 rounded border border-[#543b24]">
                  {profile.militaryAffiliation.camp === 'WEI'
                    ? '【曹魏】'
                    : profile.militaryAffiliation.camp === 'SHU'
                    ? '【蜀汉】'
                    : profile.militaryAffiliation.camp === 'WU'
                    ? '【东吴】'
                    : profile.militaryAffiliation.camp === 'YUAN_SHAO'
                    ? '【河北袁绍】'
                    : profile.militaryAffiliation.camp === 'DONG_ZHUO'
                    ? '【西凉董卓】'
                    : profile.militaryAffiliation.camp === 'LU_BU'
                    ? '【徐州吕布】'
                    : '【联军】'}
                  {' '}{profile.militaryAffiliation.roleTitle}
                </span>
              ) : (
                <span className="text-[#a89987]">乡野平民 · 未入诸侯行伍</span>
              )}
            </div>
            {profile.militaryAffiliation && profile.militaryAffiliation.campaigns.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#e5a84b] flex-wrap">
                <Award className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[#998774]">亲历战役：</span>
                {profile.militaryAffiliation.campaigns.map((campName) => (
                  <span
                    key={campName}
                    className="px-1.5 py-0.2 rounded bg-[#332214] border border-[#523820] text-[#fcd34d]"
                  >
                    {campName}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Known Historical Figures List */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onNavigateToFigures}
            className="text-[#8e7f6e] hover:text-[#d4af37] flex items-center gap-1 transition-colors cursor-pointer text-xs"
            title="点击查看名仕人脉与特权谱牒"
          >
            <Users className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="underline decoration-dotted underline-offset-2">天下知交 ({profile.knownFigures?.length || 0})：</span>
          </button>
          {profile.knownFigures && profile.knownFigures.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {profile.knownFigures.map((fig) => (
                <button
                  key={fig.id}
                  onClick={onNavigateToFigures}
                  className="px-2 py-0.5 rounded text-[11px] bg-[#241c15] hover:bg-[#34271e] border border-[#4a3928] text-[#faece0] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  title={`${fig.name}（字${fig.courtesyName}）· ${fig.title} · ${fig.relation} (点击查看五维成长与特权)`}
                >
                  <span className="text-[#d4af37] font-semibold">{fig.name}</span>
                  <span className="text-[10px] text-[#9c8976]">({fig.relation})</span>
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-[#716353] italic">
              待逢机缘结识同郡当世名将名士
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
