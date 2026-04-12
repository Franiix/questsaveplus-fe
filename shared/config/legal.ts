export type LegalDocumentKey = 'privacy' | 'terms' | 'policy';

function normalizeUrl(value?: string) {
 const trimmed = value?.trim();
 return trimmed ? trimmed : null;
}

const PRIVACY_URL = normalizeUrl(process.env.EXPO_PUBLIC_LEGAL_PRIVACY_URL);
const SUPPORT_URL = normalizeUrl(process.env.EXPO_PUBLIC_LEGAL_SUPPORT_URL);

export function getSupportUrl() {
 return SUPPORT_URL;
}

export function getLegalDocumentUrl(documentKey: LegalDocumentKey) {
 if (documentKey === 'privacy') return PRIVACY_URL;
 if (!SUPPORT_URL) return null;

 return documentKey === 'terms' ? `${SUPPORT_URL}#terms` : `${SUPPORT_URL}#policy`;
}
