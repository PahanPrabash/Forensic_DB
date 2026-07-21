const express = require('express');
const cors = require('cors');
require('dotenv').config();

const autopsyRoutes = require('./routes/autopsyRoutes');
const courtRoutes = require('./routes/courtRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Member 4 Module Routes
app.use('/api', autopsyRoutes);
app.use('/api', courtRoutes);
app.use('/api', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Forensic DB API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
