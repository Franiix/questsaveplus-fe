import { useTranslation } from 'react-i18next';
import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';
import { getLegalDocumentContent } from '@/shared/content/legalDocuments';

export default function PrivacyScreen() {
 const { i18n } = useTranslation();
 return <LegalDocumentScreen document={getLegalDocumentContent(i18n.language, 'privacy')} />;
}
