import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models.js';
import taskRoutes from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client connection (typically http://localhost:5173 for Vite)
app.use(cors({
  origin: '*', // Allow all origins in dev, or specify local client URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Routes
app.use('/api', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Sync database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite database successfully.');
    
    // Sync models to database
    // use { alter: true } in dev to update columns if schema changes
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start the server:', error);
    process.exit(1);
  }
}

startServer();
