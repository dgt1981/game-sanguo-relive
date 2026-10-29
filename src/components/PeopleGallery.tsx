import React, { useState, useEffect } from 'react';
import { CompletedLifeRecord } from '../types/game';
import { CommunityLifeItem, storage } from '../services/storage';
import { PROVINCES } from '../data/regions';
import { PixelFigureAvatar } from './PixelFigureAvatar';
import { sound } from '../services/sound';
import {
  Users,
  Trash2,
  MapPin,
  ChevronRight,
  Heart,
  Search,
  Database,
  Code2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

interface PeopleGalleryProps {
  records: CompletedLifeRecord[];
  onClearRecords: () => void;
}

export const PeopleGallery: React.FC<PeopleGalleryProps> = ({
  records,
  onClearRecords,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'WALL' | 'BACKEND_CODE'>('WALL');
  const [communityLives, setCommunityLives] = useState<CommunityLifeItem[]>(() =>
    storage.getCommunityLives()
  );
  const [selectedRecord, setSelectedRecord] = useState<CommunityLifeItem | null>(null);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const filteredLives = communityLives.filter((item) => {
    if (selectedProvince !== 'ALL') {
      const p = PROVINCES.find((prov) => prov.id === selectedProvince);
      if (p && !item.birthplace.includes(p.provinceName.split(' · ')[1] || p.provinceName)) {
        return false;
      }
    }
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCourtesy = item.courtesyName.toLowerCase().includes(q);
      const matchTitle = (item.primaryFunTitle || '').toLowerCase().includes(q);
      const matchBirth = item.birthplace.toLowerCase().includes(q);
      return matchName || matchCourtesy || matchTitle || matchBirth;
    }
    return true;
  });

  const handleCopyCode = (type: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const sampleSqlSnippet = `-- 导入 MySQL 数据库表结构
-- 执行: mysql -u root -p three_kingdoms_life < backend/schema.sql
CREATE TABLE IF NOT EXISTS tb_three_kingdoms_lives (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  courtesy_name VARCHAR(32) DEFAULT '',
  gender ENUM('MALE', 'FEMALE') DEFAULT 'MALE',
  birth_year INT NOT NULL DEFAULT 184,
  death_year INT NOT NULL,
  death_season VARCHAR(16) NOT NULL,
  death_age INT NOT NULL,
  birthplace VARCHAR(128) NOT NULL,
  province_id VARCHAR(32) NOT NULL,
  ending_title VARCHAR(128) NOT NULL,
  primary_fun_title VARCHAR(128) DEFAULT '',
  badges_json TEXT,
  summary TEXT NOT NULL,
  stats_json JSON NOT NULL,
  likes_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

  const sampleSeedSnippet = `-- 导入事件总谱预置数据 (共51条大事件与多分支因果抉择)
-- 执行: mysql -u root -p three_kingdoms_life < backend/seed_events.sql
INSERT INTO tb_three_kingdoms_events_catalog (
  id, category, priority, min_year, max_year, seasons_json, min_age, max_age, narrative_template, choices_json
) VALUES (
  'evt_toddler_1_zhuazhou', 'INFANT_SURVIVAL', 90, 185, 185, '[0,1]', 1, 1,
  '公元185年中平二年，你满周岁了！按汉家习俗，父母在红漆案几上设下“晬盘”...',
  '[{"id":"c_zhuazhou_abacus","label":"【算盘铜钱】..."},{"id":"c_zhuazhou_wooden_sword","label":"【桃木小剑】..."}]'
) ON DUPLICATE KEY UPDATE choices_json = VALUES(choices_json);`;

  const samplePhpSnippet = `<?php
// PHP 7.4+ / 8.x PDO 存储与读取接口 (backend/api.php)
$pdo = new PDO("mysql:host=127.0.0.1;dbname=three_kingdoms_life;charset=utf8mb4", "root", "root123456");

$action = $_GET['action'] ?? '';
if ($action === 'save_life') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO tb_three_kingdoms_lives (id, name, courtesy_name, death_year, death_age, birthplace, ending_title, primary_fun_title, summary, stats_json) VALUES (:id, :name, :courtesy, :dyear, :dage, :bplace, :etitle, :ftitle, :summary, :stats)");
    $stmt->execute([...]);
    echo json_encode(['code' => 200, 'message' => '保存成功']);
} elseif ($action === 'save_progress') {
    // 实时保存中途进度
} elseif ($action === 'load_progress') {
    // 恢复先前未竟进度
}`;

  return (
    <div className="bg-[#1b1612] border border-[#3e3023] rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header and Sub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2e2319]">
        <div>
          <h2 className="text-lg md:text-xl font-calligraphy text-[#faece0] tracking-wider">
            万民谱牒 · 芸芸众生殿
          </h2>
          <span className="text-xs text-[#a29280]">
            已汇聚 {communityLives.length} 段天下玩家与先贤的真实生平
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#221a14] p-1 rounded-lg border border-[#3f3022]">
          <button
            onClick={() => setActiveSubTab('WALL')}
            className={`px-3 py-1 text-xs font-classical rounded transition-colors cursor-pointer ${
              activeSubTab === 'WALL'
                ? 'bg-[#d4af37] text-[#1c1208] font-semibold'
                : 'text-[#9d8d7b] hover:text-[#f5eee4]'
            }`}
          >
            天下群生浏览
          </button>
          <button
            onClick={() => setActiveSubTab('BACKEND_CODE')}
            className={`px-3 py-1 text-xs font-classical rounded transition-colors cursor-pointer flex items-center gap-1 ${
              activeSubTab === 'BACKEND_CODE'
                ? 'bg-[#d4af37] text-[#1c1208] font-semibold'
                : 'text-[#9d8d7b] hover:text-[#f5eee4]'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>PHP+MySQL 架构</span>
          </button>
        </div>
      </div>

      {/* View 1: Community Lives Wall */}
      {activeSubTab === 'WALL' && (
        <div className="space-y-4">
          {/* Search & Province Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7a6b5c]" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索姓名、表字、趣称或籍贯..."
                className="w-full bg-[#201813] border border-[#3e2e21] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f5eee4] placeholder-[#736353] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full sm:w-auto bg-[#201813] border border-[#3e2e21] rounded-lg px-3 py-1.5 text-xs text-[#dcd1c2] focus:outline-none focus:border-[#d4af37] font-classical"
            >
              <option value="ALL">全天下十四州</option>
              {PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.provinceName}
                </option>
              ))}
            </select>
          </div>

          {/* List Grid */}
          {filteredLives.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8c7b69] font-classical">
              未检索到符合条件的平民先贤。
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
                    className="bg-[#221a14] border border-[#3e2f21] hover:border-[#d4af37] rounded-lg p-3.5 sm:p-4 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
                  >
                    <div>
                      {/* Name & Fun Title */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-baseline gap-1.5">
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

                        {/* Likes Button */}
                        <button
                          onClick={(e) => handleLike(e, item.id)}
                          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#2a1d15] hover:bg-[#3d2719] border border-[#483424] text-[#fca5a5] transition-colors cursor-pointer shrink-0"
                          title="为这位乱世先贤斟浊酒一杯"
                        >
                          <Heart className="w-3 h-3 fill-current text-[#ef4444]" />
                          <span className="font-mono">{item.likesCount || 0}</span>
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

                      {/* Historical Parallel Badge if present */}
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

                      <p className="text-xs text-[#a49381] italic line-clamp-2 leading-relaxed font-classical border-t border-[#2e2319] pt-2">
                        {item.ending.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#786959] mt-3 pt-2 border-t border-[#2e2319]">
                      <span>公元184年春 — 公元{item.deathYear}年{item.deathSeason || ''}</span>
                      <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform flex items-center">
                        查阅传记 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* View 2: PHP & MySQL Backend Code & Schema Showcase */}
      {activeSubTab === 'BACKEND_CODE' && (
        <div className="space-y-4 font-classical text-xs">
          <div className="bg-[#221a14] border border-[#3e2e21] rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-[#f5eee4] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#d4af37]" />
              <span>数据持久化架构说明</span>
            </h3>
            <p className="text-[#a49381] leading-relaxed">
              为了让生平履历可被所有玩家公共浏览、且在中途退出时能保存进度并在重新进入时继续，项目已为您在{' '}
              <code className="text-[#d4af37] bg-[#16120e] px-1 py-0.5 rounded">backend/</code> 目录下生成了完整的
              PHP 接口程序与 MySQL 数据表结构，支持在任意 PHP+MySQL 生产服务器上一键部署。
            </p>
          </div>

          {/* SQL Block */}
          <div className="bg-[#181310] border border-[#382b1f] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#d4af37]">1. MySQL 数据库表结构 (backend/schema.sql)</span>
              <button
                onClick={() => handleCopyCode('sql', sampleSqlSnippet)}
                className="text-[11px] text-[#a49381] hover:text-[#faece0] flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === 'sql' ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'sql' ? '已复制' : '复制代码'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-[#120e0b] rounded text-[11px] text-[#cfc2b2] font-mono overflow-x-auto">
              {sampleSqlSnippet}
            </pre>
          </div>

          {/* PHP Block */}
          <div className="bg-[#181310] border border-[#382b1f] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#d4af37]">2. PHP 后端接口程序 (backend/api.php)</span>
              <button
                onClick={() => handleCopyCode('php', samplePhpSnippet)}
                className="text-[11px] text-[#a49381] hover:text-[#faece0] flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === 'php' ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'php' ? '已复制' : '复制代码'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-[#120e0b] rounded text-[11px] text-[#cfc2b2] font-mono overflow-x-auto">
              {samplePhpSnippet}
            </pre>
          </div>

          {/* Seed Events Catalog SQL Block */}
          <div className="bg-[#181310] border border-[#382b1f] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#d4af37]">3. 事件总谱数据初始化脚本 (backend/seed_events.sql · 共51条预置事件)</span>
              <div className="flex items-center gap-2">
                <a
                  href="./backend/seed_events.sql"
                  download="seed_events.sql"
                  className="text-[11px] text-[#f59e0b] hover:underline"
                >
                  下载完整SQL
                </a>
                <button
                  onClick={() => handleCopyCode('seed', sampleSeedSnippet)}
                  className="text-[11px] text-[#a49381] hover:text-[#faece0] flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === 'seed' ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'seed' ? '已复制' : '复制代码'}</span>
                </button>
              </div>
            </div>
            <pre className="p-2.5 bg-[#120e0b] rounded text-[11px] text-[#cfc2b2] font-mono overflow-x-auto">
              {sampleSeedSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Selected Life Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
                className="text-xs text-[#a29280] hover:text-[#faece0] p-1.5 bg-[#261f18] rounded border border-[#3e3023] cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3 font-classical text-xs sm:text-sm">
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

              {selectedRecord.humorousQuote && (
                <div className="bg-[#221a14] p-3.5 rounded border border-[#3f3022]">
                  <div className="text-[#f59e0b] font-semibold mb-1">【民间生平趣评】</div>
                  <p className="leading-relaxed text-[#ddd2c4] italic">
                    {selectedRecord.humorousQuote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
