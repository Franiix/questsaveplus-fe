import type { LegalDocument } from '@/shared/models/LegalDocument.model';

type LegalDocumentType = 'terms' | 'privacy' | 'policy';
type SupportedLegalLanguage = 'it' | 'en';

const OWNER_NAME = 'Francesco Scamardella';
const SUPPORT_EMAIL = 'supportoquestsaveplus@franiix.cloud';

const itDocuments: Record<LegalDocumentType, LegalDocument> = {
 terms: {
  title: 'Termini di utilizzo',
  subtitle: "Questi termini regolano l'uso dell'app QuestSave+ e dei servizi collegati.",
  lastUpdated: 'Ultimo aggiornamento: 10 aprile 2026',
  sections: [
   {
    title: '1. Titolare del servizio',
    paragraphs: [
     `QuestSave+ e' un'app gestita da ${OWNER_NAME}, che agisce come persona fisica.`,
     `Per richieste di supporto, informazioni legali, privacy o eliminazione account puoi scrivere a ${SUPPORT_EMAIL}.`,
    ],
   },
   {
    title: '2. Oggetto del servizio',
    paragraphs: [
     "QuestSave+ e' un'app dedicata alla scoperta, organizzazione e consultazione di videogiochi, del proprio backlog e di contenuti informativi collegati.",
     "Il servizio e' attualmente gratuito e non richiede acquisti interni o piani riservati.",
    ],
   },
   {
    title: '3. Account e accesso',
    paragraphs: [
     "Per usare alcune funzioni puo' essere necessario creare un account e mantenere aggiornati dati come username, profilo e preferenze.",
     "L'utente e' responsabile delle attivita' svolte tramite il proprio account e deve custodire con attenzione le credenziali di accesso.",
    ],
    bullets: [
     "non e' consentito impersonare altre persone o usare dati falsi in modo fraudolento",
     "non e' consentito condividere l'account in modo da compromettere la sicurezza del servizio",
     "l'utente deve informarci tempestivamente in caso di accessi non autorizzati",
    ],
   },
   {
    title: '4. Regole di utilizzo',
    bullets: [
     "non usare l'app per violare leggi, diritti di terzi o condizioni delle piattaforme di distribuzione",
     "non tentare di interferire con il funzionamento dell'app, delle API o dell'infrastruttura",
     "non copiare, estrarre in massa o riutilizzare contenuti e dati in modo non autorizzato",
     "non pubblicare contenuti offensivi, illeciti, diffamatori o idonei a danneggiare altri utenti o il servizio",
    ],
   },
   {
    title: '5. Contenuti, accuratezza e disponibilita',
    paragraphs: [
     "Le schede dei videogiochi, i metadati e parte dei contenuti informativi possono provenire da fornitori terzi come IGDB e da dati inseriti dall'utente.",
     "Pur cercando di mantenere i dati accurati e aggiornati, non garantiamo che ogni informazione sia sempre completa, esatta o disponibile in ogni momento.",
    ],
   },
   {
    title: '6. Stato gratuito del servizio',
    paragraphs: [
     "QuestSave+ e' gratuita. Al momento non sono previsti costi, acquisti interni, piani riservati o annunci integrati.",
     "QuestSave+ non gestisce addebiti o rinnovi automatici collegati a funzionalita dell'app.",
    ],
   },
   {
    title: "7. Eliminazione dell'account",
    paragraphs: [
     "L'utente puo' richiedere l'eliminazione del proprio account direttamente dall'app.",
     `In alternativa, puo' inviare una richiesta a ${SUPPORT_EMAIL}.`,
     "La richiesta di eliminazione comporta la cancellazione o anonimizzazione dei dati associati all'account, salvo i dati che dobbiamo conservare per obblighi di legge, sicurezza, prevenzione frodi o tutela dei nostri diritti.",
    ],
   },
   {
    title: '8. Sospensione o cessazione del servizio',
    paragraphs: [
     "Possiamo limitare, sospendere o interrompere l'accesso al servizio in caso di uso illecito, abuso, violazione di questi termini o rischi per la sicurezza dell'app e degli altri utenti.",
     "Possiamo inoltre modificare, aggiornare o interrompere alcune funzionalita dell'app, anche per ragioni tecniche o di business.",
    ],
   },
   {
    title: '9. Proprieta intellettuale',
    paragraphs: [
     "Il marchio QuestSave+, l'interfaccia dell'app, il design, i testi originali e i materiali creati per il servizio restano di proprieta del titolare del progetto o dei rispettivi licenzianti.",
     "I marchi, i nomi dei videogiochi e i contenuti di terzi restano di proprieta dei rispettivi titolari.",
    ],
   },
   {
    title: '10. Legge applicabile e mercato iniziale',
    paragraphs: [
     "Il servizio e' inizialmente rivolto al mercato italiano.",
     "I presenti termini sono regolati dalla legge italiana, salvo diversa applicazione di norme imperative a tutela dei consumatori residenti in altri Paesi.",
    ],
   },
  ],
 },
 privacy: {
  title: 'Privacy policy',
  subtitle:
   "Questa informativa spiega quali dati personali trattiamo quando usi QuestSave+, per quali finalita, per quanto tempo e quali diritti puoi esercitare.",
  lastUpdated: 'Ultimo aggiornamento: 10 aprile 2026',
  sections: [
   {
    title: '1. Titolare del trattamento',
    paragraphs: [
     `${OWNER_NAME} agisce come titolare del trattamento dei dati personali relativi a QuestSave+.`,
     `Per richieste privacy, supporto o eliminazione account puoi contattare ${SUPPORT_EMAIL}.`,
    ],
   },
   {
    title: '2. Dati che possiamo trattare',
    bullets: [
     'dati di account, come email, identificativo utente, username, nome visualizzato, avatar, data di nascita e genere se forniti',
     'dati di utilizzo del servizio, come backlog, stati dei giochi, preferenze e interazioni con alcune funzioni',
     'dati tecnici e di sicurezza, come log essenziali, identificativi tecnici, crash report e informazioni sul dispositivo',
     'dati forniti nelle richieste di supporto, come testo della segnalazione e informazioni necessarie a risolvere il problema',
    ],
   },
   {
    title: '3. Finalita e basi giuridiche',
    bullets: [
     "fornire il servizio richiesto dall'utente e gestire l'account: esecuzione del contratto",
     'mantenere sicurezza, prevenire abusi e proteggere il servizio: legittimo interesse e, se necessario, obblighi di legge',
     'gestire richieste di supporto, eliminazione account e contestazioni: esecuzione del contratto e obblighi di legge',
     'migliorare stabilita, sicurezza e performance del servizio: legittimo interesse, nei limiti consentiti dalla normativa applicabile',
    ],
   },
   {
    title: '4. Conservazione dei dati',
    paragraphs: [
     "Conserviamo i dati personali per il tempo necessario a fornire il servizio, gestire il rapporto con l'utente, rispettare obblighi legali, prevenire frodi e risolvere controversie.",
     "Quando l'account viene eliminato, i dati associati vengono cancellati o anonimizzati entro tempi ragionevoli, salvo quelli che dobbiamo trattenere per motivi legali, fiscali, di sicurezza o per far valere o difendere un diritto.",
    ],
   },
   {
    title: "5. Eliminazione dell'account e dei dati",
    paragraphs: [
     "L'utente puo' richiedere l'eliminazione dell'account direttamente dall'app.",
     `In alternativa, puo' scrivere a ${SUPPORT_EMAIL}.`,
     "L'eliminazione dell'account non impedisce la conservazione temporanea di alcuni dati quando cio sia necessario per obblighi di legge, sicurezza, prevenzione frodi o gestione di reclami.",
    ],
   },
   {
    title: "6. Diritti dell'utente",
    bullets: [
     'accesso ai dati personali',
     'rettifica dei dati inesatti o incompleti',
     'cancellazione dei dati nei casi previsti dalla legge',
     'limitazione del trattamento nei casi previsti',
     'opposizione al trattamento quando applicabile',
     'portabilita dei dati quando applicabile',
     'revoca del consenso per trattamenti opzionali basati sul consenso',
     "reclamo all'autorita di controllo competente",
    ],
   },
   {
    title: '7. Sicurezza e terzi',
    paragraphs: [
     "Possiamo condividere dati solo con soggetti necessari a fornire il servizio, ad esempio fornitori infrastrutturali, autenticazione, database e altri strumenti tecnici necessari al funzionamento dell'app.",
     "Adottiamo misure tecniche e organizzative ragionevoli per ridurre i rischi di accesso non autorizzato, perdita, distruzione o divulgazione impropria dei dati.",
    ],
   },
   {
    title: '8. Ambito territoriale',
    paragraphs: [
     "Il servizio e' inizialmente rivolto al mercato italiano.",
     "Se alcuni fornitori trattano dati fuori dal Paese dell'utente o dallo Spazio Economico Europeo, adottiamo o richiediamo misure adeguate secondo la normativa applicabile.",
    ],
   },
  ],
 },
 policy: {
  title: "Stato gratuito dell'app",
  subtitle:
   "QuestSave+ e' attualmente gratuita. Questa sezione chiarisce cosa significa per chi scarica o testa l'app dagli store ufficiali.",
  lastUpdated: 'Ultimo aggiornamento: 10 aprile 2026',
  sections: [
   {
    title: '1. Accesso gratuito',
    paragraphs: [
     "Le funzionalita disponibili nell'app non richiedono un costo diretto da parte dell'utente.",
    ],
   },
   {
    title: '2. Nessun piano attivo',
    paragraphs: [
     "Non sono presenti piani mensili, annuali, prove con rinnovo automatico o funzionalita riservate a utenti paganti.",
    ],
   },
   {
    title: '3. Nessun annuncio integrato',
    paragraphs: [
     "L'app non include al momento annunci o formati sponsorizzati interni.",
    ],
   },
   {
    title: '4. Supporto operativo',
    paragraphs: [
     `Per dubbi sull'accesso, problemi account, eliminazione dati o beta Android puoi scrivere a ${SUPPORT_EMAIL}.`,
    ],
   },
   {
    title: '5. Eliminazione account',
    paragraphs: [
     "La richiesta di eliminazione dell'account riguarda i dati collegati a QuestSave+ e non comporta procedure collegate a costi ricorrenti, perche non sono presenti piani attivi.",
    ],
   },
  ],
 },
};

const enDocuments: Record<LegalDocumentType, LegalDocument> = {
 terms: {
  title: 'Terms of use',
  subtitle: 'These terms govern the use of the QuestSave+ app and its related services.',
  lastUpdated: 'Last updated: April 10, 2026',
  sections: [
   {
    title: '1. Service owner',
    paragraphs: [
     `QuestSave+ is operated by ${OWNER_NAME}, acting as a natural person.`,
     `For support, legal, privacy, or account deletion requests, you can contact ${SUPPORT_EMAIL}.`,
    ],
   },
   {
    title: '2. Scope of the service',
    paragraphs: [
     'QuestSave+ is an app focused on video game discovery, backlog organization, and related informational content.',
     'The service is currently free and does not require in-app purchases or reserved paid plans.',
    ],
   },
   {
    title: '3. Accounts and access',
    paragraphs: [
     'Some features may require you to create an account and keep profile data and preferences up to date.',
     'You are responsible for activities carried out through your account and for keeping your login credentials secure.',
    ],
    bullets: [
     'you may not impersonate others or use false information in a fraudulent way',
     'you may not share your account in ways that compromise service security',
     'you must notify us promptly in case of unauthorized access',
    ],
   },
   {
    title: '4. Rules of use',
    bullets: [
     'do not use the app to violate laws, third-party rights, or platform rules',
     'do not interfere with the app, APIs, or infrastructure',
     'do not scrape, mass extract, or reuse content or data without authorization',
     'do not publish unlawful, abusive, defamatory, or harmful content',
    ],
   },
   {
    title: '5. Free service status',
    paragraphs: [
     'QuestSave+ is free. There are currently no fees, in-app purchases, reserved plans, or integrated ads.',
     'QuestSave+ does not manage charges or automatic renewals connected to app features.',
    ],
   },
   {
    title: '6. Account deletion',
    paragraphs: [
     'Users may request deletion of their account directly from the app.',
     `Alternatively, they may send a request to ${SUPPORT_EMAIL}.`,
     'Account deletion leads to deletion or anonymization of the related data, except for data that must be retained for legal, security, anti-fraud, or rights-protection purposes.',
    ],
   },
   {
    title: '7. Suspension or termination',
    paragraphs: [
     'We may restrict, suspend, or terminate access to the service in case of unlawful use, abuse, violation of these terms, or risks to app or user security.',
     'We may also modify, update, or discontinue some features for technical or business reasons.',
    ],
   },
   {
    title: '8. Intellectual property',
    paragraphs: [
     'The QuestSave+ brand, app interface, design, original copy, and materials created for the service remain the property of the project owner or the relevant licensors.',
     'Third-party brands, game names, and third-party content remain the property of their respective owners.',
    ],
   },
   {
    title: '9. Applicable law and initial market',
    paragraphs: [
     'The service is initially intended for the Italian market.',
     'These terms are governed by Italian law, without prejudice to any mandatory consumer protection rules applicable in the user country.',
    ],
   },
  ],
 },
 privacy: {
  title: 'Privacy policy',
  subtitle:
   'This notice explains what personal data we may process when you use QuestSave+, for which purposes, for how long, and which rights you may exercise.',
  lastUpdated: 'Last updated: April 10, 2026',
  sections: [
   {
    title: '1. Data controller',
    paragraphs: [
     `${OWNER_NAME} acts as the data controller for the personal data processed in relation to QuestSave+.`,
     `For privacy, support, or account deletion requests, you can contact ${SUPPORT_EMAIL}.`,
    ],
   },
   {
    title: '2. Data we may process',
    bullets: [
     'account data such as email, user id, username, display name, avatar, birth date, and gender if provided',
     'service usage data such as backlog, game statuses, preferences, and interactions with certain features',
     'technical and security data such as essential logs, technical identifiers, crash reports, and device information',
     'data provided in support requests, such as the message content and information needed to resolve the issue',
    ],
   },
   {
    title: '3. Purposes and legal bases',
    bullets: [
     'providing the requested service and managing the account: contract performance',
     'maintaining security, preventing abuse, and protecting the service: legitimate interest and, where needed, legal obligations',
     'handling support, account deletion, and disputes: contract performance and legal obligations',
     'improving service stability, security, and performance: legitimate interest, within the limits allowed by applicable law',
    ],
   },
   {
    title: '4. Data retention',
    paragraphs: [
     'We retain personal data for as long as necessary to provide the service, manage the relationship with the user, comply with legal obligations, prevent fraud, and resolve disputes.',
     'When an account is deleted, related data is deleted or anonymized within a reasonable time, except for data that must be retained for legal, tax, security, or rights-defense purposes.',
    ],
   },
   {
    title: '5. Account and data deletion',
    paragraphs: [
     'Users may request account deletion directly from the app.',
     `Alternatively, they may write to ${SUPPORT_EMAIL}.`,
     'Deleting the account does not prevent temporary retention of some data where necessary for legal obligations, security, fraud prevention, or complaint handling.',
    ],
   },
   {
    title: '6. User rights',
    bullets: [
     'access to personal data',
     'rectification of inaccurate or incomplete data',
     'erasure where permitted by law',
     'restriction of processing where applicable',
     'objection to processing where applicable',
     'data portability where applicable',
     'withdrawal of consent for optional consent-based processing',
     'complaint to the competent supervisory authority',
    ],
   },
   {
    title: '7. Security and third parties',
    paragraphs: [
     'We may share data only with parties necessary to provide the service, such as infrastructure providers, authentication services, databases, and other technical tools required for app operation.',
     'We adopt reasonable technical and organizational measures to reduce the risks of unauthorized access, loss, destruction, or improper disclosure of data.',
    ],
   },
   {
    title: '8. Territorial scope',
    paragraphs: [
     'The service is initially intended for the Italian market.',
     'If some providers process data outside the user country or the European Economic Area, we adopt or require adequate safeguards in accordance with applicable law.',
    ],
   },
  ],
 },
 policy: {
  title: 'Free app status',
  subtitle:
   'QuestSave+ is currently free. This section clarifies what that means for users downloading or testing the app through official stores.',
  lastUpdated: 'Last updated: April 10, 2026',
  sections: [
   {
    title: '1. Free access',
    paragraphs: [
     'The features available in the app do not require a direct cost from the user.',
    ],
   },
   {
    title: '2. No active paid plan',
    paragraphs: [
     'There are no monthly plans, yearly plans, automatic-renewal trials, or features reserved for paying users.',
    ],
   },
   {
    title: '3. No integrated ads',
    paragraphs: [
     'The app currently does not include ads or internal sponsored formats.',
    ],
   },
   {
    title: '4. Operational support',
    paragraphs: [
     `For access questions, account issues, data deletion, or Android beta support, contact ${SUPPORT_EMAIL}.`,
    ],
   },
   {
    title: '5. Account deletion',
    paragraphs: [
     'Account deletion concerns data connected to QuestSave+ and does not require procedures related to recurring costs, because no active paid plans exist.',
    ],
   },
  ],
 },
};

const legalDocumentsByLanguage: Record<SupportedLegalLanguage, Record<LegalDocumentType, LegalDocument>> = {
 it: itDocuments,
 en: enDocuments,
};

function normalizeLegalLanguage(language: string): SupportedLegalLanguage {
 return language.toLowerCase().startsWith('en') ? 'en' : 'it';
}

export function getLegalDocumentContent(
 language: string,
 type: LegalDocumentType,
): LegalDocument {
 return legalDocumentsByLanguage[normalizeLegalLanguage(language)][type];
}
