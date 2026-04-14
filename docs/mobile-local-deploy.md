# Sviluppo e Test Locale Mobile

## Obiettivo

Questa guida spiega come:

1. preparare l'ambiente locale
2. generare i progetti nativi da Expo
3. testare l'app su Xcode
4. testare l'app su Android Studio
5. capire quando serve rigenerare o rebuildare

Questa guida e pensata per il flusso di sviluppo e debug, non per il caricamento finale sugli store.

## Stato attuale del progetto

- Expo SDK `54`
- React Native `0.81`
- routing con Expo Router
- iOS bundle identifier: `com.franiix.questsaveplus`
- Android package: `com.franiix.questsaveplus`
- iOS attualmente iPhone-only (`supportsTablet: false`)

## Prerequisiti macchina

### Comuni

- macOS
- Node.js installato
- npm installato
- Xcode Command Line Tools
- Watchman consigliato

### iOS

- Xcode aggiornato
- simulatore iOS o device reale
- account Apple in Xcode se vuoi test su device reale

### Android

- Android Studio
- Android SDK installato
- JDK `21`
- Node globale disponibile anche per le app GUI

## Nota importante su Node e Android Studio

Su macOS e molto comune che:

- nel terminale funzioni `nvm`
- Android Studio invece non trovi `node`

Per questo progetto, la soluzione consigliata e globale e:

1. installare Node anche con Homebrew
2. verificare che Android Studio possa usare `node` fuori dal terminale

Comandi utili:

```bash
/opt/homebrew/bin/node -v
/usr/local/bin/node -v
which node
```

Se `/usr/local/bin/node` non punta al Node globale corretto:

```bash
sudo ln -sf /opt/homebrew/bin/node /usr/local/bin/node
```

Poi:

1. chiudi completamente Android Studio
2. fai logout/login del Mac oppure riavvia
3. riapri Android Studio

Il repository non deve contenere path assoluti macchina-specifici di Node.
Il fix corretto e a livello macchina.

## Variabili ambiente richieste

Nel file `.env` locale devono essere presenti almeno:

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

Nota importante su Expo:

- le variabili `EXPO_PUBLIC_*` devono essere lette con accesso statico, ad esempio `process.env.EXPO_PUBLIC_SUPABASE_URL`
- evita accessi dinamici come `process.env[name]`
- con accesso dinamico le build release possono partire senza valori inlined e crashare all'avvio

## Installazione dipendenze

Dalla root frontend:

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npm install
```

## Generazione progetti nativi

Se `ios/` e `android/` non esistono o vanno riallineati:

```bash
npx expo prebuild
```

Se hai cambiato config native, plugin Expo, permessi, icone, splash o impostazioni di piattaforma:

```bash
npx expo prebuild --clean
```

Usa `--clean` solo quando serve davvero, perche rigenera completamente i progetti nativi.

## Test rapido da CLI

### iOS

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npx expo run:ios
```

### Android

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npx expo run:android
```

Questo e il modo piu rapido per verificare fix UI e logica senza passare dagli store.

## Test release-like locale

Questa e la sezione giusta quando vuoi verificare il comportamento reale della build senza dipendere da Metro.

Differenza chiave:

- `debug` usa Metro
- `release` non usa Metro

Se il bug succede su TestFlight, App Store o Play Console, devi sempre provare anche una build release locale.

## Test release su iOS

### Opzione consigliata per debug reale

Apri il workspace in Xcode e cambia lo scheme:

1. `Product > Scheme > Edit Scheme`
2. seleziona `Run`
3. imposta `Build Configuration` su `Release`
4. premi `Run`

Questo ti permette di:

- eseguire l'app come release
- testare startup, bootstrap e routing senza Metro
- leggere comunque la console di Xcode

### Opzione piu vicina ad App Store

1. `Product > Archive`
2. da Organizer valida e distribuisci l'archive
3. usa quella build per TestFlight o review

Se vuoi solo riprodurre un bug di avvio, il `Run` in configurazione `Release` e piu veloce.

## Test release su Android

### Da terminale

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android
./gradlew --stop
./gradlew installRelease
```

Questo:

- compila la build release
- installa l'APK release su emulatore o device collegato

Se vuoi generare prima l'APK release senza installarlo:

```bash
./gradlew assembleRelease
```

Se vuoi generare l'AAB da store:

```bash
./gradlew bundleRelease
```

### Da Android Studio

In Android Studio:

1. `Build Variants`
2. per il modulo `app` seleziona `release`
3. esegui `Run app`

Questo e utile se vuoi:

- testare la release senza Metro
- vedere Logcat mentre l'app parte

## Quando usare debug e quando release

Usa `debug` quando:

- stai sviluppando UI
- vuoi hot reload
- vuoi iterare veloce

Usa `release` quando:

- il bug succede sugli store
- l'app si blocca solo fuori da Metro
- vuoi verificare bootstrap, auth, splash o startup reale
- vuoi controllare problemi di minification o bundling

## Test con Xcode

## 1. Rigenera iOS se necessario

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npx expo prebuild
```

## 2. Installa CocoaPods

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe/ios
pod install
```

## 3. Apri il workspace

Apri:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/ios/QuestSave+.xcworkspace
```

## 4. Esegui in debug

In Xcode:

1. seleziona un simulatore iPhone oppure un device reale
2. premi `Run`

Questo e il flusso giusto per:

- verificare bug di bootstrap
- leggere crash nativi
- vedere warning e log in console

## 5. Quando serve rebuildare iOS

Serve rifare `Run` o ricompilare se cambi:

- codice React Native / TypeScript
- store Zustand
- query / Supabase bootstrap
- componenti UI
- traduzioni

Serve rigenerare con `prebuild --clean` se cambi:

- `app.json`
- plugin Expo
- permessi nativi
- icone / splash / bundle identifier

## Test con Android Studio

## 1. Rigenera Android se necessario

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npx expo prebuild
```

## 2. Verifica Java 21

```bash
java -version
```

Per questo progetto non usare Java `25`.

Se serve:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

## 3. Verifica Android SDK path

Il file corretto e:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android/local.properties
```

Contenuto:

```properties
sdk.dir=/Users/franiix/Library/Android/sdk
```

Se manca, ricrealo.

## 4. Apri il progetto Android

Apri in Android Studio questa cartella:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android
```

Non aprire la root del frontend: apri proprio `android/`.

## 5. Sync e Run

In Android Studio:

1. aspetta la Gradle sync
2. seleziona emulatore o device reale
3. premi `Run app`

## 6. Logcat per crash e freeze

Se l'app crasha o si blocca:

1. apri `Logcat`
2. seleziona package `com.franiix.questsaveplus`
3. livello `Error` o `Verbose`
4. cerca:
   - `FATAL EXCEPTION`
   - `AndroidRuntime`
   - errori JS/Native Modules

## Quando devi rebuildare

### Rebuild semplice

Basta rieseguire `Run app` se hai cambiato:

- codice TypeScript / React
- componenti
- store
- hook
- bootstrap JS

### Rigenerazione nativa

Serve `npx expo prebuild --clean` se hai cambiato:

- `app.json`
- plugin Expo
- signing / package / permission
- splash / icon / adaptive icon

### Nuova release build

Devi rigenerare una build `release` se hai cambiato:

- qualunque codice React Native / TypeScript che vuoi verificare in comportamento store-like
- bootstrap auth
- provider root
- routing
- dipendenze che entrano nel bundle

In pratica:

- per verificare i fix attuali di startup, serve una nuova build release

## Errori frequenti e causa

### `command 'node'`

Android Studio non vede `node` a livello GUI.
Fix:

- Node globale Homebrew
- symlink corretto in `/usr/local/bin/node`
- riavvio sessione macOS

### `Unsupported class file major version 69`

Stai usando Java `25`.
Fix:

- usa Java `21`

### `SDK location not found`

Manca `android/local.properties`.

### App bloccata all'avvio

Controlla prima:

- variabili env Supabase
- bootstrap auth/profile
- provider root come `SafeAreaProvider`
- errori in Logcat / Xcode console

## Checklist rapida di test locale

1. apertura app senza freeze
2. login / register
3. callback auth
4. profile setup
5. home / discovery
6. detail gioco
7. backlog add / update / remove
8. profile edit
9. legal routes
10. supporto `it` e `en`
