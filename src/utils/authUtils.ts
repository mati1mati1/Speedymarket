import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
  exp: number;
}

export const decodedToken = (token: string | null): DecodedToken | null => {
try {
    if (!token) {
        console.error('Error decoding token:', 'Token is null');
        return null;
    }
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
