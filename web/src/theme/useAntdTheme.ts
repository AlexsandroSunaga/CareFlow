import type { ThemeConfig } from "antd";
import { theme } from "antd";

export function useAntdTheme(): ThemeConfig {
  return {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "var(--color-primary, #1677ff)",
      borderRadius: 8,
    },
  };
}
