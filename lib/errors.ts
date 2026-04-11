export function getErrorMessage(error: unknown, fallbackMessage: string): string {
 if (error instanceof Error) {
  return error.message;
 }

 if (typeof error === 'string' && error.trim().length > 0) {
  return error;
 }

 return fallbackMessage;
}
