import {
  Attributes,
  SeasonalEvent,
  SeasonLogEntry,
  RealisticEnding,
  CompletedLifeRecord,
  SeasonIndex,
} from '../types/game';
import { PersonProfile } from './lifeSimulator';
import { FunTitleInfo } from './titleGenerator';

export interface MidGameSaveData {
  userToken: string;
  playerName: string;
  currentYear: number;
  currentSeason: SeasonIndex;
  currentAge: number;
  profile: PersonProfile;
  stats: Attributes;
  seasonLogs: SeasonLogEntry[];
  currentEvent: SeasonalEvent;
  isAutoRunning: boolean;
  playbackSpeed: 1 | 2 | 4 | 8;
  savedAt: string;
}

export interface CommunityLifeItem extends CompletedLifeRecord {
  primaryFunTitle: string;
  folkNickname: string;
  badges: string[];
  humorousQuote: string;
  likesCount: number;
}

const LOCAL_STORAGE_SAVE_KEY = '3k_mid_game_save_v2';
const LOCAL_STORAGE_COMMUNITY_KEY = '3k_community_lives_v2';

// Historical seed souls so the community wall is alive from the very start
const INITIAL_COMMUNITY_SOULS: CommunityLifeItem[] = [
  {
    id: 'seed_life_1',
    name: '周阿狗',
    courtesyName: '子安',
    gender: 'MALE',
    birthYear: 184,
    deathYear: 246,
    deathSeason: '秋季',
    deathAge: 62,
    birthplace: '扬州会稽郡山阴县',
    socialClass: 'FISHER_BOATMAN',
    finalOccupation: '乡党长者',
    primaryFunTitle: '「浪里白条横江水怪」',
    folkNickname: '鉴湖水边的「周老汉」',
    badges: ['长江横江水怪', '风浪越大鱼越贵', '大难不死', '三国打卡狂人'],
    humorousQuote: '“江东六郡打得翻天覆地，老汉我依然在鉴湖里钓肥鱼。”',
    ending: {
      title: '会稽鉴湖渔翁 · 享年六十二',
      epitaphTitle: '沧江逸叟',
      summary: '生于黄巾元年，长于水乡。经历了孙策平江东、赤壁大火。不求功名，一叶扁舟过重山，寿过花甲，含笑于舟头。',
      historianNote: '英雄争据州郡，渔樵笑谈古今。沧浪之水清兮，濯我缨；沧浪之水浊兮，濯我足。',
      tier: 'RESILIENT',
    },
    finalStats: { health: 65, intellect: 52, martial: 58, virtue: 72, wealth: 48, fortune: 60 },
    seasonLogsCount: 248,
    completedAt: '2026/10/20',
    likesCount: 18,
    matchedFigureName: '甘宁',
    matchedFigureSimilarity: 88,
    matchedFigureTitle: '【锦帆豪侠 · 胆气过人水陆霸王】',
  },
  {
    id: 'seed_life_2',
    name: '李小顺',
    courtesyName: '叔平',
    gender: 'MALE',
    birthYear: 184,
    deathYear: 203,
    deathSeason: '冬季',
    deathAge: 19,
    birthplace: '徐州下邳国睢陵县',
    socialClass: 'PEASANT',
    finalOccupation: '随军粮夫',
    primaryFunTitle: '「当阳推车神行太保」',
    folkNickname: '村里跑得最快的「顺子」',
    badges: ['推车神将', '泗水幸存者', '虽败犹荣'],
    humorousQuote: '“官渡运粮跑得快，可惜冬天风太冷，未能回徐州见娘一面。”',
    ending: {
      title: '官渡随军粮夫 · 享年十九',
      epitaphTitle: '短折荒岁草民',
      summary: '应募转运军粮数百里，在乌巢大火后因冻疮严寒殁于荒营。怀中尚留有母亲手织的一双旧布鞋底。',
      historianNote: '可怜无定河边骨，犹是春闺梦里人。百万粮夫之血泪，铸就一代北方霸业。',
      tier: 'TRAGIC',
    },
    finalStats: { health: 22, intellect: 40, martial: 38, virtue: 62, wealth: 18, fortune: 30 },
    seasonLogsCount: 76,
    completedAt: '2026/10/21',
    likesCount: 34,
    matchedFigureName: '太史慈',
    matchedFigureSimilarity: 82,
    matchedFigureTitle: '【笃烈信义 · 弦无虚发东莱豪士】',
  },
  {
    id: 'seed_life_3',
    name: '王惠娘',
    courtesyName: '文慧',
    gender: 'FEMALE',
    birthYear: 184,
    deathYear: 251,
    deathSeason: '春季',
    deathAge: 67,
    birthplace: '荆州襄阳郡襄阳县',
    socialClass: 'SCHOLAR_CLERK',
    finalOccupation: '里塾女先生',
    primaryFunTitle: '「野生民间小诸葛」',
    folkNickname: '十里八乡赞颂的「大善人惠姑」',
    badges: ['抗疫老当益壮', '行走的百草经', '救苦救难及时雨', '桃李满天下'],
    humorousQuote: '“生姜羊肉汤多熬两锅，比求什么黄巾神符管用一万倍！”',
    ending: {
      title: '襄阳里塾慈妪 · 享年六十七',
      epitaphTitle: '乱世人瑞 · 杏林遗风',
      summary: '幼承庭训，长于荆襄安宁岁月。建安大疫时按张仲景古方熬汤救活乡里数十户。晚年设蒙馆开智化民，寿考遐龄。',
      historianNote: '善人者，人亦善之。大疫横行之时，以慈心活众生，功德不在公卿相门之下！',
      tier: 'RESILIENT',
    },
    finalStats: { health: 60, intellect: 84, martial: 30, virtue: 92, wealth: 56, fortune: 75 },
    seasonLogsCount: 268,
    completedAt: '2026/10/22',
    likesCount: 52,
    matchedFigureName: '张仲景',
    matchedFigureSimilarity: 95,
    matchedFigureTitle: '【仁爱济世 · 伤寒活命万家生佛】',
  },
];

/**
 * 动态获取 PHP 接口的相对路径
 * 默认使用 './backend/api.php'（相对路径），确保网页被部署在任何网站二级目录
 * （例如 https://example.com/sub/ 或 https://example.com/games/sanguo/）时均能正确寻址，
 * 也支持通过 window.__PHP_API_URL__ 自定义指定完整或其它相对路径。
 */
export function getPhpApiUrl(action: string, extraParams: Record<string, string> = {}): string {
  let baseUrl = './backend/api.php';
  if (typeof window !== 'undefined' && (window as any).__PHP_API_URL__) {
    baseUrl = (window as any).__PHP_API_URL__;
  }
  const params = new URLSearchParams({ action, ...extraParams });
  return `${baseUrl}?${params.toString()}`;
}

class StorageService {
  // Get or create unique user token
  public getUserToken(): string {
    let token = localStorage.getItem('3k_user_token');
    if (!token) {
      token = 'user_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('3k_user_token', token);
    }
    return token;
  }

  // 1. Save mid-game progress
  public saveMidGameProgress(data: Omit<MidGameSaveData, 'userToken' | 'savedAt'>): void {
    try {
      const fullSave: MidGameSaveData = {
        ...data,
        userToken: this.getUserToken(),
        savedAt: new Date().toLocaleString('zh-CN'),
      };
      localStorage.setItem(LOCAL_STORAGE_SAVE_KEY, JSON.stringify(fullSave));

      // Optional remote PHP call if hosted (relative path './backend/api.php')
      if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        fetch(getPhpApiUrl('save_progress'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullSave),
        }).catch(() => {
          // Graceful fallback to localStorage
        });
      }
    } catch {}
  }

  // 2. Load mid-game progress
  public loadMidGameProgress(): MidGameSaveData | null {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVE_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  // 3. Clear mid-game progress
  public clearMidGameProgress(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_SAVE_KEY);
      if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        fetch(getPhpApiUrl('clear_progress', { userToken: this.getUserToken() }), {
          method: 'POST',
        }).catch(() => {});
      }
    } catch {}
  }

  // 4. Publish completed life to community wall
  public publishCompletedLife(
    record: CompletedLifeRecord,
    funTitles: FunTitleInfo
  ): CommunityLifeItem {
    const item: CommunityLifeItem = {
      ...record,
      primaryFunTitle: funTitles.primaryTitle,
      folkNickname: funTitles.folkNickname,
      badges: funTitles.badges,
      humorousQuote: funTitles.humorousQuote,
      likesCount: 1,
    };

    try {
      // 1. Update local community wall
      const existing = this.getCommunityLives();
      const updated = [item, ...existing.filter((x) => x.id !== item.id)];
      localStorage.setItem(LOCAL_STORAGE_COMMUNITY_KEY, JSON.stringify(updated));

      // 2. Optional remote PHP call (relative path './backend/api.php')
      if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        fetch(getPhpApiUrl('save_life'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...item,
            funTitles,
            provinceId: record.birthplace.split(' · ')[0] || 'LUOYANG',
          }),
        }).catch(() => {});
      }
    } catch {}

    // When life is completed, automatically clear mid-game resume point
    this.clearMidGameProgress();

    return item;
  }

  // 5. Get community lives
  public getCommunityLives(): CommunityLifeItem[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COMMUNITY_KEY);
      if (!saved) {
        localStorage.setItem(LOCAL_STORAGE_COMMUNITY_KEY, JSON.stringify(INITIAL_COMMUNITY_SOULS));
        return INITIAL_COMMUNITY_SOULS;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return INITIAL_COMMUNITY_SOULS;
      }
      return parsed;
    } catch {
      return INITIAL_COMMUNITY_SOULS;
    }
  }

  // 6. Upvote / Like a community life
  public likeCommunityLife(id: string): number {
    const lives = this.getCommunityLives();
    let newLikes = 0;
    const updated = lives.map((item) => {
      if (item.id === id) {
        newLikes = (item.likesCount || 0) + 1;
        return { ...item, likesCount: newLikes };
      }
      return item;
    });
    localStorage.setItem(LOCAL_STORAGE_COMMUNITY_KEY, JSON.stringify(updated));

    // Optional remote call (relative path './backend/api.php')
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      fetch(getPhpApiUrl('like_life'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => {});
    }

    return newLikes;
  }

  // 7. 同步远程万民谱 (从 PHP/MySQL 获取天下玩家的真实生平)
  public async syncCommunityLivesFromRemote(): Promise<CommunityLifeItem[]> {
    try {
      if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        const res = await fetch(getPhpApiUrl('get_community_lives', { limit: '50' }));
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data?.list) && json.data.list.length > 0) {
          const remoteList: CommunityLifeItem[] = json.data.list.map((r: any) => ({
            ...r,
            likesCount: r.likes_count || r.likesCount || 0,
            primaryFunTitle: r.primary_fun_title || r.primaryFunTitle || '',
            folkNickname: r.folk_nickname || r.folkNickname || '',
            humorousQuote: r.humorous_quote || r.humorousQuote || '',
            badges: r.badges || [],
            finalStats: r.stats || r.finalStats || { health: 50, intellect: 50, martial: 50, virtue: 50, wealth: 50, fortune: 50 },
            ending: {
              title: r.ending_title || r.ending?.title || '汉末草民',
              epitaphTitle: r.epitaph_title || r.ending?.epitaphTitle || '草民实录',
              summary: r.summary || r.ending?.summary || '',
              historianNote: r.historian_note || r.ending?.historianNote || '',
              tier: r.ending?.tier || 'RESILIENT',
            },
          }));
          const localItems = this.getCommunityLives();
          const map = new Map<string, CommunityLifeItem>();
          localItems.forEach((item) => map.set(item.id, item));
          remoteList.forEach((item) => map.set(item.id, item));
          const merged = Array.from(map.values());
          localStorage.setItem(LOCAL_STORAGE_COMMUNITY_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch {}
    return this.getCommunityLives();
  }

  // 4. 从后端 MySQL 数据表中动态读取预存扩展事件
  public async fetchCatalogEventsFromBackend(category?: string, year?: number): Promise<any[]> {
    try {
      const extra: Record<string, string> = {};
      if (category) extra.category = category;
      if (year) extra.year = String(year);
      const url = getPhpApiUrl('get_events_catalog', extra);
      const resp = await fetch(url);
      if (resp.ok) {
        const json = await resp.json();
        if (json.code === 200 && Array.isArray(json.data?.events)) {
          return json.data.events;
        }
      }
    } catch {}
    return [];
  }
}

export const storage = new StorageService();
