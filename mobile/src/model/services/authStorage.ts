import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'connectacao.accessToken';
const isWeb = () => typeof document !== 'undefined';

/** Native uses SecureStore. Web localStorage is a development fallback and does not
 * provide equivalent protection against XSS or other scripts. Never store passwords. */
export async function saveToken(token: string): Promise<void> {
  if (isWeb()) { window.localStorage.setItem(TOKEN_KEY, token); return; }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (isWeb()) return window.localStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  if (isWeb()) { window.localStorage.removeItem(TOKEN_KEY); return; }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
