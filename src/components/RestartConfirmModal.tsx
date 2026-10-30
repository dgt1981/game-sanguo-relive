import React from 'react';
import { PersonProfile, SEASONS_CONFIG } from '../services/lifeSimulator';
import { SeasonIndex } from '../types/game';
import { sound } from '../services/sound';
import { RotateCcw, AlertTriangle, X, ShieldAlert, Sparkles } from 'lucide-react';

interface RestartConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  profile?: PersonProfile;
  age?: number;
  year?: number;
  season?: SeasonIndex;
  isGameOver?: boolean;
  customMessage?: string;
}

export const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  profile,
  age = 0,
  year = 184,
  season = 0,
  isGameOver = false,
  customMessage,
}) => {
  if (!isOpen) return null;

  const seasonName = SEASONS_CONFIG[season]?.fullName || '春分之令';
  const knownFiguresCount = profile?.knownFigures?.length || 0;
  const boonsCount = profile?.collectedBoons?.length || 0;

  const handleCancel = () => {
    sound.playPluck(380);
    onCancel();
  };

  const handleConfirm = () => {
    sound.playDrum();
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-modal-title"
    >
      <div className="bg-[#191410] border-2 border-[#8b261e] rounded-xl max-w-md w-full p-6 shadow-[0_0_30px_rgba(139,38,30,0.5)] relative space-y-5 animate-in zoom-in-95 duration-200 paper-pattern">
        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />

        {/* Close Button in corner */}
        <button
          onClick={handleCancel}
          aria-label="关闭提示"
          className="absolute top-4 right-4 text-[#8a7b6c] hover:text-[#faece0] p-1 rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8b261e]/25 border border-[#8b261e] text-[#d4af37] shadow-inner mb-1">
            <RotateCcw className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-[11px] font-classical tracking-widest text-[#d4af37]">
            【 天 命 轮 回 · 宿 命 抉 择 】
          </div>
          <h3
            id="restart-modal-title"
            className="text-lg sm:text-xl font-calligraphy text-[#faece0] tracking-wider"
          >
            确认重新轮回？
          </h3>
        </div>

        {/* Warning & Context Message */}
        <div className="space-y-3 text-xs font-classical leading-relaxed">
          {customMessage ? (
            <div className="p-3 bg-[#241a14] border border-[#4a3424] rounded-lg text-[#d5c5b3]">
              {customMessage}
            </div>
          ) : !isGameOver ? (
            <div className="space-y-2.5">
              <div className="p-3 bg-[#261713] border border-[#6b251d] rounded-lg space-y-2 text-[#e8ded2]">
                <div className="flex items-center gap-1.5 text-[#e5c158] font-medium text-xs">
                  <ShieldAlert className="w-4 h-4 text-[#e07a5f] shrink-0" />
                  <span>当前人生正在进行中</span>
                </div>
                <div className="text-[11px] text-[#c9b7a2] space-y-1">
                  <div className="flex items-center justify-between border-b border-[#3d241d] pb-1">
                    <span>当生传主：</span>
                    <span className="font-calligraphy text-[#faece0] text-sm">
                      {profile?.name} {profile?.courtesyName ? `(${profile.courtesyName})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#3d241d] pb-1">
                    <span>时令岁数：</span>
                    <span className="text-[#e5c158]">
                      公元 {year} 年 · {seasonName}（现年 {age} 岁）
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>结纳知交 / 珍品：</span>
                    <span className="text-[#a89b8d]">
                      {knownFiguresCount} 位名士 · {boonsCount} 件赐予
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 bg-[#201813] border border-[#3d2e21] rounded text-[#b3a18e] text-[11px]">
                <AlertTriangle className="w-4 h-4 text-[#c28422] shrink-0 mt-0.5" />
                <p>
                  重新轮回将<strong>立即弃置当前所有进度</strong>与世家因果，重新投胎生成全新的生辰八字、籍贯门第与初始命盘。此操作无法撤销。
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-[#231b15] border border-[#443324] rounded-lg space-y-2 text-[#d5c7b7]">
              <div className="flex items-center gap-1.5 text-[#e5c158] font-medium">
                <Sparkles className="w-4 h-4 text-[#e5c158]" />
                <span>此生因果已尘埃落定</span>
              </div>
              <p className="text-[11px] text-[#a49381] leading-relaxed">
                传主【{profile?.name}】享年 {age} 岁，其平生志业与历史同道已载入万民谱牒。确认辞别此世，重返公元184年中平元年，开启一段全新的汉末人生？
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-2.5 px-3 rounded-lg bg-[#241c16] hover:bg-[#2e231c] text-[#a89886] hover:text-[#faece0] border border-[#443425] font-classical text-xs sm:text-sm transition-all cursor-pointer active:scale-98"
          >
            {isGameOver ? '留在当下 · 细阅生平' : '暂且作罢 · 继续此生'}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#8b261e] via-[#a82e25] to-[#8b261e] hover:from-[#a82e25] hover:to-[#c4382c] text-[#faece0] border border-[#d4af37]/60 shadow-[0_2px_12px_rgba(139,38,30,0.6)] font-classical text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>确认重新轮回</span>
          </button>
        </div>
      </div>
    </div>
  );
};
