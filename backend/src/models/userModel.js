import pool from '../config/database.js';

export const UserModel = {
  // Criar tabela (para desenvolvimento)
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  // Buscar todos os usuários
  async getAll() {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return result.rows;
  },

  // Buscar usuário por ID
  async getById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Criar usuário
  async create(user) {
    const { name, email, age } = user;
    const result = await pool.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name, email, age]
    );
    return result.rows[0];
  },

  // Atualizar usuário
  async update(id, user) {
    const { name, email, age } = user;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
      [name, email, age, id]
    );
    return result.rows[0];
  },

  // Deletar usuário
  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  }
};