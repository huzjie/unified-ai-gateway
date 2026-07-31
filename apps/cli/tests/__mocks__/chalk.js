// chalk@5 为 ESM-only，jest(CJS) 无法加载；用恒等代理模拟
module.exports = new Proxy(
  { default: (s) => s },
  {
    get: () => (s) => s,
    apply: () => (s) => s,
  },
);
