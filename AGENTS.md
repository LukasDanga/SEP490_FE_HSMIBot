# HSMIBot Project Instructions & AI Rules

## Core Guidelines for AI Assistants

### 1. UI Design: Light, Bright & User-Friendly (Trắng Sáng Thân Thiện)
- All components in `Web/` and `Mobile/` must be designed with a clean, high-contrast, bright Light Theme.
- Primary Background: `#F8FAFC` (Slate 50).
- Cards & Surfaces: `#FFFFFF` (Pure White) with `#E2E8F0` (Slate 200) borders.
- Text: `#0F172A` (Slate 900) for titles, `#475569` (Slate 600) for body text.
- Accents: Electric Blue `#2563EB`, Emerald `#16A34A`, Amber `#D97706`, Danger `#DC2626`.
- Strictly avoid dark gloomy backgrounds.

### 2. Internationalization (i18n: vi - en)
- All text visible to users must come from `translations.ts` (`Web/src/i18n/translations.ts` and `Mobile/src/i18n/translations.ts`).
- Never hardcode user-facing strings in JSX/TSX.
- Always provide full translations for both `vi` (Vietnamese - default) and `en` (English).
- Keep translation keys consistent between Web and Mobile.

### 3. Mobile Development: React Native + Expo
- Mobile app lives in `Mobile/` and must remain 100% compatible with Expo Go.
- Use safe area insets (`react-native-safe-area-context`), dark status bar text (`<StatusBar style="dark" />`), and light backgrounds.

### 4. Git Commit & Push Policy
- NEVER run `git commit` or `git push` automatically.
- ONLY execute `git commit` and `git push` when the USER explicitly requests it in their prompt.
