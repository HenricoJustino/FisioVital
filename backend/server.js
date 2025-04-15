const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuração do pool de conexões MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Ajuste a senha conforme sua configuração
  database: 'fisiovital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão com o banco
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('O banco de dados "fisiovital" não existe. Por favor, crie o banco de dados.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Acesso negado ao MySQL. Verifique seu usuário e senha.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Não foi possível conectar ao MySQL. Verifique se o serviço está rodando.');
    }
    return;
  }
  console.log('Conectado ao banco de dados MySQL com sucesso!');
  
  // Verificar se a tabela Pacientes existe
  connection.query('SHOW TABLES LIKE "Pacientes"', async (err, results) => {
    if (err) {
      console.error('Erro ao verificar tabela Pacientes:', err);
    } else {
      if (results.length === 0) {
        console.log('A tabela Pacientes não existe. Criando tabela...');
        try {
          await connection.promise().query(`
            CREATE TABLE Pacientes (
              id INT AUTO_INCREMENT PRIMARY KEY,
              nome VARCHAR(100) NOT NULL,
              telefone VARCHAR(20),
              email VARCHAR(100),
              historico TEXT
            )
          `);
          console.log('Tabela Pacientes criada com sucesso!');
          
          // Inserir dados de exemplo
          await connection.promise().query(`
            INSERT INTO Pacientes (nome, telefone, email, historico) VALUES
            ('João Silva', '(11) 99999-9999', 'joao@email.com', 'Paciente com dor lombar'),
            ('Maria Santos', '(11) 98888-8888', 'maria@email.com', 'Paciente com lesão no ombro'),
            ('Pedro Oliveira', '(11) 97777-7777', 'pedro@email.com', 'Paciente em recuperação pós-cirúrgica')
          `);
          console.log('Dados de exemplo inseridos com sucesso!');
        } catch (error) {
          console.error('Erro ao criar tabela ou inserir dados:', error);
        }
      } else {
        console.log('Tabela Pacientes existe.');
      }
    }
    connection.release();
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota para listar todos os serviços
app.get('/api/servicos', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Servicos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

// Rota para listar todos os profissionais
app.get('/api/profissionais', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Profissionais');
    console.log(`Encontrados ${rows.length} profissionais`);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    res.status(500).json({ error: 'Erro ao buscar profissionais' });
  }
});

// Rota para buscar um serviço específico por ID
app.get('/api/servicos/:id', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Servicos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
});

// Rota para criar um novo serviço
app.post('/api/servicos', (req, res) => {
  const { nome, duracao, preco } = req.body;
  
  if (!nome || !duracao || !preco) {
    res.status(400).json({ error: 'Nome, duração e preço são obrigatórios' });
    return;
  }

  pool.query(
    'INSERT INTO Servicos (nome, duracao, preco) VALUES (?, ?, ?)',
    [nome, duracao, preco],
    (error, results) => {
      if (error) {
        console.error('Erro ao criar serviço:', error);
        res.status(500).json({ error: 'Erro ao criar serviço' });
        return;
      }
      res.status(201).json({
        id: results.insertId,
        nome,
        duracao,
        preco
      });
    }
  );
});

// Rota para atualizar um serviço
app.put('/api/servicos/:id', (req, res) => {
  const id = req.params.id;
  const { nome, duracao, preco } = req.body;

  if (!nome || !duracao || !preco) {
    res.status(400).json({ error: 'Nome, duração e preço são obrigatórios' });
    return;
  }

  pool.query(
    'UPDATE servicos SET nome = ?, duracao = ?, preco = ? WHERE id = ?',
    [nome, duracao, preco, id],
    (error, results) => {
      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        res.status(500).json({ error: 'Erro ao atualizar serviço' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Serviço não encontrado' });
        return;
      }
      res.json({
        id,
        nome,
        duracao,
        preco
      });
    }
  );
});

// Rota para deletar um serviço
app.delete('/api/servicos/:id', (req, res) => {
  const id = req.params.id;
  
  pool.query('DELETE FROM servicos WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Erro ao deletar serviço:', error);
      res.status(500).json({ error: 'Erro ao deletar serviço' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Serviço não encontrado' });
      return;
    }
    res.status(204).send();
  });
});

// Rota para obter todos os pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
    console.log('Iniciando busca de pacientes...');
    const [pacientes] = await pool.promise().query('SELECT * FROM Pacientes');
    console.log('Resultado da consulta:', pacientes);
    console.log('Número de pacientes encontrados:', pacientes.length);
    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

// Rota para obter todos os horários
app.get('/api/horarios', async (req, res) => {
  try {
    const [horarios] = await pool.promise().query(`
      SELECT h.*, p.nome as nome_profissional 
      FROM HorariosDisponiveis h
      LEFT JOIN Profissionais p ON h.profissional_id = p.id
    `);
    console.log('Horários encontrados:', horarios.length);
    res.json(horarios);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: 'Erro ao buscar horários' });
  }
});

// Rota para adicionar/atualizar paciente
app.post('/api/pacientes', async (req, res) => {
  try {
    const { nome, telefone, email, historico } = req.body;
    const [result] = await pool.promise().query(
      'INSERT INTO Pacientes (nome, telefone, email, historico) VALUES (?, ?, ?, ?)',
      [nome, telefone, email, historico]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Erro ao adicionar paciente:', error);
    res.status(500).json({ error: 'Erro ao adicionar paciente' });
  }
});

app.put('/api/pacientes', async (req, res) => {
  try {
    const { id, nome, telefone, email, historico } = req.body;
    await pool.promise().query(
      'UPDATE Pacientes SET nome = ?, telefone = ?, email = ?, historico = ? WHERE id = ?',
      [nome, telefone, email, historico, id]
    );
    res.json(req.body);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
});

// Rota para adicionar/atualizar horário
app.post('/api/horarios', async (req, res) => {
  try {
    const { data, hora, profissional_id } = req.body;
    const [result] = await pool.promise().query(
      'INSERT INTO HorariosDisponiveis (data, hora, profissional_id) VALUES (?, ?, ?)',
      [data, hora, profissional_id]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Erro ao adicionar horário:', error);
    res.status(500).json({ error: 'Erro ao adicionar horário' });
  }
});

app.put('/api/horarios', async (req, res) => {
  try {
    const { id, data, hora, profissional_id } = req.body;
    await pool.promise().query(
      'UPDATE HorariosDisponiveis SET data = ?, hora = ?, profissional_id = ? WHERE id = ?',
      [data, hora, profissional_id, id]
    );
    res.json(req.body);
  } catch (error) {
    console.error('Erro ao atualizar horário:', error);
    res.status(500).json({ error: 'Erro ao atualizar horário' });
  }
});

// Rota para excluir paciente
app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    await pool.promise().query('DELETE FROM Pacientes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Paciente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    res.status(500).json({ error: 'Erro ao excluir paciente' });
  }
});

// Rota para excluir horário
app.delete('/api/horarios/:id', async (req, res) => {
  try {
    await pool.promise().query('DELETE FROM HorariosDisponiveis WHERE id = ?', [req.params.id]);
    res.json({ message: 'Horário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
    res.status(500).json({ error: 'Erro ao excluir horário' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse http://localhost:${port}/api/servicos para ver os serviços`);
});