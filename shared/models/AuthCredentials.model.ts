/**
 * Credenziali di autenticazione inserite dall'utente.
 *
 * Usato come tipo form per login e register.
 * La validazione (required, email, minLength) è delegata al Zod schema
 * in shared/validation/auth.schemas.ts.
 */
export interface AuthCredentialsModel {
 email: string;
 password: string;
}

export const authCredentialsDefaultValues: AuthCredentialsModel = {
 email: '',
 password: '',
};
