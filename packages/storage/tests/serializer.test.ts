import { Serializer } from '../src/services/serializer';
import { StatsUtils } from '../src/utils/stats-utils';

describe('serializer & stats-utils', () => {
  it('Serializer 序列化/反序列化', () => {
    expect(Serializer.serialize([1, 2])).toBe('[1,2]');
    expect(Serializer.stringArray('[1,2]')).toEqual([1, 2]);
    expect(Serializer.stringArray(null)).toEqual([]);
    expect(Serializer.record('{"a":1}')).toEqual({ a: 1 });
    expect(Serializer.record('bad')).toEqual({});
  });

  it('StatsUtils 维度列与 SQL', () => {
    expect(StatsUtils.dimensionColumn('model')).toBe('model');
    expect(StatsUtils.dimensionColumn('key')).toBe('key_id');
    expect(StatsUtils.dimensionColumn('provider')).toBe('provider');
    expect(StatsUtils.dimensionColumn('date')).toBe('stat_date');
    const sql = StatsUtils.aggregateSql('model');
    expect(sql).toContain('GROUP BY model');
    expect(sql).toContain('request_count');
  });
});
