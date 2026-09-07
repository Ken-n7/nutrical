import '@testing-library/jest-dom/vitest';

if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub;
}

if (typeof globalThis.requestAnimationFrame !== 'function') {
  const callbacks = new Map();
  let nextId = 0;
  globalThis.requestAnimationFrame = (cb) => {
    const id = ++nextId;
    const token = setTimeout(() => {
      callbacks.delete(id);
      cb(Date.now());
    }, 16);
    callbacks.set(id, token);
    return id;
  };
  globalThis.cancelAnimationFrame = (id) => {
    const token = callbacks.get(id);
    if (token) {
      clearTimeout(token);
      callbacks.delete(id);
    }
  };
}
