interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  // add more env vars here if needed, e.g.:
  // readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}