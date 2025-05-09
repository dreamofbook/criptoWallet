// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/status', (req, res) => {
	res.json({ status: 'Server is running' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));