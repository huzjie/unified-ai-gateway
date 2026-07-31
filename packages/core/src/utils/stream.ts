/**
 * AsyncIterable 工具
 */

/** 将 ReadableStream/AsyncIterable 统一为 AsyncIterable */
export async function* streamToAsyncIterable<T>(stream: AsyncIterable<T> | ReadableStream<T>): AsyncIterable<T> {
  if (Symbol.asyncIterator in stream) {
    yield* stream as AsyncIterable<T>;
    return;
  }
  const reader = (stream as ReadableStream<T>).getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

/** 将 AsyncIterable 收集为数组 */
export async function asyncIterableToArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}

/** 合并多个 AsyncIterable（按到达顺序产出） */
export async function* mergeAsyncIterables<T>(iterables: Array<AsyncIterable<T>>): AsyncIterable<T> {
  const queues: T[][] = iterables.map(() => []);
  const doneFlags: boolean[] = iterables.map(() => false);
  let pending = iterables.length;

  const pump = async (index: number): Promise<void> => {
    try {
      for await (const item of iterables[index]) {
        queues[index].push(item);
      }
    } finally {
      doneFlags[index] = true;
      pending -= 1;
    }
  };

  const pumps = iterables.map((_, i) => pump(i));
  while (pending > 0 || queues.some((q) => q.length > 0)) {
    let yielded = false;
    for (let i = 0; i < queues.length; i++) {
      if (queues[i].length > 0) {
        yield queues[i].shift() as T;
        yielded = true;
        break;
      }
    }
    if (!yielded) {
      await Promise.race([...pumps, delay(5)]);
    }
  }
}

/** 收集 AsyncIterable 全部内容（返回字符串，用于测试/调试） */
export async function collectStream(iterable: AsyncIterable<string>): Promise<string> {
  let out = '';
  for await (const chunk of iterable) {
    out += chunk;
  }
  return out;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
