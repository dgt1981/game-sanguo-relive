import React, { useState } from 'react';
import { PROVINCES } from '../data/regions';
import { ProvinceId, SocialClass } from '../types/game';
import { PersonProfile, generateRandomBirth, SEASONS_CONFIG } from '../services/lifeSimulator';
import { MidGameSaveData } from '../services/storage';
import { ProtagonistPixelAvatar } from './ProtagonistPixelAvatar';
import { sound } from '../services/sound';
import { Compass, Dices, ArrowRight, User, Edit3, Play, RotateCcw } from 'lucide-react';

interface BirthModalProps {
  onStartLife: (profile: PersonProfile) => void;
  resumeData?: MidGameSaveData | null;
  onResume?: () => void;
  onDiscardResume?: () => void;
}

export const BirthModal: React.FC<BirthModalProps> = ({
  onStartLife,
  resumeData,
  onResume,
  onDiscardResume,
}) => {
  const [profile, setProfile] = useState<PersonProfile>(() => generateRandomBirth());
  const [selectedProvinceId, setSelectedProvinceId] = useState<ProvinceId | 'RANDOM'>('RANDOM');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  // Editable Name fields
  const [surname, setSurname] = useState(profile.surname);
  const [givenName, setGivenName] = useState(profile.givenName);
  const [courtesyName, setCourtesyName] = useState(profile.courtesyName);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>(profile.gender);
  const [fatherName, setFatherName] = useState(profile.fatherName);
  const [motherName, setMotherName] = useState(profile.motherName);

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
    setSurname(rolled.surname);
    setGivenName(rolled.givenName);
    setCourtesyName(rolled.courtesyName);
    setGender(rolled.gender);
    setFatherName(rolled.fatherName);
    setMotherName(rolled.motherName);
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
    setSurname(rolled.surname);
    setGivenName(rolled.givenName);
    setCourtesyName(rolled.courtesyName);
    setGender(rolled.gender);
    setFatherName(rolled.fatherName);
    setMotherName(rolled.motherName);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playDrum();

    const finalizedProfile: PersonProfile = {
      ...profile,
      surname: surname.trim() || '李',
      givenName: givenName.trim() || '安',
      name: `${surname.trim() || '李'}${givenName.trim() || '安'}`,
      courtesyName: courtesyName.trim() || '子和',
      gender,
      fatherName: fatherName.trim() || `${surname.trim() || '李'}老汉`,
      motherName: motherName.trim() || '陈氏',
    };

    onStartLife(finalizedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181411] border-2 border-[#483726] rounded-xl max-w-2xl w-full p-6 sm:p-8 text-[#ece2d5] shadow-2xl my-6 relative">
        {/* Year Kick-off */}
        <div className="text-center pb-5 border-b border-[#362a1f]">
          <div className="inline-block px-3 py-1 bg-[#2b1f15] border border-[#5a412c] rounded text-xs text-[#d4af37] font-classical mb-2">
            公元184年春 · 汉灵帝中平元年
          </div>
          <h1 className="text-2xl sm:text-3xl font-calligraphy text-[#faece0] tracking-widest">
            公元184年，你出生了。
          </h1>
          <p className="text-xs sm:text-sm text-[#a89987] mt-2 max-w-lg mx-auto leading-relaxed font-classical">
            你不知道自己未来会遇见谁，也不知道自己会不会成为大英雄，甚至大概率只是一介普通百姓。
            四季不断轮转，岁月自会带着你向前走。
          </p>
        </div>

        {/* Mid-Game Resume Card if Save Exists */}
        {resumeData && (
          <div className="my-5 bg-[#251d16] border-2 border-[#d4af37]/70 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5c158] animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-[#f59e0b] tracking-wider font-classical">
                  检测到上次未完成的存档
                </span>
              </div>
              <span className="text-[11px] text-[#8e7e6e] font-mono">{resumeData.savedAt}</span>
            </div>

            <div className="bg-[#18120e] p-3 rounded-lg border border-[#3e2e20] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#faece0]">
                <span className="font-calligraphy text-base sm:text-lg text-[#e5c158]">
                  {resumeData.profile.name}（字{resumeData.profile.courtesyName}）
                </span>
                <span className="text-[#38bdf8] font-bold">历经 {resumeData.currentAge} 岁</span>
              </div>
              <div className="text-[#a49583] flex flex-wrap items-center gap-1.5 font-classical">
                <span>活到了公元 {resumeData.currentYear} 年 · {SEASONS_CONFIG[resumeData.currentSeason]?.name || '春'}季</span>
                <span>·</span>
                <span>{resumeData.profile.commandery} {resumeData.profile.county}</span>
                <span>·</span>
                <span className="text-[#dcd1c2] font-semibold">{resumeData.profile.occupation}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  sound.playSealStamp();
                  onResume?.();
                }}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] hover:from-[#c29c26] hover:to-[#c29c26] text-[#1f1206] font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>继续上次的人生进度</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playPluck(380);
                  onDiscardResume?.();
                }}
                className="py-2.5 px-3 bg-[#1e1712] hover:bg-[#2c2017] text-[#a49583] hover:text-[#e0d3c4] border border-[#3e2e20] rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>放弃存档 · 开启新人生</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="my-5 space-y-4">
          {/* Custom Name Section */}
          <div className="bg-[#221a14] border border-[#3e2f21] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1.5 font-classical">
                <User className="w-3.5 h-3.5" />
                姓名称谓自定义
              </span>
              <button
                type="button"
                onClick={handleRoll}
                className="text-xs text-[#d4af37] hover:text-[#fde68a] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5" />
                随机生辰姓名
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="text-[#8e7f6e] block mb-1 font-classical">姓氏</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  maxLength={4}
                  required
                  placeholder="如：赵"
                  className="w-full bg-[#18120e] border border-[#443324] rounded px-2.5 py-1.5 text-sm text-[#faece0] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-[#8e7f6e] block mb-1 font-classical">名字</label>
                <input
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  maxLength={4}
                  required
                  placeholder="如：云"
                  className="w-full bg-[#18120e] border border-[#443324] rounded px-2.5 py-1.5 text-sm text-[#faece0] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-[#8e7f6e] block mb-1 font-classical">表字</label>
                <input
                  type="text"
                  value={courtesyName}
                  onChange={(e) => setCourtesyName(e.target.value)}
                  maxLength={4}
                  required
                  placeholder="如：子龙"
                  className="w-full bg-[#18120e] border border-[#443324] rounded px-2.5 py-1.5 text-sm text-[#faece0] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-[#8e7f6e] block mb-1 font-classical">性别</label>
                <div className="flex items-center gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`flex-1 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                      gender === 'MALE'
                        ? 'bg-[#d4af37] text-[#1c1208] border-[#d4af37] font-semibold'
                        : 'bg-[#18120e] border-[#382b1f] text-[#8e7f6e]'
                    }`}
                  >
                    男
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    className={`flex-1 py-1.5 rounded border text-center transition-colors cursor-pointer ${
                      gender === 'FEMALE'
                        ? 'bg-[#d4af37] text-[#1c1208] border-[#d4af37] font-semibold'
                        : 'bg-[#18120e] border-[#382b1f] text-[#8e7f6e]'
                    }`}
                  >
                    女
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle Parents custom */}
            <div>
              <button
                type="button"
                onClick={() => setIsEditingCustom(!isEditingCustom)}
                className="text-[11px] text-[#a49381] hover:text-[#d4af37] flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingCustom ? '收起父母姓名设置' : '自定义父母姓名'}</span>
              </button>

              {isEditingCustom && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div>
                    <label className="text-[#8e7f6e] block mb-1 font-classical">父亲姓名</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      maxLength={6}
                      className="w-full bg-[#18120e] border border-[#443324] rounded px-2.5 py-1.5 text-xs text-[#faece0] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[#8e7f6e] block mb-1 font-classical">母亲姓名</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      maxLength={6}
                      className="w-full bg-[#18120e] border border-[#443324] rounded px-2.5 py-1.5 text-xs text-[#faece0] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location & Class Information */}
          <div className="bg-[#221a14] border border-[#3e2f21] rounded-lg p-4 space-y-3">
            <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1.5 font-classical">
              <Compass className="w-3.5 h-3.5" />
              出生地点与出身家庭
            </span>

            <div className="space-y-1.5 font-classical">
              <div className="text-base sm:text-lg text-[#faece0] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                <span>你出生在【{currentProvinceInfo?.provinceName} · {profile.commandery} · {profile.county}】</span>
              </div>

              <p className="text-xs text-[#baa996] leading-relaxed italic pl-3 border-l-2 border-[#544130]">
                “{currentProvinceInfo?.culturalNote}”
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2e2319] text-xs text-[#b8a794]">
              <div className="bg-[#1a1410] p-2 rounded border border-[#312519]">
                <span className="text-[#8e7f6e] block mb-0.5">家庭阶层</span>
                <span className="font-semibold text-[#f5eee4]">{getClassName(profile.socialClass)}</span>
              </div>

              <div className="bg-[#1a1410] p-2 rounded border border-[#312519]">
                <span className="text-[#8e7f6e] block mb-0.5">兄弟姐妹</span>
                <span className="text-[#ddd0c0]">家里还有 {profile.siblingCount} 个兄弟姐妹</span>
              </div>
            </div>

            {/* Physiological Starting Law Preview */}
            <div className="bg-[#16110d] p-3 rounded-lg border border-[#3b2b1e] text-[11px] font-classical text-[#ad9c8a] space-y-2">
              <div className="text-[#e5a84b] font-semibold flex items-center justify-between border-b border-[#2a1e15] pb-1.5">
                <span>【身体成长规律】</span>
                <span className="text-[10px] text-[#38bdf8] font-mono">0岁 · 吃奶娃娃</span>
              </div>
              <div className="flex items-center gap-3">
                <ProtagonistPixelAvatar
                  stageKey="INFANT"
                  gender={gender}
                  age={0}
                  socialClass={profile.socialClass}
                  name={`${surname.trim() || '李'}${givenName.trim() || '安'}`}
                  size="md"
                  showAgeBadge={true}
                  showCampBorder={true}
                  showTooltip={true}
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="leading-relaxed text-[#c7b8a7]">
                    婴儿阶段：体质较弱（容易受凉生病）、懂的事情不多、力气还没长出来。
                  </p>
                  <div className="text-[10px] text-[#8a7a6a] italic">
                    “随着年龄增长，身体在童年会慢慢抽条长个，成年时精力最为充沛，年纪大了体力也会自然下滑。每个阶段的样貌都会随着岁月发生改变。”
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Province Picker */}
          <div>
            <label className="text-xs font-semibold text-[#a89987] block mb-1.5 font-classical">
              选择出生州郡（也可以随机）：
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-classical">
              <button
                type="button"
                onClick={() => handleSelectProvince('RANDOM')}
                className={`py-1 px-2 rounded border text-center transition-colors cursor-pointer ${
                  selectedProvinceId === 'RANDOM'
                    ? 'bg-[#d4af37] text-[#1c1208] border-[#d4af37] font-semibold'
                    : 'bg-[#221a14] border-[#382b1f] text-[#a69684] hover:text-[#faece0]'
                }`}
              >
                随机出生
              </button>
              {PROVINCES.map((p) => {
                const isSel = selectedProvinceId === p.id;
                return (
                  <button
                    type="button"
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
            type="submit"
            className="w-full py-3.5 text-base font-semibold text-[#1f1206] bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] hover:from-[#c29c26] hover:to-[#c29c26] rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-classical tracking-widest cursor-pointer mt-4"
          >
            <span>开始游戏 · 开启这辈子</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
