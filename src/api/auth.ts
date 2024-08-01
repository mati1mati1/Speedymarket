import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
};
interface LoginResponse {
  success: boolean;
  token: string;
}
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('https://speedymarketbackend1.azurewebsites.net/api/login?', {
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
