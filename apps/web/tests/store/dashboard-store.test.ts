import { useDashboardStore } from '../src/store/dashboard-store';

describe('dashboard store', () => {
  it('初始无数据', () => {
    expect(useDashboardStore.getState().data).toBeNull();
    expect(useDashboardStore.getState().loading).toBe(false);
  });
});
