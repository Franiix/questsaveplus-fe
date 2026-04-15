# Release Store iOS e Android

## Obiettivo

Questa guida spiega come rilasciare `QuestSave+` sugli store con build locali:

- iOS con Xcode
- Android con Gradle / Android Studio

Non e una guida EAS Cloud-first.

## Dati attuali del progetto

- iOS bundle identifier: `com.franiix.questsaveplus`
- Android package: `com.franiix.questsaveplus`
- versione utente attuale: `0.0.1`
- build iOS attesa: `1`
- versionCode Android atteso: `1`

## Prima di fare una release

Devi verificare:

1. bug di startup risolti
2. login e profilo funzionanti
3. backlog e detail gioco funzionanti
4. URL pubblici online:
   - privacy: `https://www.franiix.cloud/questsaveplus/privacy/`
   - support: `https://www.franiix.cloud/questsaveplus/support/`
5. store listing compilato
6. screenshot pronti

## Prima del rilascio: test release locale obbligatorio

Prima di caricare sugli store conviene sempre testare una release locale.

### iOS

In Xcode:

1. `Product > Scheme > Edit Scheme`
2. `Run`
3. `Build Configuration = Release`
4. `Run`

### Android

Da terminale:

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android
./gradlew installRelease
```

Oppure da Android Studio selezionando la variant `release`.

Questa verifica e importante perche:

- la build `debug` usa Metro
- la build `release` usa il bundle reale
- molti bug di startup compaiono solo in release

## Gestione chiavi e segreti

## Scelta consigliata

La pratica corretta e:

- **non pushare** keystore, certificati, password e segreti nel repo, anche se privato
- tenere i segreti fuori dal repository
- usare file locali macchina-specifici

Perche:

- un repo privato non e un vault
- i segreti possono finire in fork, backup, export, CI, zip o condivisioni future
- ruotare chiavi firmate dopo e molto piu costoso che proteggerle bene da subito

## Cosa tenere fuori dal repo

- keystore Android release
- password keystore
- `~/.gradle/gradle.properties`
- `.env` con chiavi sensibili

## Se proprio vuoi tenerli nel repo

Se scegli consapevolmente di farlo per comodita personale:

- fallo solo su un repository davvero privato
- documenta il rischio
- evita almeno di committare password in chiaro nel README
- preparati a ruotare tutto se il repo viene esposto
- in questo progetto, se scegli questa strada, tieni la keystore in:
  `/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/questsaveplus-upload.keystore`

La mia raccomandazione tecnica resta: **non committare i segreti**.

## Release iOS con Xcode

## 1. Prepara il progetto

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
APP_VERSION=0.0.2 npx expo prebuild --clean --platform ios
cd ios
pod install
```

## 2. Apri il workspace

Apri:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/ios/QuestSave+.xcworkspace
```

## 3. Verifica signing

In Xcode:

1. target app
2. `Signing & Capabilities`
3. `Automatically manage signing`
4. team Apple corretto
5. bundle identifier corretto

## 4. Test finale locale

Fai una run su:

- simulatore
- device reale, se possibile

## 5. Archive

In Xcode:

1. seleziona `Any iOS Device (arm64)`
2. `Product > Archive`

## 6. Validate

Da Organizer:

1. seleziona l'archive
2. `Validate App`

Warning sui `dSYM` dei framework React Native/Hermes possono comparire.
Non sempre bloccano l'upload, ma vanno monitorati.

## 7. Upload

Sempre da Organizer:

1. `Distribute App`
2. `App Store Connect`
3. `Upload`

## 8. App Store Connect

Prima del submit finale verifica:

- screenshots iPhone corretti
- se l'app supporta iPad, servono anche screenshot iPad
- age rating
- privacy
- support URL
- privacy policy URL
- copyright
- build associata alla versione
- informazioni per il team review

## 9. Submit for Review

Quando tutto e completo:

1. `Add for Review`
2. `Submit for Review`

## Release Android per Play Store

## 1. Verifica Java 21

```bash
java -version
```

Se non e `21`, imposta Java 21:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

## 2. Verifica SDK path

Assicurati che esista:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android/local.properties
```

con:

```properties
sdk.dir=/Users/franiix/Library/Android/sdk
```

## 3. Rigenera il progetto se hai cambiato config native

```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe
APP_VERSION=0.0.4 npx expo prebuild --clean --platform android
```

Se invece hai cambiato solo codice applicativo, non serve per forza il clean.

## 4. Build release AAB

```bash
cat > /Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android/local.properties <<'EOF'
sdk.dir=/Users/franiix/Library/Android/sdk
EOF
```
```bash
cd /Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android
./gradlew --stop
./gradlew bundleRelease
```

Output atteso:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/android/app/build/outputs/bundle/release/app-release.aab
```

## 5. Signing release Android

La build release deve usare una keystore release vera, non la debug keystore.

Il progetto e gia configurato per usare:

- `signingConfigs.release`
- proprieta lette da Gradle
- fallback automatico a `questsaveplus-upload.keystore` nella root di `questsave-fe` dopo `expo prebuild --clean`

Il posto corretto per questi valori e:

```text
~/.gradle/gradle.properties
```

Esempio:

```properties
MYAPP_UPLOAD_KEY_ALIAS=alias
MYAPP_UPLOAD_STORE_PASSWORD=...
MYAPP_UPLOAD_KEY_PASSWORD=...
org.gradle.java.home=/percorso/java21
```

`MYAPP_UPLOAD_STORE_FILE` e opzionale se usi la convenzione del progetto:

```text
/Users/franiix/Projects/Personale/QuestSave+/questsave-fe/questsaveplus-upload.keystore
```

In quel caso bastano alias e password nel tuo `~/.gradle/gradle.properties`.

## 6. Upload in Play Console

Vai in:

- `Google Play Console`
- track `Internal`, `Closed` o `Production`

Carica `app-release.aab`.

## 7. Errori Play Console comuni

### `debug signed`

Hai caricato un bundle firmato con la debug keystore.
Devi rigenerare la release corretta.

### upload key mismatch

La chiave di caricamento usata localmente non coincide con quella registrata in Play Console.
In quel caso:

- recuperi la vecchia upload key
- oppure fai il reset della upload key

### `android.permission.CAMERA`

Il bundle dichiara ancora permessi che Play considera sensibili.
In quel caso:

- controlla `app.json`
- rigenera con `npx expo prebuild --clean`
- ricrea l'AAB

## 8. Store listing Play

Prima del submit verifica:

- descrizione breve
- descrizione completa
- privacy policy URL
- data safety
- account deletion URL
- screenshots
- icona / grafica store

## Flusso consigliato per ogni release

1. fix bug
2. test locale iOS e Android
3. nuova build release iOS
4. nuova build release Android
5. upload sugli store
6. verifica listing e privacy
7. submit
