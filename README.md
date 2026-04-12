# QuestSave+ App

App mobile Expo/React Native per scoprire giochi tramite IGDB e gestire un backlog personale persistito su Supabase.

## Stato Attuale

- Routing file-based con Expo Router
- Autenticazione e persistenza dati utente con Supabase
- Dati giochi e dettaglio via catalog layer `IGDB-only`
- Stato locale con Zustand
- Server state con TanStack Query
- UI composta principalmente da componenti custom in `components/base` e `components/game`
- i18n attiva con locale `it` e `en`

## Stack Tecnologico

| Tecnologia | Uso |
|---|---|
| Expo SDK 54 | Runtime mobile e toolchain |
| React Native 0.81 | UI cross-platform |
| Expo Router | Routing file-based |
| TanStack Query | Cache e fetching del catalogo |
| Supabase JS | Auth e backend catalog |
| Zustand | Store applicativi |
| i18next + expo-localization | Traduzioni |
| react-hook-form + zod | Form e validazione |
| Biome | Lint / format / check |

## Struttura Reale Del Progetto

```text
app/
  _layout.tsx
  index.tsx
  (auth)/
    _layout.tsx
    login.tsx
    register.tsx
    forgot-password.tsx
    check-email.tsx
    profile-setup.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    backlog.tsx
    profile.tsx
    credits.tsx
  auth/
    callback.tsx
  game/
    [id].tsx
  profile/
    edit-profile.tsx
    change-email.tsx
    change-password.tsx

components/
  base/
    display/
    feedback/
    inputs/
    layout/
    navigation/
  form/
  game/
    catalog/

hooks/
  useBacklogGameMetadata.ts
  useGameBacklogController.ts
  useGameDetail.ts
  useGames.ts
  useHomeSectionGames.ts

lib/
  catalog/
  storage.ts
  supabase.ts

stores/
  auth.store.ts
  backlog.store.ts
  profile.store.ts
  toast.store.ts

shared/
  dto/
  entities/
  enums/
  i18n/
  models/
  theme/
  utils/
  validation/
```

## Architettura Applicativa

- `app/_layout.tsx` monta provider globali, `QueryClientProvider`, `GluestackUIProvider`, `ToastContainer` e guard auth
- `app/(tabs)/index.tsx` usa il catalog layer per search, discovery e sezioni home
- `app/game/[id].tsx` usa `CatalogGameDetail` e componenti `catalog/*` per il detail
- `lib/catalog/` contiene provider selection, service e provider edge Supabase
- `stores/*` gestiscono auth, profilo, backlog e toast

## Feature Attualmente Presenti

- Login / register / forgot password
- Profile setup post registrazione
- Home con search, discovery e caroselli editoriali
- Detail gioco IGDB-first
- Backlog personale con stato, rating e note
- Profilo utente con modifica profilo, email e password
- Tab crediti
- Traduzioni italiane e inglesi

## Setup Locale

### Prerequisiti

- Node.js recente compatibile con Expo SDK 54
- npm
- Expo Go oppure simulatore iOS / emulatore Android

### Installazione

```bash
cd questsaveplus-fe
npm install
```

### Variabili d'ambiente

Crea un file `.env` in `questsaveplus-fe/` con:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_CATALOG_PRIMARY_PROVIDER=igdb
EXPO_PUBLIC_CATALOG_EDGE_SUPPORTS_FILTERED_SEARCH=true
EXPO_PUBLIC_CATALOG_EDGE_SUPPORTS_SECTION_DISCOVERY=true
EXPO_PUBLIC_CATALOG_EDGE_ENABLED=true
EXPO_PUBLIC_LEGAL_PRIVACY_URL=https://www.franiix.cloud/questsaveplus/privacy/
EXPO_PUBLIC_LEGAL_SUPPORT_URL=https://www.franiix.cloud/questsaveplus/support/
```

### Avvio

```bash
npm run start
```

Script disponibili:

```bash
npm run start
npm run start_clear
npm run android
npm run ios
npm run web
npm run build:ios:preview
npm run build:android:preview
npm run build:ios:production
npm run build:android:production
npm run submit:ios
npm run submit:android
npm run lint
npm run format
npm run check
```

## Release Mobile

La configurazione EAS per iOS e Android e la checklist di rilascio sono documentate in [docs/mobile-release.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/mobile-release.md).
Per store listing e privacy submission trovi anche [docs/store-metadata.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/store-metadata.md) e [docs/store-privacy-checklist.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/store-privacy-checklist.md).

## Dipendenze Da Backend

L'app si aspetta che il backend Supabase in [README.md](/C:/Users/franiix/Projects/Personale/QuestSave+/questsaveplus-be/README.md) sia gia allineato alla base `v1.0` IGDB-only.

## Qualita E Verifica Manuale

Checklist minima:

1. Login, register e callback auth
2. Profile setup e modifica profilo
3. Home con search/discovery e apertura detail
4. Add / update / remove backlog
5. Backlog list e profile stats
6. i18n base su `it` e `en`

*Made by Franiix*
