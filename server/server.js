
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', verifyToken, journalRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Daydream Journal API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
