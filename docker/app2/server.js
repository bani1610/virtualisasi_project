const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Halo dari App2! Waktu server: ' + new Date().toISOString());
});

app.listen(PORT, () => {
  console.log(`App1 running on port ${PORT}`);
});
