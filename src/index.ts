import bodyParser from 'body-parser';
import express from 'express';
import { Pool } from 'pg';
import path from 'path';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import usersRouter from './routers/usersRouter';
config();

// Connect to the database using the DATABASE_URL environment
//variable injected by Railway
const pool = new Pool();
console.log({ pool });
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

//Send to index.html in the public folder
app.get('/', async (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.use('/users', usersRouter);

app.get('/data', async (req, res) => {
  //Get token from header
  console.log(req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1].toString();
  if (token == 'null') {
    console.log('here');
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWT;
    console.log(decoded);
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [decoded.username]
    );
    res.status(200).json(rows);
  } catch (err) {
    //If token is invalid
    res.status(401).json({ message: 'Invalid token' });
  }
});

interface JWT extends jwt.JwtPayload {
  username: string;
  iat: number;
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export { pool };
