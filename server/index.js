const express = require('express');
const cors = require('cors');

const authRouters = require('./routers/auth.js');

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Server running...');
});

app.get('/key', (req, res) => {
  const api_key = process.env.STREAM_API_KEY;

  res.json({
    apiKey: api_key || null
  });
})

app.use('/auth', authRouters);

app.listen(PORT, () => console.log(PORT));
