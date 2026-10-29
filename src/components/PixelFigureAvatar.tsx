import React, { useMemo, useState } from 'react';
import { CampType } from '../types/game';
import { getPixelPortrait, PixelPortraitData } from '../data/pixelFiguresData';

export type PixelAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface PixelFigureAvatarProps {
  figureId?: string;
  name?: string;
  courtesyName?: string;
  camp?: CampType;
  archetype?: string;
  size?: PixelAvatarSize;
  showCampBorder?: boolean;
  showCampBadge?: boolean;
  showHoverTooltip?: boolean;
  isAlive?: boolean;
  avatarChar?: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP: Record<PixelAvatarSize, { px: number; containerClass: string; badgeClass: string; textClass: string }> = {
  xs: { px: 24, containerClass: 'w-6 h-6', badgeClass: 'text-[8px] -bottom-1 -right-1 px-0.5', textClass: 'text-xs' },
  sm: { px: 32, containerClass: 'w-8 h-8', badgeClass: 'text-[9px] -bottom-1 -right-1 px-1', textClass: 'text-sm' },
  md: { px: 44, containerClass: 'w-11 h-11', badgeClass: 'text-[10px] -bottom-1.5 -right-1 px-1', textClass: 'text-lg' },
  lg: { px: 56, containerClass: 'w-14 h-14', badgeClass: 'text-[11px] -bottom-1.5 -right-1 px-1.5', textClass: 'text-2xl' },
  xl: { px: 76, containerClass: 'w-[76px] h-[76px]', badgeClass: 'text-xs -bottom-2 -right-1.5 px-1.5', textClass: 'text-3xl' },
  '2xl': { px: 96, containerClass: 'w-24 h-24', badgeClass: 'text-xs -bottom-2 -right-2 px-2', textClass: 'text-4xl' },
};

export const PixelFigureAvatar: React.FC<PixelFigureAvatarProps> = ({
  figureId,
  name,
  courtesyName,
  camp = 'NEUTRAL',
  archetype = 'MARTIAL',
  size = 'md',
  showCampBorder = true,
  showCampBadge = false,
  showHoverTooltip = false,
  isAlive = true,
  avatarChar,
  className = '',
  onClick,
  title,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 获取对应的像素数据
  const portrait: PixelPortraitData = useMemo(() => {
    const validCamp = camp === 'NONE' ? 'NEUTRAL' : (camp as 'WEI' | 'SHU' | 'WU' | 'NEUTRAL');
    return getPixelPortrait(figureId, name, validCamp, archetype);
  }, [figureId, name, camp, archetype]);

  const sizeCfg = SIZE_MAP[size] || SIZE_MAP.md;

  // 阵营边框与徽章色彩
  const campTheme = useMemo(() => {
    const c = portrait.camp;
    if (c === 'WEI') {
      return {
        border: 'border-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.35)]',
        badgeBg: 'bg-[#1e3a8a] text-[#bfdbfe] border-[#3b82f6]',
        label: '魏',
      };
    }
    if (c === 'SHU') {
      return {
        border: 'border-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.35)]',
        badgeBg: 'bg-[#064e3b] text-[#a7f3d0] border-[#10b981]',
        label: '蜀',
      };
    }
    if (c === 'WU') {
      return {
        border: 'border-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.35)]',
        badgeBg: 'bg-[#7f1d1d] text-[#fecaca] border-[#ef4444]',
        label: '吴',
      };
    }
    return {
      border: 'border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.35)]',
      badgeBg: 'bg-[#78350f] text-[#fde68a] border-[#d4af37]',
      label: '群',
    };
  }, [portrait.camp]);

  // 构建 SVG 像素渲染块
  const pixelElements = useMemo(() => {
    const matrix = portrait.matrix;
    const elements: React.ReactElement[] = [];

    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char === '.') continue; // 跳过透明像素

        const hex = portrait.palette[char] || '#000000';
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
  }, [portrait]);

  const displayName = name || portrait.name;
  const displayCourtesy = courtesyName || portrait.courtesyName;

  return (
    <div
      className={`relative inline-block select-none shrink-0 group ${className} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title || `${displayName} (${portrait.campLabel})`}
    >
      {/* 像素头像主体容器 */}
      <div
        className={`relative ${sizeCfg.containerClass} rounded overflow-hidden bg-[#181310] flex items-center justify-center ${
          showCampBorder ? `border-2 ${campTheme.border}` : 'border border-[#443324]'
        } ${!isAlive ? 'grayscale opacity-75 contrast-125' : ''}`}
        style={{
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
        }}
      >
        {/* 复古像素画卷 SVG (强制像素化渲染模式) */}
        <svg
          viewBox="0 0 20 20"
          className="w-full h-full"
          style={{
            imageRendering: 'pixelated',
            shapeRendering: 'crispEdges',
          }}
        >
          {/* 背景微调衬底 */}
          <rect width="20" height="20" fill="#201813" />
          {/* 像素点阵 */}
          {pixelElements}
        </svg>

        {/* 已经逝世历史人物标记 (故) */}
        {!isAlive && (
          <div className="absolute inset-0 bg-[#0f0b09]/55 flex items-center justify-center pointer-events-none">
            <span className="font-calligraphy text-xs text-[#a89b8d] font-bold border border-[#786c5e] px-1 rounded-xs bg-[#1a1410]/80">
              故
            </span>
          </div>
        )}

        {/* 像素复古高光网格微效 (CRT 微光扫描线微弱感知) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]"
        />
      </div>

      {/* 阵营角标 (魏/蜀/吴/群) */}
      {showCampBadge && (
        <span
          className={`absolute ${sizeCfg.badgeClass} rounded-xs font-calligraphy font-bold border shadow-sm select-none pointer-events-none leading-none z-10 ${campTheme.badgeBg}`}
        >
          {campTheme.label}
        </span>
      )}

      {/* 悬停信息气泡 (可选) */}
      {showHoverTooltip && isHovered && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap bg-[#1a130e] text-[#f5eee4] text-xs font-classical px-2.5 py-1 rounded shadow-xl border border-[#d4af37] flex items-center gap-1.5 animate-fadeIn">
          <span className="font-bold text-[#f59e0b] font-calligraphy">{displayName}</span>
          {displayCourtesy && <span className="text-[#a89b8d] text-[10px]">字{displayCourtesy}</span>}
          <span className="text-[10px] text-[#eab308] opacity-80">· {portrait.campLabel}</span>
        </div>
      )}
    </div>
  );
};
