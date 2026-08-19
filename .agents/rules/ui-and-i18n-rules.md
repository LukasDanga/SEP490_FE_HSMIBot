# Mandatory HSMIBot UI & i18n Rules

## 1. UI Theme Standard: Light & Bright (Trắng Sáng Thân Thiện)
- All UI screens, modals, components in both `Web` and `Mobile` must use a clean, modern, bright **Light Theme**.
- Backgrounds: `#F8FAFC` (Slate 50), Card/Modal backgrounds: `#FFFFFF` (Pure White), Borders: `#E2E8F0` (Slate 200).
- Typography: `#0F172A` (Slate 900) for headers/titles, `#475569` (Slate 600) for body/subtext.
- Do NOT use dark gloomy backgrounds or dark mode unless explicitly instructed.

## 2. Mandatory i18n (Bilingual: vi - en)
- All user-facing strings must be defined in `translations.ts` (`Web/src/i18n/translations.ts` and `Mobile/src/i18n/translations.ts`).
- Both `vi` (Vietnamese - default) and `en` (English) must be fully translated with matching keys.
- Never hardcode raw text in JSX/TSX components.
- Top Header must include a bilingual language switcher (`🇻🇳 VI` / `🇺🇸 EN`).

## 3. Git Commit & Push Policy
- NEVER execute `git commit` or `git push` automatically.
- ONLY execute `git commit` and `git push` when the USER explicitly requests it in their prompt.
