// Flip VITE_USE_MOCKS=false once your real backends are running.
// Defaults to true (mocks on) if unset, so the app works immediately after `npm install`.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
