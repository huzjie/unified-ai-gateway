import { StatsUtils } from '../src/utils/stats-utils';

describe('StatsUtils', () => {
  it('维度列映射', () => {
    expect(StatsUtils.dimensionColumn('model')).toBe('model');
    expect(StatsUtils.dimensionColumn('key')).toBe('key_id');
    expect(StatsUtils.dimensionColumn('provider')).toBe('provider');
    expect(StatsUtils.dimensionColumn('date')).toBe('stat_date');
  });

  it('聚合 SQL 生成', () => {
    const sql = StatsUtils.aggregateSql('model');
    expect(sql).toContain('GROUP BY model');
    expect(sql).toContain('request_count');
    expect(sql).toContain('cost_amount');
  });
});
