import type { LegalDocument } from '@/shared/models/LegalDocument.model';

type LegalDocumentType = 'terms' | 'privacy' | 'policy';
type SupportedLegalLanguage = 'it' | 'en';

const OWNER_NAME = 'Francesco Scamardella';
const SUPPORT_EMAIL = 'support@dominiochecomprero.it';

const itDocuments: Record<LegalDocumentType, LegalDocument> = {
 terms: {
  title: 'Termini di utilizzo',
  subtitle:
   "Questi termini regolano l'uso dell'app QuestSave+, dei servizi collegati e delle eventuali funzionalita' premium rese disponibili nel tempo.",
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
     "Il servizio puo' essere inizialmente gratuito, includere in futuro pubblicita' e, successivamente, offrire funzionalita' premium tramite abbonamenti mensili o annuali acquistabili su App Store o Google Play.",
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
    title: '6. Funzioni premium, pubblicita e acquisti in-app',
    paragraphs: [
     "QuestSave+ puo' restare gratuita in una prima fase. In una fase successiva potrebbero essere introdotte pubblicita' e, successivamente, funzioni premium.",
     "Gli eventuali abbonamenti premium potranno essere mensili o annuali, con una prova gratuita iniziale di 48 ore e rinnovo automatico salvo cancellazione nei tempi previsti dallo store.",
     "Gli acquisti in-app e gli abbonamenti effettuati su iOS o Android sono gestiti rispettivamente da Apple o Google tramite i relativi sistemi di pagamento.",
    ],
   },
   {
    title: '7. Rinnovo, cancellazione e rimborsi',
    paragraphs: [
     "Gli eventuali abbonamenti si rinnoveranno automaticamente salvo cancellazione da parte dell'utente tramite il proprio account App Store o Google Play prima della data di rinnovo.",
     "Le richieste di rimborso per acquisti effettuati tramite gli store mobili sono soggette alle regole della piattaforma di pagamento utilizzata e alle norme inderogabili a tutela dei consumatori applicabili nel Paese dell'utente.",
     `Quando possibile, l'utente puo' anche contattarci a ${SUPPORT_EMAIL} per ricevere supporto sulla procedura corretta o per far valere eventuali diritti previsti dalla legge.`,
    ],
   },
   {
    title: "8. Eliminazione dell'account",
    paragraphs: [
     "L'utente puo' richiedere l'eliminazione del proprio account direttamente dall'app.",
     `In alternativa, puo' inviare una richiesta a ${SUPPORT_EMAIL}.`,
     "La richiesta di eliminazione comporta la cancellazione o anonimizzazione dei dati associati all'account, salvo i dati che dobbiamo conservare per obblighi di legge, sicurezza, prevenzione frodi o tutela dei nostri diritti.",
    ],
   },
   {
    title: '9. Sospensione o cessazione del servizio',
    paragraphs: [
     "Possiamo limitare, sospendere o interrompere l'accesso al servizio in caso di uso illecito, abuso, violazione di questi termini o rischi per la sicurezza dell'app e degli altri utenti.",
     "Possiamo inoltre modificare, aggiornare o interrompere alcune funzionalita dell'app, anche per ragioni tecniche o di business.",
    ],
   },
   {
    title: '10. Proprieta intellettuale',
    paragraphs: [
     "Il marchio QuestSave+, l'interfaccia dell'app, il design, i testi originali e i materiali creati per il servizio restano di proprieta del titolare del progetto o dei rispettivi licenzianti.",
     "I marchi, i nomi dei videogiochi e i contenuti di terzi restano di proprieta dei rispettivi titolari.",
    ],
   },
   {
    title: '11. Legge applicabile e mercato iniziale',
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
     "dati relativi a pagamenti e abbonamenti, come stato dell'abbonamento e conferma del piano acquistato tramite Apple o Google",
     "dati legati a pubblicita o analytics, solo se e quando tali strumenti verranno effettivamente attivati e nel rispetto delle regole applicabili",
    ],
   },
   {
    title: '3. Finalita e basi giuridiche',
    bullets: [
     "fornire il servizio richiesto dall'utente e gestire l'account: esecuzione del contratto",
     'mantenere sicurezza, prevenire abusi e proteggere il servizio: legittimo interesse e, se necessario, obblighi di legge',
     'gestire richieste di supporto, eliminazione account e contestazioni: esecuzione del contratto e obblighi di legge',
     'gestire eventuali pagamenti, rinnovi e stato premium: esecuzione del contratto',
     'misurare uso, performance o campagne pubblicitarie future ove richiesto: consenso, quando previsto dalla normativa applicabile',
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
     "L'eliminazione dell'account non impedisce la conservazione temporanea di alcuni dati quando cio sia necessario per obblighi di legge, sicurezza, prevenzione frodi o gestione di reclami e rimborsi.",
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
     "Possiamo condividere dati solo con soggetti necessari a fornire il servizio, ad esempio fornitori infrastrutturali, autenticazione, database, piattaforme di pagamento in-app e altri strumenti tecnici eventualmente attivati.",
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
  title: 'Policy abbonamenti, pubblicita e rimborsi',
  subtitle:
   "Questa policy descrive come QuestSave+ gestisce funzioni premium, rinnovi, pubblicita, cancellazioni e richieste di rimborso quando tali modelli saranno attivati.",
  lastUpdated: 'Ultimo aggiornamento: 10 aprile 2026',
  sections: [
   {
    title: '1. Stato attuale del prodotto',
    paragraphs: [
     "QuestSave+ puo' essere resa disponibile inizialmente in forma gratuita.",
     "In una fase successiva il servizio potra' includere pubblicita, e successivamente anche un modello freemium con funzionalita premium acquistabili tramite abbonamento mensile o annuale su iOS e Android.",
    ],
   },
   {
    title: '2. Abbonamenti premium',
    bullets: [
     "gli eventuali piani premium potranno essere mensili o annuali",
     "potra' essere prevista una prova gratuita iniziale di 48 ore",
     "il rinnovo automatico si applichera salvo disattivazione da parte dell'utente tramite il proprio account store",
     'la gestione di pagamento, rinnovo e fatturazione avviene tramite Apple App Store o Google Play',
    ],
   },
   {
    title: '3. Cancellazione degli abbonamenti',
    paragraphs: [
     "L'utente puo' annullare il rinnovo automatico in qualsiasi momento dalle impostazioni del proprio account Apple o Google.",
     "La cancellazione impedisce il rinnovo successivo ma, salvo diversa previsione di legge o della piattaforma, non interrompe immediatamente il periodo gia pagato.",
    ],
   },
   {
    title: '4. Rimborsi',
    paragraphs: [
     'Per gli acquisti effettuati tramite Apple App Store o Google Play, le richieste di rimborso devono in linea generale seguire le procedure previste dalla piattaforma che ha elaborato il pagamento.',
     "Apple e Google applicano regole proprie sui rimborsi; inoltre l'utente mantiene i diritti inderogabili previsti dalla normativa applicabile, incluse eventuali tutele dei consumatori nel proprio Paese.",
     `Quando possibile, QuestSave+ puo' fornire assistenza informativa sulla procedura corretta tramite ${SUPPORT_EMAIL}, ma il rimborso puo' dipendere dal provider di pagamento e dalla legge applicabile.`,
    ],
   },
   {
    title: '5. Pubblicita',
    paragraphs: [
     "Se verra introdotta pubblicita, questa potra comparire nel piano gratuito o in specifiche aree dell'app in modo coerente con l'esperienza utente e con la normativa applicabile.",
     "Al momento i provider pubblicitari o analytics futuri non sono ancora definiti in modo definitivo.",
    ],
   },
   {
    title: '6. Eliminazione account e acquisti',
    paragraphs: [
     "La richiesta di eliminazione dell'account non annulla automaticamente gli abbonamenti attivi nello store: l'utente deve gestire anche la cancellazione del rinnovo tramite Apple o Google.",
     "Le informazioni essenziali sugli acquisti possono essere conservate per finalita contabili, fiscali, antifrode o di gestione dei reclami, nei limiti consentiti dalla legge.",
    ],
   },
  ],
 },
};

const enDocuments: Record<LegalDocumentType, LegalDocument> = {
 terms: {
  title: 'Terms of use',
  subtitle:
   'These terms govern the use of the QuestSave+ app, its related services, and any premium features that may be introduced over time.',
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
     'The service may start as free, may later include advertising, and may subsequently offer premium features through monthly or yearly subscriptions purchased on the App Store or Google Play.',
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
    title: '5. Premium features, ads, and in-app purchases',
    paragraphs: [
     'QuestSave+ may remain free in an initial phase. Later, advertising and premium features may be introduced.',
     'Premium subscriptions may be offered monthly or yearly, with an initial 48-hour free trial and automatic renewal unless cancelled in time through the applicable store.',
     'In-app purchases and subscriptions on iOS and Android are handled respectively by Apple and Google through their payment systems.',
    ],
   },
   {
    title: '6. Renewals, cancellations, and refunds',
    paragraphs: [
     'Subscriptions, if introduced, renew automatically unless cancelled through the relevant App Store or Google Play account before the renewal date.',
     'Refund requests for purchases made through mobile stores are subject to the rules of the payment platform and any mandatory consumer protection laws applicable in the user country.',
     `When possible, users may also contact ${SUPPORT_EMAIL} for guidance on the proper process or to assert any rights granted by law.`,
    ],
   },
   {
    title: '7. Account deletion',
    paragraphs: [
     'Users may request deletion of their account directly from the app.',
     `Alternatively, they may send a request to ${SUPPORT_EMAIL}.`,
     'Account deletion leads to deletion or anonymization of the related data, except for data that must be retained for legal, security, anti-fraud, or rights-protection purposes.',
    ],
   },
   {
    title: '8. Suspension or termination',
    paragraphs: [
     'We may restrict, suspend, or terminate access to the service in case of unlawful use, abuse, violation of these terms, or risks to app or user security.',
     'We may also modify, update, or discontinue some features for technical or business reasons.',
    ],
   },
   {
    title: '9. Intellectual property',
    paragraphs: [
     'The QuestSave+ brand, app interface, design, original copy, and materials created for the service remain the property of the project owner or the relevant licensors.',
     'Third-party brands, game names, and third-party content remain the property of their respective owners.',
    ],
   },
   {
    title: '10. Applicable law and initial market',
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
     'subscription and payment-related data such as subscription status and plan confirmation received from Apple or Google',
     'advertising or analytics-related data only if and when such tools are actually enabled and in compliance with applicable law',
    ],
   },
   {
    title: '3. Purposes and legal bases',
    bullets: [
     'providing the requested service and managing the account: contract performance',
     'maintaining security, preventing abuse, and protecting the service: legitimate interest and, where needed, legal obligations',
     'handling support, account deletion, and disputes: contract performance and legal obligations',
     'managing payments, renewals, and premium access: contract performance',
     'measuring usage, performance, or future advertising campaigns where required: consent, when applicable',
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
     'Deleting the account does not prevent temporary retention of some data where necessary for legal obligations, security, fraud prevention, or complaints and refunds handling.',
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
     'We may share data only with parties necessary to provide the service, such as infrastructure providers, authentication services, databases, in-app payment platforms, and other technical tools that may be enabled over time.',
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
  title: 'Subscriptions, ads, and refunds policy',
  subtitle:
   'This policy explains how QuestSave+ may handle premium features, renewals, advertising, cancellations, and refund requests when those business models are activated.',
  lastUpdated: 'Last updated: April 10, 2026',
  sections: [
   {
    title: '1. Current product stage',
    paragraphs: [
     'QuestSave+ may initially be offered as a free app.',
     'At a later stage the service may include advertising and, afterwards, a freemium model with premium monthly or yearly subscriptions on iOS and Android.',
    ],
   },
   {
    title: '2. Premium subscriptions',
    bullets: [
     'premium plans may be monthly or yearly',
     'an initial 48-hour free trial may be offered',
     'automatic renewal applies unless disabled by the user through the relevant store account',
     'payments, billing, and renewals are handled through Apple App Store or Google Play',
    ],
   },
   {
    title: '3. Subscription cancellation',
    paragraphs: [
     'Users may disable auto-renewal at any time in their Apple or Google account settings.',
     'Cancellation stops future renewal but, unless otherwise required by law or platform rules, does not immediately terminate the already paid period.',
    ],
   },
   {
    title: '4. Refunds',
    paragraphs: [
     'For purchases made through Apple App Store or Google Play, refund requests generally follow the procedures set by the platform that processed the payment.',
     'Apple and Google apply their own refund rules, and users also retain any mandatory rights provided by applicable consumer law in their country.',
     `Where possible, QuestSave+ may provide procedural support via ${SUPPORT_EMAIL}, but the refund decision may depend on the payment provider and the applicable law.`,
    ],
   },
   {
    title: '5. Advertising',
    paragraphs: [
     'If advertising is introduced, it may appear in the free tier or in specific areas of the app in a way that remains consistent with the product experience and applicable law.',
     'At the moment, future advertising or analytics providers have not yet been definitively selected.',
    ],
   },
   {
    title: '6. Account deletion and purchases',
    paragraphs: [
     'Deleting the account does not automatically cancel active store subscriptions: users must also manage cancellation through Apple or Google.',
     'Essential purchase information may be retained for accounting, tax, anti-fraud, or complaint-handling purposes, within the limits permitted by law.',
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

