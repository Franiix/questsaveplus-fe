# Deploy Locale iOS e Android

## Obiettivo

Questa guida descrive come compilare, firmare e pubblicare `QuestSave+` senza dipendere da EAS Cloud.

Il flusso consigliato e:

1. sviluppo e debug locale con `expo run`
2. generazione dei progetti nativi con `expo prebuild`
3. build release locali:
   - iOS con `Xcode`
   - Android con `Gradle` / `Android Studio`
4. distribuzione:
   - `TestFlight` da `Xcode Organizer`
   - `Google Play Console` caricando `.aab`

## Stato attuale del progetto

- Expo SDK `54`
- React Native `0.81`
- bundle id iOS: `com.franiix.questsaveplus`
- package Android: `com.franiix.questsaveplus`
- al momento le cartelle `ios/` e `android/` non sono committate: verranno generate da `expo prebuild`

## Variabili ambiente richieste

Nel file `.env` locale devono essere presenti:

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

## Prerequisiti macchina

### Comuni

- Node.js installato
- npm installato
- Xcode Command Line Tools
- Watchman consigliato

### iOS

- macOS
- Xcode aggiornato
- Apple ID loggato in Xcode
- Apple Developer Program attivo
- simulatore iOS o dispositivo fisico

### Android

- Android Studio
- Android SDK installato
- JDK compatibile con la toolchain Android corrente
- emulatore Android o dispositivo fisico con USB debugging attivo

## Setup iniziale

Dalla root frontend:

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npm install
```

## Generazione progetti nativi

Se `ios/` e `android/` non esistono ancora:

```bash
npx expo prebuild
```

Per rigenerare da zero dopo modifiche ai plugin/config nativi:

```bash
npx expo prebuild --clean
```

Usa `--clean` solo quando serve davvero, perche ricrea i progetti nativi.

## Debug locale veloce

### iOS

```bash
npx expo run:ios
```

Questo:

- genera `ios/` se necessario
- installa pods
- compila
- apre il simulatore o builda sul target selezionato

### Android

```bash
npx expo run:android
```

Questo:

- genera `android/` se necessario
- compila il progetto Android
- installa l'app su emulatore o device

## Firma e release iOS senza EAS Cloud

### 1. Genera il progetto iOS

```bash
npx expo prebuild
```

### 2. Installa i pod

```bash
cd ios
pod install
cd ..
```

### 3. Apri il workspace in Xcode

Apri:

```text
ios/QuestSave+.xcworkspace
```

Se il nome workspace differisce leggermente, usa quello generato in `ios/`.

### 4. Configura signing

In Xcode:

1. seleziona il target app
2. vai su `Signing & Capabilities`
3. scegli il tuo team Apple Developer
4. verifica:
   - bundle identifier `com.franiix.questsaveplus`
   - signing automatico attivo

### 5. Test locale release

Da Xcode puoi:

- lanciare su simulatore
- lanciare su device reale
- verificare che l'app si apra senza crash

### 6. Crea archive

In Xcode:

1. seleziona un target `Any iOS Device (arm64)`
2. menu `Product > Archive`

### 7. Invia a TestFlight

Quando l'archive e pronta:

1. si apre `Organizer`
2. seleziona l'archive
3. `Distribute App`
4. `App Store Connect`
5. `Upload`

Poi in App Store Connect:

- completa metadata
- aggiungi internal/external testers

## Firma e release Android senza EAS Cloud

### 1. Genera il progetto Android

```bash
npx expo prebuild
```

### 2. Apri Android Studio

Apri la cartella:

```text
android/
```

### 3. Crea o importa keystore release

Se non ne hai una, genera una keystore tua e conservala in modo sicuro.

Ti serviranno:

- file keystore
- alias
- store password
- key password

### 4. Configura signing release

Nel progetto Android configura la signing release tramite:

- `android/gradle.properties`
- `android/app/build.gradle`

Valori tipici:

```properties
MYAPP_UPLOAD_STORE_FILE=questsaveplus-upload.keystore
MYAPP_UPLOAD_KEY_ALIAS=questsaveplus
MYAPP_UPLOAD_STORE_PASSWORD=...
MYAPP_UPLOAD_KEY_PASSWORD=...
```

Poi nel `build.gradle` usi quei valori nella `signingConfigs.release`.

### 5. Build release locale

Per APK debug/installabile rapidamente:

```bash
cd android
./gradlew assembleRelease
cd ..
```

Per Play Console devi preferire `AAB`:

```bash
cd android
./gradlew bundleRelease
cd ..
```

Output atteso:

- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/`

### 6. Carica su Google Play

Vai in Play Console e carica il file:

- `.aab` per internal testing / closed testing / production

## Versioning

Prima di ogni release:

- aggiorna `expo.version` in `app.json`
- incrementa `ios.buildNumber`
- incrementa `android.versionCode`

Valori attuali:

- version: `0.0.1`
- buildNumber iOS: `1`
- versionCode Android: `1`

## Quando usare quale flusso

### Per debug rapido

Usa:

```bash
npx expo run:ios
npx expo run:android
```

### Per test release locale

Usa:

- iOS: archive da Xcode
- Android: `bundleRelease` locale

### Per distribuzione a tester

Usa:

- iOS: TestFlight da Xcode Organizer
- Android: Play Internal Testing caricando `.aab`

## Checklist pre-release

1. Verifica login, register e reset password.
2. Verifica profile setup e upload avatar.
3. Verifica home, search, discovery e detail game.
4. Verifica backlog add/update/remove.
5. Verifica link legali pubblici.
6. Verifica che `questsaveplus@franiix.cloud` sia l'email mostrata nei documenti pubblici.
7. Verifica che le env locali siano presenti prima di compilare.

## Rischi e note importanti

### Expo prebuild

`expo prebuild` traduce `app.json` nei progetti nativi.

Ogni volta che cambi:

- plugin Expo
- permessi nativi
- splash/icon
- bundle/package identifiers

devi rigenerare o sincronizzare i progetti nativi.

### Non committare segreti

Non salvare:

- password keystore
- file sensibili
- certificati privati

direttamente nel repository.

### Signing Android

La keystore Android e critica:

- se la perdi, la gestione futura delle release diventa problematica
- conservala in backup sicuro

### Signing iOS

Se usi signing automatico Xcode, il flusso e piu semplice, ma dipende dal tuo account Apple Developer e dai profili generati nel portale Apple.

## Comandi rapidi

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
npm install
npx expo prebuild
npx expo run:ios
npx expo run:android
```

Per Android release:

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android
./gradlew bundleRelease
```

## Percorso consigliato per te

Per il tuo caso pratico, la strategia piu sensata e:

1. usare `expo run` per risolvere crash e bug
2. usare Xcode per archive/TestFlight
3. usare Android Studio o `gradlew bundleRelease` per Play Console
4. usare EAS solo come fallback eventuale, non come flusso principale
