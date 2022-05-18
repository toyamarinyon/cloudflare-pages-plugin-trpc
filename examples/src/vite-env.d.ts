/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
