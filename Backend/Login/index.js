const jwt = require('jsonwebtoken');
const sql = require('mssql');

const config = {
  user: 'SA',
  password: 'Aa123456',
  server: 'localhost',
  port: 1433,
  database: 'MySuperMarketDb',
  options: {
    encrypt: false 
  }
};

module.exports = async function (context, req) {
  // const { username, password } = req.body;
  // const user = await getUserByUserName(username);

  // if (user && user.Password === password) { 
  //   const token = jwt.sign({ userId: user.UserID, username: user.UserName, role: user.UserType }, process.env.JWT_SECRET, { expiresIn: '1h' });
  //   context.res = {
  //     body: { token },
  //   };
  // } else {
  //   context.res = {
  //     status: 401,
  //     body: { message: 'Invalid credentials' },
  //   };
  // }
  const { username } = req.body;
  const user = await getUserByUserName(username);

  if (user ) { 
    const token = jwt.sign({ userId: user.UserID, username: user.UserName, role: user.UserType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    context.res = {
      body: { token },
    };
  } else {
    context.res = {
      status: 401,
      body: { message: 'Invalid credentials' },
    };
  }
};

async function getUserByUserName(username) {
  try {
    await sql.connect(config);
    // Password,
    const result = await sql.query`SELECT UserID, UserName, UserType FROM [User] WHERE UserName = ${username}`;
    
    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error('SQL error', err);
    throw err;
  } finally {
    await sql.close();
  }
}
