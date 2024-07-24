import Cookies from 'js-cookie';

export const saveToken = (token: string) => {
  Cookies.set('token', token, { secure: true, sameSite: 'strict' });
};
interface LoginResponse {
  success: boolean;
  token: string;
}
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:7071/api/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (data.token) {
    saveToken(data.token);
    return {
      success: true,
      token: data.token,
    };
  } else {
    return {
      success: false,
      token: '',
    };
  }
}
