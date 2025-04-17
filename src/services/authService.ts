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

// Add this new function to get the user type from the JWT token
export const getUserType = (): 'contributor' | 'project-owner' | null => {
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth='))?.split('=')[1];
    
    if (!token) {
      return null;
    }
    
    // Decode the JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    
    // Check if the token has a role or type claim
    if (payload.role) {
      return payload.role === 'contributor' ? 'contributor' : 'project-owner';
    } else if (payload.type) {
      return payload.type === 'contributor' ? 'contributor' : 'project-owner';
    }
    return null;
  } catch (error) {
    console.error('Error getting user type:', error);
    return null;
  }
};