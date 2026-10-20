import React from 'react';
import { Attributes } from '../types/game';
import { PersonProfile } from '../services/lifeSimulator';
import { Heart, BookOpen, Sword, Users, Coins, Sparkles, MapPin } from 'lucide-react';

interface LifeAttributeHUDProps {
  stats: Attributes;
  profile: PersonProfile;
  year: number;
  age: number;
  lunarYear: string;
}

export const LifeAttributeHUD: React.FC<LifeAttributeHUDProps> = ({
  stats,
  profile,
  year,
  age,
  lunarYear,
}) => {
  const statConfig: { key: keyof Attributes; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'health', label: '体魄', icon: <Heart className="w-3.5 h-3.5" />, color: stats.health < 30 ? '#ef4444' : '#10b981' },
    { key: 'intellect', label: '识见', icon: <BookOpen className="w-3.5 h-3.5" />, color: '#0284c7' },
    { key: 'martial', label: '勇略', icon: <Sword className="w-3.5 h-3.5" />, color: '#c2410c' },
    { key: 'virtue', label: '仁厚', icon: <Users className="w-3.5 h-3.5" />, color: '#ca8a04' },
    { key: 'wealth', label: '家财', icon: <Coins className="w-3.5 h-3.5" />, color: '#eab308' },
    { key: 'fortune', label: '气数', icon: <Sparkles className="w-3.5 h-3.5" />, color: '#a855f7' },
  ];

  return (
    <div className="bg-[#1c1815] border border-[#3b3026] rounded-lg p-3 md:p-4 shadow-lg text-[#e6ded5]">
      {/* Top Identity Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2e261e]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#2b221a] border border-[#524131] flex items-center justify-center font-calligraphy text-xl text-[#d4af37]">
            {profile.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-calligraphy text-lg md:text-xl text-[#f3ece2]">
                {profile.name}
              </span>
              <span className="text-xs text-[#a39482]">
                ({profile.gender === 'MALE' ? '男丁' : '女秀'} · {profile.occupation})
              </span>
            </div>
            <div className="text-xs text-[#8c7b69] flex items-center gap-1 font-classical">
              <MapPin className="w-3 h-3 text-[#d4af37]" />
              <span>生于【{profile.commandery} · {profile.county}】</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#dcd1c2]">
          <div className="flex items-center gap-1.5 bg-[#251f1a] px-2.5 py-1 rounded border border-[#3f3428]">
            <span className="text-[#a89985]">纪元</span>
            <span className="text-[#f59e0b] font-semibold">公元 {year} 年</span>
            <span className="text-[#877868]">({lunarYear})</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#251f1a] px-2.5 py-1 rounded border border-[#3f3428]">
            <span className="text-[#a89985]">享年</span>
            <span className="text-[#38bdf8] font-semibold">{age} 岁</span>
          </div>
        </div>
      </div>

      {/* 6 Core Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
        {statConfig.map(({ key, label, icon, color }) => {
          const val = Math.max(0, Math.min(100, stats[key]));
          return (
            <div
              key={key}
              className="bg-[#241e19] border border-[#382d23] rounded p-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-[#b0a190] mb-1">
                <span className="flex items-center gap-1 font-classical">
                  <span style={{ color }}>{icon}</span>
                  {label}
                </span>
                <span className="font-mono tabular-nums font-bold text-sm text-[#f5ede3]">
                  {val}
                </span>
              </div>
              <div className="w-full bg-[#171310] h-1.5 rounded-full overflow-hidden">
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
  );
};
