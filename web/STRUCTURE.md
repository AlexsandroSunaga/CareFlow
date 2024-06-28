# Frontend layout (Kombai webbuilder conventions)

Aligned with [kombai-io/webbuilder](https://github.com/kombai-io/webbuilder):

- `main.tsx` / `index.css` at package root
- `src/pages/<PageName>/<PageName>.tsx` â€” route screens
- `src/components/<Name>/<Name>.tsx` â€” UI building blocks
- `src/hooks/`, `src/services/`, `src/store/`, `src/types/`, `src/utils/`

Legacy `src/views/` may remain during migration; new work goes in `src/pages/`.
