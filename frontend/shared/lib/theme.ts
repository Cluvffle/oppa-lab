export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "charming-theme";

/**
 * FOUC 방지용 인라인 스크립트 (SSR HTML head에 주입).
 * 사용자의 저장된 테마 or 시스템 prefers-color-scheme 을 즉시 적용.
 * 반드시 blocking 스크립트로 실행되어야 하며, layout.tsx <head> 안에 넣는다.
 */
export const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = saved;
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;
