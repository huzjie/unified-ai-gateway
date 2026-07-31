import '@testing-library/jest-dom';

// jsdom 环境与匹配器
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
