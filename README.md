# QuestSave+ App

App mobile Expo/React Native per scoprire videogiochi e gestire un backlog personale persistito su Supabase.

## Stato attuale

- Expo SDK `54`
- React Native `0.81`
- Expo Router
- Supabase per auth e dati utente
- Zustand per stato locale
- TanStack Query per cache e fetching
- i18n `it` / `en`
- iOS attualmente iPhone-only

## Struttura principale

```text
app/
components/
hooks/
lib/
stores/
shared/
docs/
```

## Setup rapido

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npm install
```

Crea `.env` con almeno:

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

## Script utili

```bash
npm run start
npm run start_clear
npm run ios
npm run android
npm run web
npm run lint
npm run format
npm run check
```

## Guide operative

### Test locale su Xcode e Android Studio

Usa:

- [docs/mobile-local-deploy.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/mobile-local-deploy.md)

Dentro trovi:

- prerequisiti macchina
- setup Node/Android Studio
- `expo prebuild`
- test da CLI
- test con Xcode
- test con Android Studio
- test release su iOS
- test release su Android
- quando serve rebuildare

### Release store locali

Usa:

- [docs/mobile-release.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/mobile-release.md)

Dentro trovi:

- archive iOS
- validate / upload App Store Connect
- build `.aab` Android
- upload Play Console
- signing release
- gestione chiavi

### Metadata e privacy store

- [docs/store-metadata.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/store-metadata.md)
- [docs/store-privacy-checklist.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/store-privacy-checklist.md)

## Note operative importanti

- bundle id iOS: `com.franiix.questsaveplus`
- package Android: `com.franiix.questsaveplus`
- versione utente corrente: `0.0.1`
- Java consigliata per Android: `21`
- Android Studio su macOS deve vedere un `node` globale, non solo `nvm`
- le variabili `EXPO_PUBLIC_*` vanno lette con accesso statico, non con `process.env[name]`, altrimenti la release puo crashare all'avvio
- non e consigliato committare keystore e segreti nel repo, anche se privato
- se scegli comunque di versionare la upload key Android, il path previsto dal progetto e `questsaveplus-upload.keystore` nella root di `questsave-fe`

## Flusso consigliato

1. sviluppi e testi in locale
2. riproduci e risolvi i bug su simulatore/emulatore
3. testi sempre almeno una build `release` locale su iOS e Android
4. validi su device reali quando possibile
5. generi build release locali finali
6. carichi sugli store
7. completi listing, privacy e review info

## Checklist minima QA

1. bootstrap app senza freeze o crash
2. login / register / callback
3. profile setup
4. home e search
5. detail gioco
6. backlog
7. profilo
8. rotte legali
9. localizzazione `it` / `en`

*Made by Franiix*
