interface LoginResponse {
    success: boolean;
    user: {
      role: 'customer' | 'manager';
      username: string;
    };
  }
  
  // פונקציה פשוטה לאימות משתמש
  export async function login(username: string, password: string): Promise<LoginResponse> {
    debugger
    // נתונים לדוגמה של משתמשים
    const users: { [key: string]: { role: 'customer' | 'manager'; username: string } } = {
      user: { role: 'customer', username: 'user' },
      admin: { role: 'manager', username: 'admin' },
    };
  
    // אימות המשתמש
    if (username === 'user') {
      return {
        success: true,
        user: users.user,
      };
    } else if (username === 'admin' ) {
      return {
        success: true,
        user: users.admin,
      };
    } else {
      return {
        success: false,
        user: { role: 'customer', username: '' }, // משתמש ריק במקרה של כישלון
      };
    }
  }
  
  // דוגמה לפונקציה המבוססת על fetch (כרגע בתגובה להערות)
  // export async function login(username: string, password: string): Promise<LoginResponse> {
  //   const response = await fetch('https://example.com/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username, password }),
  //   });
  //   return response.json();
  // }
  