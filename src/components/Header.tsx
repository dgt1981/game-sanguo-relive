import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sound } from '../services/sound';

interface HeaderProps {
  activeTab: 'SIMULATION' | 'FIGURES' | 'CHRONICLE' | 'PEOPLE_GALLERY' | 'PROVINCES_GUIDE';
  setActiveTab: (tab: 'SIMULATION' | 'FIGURES' | 'CHRONICLE' | 'PEOPLE_GALLERY' | 'PROVINCES_GUIDE') => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  knownFiguresCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRestart,
  isMuted,
  onToggleSound,
  knownFiguresCount = 0,
}) => {
  return (
    <header className="bg-[#161311]/95 backdrop-blur-md border-b border-[#3d3228] px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        {/* Top / Left: Wordmark & Brand */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-[#8b261e] flex items-center justify-center text-[#fae8c8] font-calligraphy text-lg sm:text-xl shadow-md border border-[#a83228]">
              汉
            </div>
            <button
              onClick={() => setActiveTab('SIMULATION')}
              className="text-base sm:text-lg md:text-xl font-calligraphy text-[#e8ded2] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 tracking-wider text-left cursor-pointer"
            >
              公元184年 · 汉末人生
            </button>
          </div>

          {/* Quick Sound & Restart on mobile top-right */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            <button
              onClick={onToggleSound}
              aria-label={isMuted ? '开启音效' : '静音'}
              className="p-1.5 text-[#a89b8d] hover:text-[#e8ded2] rounded-md transition-colors hover:bg-[#251f1a] cursor-pointer"
              title={isMuted ? '开启音效' : '静音'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
            </button>
            <button
              onClick={onRestart}
              className="px-2.5 py-1 text-xs font-medium text-[#2a170d] bg-gradient-to-r from-[#d4af37] to-[#e6ca65] rounded transition-all shadow-sm flex items-center gap-1 font-classical cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>轮回</span>
            </button>
          </div>
        </div>

        {/* Center: Navigation links with horizontal scroll on mobile */}
        <nav className="w-full sm:w-auto flex items-center justify-start sm:justify-center gap-4 sm:gap-6 md:gap-7 text-xs sm:text-sm font-medium text-[#a89b8d] overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <button
            onClick={() => {
              sound.playPluck(523);
              setActiveTab('SIMULATION');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-1 border-b-2 cursor-pointer font-classical ${
              activeTab === 'SIMULATION'
                ? 'text-[#e5c158] border-[#e5c158] font-semibold'
                : 'border-transparent'
            }`}
          >
            岁月流转
          </button>
          <button
            onClick={() => {
              sound.playPluck(550);
              setActiveTab('FIGURES');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 font-classical ${
              activeTab === 'FIGURES'
                ? 'text-[#e5c158] border-[#e5c158] font-semibold'
                : 'border-transparent'
            }`}
          >
            <span>天下名仕</span>
            {knownFiguresCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-[#8b261e] text-[#fae8c8] rounded-full border border-[#d4af37]/40 font-mono">
                {knownFiguresCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              sound.playPluck(587);
              setActiveTab('CHRONICLE');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-1 border-b-2 cursor-pointer font-classical ${
              activeTab === 'CHRONICLE'
                ? 'text-[#e5c158] border-[#e5c158] font-semibold'
                : 'border-transparent'
            }`}
          >
            平生编年
          </button>
          <button
            onClick={() => {
              sound.playPluck(659);
              setActiveTab('PEOPLE_GALLERY');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-1 border-b-2 cursor-pointer font-classical ${
              activeTab === 'PEOPLE_GALLERY'
                ? 'text-[#e5c158] border-[#e5c158] font-semibold'
                : 'border-transparent'
            }`}
          >
            万民谱牒
          </button>
          <button
            onClick={() => {
              sound.playPluck(783);
              setActiveTab('PROVINCES_GUIDE');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-1 border-b-2 cursor-pointer font-classical ${
              activeTab === 'PROVINCES_GUIDE'
                ? 'text-[#e5c158] border-[#e5c158] font-semibold'
                : 'border-transparent'
            }`}
          >
            十四州舆地
          </button>
        </nav>

        {/* Right: Sound & Restart (Desktop) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? '开启音效' : '静音'}
            className="p-2 text-[#a89b8d] hover:text-[#e8ded2] rounded-md transition-colors hover:bg-[#251f1a] cursor-pointer"
            title={isMuted ? '开启音效' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
          </button>
          <button
            onClick={onRestart}
            className="px-3.5 py-1.5 text-xs md:text-sm font-medium text-[#2a170d] bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#c5a028] hover:to-[#d8bc55] rounded-md transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 font-classical active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重入轮回</span>
          </button>
        </div>
      </div>
    </header>
  );
};
