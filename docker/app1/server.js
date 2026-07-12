const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

// Koneksi pool ke database
const db = mysql.createPool({
  host:     process.env.DB_HOST || '192.168.54.10',
  port:     process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'app1_db',
  user:     process.env.DB_USER || 'app1_user',
  password: process.env.DB_PASS || '',
  waitForConnections: true,
  connectionLimit: 5,
});

// Root — status app + waktu server
app.get('/', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.send('Halo dari App1! Waktu server: ' + new Date().toISOString() + ' | DB: connected');
  } catch (err) {
    res.status(500).send('Halo dari App1! Waktu server: ' + new Date().toISOString() + ' | DB: ' + err.message);
  }
});

// GET /users — ambil semua data dari tabel users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json({ status: 'ok', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App1 running on port ${PORT}`);
});
