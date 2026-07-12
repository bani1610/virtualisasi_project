const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;

// Koneksi pool ke database
const db = mysql.createPool({
  host:     process.env.DB_HOST || '192.168.54.10',
  port:     process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'app2_db',
  user:     process.env.DB_USER || 'app2_user',
  password: process.env.DB_PASS || '',
  waitForConnections: true,
  connectionLimit: 5,
});

// Root — tampilkan halaman HTML dengan data dari DB
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    const rows_html = rows.map(p =>
      `<tr><td>${p.id}</td><td>${p.name}</td><td>Rp ${Number(p.price).toLocaleString('id-ID')}</td></tr>`
    ).join('');
    res.send(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>App2 - Data Products</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; background: #f5f5f5; }
    h1 { color: #1a252f; }
    .status { background: #27ae60; color: white; padding: 6px 14px; border-radius: 4px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #1a252f; color: white; padding: 12px; text-align: left; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; }
    tr:last-child td { border-bottom: none; }
    .meta { color: #888; font-size: 13px; margin-top: 16px; }
  </style>
</head>
<body>
  <h1>App2 <span class="status">DB: connected</span></h1>
  <p>Database: <strong>app2_db</strong> &mdash; Tabel: <strong>products</strong></p>
  <table>
    <thead><tr><th>ID</th><th>Nama Produk</th><th>Harga</th></tr></thead>
    <tbody>${rows_html}</tbody>
  </table>
  <p class="meta">Waktu server: ${new Date().toISOString()}</p>
</body>
</html>`);
  } catch (err) {
    res.status(500).send(`<h2>App2 - DB Error</h2><pre>${err.message}</pre>`);
  }
});

// GET /products — ambil semua data dari tabel products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json({ status: 'ok', data: rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App2 running on port ${PORT}`);
});
