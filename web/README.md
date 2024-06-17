# CareFlow frontend (Vite + React)

Main UI: marketing, patient portal, and staff console.

Layout follows [kombai-io/webbuilder](https://github.com/kombai-io/webbuilder): `main.tsx` at package root, `src/pages/`, `src/services/`, `src/hooks/`, `src/store/`. Console screens use Ant Design + `ModuleWorkbench`.

```powershell
cd web
npm install
npm run dev
```

API: `http://localhost:8011` (proxied via `VITE_API_PROXY_TARGET` in `.env`).
