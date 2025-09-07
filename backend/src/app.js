import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { UserModel } from './models/userModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'API funcionando!' });
});

// Inicializar tabela e servidor
async function startServer() {
  try {
    await UserModel.createTable();
    console.log('Tabela de usuários verificada/criada');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
}

startServer();