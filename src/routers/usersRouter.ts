import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { pool } from '../index';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
console.log({ pool });

//Path: /users/login
router.post('/login', async (req, res) => {
  //Log request body
  console.log('Login', req.body);

  //Destructure properties
  const { username, password } = req.body;

  //Query database
  const { rows } = await pool.query(
    'SELECT password FROM users WHERE username = $1',
    [username]
  );

  //If no valid entry was found
  if (rows.length === 0) {
    res.status(401).json({ message: 'Login failed' });
    return;
  }

  //Check found password hash against the newly hashed plaintext password
  bcrypt.compare(password, rows[0].password, function (err, result) {
    //If valid
    if (result) {
      //Create new JSON web token
      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
        expiresIn: '15s',
      });

      //Send back JSON with status 200
      res.status(200).json({ token });
    } else {
      //Send back JSON with status 401
      res.status(401).json({ message: 'Login failed' });
    }
  });
});

//Path: /users/signup
router.post('/signup', async (req, res) => {
  //Log request body
  console.log('Signup', req.body);

  //Destructure properties
  const { username, password } = req.body;

  //Hash password
  const hash = await bcrypt.hash(password, 10);

  //Generate random id
  const id = uuidv4();

  //Insert into database and return id
  const { rows } = await pool.query(
    'INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING id',
    [id, username, hash]
  );

  //Response
  res.status(200).json({ 'New User': username });
});

//Export
export default router;
