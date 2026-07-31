import { SseParser } from '../../src/base/sse-parser';

describe('SseParser', () => {
  const parser = new SseParser();

  it('解析单个事件', () => {
    const events = parser.parse('data: {"a":1}\n\n');
    expect(events.length).toBe(1);
    expect(events[0].data).toBe('{"a":1}');
  });

  it('解析多个事件', () => {
    const events = parser.parse('data: {"a":1}\n\ndata: [DONE]\n\n');
    expect(events.length).toBe(2);
    expect(events[1].data).toBe('[DONE]');
  });

  it('解析 event 字段', () => {
    const events = parser.parse('event: message_start\ndata: {"x":1}\n\n');
    expect(events[0].event).toBe('message_start');
    expect(events[0].data).toBe('{"x":1}');
  });

  it('忽略注释行', () => {
    const events = parser.parse(': ping\ndata: {"x":1}\n\n');
    expect(events.length).toBe(1);
  });

  it('多行 data 合并', () => {
    const events = parser.parse('data: line1\ndata: line2\n\n');
    expect(events[0].data).toBe('line1\nline2');
  });

  it('增量解析', () => {
    const inc = parser.createIncrementalParser();
    expect(inc.feed('data: {"a":1}\n\n')).toHaveLength(1);
    expect(inc.feed('data: {"b":2}\n\n')).toHaveLength(1);
    // 半包
    expect(inc.feed('data: {"c"')).toHaveLength(0);
    expect(inc.feed(':3}\n\n')).toHaveLength(1);
  });
});
