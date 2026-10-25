import fs from 'fs';
import path from 'path';
import { EVENTS_DATA_TABLE } from '../src/data/eventsCatalog';

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  })}'`;
}

function generateSql(): void {
  const lines: string[] = [
    '-- ==========================================================',
    '-- 三国人生演义 · 默认预存事件数据表初始化脚本 (Seed Events Catalog)',
    '-- 表名: tb_three_kingdoms_events_catalog',
    `-- 生成时间: ${new Date().toISOString()}`,
    `-- 总条目数: ${EVENTS_DATA_TABLE.length}`,
    '-- ==========================================================',
    '',
    'USE `three_kingdoms_life`;',
    '',
    'INSERT INTO `tb_three_kingdoms_events_catalog` (',
    '  `id`, `category`, `priority`, `campaign_name`,',
    '  `min_year`, `max_year`, `seasons_json`, `min_age`, `max_age`,',
    '  `required_camp`, `required_provinces_json`, `required_flags_json`, `forbidden_flags_json`, `min_stats_json`,',
    '  `historical_figure_id`, `narrative_template`, `dialogue_prompt`, `dialogue_quote`,',
    '  `choices_json`, `is_enabled`',
    ') VALUES',
  ];

  const valueRows: string[] = [];

  for (const row of EVENTS_DATA_TABLE) {
    const c = row.conditions;
    const seasonsJson = c.seasons ? JSON.stringify(c.seasons) : null;
    const reqProvinces = c.provinces ? JSON.stringify(c.provinces) : null;
    const reqFlags = c.requiredFlags ? JSON.stringify(c.requiredFlags) : null;
    const forbiddenFlags = c.forbiddenFlags ? JSON.stringify(c.forbiddenFlags) : null;
    const minStats = c.minStats ? JSON.stringify(c.minStats) : null;

    let narrativeTemplate = '';
    if (typeof row.storyText === 'function') {
      const mockProfile: any = {
        name: '{传主姓名}',
        commandery: '{郡名}',
        county: '{县名}',
        fatherName: '{父名}',
        motherName: '{母名}',
      };
      narrativeTemplate = row.storyText(mockProfile, {} as any, 0);
    } else {
      narrativeTemplate = row.storyText;
    }

    const dialoguePrompt = row.choice?.prompt || null;
    let dialogueQuote: string | null = null;
    let figureId: string | null = null;
    if (row.figureDialogue) {
      if (typeof row.figureDialogue !== 'function') {
        dialogueQuote = row.figureDialogue.quote || null;
        figureId = row.figureDialogue.figureId || null;
      }
    }

    const choicesJson = row.choice?.options ? JSON.stringify(row.choice.options) : '[]';

    const vals = [
      escapeSql(row.id),
      escapeSql(row.category),
      row.priority,
      escapeSql(row.campaignName || null),
      c.minYear ?? 'NULL',
      c.maxYear ?? 'NULL',
      escapeSql(seasonsJson),
      c.minAge ?? 'NULL',
      c.maxAge ?? 'NULL',
      escapeSql(c.requiredCamp || null),
      escapeSql(reqProvinces),
      escapeSql(reqFlags),
      escapeSql(forbiddenFlags),
      escapeSql(minStats),
      escapeSql(figureId),
      escapeSql(narrativeTemplate),
      escapeSql(dialoguePrompt),
      escapeSql(dialogueQuote),
      escapeSql(choicesJson),
      1,
    ].join(', ');

    valueRows.push(`  (${vals})`);
  }

  lines.push(valueRows.join(',\n'));
  lines.push('ON DUPLICATE KEY UPDATE');
  lines.push('  `category` = VALUES(`category`),');
  lines.push('  `priority` = VALUES(`priority`),');
  lines.push('  `campaign_name` = VALUES(`campaign_name`),');
  lines.push('  `min_year` = VALUES(`min_year`),');
  lines.push('  `max_year` = VALUES(`max_year`),');
  lines.push('  `seasons_json` = VALUES(`seasons_json`),');
  lines.push('  `min_age` = VALUES(`min_age`),');
  lines.push('  `max_age` = VALUES(`max_age`),');
  lines.push('  `required_camp` = VALUES(`required_camp`),');
  lines.push('  `required_provinces_json` = VALUES(`required_provinces_json`),');
  lines.push('  `required_flags_json` = VALUES(`required_flags_json`),');
  lines.push('  `forbidden_flags_json` = VALUES(`forbidden_flags_json`),');
  lines.push('  `min_stats_json` = VALUES(`min_stats_json`),');
  lines.push('  `narrative_template` = VALUES(`narrative_template`),');
  lines.push('  `dialogue_prompt` = VALUES(`dialogue_prompt`),');
  lines.push('  `dialogue_quote` = VALUES(`dialogue_quote`),');
  lines.push('  `choices_json` = VALUES(`choices_json`),');
  lines.push('  `is_enabled` = VALUES(`is_enabled`);');

  const content = lines.join('\n');
  const targetPublic = path.resolve(process.cwd(), 'public/backend/seed_events.sql');
  fs.writeFileSync(targetPublic, content, 'utf-8');
  console.log(`Generated ${targetPublic} successfully (${EVENTS_DATA_TABLE.length} events).`);

  const distDir = path.resolve(process.cwd(), 'dist/backend');
  if (fs.existsSync(distDir)) {
    const targetDist = path.resolve(distDir, 'seed_events.sql');
    fs.writeFileSync(targetDist, content, 'utf-8');
    console.log(`Generated ${targetDist} successfully.`);
  }
}

generateSql();
