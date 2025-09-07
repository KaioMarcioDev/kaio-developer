// src/config/test-connection.js
import pool from './database.js';

async function testConnection() {
    try {
        console.log('🧪 Testando conexão com PostgreSQL...');
        
        // Testar conexão
        const client = await pool.connect();
        console.log('✅ Conexão bem-sucedida!');
        
        // Testar query simples
        const result = await client.query('SELECT NOW() as current_time');
        console.log('⏰ Hora do servidor:', result.rows[0].current_time);
        
        // Verificar se tabela users existe
        try {
            const tableCheck = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'users'
                );
            `);
            console.log('📊 Tabela users existe:', tableCheck.rows[0].exists);
        } catch (tableError) {
            console.log('📊 Tabela users não existe ainda (normal em primeiro teste)');
        }
        
        client.release();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error.message);
        process.exit(1);
    }
}

testConnection();