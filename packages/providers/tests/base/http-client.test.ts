import { createServer, type Server } from 'node:http';
import { HttpClient } from '../../src/base/http-client';
import { HttpClientFactory } from '../../src/base/http-client-factory';

describe('HttpClient', () => {
  const client = new HttpClient();

  // 本地可控"挂起"服务：接受连接但永不响应，用于确定性触发客户端超时
  let hangServer: Server;
  let hangPort = 0;

  beforeAll(async () => {
    hangServer = createServer(() => {
      // 接受连接但不发送任何数据，客户端将因超时而中止
    });
    await new Promise<void>((resolve) => {
      hangServer.listen(0, '127.0.0.1', () => {
        const addr = hangServer.address();
        if (addr && typeof addr === 'object') {
          hangPort = addr.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    // 强制销毁未关闭的连接（undici 中止后可能残留 keep-alive socket），避免 close 回调挂起
    hangServer.closeAllConnections();
    await new Promise<void>((resolve) => {
      hangServer.close(() => resolve());
    });
  });

  it('请求错误 URL 抛网络错误', async () => {
    await expect(
      client.get('http://127.0.0.1:1/nonexistent', {}, 1000),
    ).rejects.toThrow();
  });

  it('超时生效', async () => {
    // 连接本地挂起服务（不响应），应被 100ms 超时中止
    await expect(
      client.request({ url: `http://127.0.0.1:${hangPort}/x`, method: 'GET', timeoutMs: 100 }),
    ).rejects.toThrow();
  }, 5000);
});

describe('HttpClientFactory', () => {
  it('创建客户端', () => {
    const factory = new HttpClientFactory({ defaultTimeoutMs: 5000 });
    expect(factory.create()).toBeInstanceOf(HttpClient);
    expect(factory.createWithDefaults()).toBeInstanceOf(HttpClient);
  });
});
