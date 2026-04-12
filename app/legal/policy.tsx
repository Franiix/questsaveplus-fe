import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LegalDocumentScreen } from '@/components/legal/LegalDocumentScreen';
import { LegalExternalDocumentScreen } from '@/components/legal/LegalExternalDocumentScreen';
import { getLegalDocumentUrl } from '@/shared/config/legal';
import { getLegalDocumentContent } from '@/shared/content/legalDocuments';

export default function PolicyScreen() {
 const { i18n } = useTranslation();
 const document = getLegalDocumentContent(i18n.language, 'policy');
 const externalUrl = getLegalDocumentUrl('policy');

 useEffect(() => {
  if (!externalUrl) return;
  void Linking.openURL(externalUrl);
 }, [externalUrl]);

 if (externalUrl) {
  return (
   <LegalExternalDocumentScreen
    title={document.title}
    subtitle={document.subtitle}
    url={externalUrl}
    onOpen={() => void Linking.openURL(externalUrl)}
   />
  );
 }

 return <LegalDocumentScreen document={document} />;
}
