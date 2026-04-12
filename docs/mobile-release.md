# Mobile Release Guide

## Obiettivo

Questa guida prepara `QuestSave+` per build e rilascio su iOS e Android con Expo EAS.

## Configurazione gia pronta nel progetto

- `app.json` contiene:
  - `bundleIdentifier` iOS: `com.franiix.questsaveplus`
  - `package` Android: `com.franiix.questsaveplus`
  - `buildNumber` iOS iniziale: `1`
  - `versionCode` Android iniziale: `1`
  - permission prompt per la libreria foto via `expo-image-picker`
  - `ITSAppUsesNonExemptEncryption=false`
- `eas.json` contiene i profili:
  - `development`
  - `preview`
  - `production`

## Variabili d'ambiente richieste

Copia `.env.example` in `.env` e valorizza:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_CATALOG_PRIMARY_PROVIDER=igdb
EXPO_PUBLIC_CATALOG_EDGE_SUPPORTS_FILTERED_SEARCH=true
EXPO_PUBLIC_CATALOG_EDGE_SUPPORTS_SECTION_DISCOVERY=true
EXPO_PUBLIC_CATALOG_EDGE_ENABLED=true
```

Per EAS Build conviene salvare gli stessi valori anche come secret/env nel progetto Expo.

## Prerequisiti account

### iOS

- Apple Developer Program attivo
- app registrata con bundle id `com.franiix.questsaveplus`
- eventuali tester TestFlight configurati

### Android

- Google Play Console attiva
- app creata con package `com.franiix.questsaveplus`
- keystore gestito da EAS oppure importato

## Comandi consigliati

Login:

```bash
eas login
```

Collegamento progetto Expo, se ancora non esiste:

```bash
eas init
```

Build internal QA:

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

Build production:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

Submit store:

```bash
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

## Checklist pre-release

1. Verificare login, register, callback auth e reset password.
2. Verificare profile setup e cambio avatar su device reale.
3. Verificare search, discovery, detail game e link esterni.
4. Verificare backlog add/update/remove su iOS e Android.
5. Verificare localizzazione base `it` e `en`.
6. Verificare splash, icona app e adaptive icon.
7. Incrementare `version`, `buildNumber` e `versionCode` per la release successiva.

## Note pratiche

- `production.autoIncrement` in `eas.json` aiuta a non dimenticare l'incremento dei numeri build nelle build cloud.
- La versione mostrata all'utente resta governata da `expo.version` in `app.json`.
- Prima del primo submit conviene preparare store listing, screenshot e privacy details nei rispettivi portali.

## Documenti collegati

- metadata store: [store-metadata.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/store-metadata.md)
- checklist privacy store: [store-privacy-checklist.md](/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/docs/store-privacy-checklist.md)

## Hosting Legali Consigliato

Se il tuo hosting gestisce piu facilmente cartelle web rispetto ai sottodomini dedicati, la struttura consigliata e:

```text
www.franiix.cloud/
  questsaveplus/
    legal.css
    privacy/
      index.html
    support/
      index.html
```

Con URL pubblici:

- `https://www.franiix.cloud/questsaveplus/privacy/`
- `https://www.franiix.cloud/questsaveplus/support/`
