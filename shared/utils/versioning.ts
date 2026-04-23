function normalizeVersionPart(value: string) {
 const parsed = Number.parseInt(value.replace(/\D+/g, ''), 10);
 return Number.isFinite(parsed) ? parsed : 0;
}

export function compareSemanticVersions(currentVersion: string, nextVersion: string) {
 const currentParts = currentVersion.split('.');
 const nextParts = nextVersion.split('.');
 const maxLength = Math.max(currentParts.length, nextParts.length);

 for (let index = 0; index < maxLength; index += 1) {
  const currentPart = normalizeVersionPart(currentParts[index] ?? '0');
  const nextPart = normalizeVersionPart(nextParts[index] ?? '0');

  if (currentPart < nextPart) return -1;
  if (currentPart > nextPart) return 1;
 }

 return 0;
}
