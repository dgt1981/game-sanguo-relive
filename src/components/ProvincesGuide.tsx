import React from 'react';
import { PROVINCES } from '../data/regions';
import { ProvinceId } from '../types/game';
import { MapPin, ArrowRight } from 'lucide-react';
import { sound } from '../services/sound';

interface ProvincesGuideProps {
  onSelectProvinceToReborn: (provId: ProvinceId) => void;
}

export const ProvincesGuide: React.FC<ProvincesGuideProps> = ({
  onSelectProvinceToReborn,
}) => {
  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-4 sm:p-6 shadow-xl space-y-5">
      <div className="pb-4 border-b border-[#2e2319]">
        <h2 className="text-lg md:text-xl font-calligraphy text-[#faece0] tracking-wider">
          东汉十四州风物舆地考
        </h2>
        <p className="text-xs text-[#a29280] mt-1 font-classical">
          幅员万里，天命殊途。你可能出生在帝都洛阳，也可能出生在荒陬塞北或烟雨江南，甚至一个在史书上只出现过一次的小县。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVINCES.map((prov) => {
          return (
            <div
              key={prov.id}
              className="bg-[#221a14] border border-[#3e2e20] hover:border-[#d4af37] rounded-lg p-4 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-calligraphy text-lg text-[#faece0] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    {prov.provinceName}
                  </span>
                  <button
                    onClick={() => {
                      sound.playDrum();
                      onSelectProvinceToReborn(prov.id);
                    }}
                    className="text-xs text-[#d4af37] hover:text-[#fde68a] flex items-center gap-1 font-classical cursor-pointer"
                  >
                    <span>投胎此州</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-[#9c8b78] mb-2 font-classical">
                  领属郡国：{prov.commanderies.join('、')}
                </div>

                <div className="text-xs text-[#baa996] mb-3 leading-relaxed font-classical italic">
                  “{prov.culturalNote}”
                </div>

                <div className="pt-2 border-t border-[#2e2217] text-[11px] text-[#7d6e5d]">
                  辖下代表县邑：{prov.counties.join(' · ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
