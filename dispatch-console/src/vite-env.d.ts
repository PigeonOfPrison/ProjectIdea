/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCKS: string
  readonly VITE_LOGSPREY_API_URL: string
  readonly VITE_RAVEN_API_URL: string
  readonly VITE_ORDERS_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
