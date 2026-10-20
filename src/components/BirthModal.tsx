import React, { useState } from 'react';
import { PROVINCES } from '../data/regions';
import { ProvinceId, SocialClass } from '../types/game';
import { PersonProfile, generateRandomBirth } from '../services/lifeSimulator';
import { sound } from '../services/sound';
import { Compass, Sparkles, MapPin, Users, Dices, ArrowRight } from 'lucide-react';

interface BirthModalProps {
  onStartLife: (profile: PersonProfile) => void;
}

export const BirthModal: React.FC<BirthModalProps> = ({ onStartLife }) => {
  const [profile, setProfile] = useState<PersonProfile>(() => generateRandomBirth());
  const [selectedProvinceId, setSelectedProvinceId] = useState<ProvinceId | 'RANDOM'>('RANDOM');

  const handleRoll = () => {
    sound.playPluck(523);
    const rolled = generateRandomBirth();
    if (selectedProvinceId !== 'RANDOM') {
      const p = PROVINCES.find((prov) => prov.id === selectedProvinceId);
      if (p) {
        rolled.birthProvince = p.id;
        rolled.currentProvince = p.id;
        rolled.commandery = p.commanderies[Math.floor(Math.random() * p.commanderies.length)];
        rolled.county = p.counties[Math.floor(Math.random() * p.counties.length)];
      }
    }
    setProfile(rolled);
  };

  const handleSelectProvince = (provId: ProvinceId | 'RANDOM') => {
    setSelectedProvinceId(provId);
    sound.playPluck(587);
    const rolled = generateRandomBirth();
    if (provId !== 'RANDOM') {
      const p = PROVINCES.find((prov) => prov.id === provId);
      if (p) {
        rolled.birthProvince = p.id;
        rolled.currentProvince = p.id;
        rolled.commandery = p.commanderies[Math.floor(Math.random() * p.commanderies.length)];
        rolled.county = p.counties[Math.floor(Math.random() * p.counties.length)];
      }
    }
    setProfile(rolled);
  };

  const getClassName = (sc: SocialClass) => {
    const map: Record<SocialClass, string> = {
      PEASANT: '贫苦佃农',
      TOWN_ARTISAN: '市井工匠',
      FISHER_BOATMAN: '水滨渔户',
      FRONTIER_ARMY: '边关军户',
      SCHOLAR_CLERK: '寒门小吏',
      MERCHANT: '坊市行商',
      NOBLE_GENTRY: '冠带世家',
    };
    return map[sc] || '草民百姓';
  };

  const currentProvinceInfo = PROVINCES.find((p) => p.id === profile.birthProvince);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181411] border-2 border-[#483726] rounded-xl max-w-2xl w-full p-6 sm:p-8 text-[#ece2d5] shadow-2xl my-6 relative">
        {/* Year Kick-off */}
        <div className="text-center pb-5 border-b border-[#362a1f]">
          <div className="inline-block px-3 py-1 bg-[#2b1f15] border border-[#5a412c] rounded text-xs text-[#d4af37] font-classical mb-2">
            东汉灵帝中平元年 · 甲子岁
          </div>
          <h1 className="text-2xl sm:text-3xl font-calligraphy text-[#faece0] tracking-widest">
            公元184年，你出生了。
          </h1>
          <p className="text-xs sm:text-sm text-[#a89987] mt-2 max-w-lg mx-auto leading-relaxed font-classical">
            你不知道自己未来会遇见谁，也不知道自己会不会成为名将，甚至大概率只是一介草民。
            然后，让时间自己向前走。
          </p>
        </div>

        {/* The Random Born Identity Card */}
        <div className="my-5 bg-[#221a14] border border-[#3e2f21] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1.5 font-classical">
              <Compass className="w-3.5 h-3.5" />
              天命初定 · 降生籍贯
            </span>
            <button
              onClick={handleRoll}
              className="text-xs text-[#d4af37] hover:text-[#fde68a] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              重新投胎抽签
            </button>
          </div>

          <div className="space-y-2 font-classical">
            <div className="text-lg sm:text-xl text-[#faece0] font-semibold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
              <span>你降生在【{currentProvinceInfo?.provinceName} · {profile.commandery} · {profile.county}】</span>
            </div>

            <p className="text-xs sm:text-sm text-[#baa996] leading-relaxed italic pl-4 border-l-2 border-[#544130]">
              “{currentProvinceInfo?.culturalNote}”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#2e2319] text-xs text-[#b8a794]">
            <div className="bg-[#1a1410] p-2.5 rounded border border-[#312519]">
              <span className="text-[#8e7f6e] block mb-0.5">本世姓名称谓</span>
              <span className="font-semibold text-sm text-[#f5eee4]">{profile.name}</span>
              <span className="text-[#887867] ml-2">({profile.gender === 'MALE' ? '男丁' : '女秀'})</span>
            </div>

            <div className="bg-[#1a1410] p-2.5 rounded border border-[#312519]">
              <span className="text-[#8e7f6e] block mb-0.5">家庭出身阶层</span>
              <span className="font-semibold text-sm text-[#f5eee4]">{getClassName(profile.socialClass)}</span>
            </div>

            <div className="bg-[#1a1410] p-2.5 rounded border border-[#312519]">
              <span className="text-[#8e7f6e] block mb-0.5">至亲眷属</span>
              <span className="text-[#ddd0c0]">父：{profile.fatherName} · 母：{profile.motherName}</span>
            </div>

            <div className="bg-[#1a1410] p-2.5 rounded border border-[#312519]">
              <span className="text-[#8e7f6e] block mb-0.5">堂中兄妹</span>
              <span className="text-[#ddd0c0]">尚有 {profile.siblingCount} 个兄弟姊妹嗷嗷待哺</span>
            </div>
          </div>
        </div>

        {/* Optional Province Picker */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-[#a89987] block mb-2 font-classical">
            或指定投胎降生之州（十四州皆有其命途）：
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-classical">
            <button
              onClick={() => handleSelectProvince('RANDOM')}
              className={`py-1 px-2 rounded border text-center transition-colors cursor-pointer ${
                selectedProvinceId === 'RANDOM'
                  ? 'bg-[#d4af37] text-[#1c1208] border-[#d4af37] font-semibold'
                  : 'bg-[#221a14] border-[#382b1f] text-[#a69684] hover:text-[#faece0]'
              }`}
            >
              任意随缘
            </button>
            {PROVINCES.map((p) => {
              const isSel = selectedProvinceId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProvince(p.id)}
                  className={`py-1 px-2 rounded border text-center transition-colors truncate cursor-pointer ${
                    isSel
                      ? 'bg-[#d4af37] text-[#1c1208] border-[#d4af37] font-semibold'
                      : 'bg-[#221a14] border-[#382b1f] text-[#a69684] hover:text-[#faece0]'
                  }`}
                  title={p.provinceName}
                >
                  {p.provinceName.split(' · ')[1] || p.provinceName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            sound.playDrum();
            onStartLife(profile);
          }}
          className="w-full py-3.5 text-base font-semibold text-[#1f1206] bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] hover:from-[#c29c26] hover:to-[#c29c26] rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-classical tracking-widest cursor-pointer"
        >
          <span>降生入世 · 让时间向前走</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
