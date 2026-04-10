/**
 * Formatta una stringa di data ISO con le opzioni di localizzazione specificate.
 *
 * @param dateStr  - stringa data ISO (es. "1996-05-30")
 * @param locale   - locale BCP 47 (es. "it", "en-GB")
 * @param options  - opzioni Intl.DateTimeFormatOptions (default: giorno/mese/anno estesi)
 */
export function formatDate(
 dateStr: string,
 locale: string,
 options: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
 },
): string {
 try {
  return new Date(dateStr).toLocaleDateString(locale, options);
 } catch {
  return dateStr;
 }
}
