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
    <header className="sticky top-0 z-40 bg-[#161311]/90 backdrop-blur-md border-b border-[#3d3228] px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-sm bg-[#8b261e] flex items-center justify-center text-[#fae8c8] font-calligraphy text-xl shadow-md border border-[#a83228]">
            汉
          </div>
          <button
            onClick={() => setActiveTab('SIMULATION')}
            className="text-lg md:text-xl font-calligraphy text-[#e8ded2] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 tracking-wider text-left cursor-pointer"
          >
            公元184年 · 汉末人生
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden sm:flex items-center gap-6 md:gap-7 text-sm font-medium text-[#a89b8d]">
          <button
            onClick={() => {
              sound.playPluck(523);
              setActiveTab('SIMULATION');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'SIMULATION'
                ? 'text-[#e5c158] border-[#e5c158]'
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
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-0.5 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'FIGURES'
                ? 'text-[#e5c158] border-[#e5c158]'
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
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'CHRONICLE'
                ? 'text-[#e5c158] border-[#e5c158]'
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
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'PEOPLE_GALLERY'
                ? 'text-[#e5c158] border-[#e5c158]'
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
            className={`whitespace-nowrap shrink-0 hover:text-[#f3ede2] transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'PROVINCES_GUIDE'
                ? 'text-[#e5c158] border-[#e5c158]'
                : 'border-transparent'
            }`}
          >
            十四州舆地
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
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
