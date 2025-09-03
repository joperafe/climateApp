
import dev from './settings.dev.json'
import integ from './settings.int.json'
import prod from './settings.prod.json'
import user from './settings.user.json'

export type Settings = typeof dev

const ENV = import.meta.env.VITE_APP_ENV || 'DEV'
let base: Settings = dev
switch (ENV) {
  case 'PROD': base = prod; break
  case 'INT': base = integ; break
  default: base = dev
}

// Deep-ish merge (features only for simplicity)
export const settings: Settings = {
  ...base,
  ...user,
  features: { ...(base as any).features, ...(user as any).features }
}
