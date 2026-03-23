require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const essayRoutes = require('./routes/essay.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const chatRoutes = require('./routes/chat.routes');
const speakingRoutes = require('./routes/speaking.routes');

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'SDELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/* =========================
   API ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/essay', essayRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/speaking', speakingRoutes);
const listeningRoutes = require('./routes/listening.routes');
app.use('/api/listening', listeningRoutes);
/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Adaptive English API is running'
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});


module.exports = app;
