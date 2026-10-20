import React, { useState } from 'react';
import { CompletedLifeRecord } from '../types/game';
import { sound } from '../services/sound';
import { Users, Trash2, Calendar, MapPin, ChevronRight, BookOpen } from 'lucide-react';

interface PeopleGalleryProps {
  records: CompletedLifeRecord[];
  onClearRecords: () => void;
}

export const PeopleGallery: React.FC<PeopleGalleryProps> = ({
  records,
  onClearRecords,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<CompletedLifeRecord | null>(null);

  if (records.length === 0) {
    return (
      <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-8 text-center text-[#9c8b78]">
        <Users className="w-8 h-8 mx-auto mb-2 text-[#786958]" />
        <p className="font-classical text-sm">尚无往生众生录入万民谱中。</p>
        <p className="text-xs text-[#6e6052] mt-1">走完一段人生后，其姓名、籍贯与平生春秋将永载于此。</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#2e2319]">
        <div>
          <h2 className="text-lg md:text-xl font-calligraphy text-[#faece0] tracking-wider">
            万民谱 · 汉末八十亿分之一人生
          </h2>
          <span className="text-xs text-[#a29280]">
            已记录 {records.length} 段真实人生的离合悲欢
          </span>
        </div>

        <button
          onClick={() => {
            if (window.confirm('确定要清空所有往生记录吗？')) {
              onClearRecords();
            }
          }}
          className="text-xs text-[#f87171] hover:text-[#ef4444] flex items-center gap-1 transition-colors px-2 py-1 rounded bg-[#2b1616] border border-[#522121] cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>清空名册</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {records.map((rec) => {
          return (
            <div
              key={rec.id}
              onClick={() => {
                sound.playPluck(550);
                setSelectedRecord(rec);
              }}
              className="bg-[#221a14] border border-[#3f3022] hover:border-[#d4af37] rounded-lg p-4 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-calligraphy text-lg text-[#faece0]">
                    {rec.name}
                  </span>
                  <span className="text-xs font-mono text-[#d4af37] bg-[#2d2117] px-2 py-0.5 rounded border border-[#483424]">
                    享年 {rec.deathAge} 岁
                  </span>
                </div>

                <div className="text-xs text-[#c5a666] font-classical mb-1">
                  {rec.ending.title}
                </div>

                <div className="text-xs text-[#9d8d7b] mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#d4af37]" />
                  <span>{rec.birthplace} · {rec.finalOccupation}</span>
                </div>

                <p className="text-xs text-[#a49381] italic line-clamp-2 leading-relaxed font-classical border-t border-[#2e2319] pt-2">
                  {rec.ending.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#786959] mt-3 pt-2 border-t border-[#2e2319]">
                <span>公元184年 — 公元{rec.deathYear}年</span>
                <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform flex items-center">
                  查阅详传 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#191512] border-2 border-[#544130] rounded-xl max-w-xl w-full p-6 text-[#ece3d6] shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#36291e] pb-3 mb-3">
              <div>
                <div className="seal-stamp text-xs px-2 py-0.5 mb-1.5">
                  {selectedRecord.ending.epitaphTitle}
                </div>
                <h3 className="text-xl font-calligraphy text-[#faece0]">
                  {selectedRecord.name} · {selectedRecord.ending.title}
                </h3>
                <span className="text-xs text-[#a29280]">
                  生于公元184年 · 殁于公元{selectedRecord.deathYear}年 · 籍贯【{selectedRecord.birthplace}】
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-xs text-[#a29280] hover:text-[#faece0] p-1.5 bg-[#261f18] rounded border border-[#3e3023] cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3 font-classical text-xs sm:text-sm">
              <div className="bg-[#221a14] p-3.5 rounded border border-[#3f3022]">
                <div className="text-[#d4af37] font-semibold mb-1">【平生小传】</div>
                <p className="leading-relaxed text-[#ddd2c4]">
                  {selectedRecord.ending.summary}
                </p>
              </div>

              <div className="bg-[#221a14] p-3.5 rounded border border-[#3f3022]">
                <div className="text-[#d4af37] font-semibold mb-1">【史家注脚】</div>
                <p className="leading-relaxed text-[#ddd2c4] italic">
                  {selectedRecord.ending.historianNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
