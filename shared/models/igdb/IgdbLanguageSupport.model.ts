export type IgdbLanguage = {
 name?: string;
 native_name?: string;
 locale?: string;
};

export type IgdbLanguageSupportType = {
 name?: string;
};

export type IgdbLanguageSupport = {
 language?: IgdbLanguage | null;
 language_support_type?: IgdbLanguageSupportType | null;
};
