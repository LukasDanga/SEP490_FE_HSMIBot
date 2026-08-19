---
name: hsmibot-ui-i18n-standards
description: >-
  Enforces UI design guidelines (Light, bright, friendly, clean Slate/White aesthetics - strictly no gloomy dark mode)
  and mandatory bilingual i18n (Vietnamese 'vi' as default and English 'en') rules across Web and Mobile codebases in HSMIBot.
---

# HSMIBot UI & i18n Engineering Standards

This skill defines the mandatory design system and internationalization (i18n) standards for all AI assistants, developers, and tools contributing to the **HSMIBot** project (Web and Mobile).

---

## 1. UI Design & Theme Rules: Light, Bright & User-Friendly

### Strict Requirement:
All user interfaces across **Web (`Web/`)** and **Mobile (`Mobile/`)** must adhere to a **Light & Bright (Trắng Sáng), friendly, and modern design**. Gloomy, dark void, or low-contrast dark themes are strictly prohibited unless explicitly requested by the homeowner.

### Color Palette Reference:
- **Backgrounds**:
  - App Background: Clean Slate 50 (`#F8FAFC`)
  - Content Cards & Modals: Pure White (`#FFFFFF`)
  - Elevated / Inputs / Hover: Slate 100 (`#F1F5F9` / `#FFFFFF`)
- **Borders & Dividers**:
  - Card & Container Borders: Slate 200 (`#E2E8F0`)
  - Subtle Dividers: Slate 300 (`#CBD5E1`)
- **Typography (High Contrast & Clean Readability)**:
  - Main Titles & Headings: Slate 900 (`#0F172A`, font-extrabold / 800)
  - Body Text & Field Labels: Slate 600 (`#475569`, font-medium / 500)
  - Placeholders & Secondary Hints: Slate 400 (`#94A3B8`)
- **Brand & Accents**:
  - Primary Electric Blue: `#2563EB` (Hover: `#1D4ED8`, Light: `#3B82F6`, Subtle: `#EFF6FF`)
  - Cyan / Sensor Glow: `#0284C7` (Subtle: `#F0F9FF`)
  - Success / Online: `#16A34A` (Badge Bg: `#ECFDF5`)
  - Warning / Alert: `#D97706` (Badge Bg: `#FFFBEB`)
  - Danger / Emergency Stop: `#DC2626` (Badge Bg: `#FEF2F2`)

---

## 2. Mandatory i18n Rules (Bilingual: vi - en)

### 1. Zero Hardcoded Strings
- **NEVER** write raw strings directly inside JSX/TSX elements (e.g. `<Text>Đăng nhập</Text>` or `<button>Submit</button>` is FORBIDDEN).
- **ALWAYS** retrieve text via `translations[lang].keyName` or `t.keyName`.

### 2. Dual Language Completeness
- Every key added to `translations.vi` **MUST** have an exact corresponding entry in `translations.en`.
- Vietnamese (`vi`) is the default primary language for Vietnamese homeowners.
- English (`en`) is the global fallback.

### 3. File Locations:
- **Web**: `Web/src/i18n/translations.ts`
- **Mobile**: `Mobile/src/i18n/translations.ts`
- **Shared Types**: `types/index.ts` must export `export type Language = 'vi' | 'en';`

### 4. Language Switcher Requirement:
- Every top-level navigation bar / header must include a bilingual toggle switch with flag badges (`🇻🇳 VI` / `🇺🇸 EN`).
- When switching language, update state seamlessly and provide subtle haptic/visual feedback.

---

## 3. Checklist for Any New Component / Feature:
- [ ] Uses Light & Bright background (`#F8FAFC` / `#FFFFFF`) and dark slate text (`#0F172A`).
- [ ] No hardcoded text strings in UI.
- [ ] All translations defined in both `vi` and `en` in `translations.ts`.
- [ ] Tested for both Vietnamese and English display without layout breaks or text truncation.
