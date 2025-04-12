import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;  // userId
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;  // role claim
  exp: number;
  jti: string;
}

export const getTokenFromCookie = (): string | null => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('auth='))?.split('=')[1] || null;
};

export const getUserIdFromToken = (): number | 0 => {
  const token = getTokenFromCookie();
  if (!token) return 0;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return parseInt(decoded.sub);
  } catch (error) {
    console.error('Error decoding token:', error);
    return 0;
  }
};

export const getUserRoleFromToken = (): string | null => {
  const token = getTokenFromCookie();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};