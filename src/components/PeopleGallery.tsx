import React, { useState, useEffect, useMemo } from 'react';
import { CompletedLifeRecord } from '../types/game';
import { CommunityLifeItem, storage } from '../services/storage';
import { PROVINCES } from '../data/regions';
import { getPhysiologicalStage } from '../services/lifeSimulator';
import { PixelFigureAvatar } from './PixelFigureAvatar';
import { ProtagonistPixelAvatar } from './ProtagonistPixelAvatar';
import { sound } from '../services/sound';
import {
  Users,
  Trash2,
  MapPin,
  ChevronRight,
  Heart,
  Search,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  Wine,
} from 'lucide-react';

interface PeopleGalleryProps {
  records: CompletedLifeRecord[];
  onClearRecords: () => void;
}

type SortOption = 'NEWEST' | 'LIKES' | 'AGE_DESC' | 'AGE_ASC';

export const PeopleGallery: React.FC<PeopleGalleryProps> = ({
  records,
  onClearRecords,
}) => {
  const [communityLives, setCommunityLives] = useState<CommunityLifeItem[]>(() =>
    storage.getCommunityLives()
  );
  const [selectedRecord, setSelectedRecord] = useState<CommunityLifeItem | null>(null);

  // Filters & Sorting
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');
  const [showPersonalOnly, setShowPersonalOnly] = useState<boolean>(false);

  useEffect(() => {
    setCommunityLives(storage.getCommunityLives());
    storage.syncCommunityLivesFromRemote().then((lives) => {
      if (lives && lives.length > 0) {
        setCommunityLives(lives);
      }
    });
  }, [records]);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playPluck(660);
    const newLikes = storage.likeCommunityLife(id);
    setCommunityLives((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likesCount: newLikes } : item))
    );
  };

  const personalRecordIds = useMemo(() => {
    return new Set(records.map((r) => r.id));
  }, [records]);

  const filteredLives = useMemo(() => {
    return communityLives
      .filter((item) => {
        // Filter personal only
        if (showPersonalOnly && !personalRecordIds.has(item.id)) {
          return false;
        }

        // Filter province
        if (selectedProvince !== 'ALL') {
          const p = PROVINCES.find((prov) => prov.id === selectedProvince);
          if (p && !item.birthplace.includes(p.provinceName.split(' · ')[1] || p.provinceName)) {
            return false;
          }
        }

        // Search keyword
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchCourtesy = item.courtesyName.toLowerCase().includes(q);
          const matchTitle = (item.primaryFunTitle || '').toLowerCase().includes(q);
          const matchBirth = item.birthplace.toLowerCase().includes(q);
          const matchEnding = (item.ending?.title || '').toLowerCase().includes(q);
          return matchName || matchCourtesy || matchTitle || matchBirth || matchEnding;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'LIKES') {
          return (b.likesCount || 0) - (a.likesCount || 0);
        }
        if (sortOption === 'AGE_DESC') {
          return b.deathAge - a.deathAge;
        }
        if (sortOption === 'AGE_ASC') {
          return a.deathAge - b.deathAge;
        }
        // Default newest (original list order)
        return 0;
      });
  }, [communityLives, searchKeyword, selectedProvince, sortOption, showPersonalOnly, personalRecordIds]);

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* 典雅古籍台头 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2e2319]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#8b261e] text-[#fde047] font-calligraphy text-xs border border-[#a83228]">
              汉末国史
            </span>
            <h2 className="text-xl md:text-2xl font-calligraphy text-[#faece0] tracking-wider">
              万民谱牒 · 芸芸众生殿
            </h2>
          </div>
          <p className="text-xs text-[#a29280] font-classical leading-relaxed">
            青史不仅录将相公卿，亦载黎民百态。此间已汇聚{' '}
            <span className="text-[#f59e0b] font-mono font-semibold">{communityLives.length}</span>{' '}
            位天下先贤生平纪传，皆具其名讳、寿夭与宿命注脚。
          </p>
        </div>

        {/* 顶部统计与私家谱牒切换 */}
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={() => setShowPersonalOnly((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-classical rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showPersonalOnly
                  ? 'bg-[#8b261e] border-[#b91c1c] text-[#fef08a] font-semibold'
                  : 'bg-[#221a14] border-[#3f3022] text-[#d4af37] hover:bg-[#2e2219]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showPersonalOnly ? '查看全天下众生' : `只看我的一生 (${records.length})`}</span>
            </button>
          )}

          {records.length > 0 && showPersonalOnly && (
            <button
              onClick={() => {
                if (window.confirm('确定要清空自己历次转世的本地谱牒记录吗？此举不可逆。')) {
                  onClearRecords();
                }
              }}
              className="p-1.5 text-xs text-[#786959] hover:text-[#ef4444] rounded bg-[#221a14] border border-[#382b1f] hover:border-[#ef4444]/40 transition-colors cursor-pointer"
              title="清空私家转世记录"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 检索与州郡筛选行 */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="relative sm:col-span-5">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7a6b5c]" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索姓名、表字、称谓或籍贯..."
            className="w-full bg-[#201813] border border-[#3e2e21] rounded-lg pl-8 pr-3 py-2 text-xs text-[#f5eee4] placeholder-[#736353] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full bg-[#201813] border border-[#3e2e21] rounded-lg px-3 py-2 text-xs text-[#dcd1c2] focus:outline-none focus:border-[#d4af37] font-classical cursor-pointer"
          >
            <option value="ALL">全天下十四州域</option>
            {PROVINCES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.provinceName}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full bg-[#201813] border border-[#3e2e21] rounded-lg px-3 py-2 text-xs text-[#e5c158] focus:outline-none focus:border-[#d4af37] font-classical cursor-pointer"
            >
              <option value="NEWEST">排序：按入牒时序</option>
              <option value="LIKES">排序：按斟酒祭奠 (热度)</option>
              <option value="AGE_DESC">排序：按寿算享年 (高寿)</option>
              <option value="AGE_ASC">排序：按寿算享年 (短折)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 众生牒谱列表网格 */}
      {filteredLives.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#8c7b69] font-classical bg-[#15110e] rounded-lg border border-[#2b2118] space-y-2">
          <Users className="w-8 h-8 text-[#544335] mx-auto" />
          <p>暂未检索到符合条件的汉末先贤记录。</p>
          <span className="text-[11px] text-[#695a4c] block">
            可尝试清除搜索词或切换州郡重新查阅
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredLives.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => {
                  sound.playPluck(550);
                  setSelectedRecord(item);
                }}
                className="bg-[#221a14] border border-[#3e2f21] hover:border-[#d4af37] rounded-lg p-3.5 sm:p-4 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
              >
                <div>
                  {/* Name & Fun Title & Protagonist Pixel Avatar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <ProtagonistPixelAvatar
                        stageKey={getPhysiologicalStage(item.deathAge).stageKey}
                        gender={item.gender}
                        age={item.deathAge}
                        name={item.name}
                        size="md"
                        showAgeBadge={false}
                        showCampBorder={true}
                        isAlive={false}
                        showTooltip={true}
                        tooltipPlacement="bottom-start"
                      />
                      <div>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="font-calligraphy text-lg text-[#faece0]">
                            {item.name}
                          </span>
                          {item.courtesyName && (
                            <span className="text-xs text-[#a29280]">字 {item.courtesyName}</span>
                          )}
                          <span className="text-xs text-[#736454]">
                            ({item.gender === 'MALE' ? '男丁' : '女秀'})
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-[#f59e0b] font-classical mt-0.5">
                          {item.primaryFunTitle || item.ending.title}
                        </div>
                      </div>
                    </div>

                    {/* 斟酒祭奠按钮 */}
                    <button
                      onClick={(e) => handleLike(e, item.id)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[#2a1d15] hover:bg-[#3d2719] border border-[#483424] hover:border-[#ef4444]/60 text-[#fca5a5] transition-colors cursor-pointer shrink-0"
                      title="为这位乱世先贤斟浊酒一杯（祭奠）"
                    >
                      <Wine className="w-3.5 h-3.5 text-[#ef4444]" />
                      <span className="font-mono font-semibold">{item.likesCount || 0}</span>
                    </button>
                  </div>

                  {/* Badges */}
                  {item.badges && item.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.badges.slice(0, 3).map((b, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-[#18120e] text-[#d4af37] border border-[#382a1d]"
                        >
                          #{b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 籍贯与享年 */}
                  <div className="text-xs text-[#8c7b69] flex items-center justify-between gap-1 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d4af37]" />
                      <span>{item.birthplace} · 享年 {item.deathAge} 岁</span>
                    </span>
                    {item.militaryCamp && item.militaryCamp !== '乡野布衣' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2e1d13] text-[#f59e0b] border border-[#523820]">
                        {item.militaryCamp}
                      </span>
                    )}
                  </div>

                  {/* 宿命同道历史映照 */}
                  {item.matchedFigureName && (
                    <div className="mb-2 flex items-center justify-between text-[11px] bg-[#1e1610] px-2 py-1 rounded border border-[#3d2c1d] text-[#e5c158] font-classical">
                      <span className="flex items-center gap-1.5">
                        <PixelFigureAvatar name={item.matchedFigureName} size="xs" showCampBorder={false} />
                        <span>宿命同道：{item.matchedFigureName}</span>
                      </span>
                      {item.matchedFigureSimilarity && (
                        <span className="text-[10px] text-[#f59e0b] font-mono">
                          {item.matchedFigureSimilarity}% 契合
                        </span>
                      )}
                    </div>
                  )}

                  {/* 生平志林节选 */}
                  <p className="text-xs text-[#a49381] italic line-clamp-2 leading-relaxed font-classical border-t border-[#2e2319] pt-2">
                    {item.ending.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#786959] mt-3 pt-2 border-t border-[#2e2319]">
                  <span>公元184年春 — 公元{item.deathYear}年{item.deathSeason || ''}</span>
                  <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform flex items-center font-classical">
                    查阅传记 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 先贤传记古卷弹窗 (Selected Life Detail Modal) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#191512] border-2 border-[#544130] rounded-xl max-w-xl w-full p-6 text-[#ece3d6] shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-[#36291e] pb-3">
              <div>
                <div className="seal-stamp text-xs px-2 py-0.5 mb-1.5">
                  {selectedRecord.ending.epitaphTitle}
                </div>
                <h3 className="text-xl font-calligraphy text-[#faece0]">
                  {selectedRecord.name}
                  {selectedRecord.courtesyName ? `（字${selectedRecord.courtesyName}）` : ''} · {selectedRecord.ending.title}
                </h3>
                <div className="text-xs text-[#d4af37] font-semibold mt-1">
                  {selectedRecord.primaryFunTitle} ({selectedRecord.folkNickname})
                </div>
                <span className="text-xs text-[#a29280] block mt-0.5">
                  生于公元184年春 · 殁于公元{selectedRecord.deathYear}年{selectedRecord.deathSeason || ''} · 籍贯【{selectedRecord.birthplace}】
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-xs text-[#a29280] hover:text-[#faece0] px-2.5 py-1.5 bg-[#261f18] rounded border border-[#3e3023] hover:border-[#d4af37] cursor-pointer transition-colors"
              >
                卷毕闭阖
              </button>
            </div>

            <div className="space-y-3 font-classical text-xs sm:text-sm">
              {/* 宿命同道卡片 */}
              {selectedRecord.matchedFigureName && (
                <div className="bg-[#241a13] p-3 rounded-lg border border-[#523b26] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PixelFigureAvatar
                      name={selectedRecord.matchedFigureName}
                      size="sm"
                      showCampBadge={true}
                      showCampBorder={true}
                    />
                    <span className="text-xs text-[#dcd1c2]">
                      宿命映照三国历史同道：<strong className="text-[#faece0] text-sm">{selectedRecord.matchedFigureName}</strong>{' '}
                      <span className="text-[#d4af37] text-xs font-semibold">{selectedRecord.matchedFigureTitle || ''}</span>
                    </span>
                  </div>
                  {selectedRecord.matchedFigureSimilarity && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#17110c] text-[#f59e0b] font-mono border border-[#483422] shrink-0">
                      {selectedRecord.matchedFigureSimilarity}% 契合
                    </span>
                  )}
                </div>
              )}

              {/* 平生小传 */}
              <div className="bg-[#221a14] p-3.5 rounded border border-[#3f3022]">
                <div className="text-[#d4af37] font-semibold mb-1">【平生小传】</div>
                <p className="leading-relaxed text-[#ddd2c4]">
                  {selectedRecord.ending.summary}
                </p>
              </div>

              {/* 史家注脚 */}
              <div className="bg-[#221a14] p-3.5 rounded border border-[#3f3022]">
                <div className="text-[#d4af37] font-semibold mb-1">【史家注脚】</div>
                <p className="leading-relaxed text-[#ddd2c4] italic">
                  {selectedRecord.ending.historianNote}
                </p>
              </div>

              {/* 民间生平趣评 */}
              {selectedRecord.humorousQuote && (
                <div className="bg-[#221a14] p-3.5 rounded border border-[#3f3022]">
                  <div className="text-[#f59e0b] font-semibold mb-1">【民间生平趣评】</div>
                  <p className="leading-relaxed text-[#ddd2c4] italic">
                    {selectedRecord.humorousQuote}
                  </p>
                </div>
              )}

              {/* 斟酒致敬交互区 */}
              <div className="pt-2 flex items-center justify-between bg-[#1f1712] p-3 rounded border border-[#392b1e]">
                <span className="text-xs text-[#9d8d7b]">
                  已得天下后人斟酒祭奠：<strong className="text-[#fca5a5] font-mono">{selectedRecord.likesCount || 0}</strong> 杯
                </span>
                <button
                  onClick={(e) => handleLike(e, selectedRecord.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#8b261e] hover:bg-[#a83228] text-[#fef08a] font-classical text-xs border border-[#b91c1c] transition-colors cursor-pointer"
                >
                  <Wine className="w-3.5 h-3.5" />
                  <span>斟浊酒祭奠</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
