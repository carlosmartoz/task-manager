import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom does not always expose crypto.randomUUID, which `addTask` needs.
if (typeof globalThis.crypto?.randomUUID !== 'function') {
  let counter = 0

  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: {
      ...globalThis.crypto,
      randomUUID: () => `test-uuid-${++counter}`,
    },
  })
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
