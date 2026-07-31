import { renderTable } from '../src/utils/table';

describe('table utils', () => {
  it('渲染表格输出', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    renderTable(['A', 'B'], [['1', '2']]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
