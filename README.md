
# Porto Climate App (React + TS + Vite)

Features:
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Axios data services
- i18n (EN/PT)
- Leaflet map with sensors, heatmap, green zones (mock data)
- Jest + Testing Library

## Scripts
- `npm run dev` (uses `.env.development`)
- `npm run dev -- --mode int` (uses `.env.int`)
- `npm run build --mode production`

## Notes
- Mock data served from `/public/data/*`.
- Environment-driven settings in `src/config/*` merged via `config.ts`.
