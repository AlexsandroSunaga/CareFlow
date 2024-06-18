import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/** Kombai webbuilder-style navigation helper */
export function useNavigation() {
  const navigate = useNavigate();
  return {
    goHome: useCallback(() => navigate("/"), [navigate]),
    goLogin: useCallback(() => navigate("/login"), [navigate]),
    go: useCallback((path: string) => navigate(path), [navigate]),
    back: useCallback(() => navigate(-1), [navigate]),
  };
}
