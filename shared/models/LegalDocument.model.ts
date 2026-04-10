export type LegalDocumentSection = {
 title: string;
 paragraphs?: string[];
 bullets?: string[];
};

export type LegalDocument = {
 title: string;
 subtitle: string;
 lastUpdated: string;
 sections: LegalDocumentSection[];
 footerNote?: string;
};
