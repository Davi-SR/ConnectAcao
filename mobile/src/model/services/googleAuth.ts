import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export type GoogleUserProfile = {
  email: string;
  nome: string;
  fotoUrl?: string;
  googleId?: string;
};

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID?.trim();

export async function checkGoogleRedirectOnMount(): Promise<GoogleUserProfile | null> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;

  const hash = window.location.hash || window.location.search;
  if (!hash || !hash.includes('access_token=')) return null;

  const match = hash.match(/[#?&]access_token=([^&]+)/);
  if (!match || !match[1]) return null;

  const accessToken = decodeURIComponent(match[1]);

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname);
  }

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      email: data.email,
      nome: data.name || data.given_name || 'Usuário Google',
      fotoUrl: data.picture,
      googleId: data.sub,
    };
  } catch {
    return null;
  }
}

export async function promptGoogleAuth(): Promise<GoogleUserProfile> {
  let redirectUrl: string;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
      redirectUrl = origin.replace(/\/+$/, '');
    } else {
      redirectUrl = 'http://localhost:8081';
    }
  } else {
    redirectUrl = Linking.createURL('/');
  }

  if (!GOOGLE_CLIENT_ID) {
    console.info(
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID não configurado no .env. Utilizando perfil de demonstração do Google para testes.'
    );
    return {
      email: 'usuario.google@conectacao.org',
      nome: 'Usuário Google ConectAção',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      googleId: 'google_dev_123456',
    };
  }

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&prompt=select_account`;

  try {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

    if (result.type !== 'success' || !result.url) {
      throw new Error('Autenticação com o Google foi cancelada.');
    }

    const match = result.url.match(/[#?&]access_token=([^&]+)/);
    if (!match || !match[1]) {
      throw new Error('Não foi possível obter o token de acesso do Google.');
    }

    const accessToken = decodeURIComponent(match[1]);

    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter os dados do perfil do Google.');
    }

    const data = await response.json();

    return {
      email: data.email,
      nome: data.name || data.given_name || 'Usuário Google',
      fotoUrl: data.picture,
      googleId: data.sub,
    };
  } catch (err: any) {
    // Se o popup foi bloqueado pelo navegador, redirecionar na mesma aba automaticamente
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      err?.message &&
      err.message.includes('Popup window was blocked')
    ) {
      window.location.assign(authUrl);
      return new Promise(() => {});
    }
    throw err;
  }
}

