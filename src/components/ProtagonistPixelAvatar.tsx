import React, { useMemo, useState } from 'react';
import { CampType, PhysiologicalStage, SocialClass } from '../types/game';
import { getProtagonistPixelData, ProtagonistPixelData } from '../data/protagonistPixelData';

export type ProtagonistAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ProtagonistPixelAvatarProps {
  stageKey: PhysiologicalStage['stageKey'];
  gender?: 'MALE' | 'FEMALE';
  age?: number;
  camp?: CampType;
  socialClass?: SocialClass;
  name?: string;
  size?: ProtagonistAvatarSize;
  showAgeBadge?: boolean;
  showStageBadge?: boolean;
  showCampBorder?: boolean;
  showTooltip?: boolean;
  isAlive?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP: Record<ProtagonistAvatarSize, { px: number; containerClass: string; badgeClass: string; textClass: string }> = {
  xs: { px: 24, containerClass: 'w-6 h-6', badgeClass: 'text-[8px] -bottom-1 -right-1 px-0.5', textClass: 'text-xs' },
  sm: { px: 32, containerClass: 'w-8 h-8', badgeClass: 'text-[9px] -bottom-1 -right-1 px-1', textClass: 'text-sm' },
  md: { px: 44, containerClass: 'w-11 h-11', badgeClass: 'text-[10px] -bottom-1.5 -right-1 px-1', textClass: 'text-lg' },
  lg: { px: 56, containerClass: 'w-14 h-14', badgeClass: 'text-[11px] -bottom-1.5 -right-1 px-1.5', textClass: 'text-2xl' },
  xl: { px: 76, containerClass: 'w-[76px] h-[76px]', badgeClass: 'text-xs -bottom-2 -right-1.5 px-1.5', textClass: 'text-3xl' },
  '2xl': { px: 96, containerClass: 'w-24 h-24', badgeClass: 'text-xs -bottom-2 -right-2 px-2', textClass: 'text-4xl' },
};

export const ProtagonistPixelAvatar: React.FC<ProtagonistPixelAvatarProps> = ({
  stageKey,
  gender = 'MALE',
  age,
  camp = 'NONE',
  socialClass,
  name,
  size = 'md',
  showAgeBadge = false,
  showStageBadge = false,
  showCampBorder = true,
  showTooltip = false,
  isAlive = true,
  className = '',
  onClick,
  title,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const pixelData: ProtagonistPixelData = useMemo(() => {
    return getProtagonistPixelData(stageKey, gender, camp, socialClass);
  }, [stageKey, gender, camp, socialClass]);

  const sizeCfg = SIZE_MAP[size] || SIZE_MAP.md;

  // 阵营或主角命格色彩
  const borderTheme = useMemo(() => {
    if (camp === 'WEI') {
      return {
        border: 'border-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.35)]',
        badgeBg: 'bg-[#1e3a8a] text-[#bfdbfe] border-[#3b82f6]',
        label: '魏',
      };
    }
    if (camp === 'SHU') {
      return {
        border: 'border-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.35)]',
        badgeBg: 'bg-[#064e3b] text-[#a7f3d0] border-[#10b981]',
        label: '蜀',
      };
    }
    if (camp === 'WU') {
      return {
        border: 'border-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.35)]',
        badgeBg: 'bg-[#7f1d1d] text-[#fecaca] border-[#ef4444]',
        label: '吴',
      };
    }
    // 默认高贵琥珀金
    return {
      border: 'border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.35)]',
      badgeBg: 'bg-[#451a03] text-[#fde68a] border-[#d4af37]',
      label: gender === 'MALE' ? '郎' : '秀',
    };
  }, [camp, gender]);

  // 构建 20x20 SVG 像素渲染块
  const pixelElements = useMemo(() => {
    const matrix = pixelData.matrix;
    const elements: React.ReactElement[] = [];

    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char === '.') continue; // 跳过透明像素

        const hex = pixelData.palette[char] || '#000000';
        elements.push(
          <rect
            key={`${r}-${c}`}
            x={c}
            y={r}
            width={1}
            height={1}
            fill={hex}
          />
        );
      }
    }
    return elements;
  }, [pixelData]);

  const defaultTitle = `${name || '你'}（${pixelData.stageName} · ${age !== undefined ? `${age}岁` : pixelData.ageRange}）`;

  return (
    <div
      className={`relative inline-block select-none shrink-0 group ${className} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title || defaultTitle}
    >
      {/* 像素头像主体容器 */}
      <div
        className={`relative ${sizeCfg.containerClass} rounded overflow-hidden bg-[#181310] flex items-center justify-center ${
          showCampBorder ? `border-2 ${borderTheme.border}` : 'border border-[#443324]'
        } ${!isAlive ? 'grayscale opacity-75 contrast-125' : ''}`}
        style={{
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
        }}
      >
        {/* 复古像素画卷 SVG */}
        <svg
          viewBox="0 0 20 20"
          className="w-full h-full"
          style={{
            shapeRendering: 'crispEdges',
            imageRendering: 'pixelated',
          }}
        >
          {pixelElements}
        </svg>

        {/* 故去/殁了印戳 (灰度水墨覆层) */}
        {!isAlive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
            <span className="font-calligraphy text-xs sm:text-sm font-bold text-[#fca5a5] border border-[#ef4444] rounded px-0.5 bg-[#450a0a]/90 rotate-[-12deg]">
              故
            </span>
          </div>
        )}
      </div>

      {/* 右下角年龄角标 */}
      {showAgeBadge && age !== undefined && (
        <span
          className={`absolute ${sizeCfg.badgeClass} rounded-full font-mono font-bold border shadow-sm leading-none z-10 ${
            age <= 6 ? 'bg-[#064e3b] text-[#a7f3d0] border-[#10b981]' :
            age <= 19 ? 'bg-[#1e3a8a] text-[#bfdbfe] border-[#3b82f6]' :
            age <= 50 ? 'bg-[#78350f] text-[#fde68a] border-[#d4af37]' :
            'bg-[#374151] text-[#e5e7eb] border-[#9ca3af]'
          }`}
        >
          {age}岁
        </span>
      )}

      {/* 右下角生理阶段角标 (若未显示年龄且指定要阶段角标) */}
      {!showAgeBadge && showStageBadge && (
        <span
          className={`absolute ${sizeCfg.badgeClass} rounded font-classical font-semibold border shadow-sm leading-none z-10 ${borderTheme.badgeBg}`}
        >
          {pixelData.stageName.slice(0, 2)}
        </span>
      )}

      {/* 悬停详情浮窗 (Tooltips) */}
      {showTooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-lg bg-[#140f0c] border border-[#d4af37] text-white shadow-2xl z-50 pointer-events-none text-left font-classical">
          <div className="flex items-center justify-between border-b border-[#33261a] pb-1 mb-1.5">
            <span className="font-calligraphy text-sm font-bold text-[#faece0]">
              {name || '你'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2b1f14] text-[#d4af37] border border-[#523d29]">
              {pixelData.stageName}
            </span>
          </div>
          <div className="text-[11px] text-[#f59e0b] font-semibold mb-0.5">
            {pixelData.titleTag}
          </div>
          <div className="text-[10px] text-[#bdae9c] leading-relaxed">
            {pixelData.appearanceNote}
          </div>
          <div className="mt-1 pt-1 border-t border-[#2a1e15] flex items-center justify-between text-[10px] text-[#8e7e6e]">
            <span>周期：{pixelData.ageRange}</span>
            <span className="text-[#38bdf8]">{age !== undefined ? `${age} 岁` : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};
