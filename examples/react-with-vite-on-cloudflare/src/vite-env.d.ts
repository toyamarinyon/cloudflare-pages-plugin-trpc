/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CF_PAGES_URL: string?;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
