const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Configurações do CORS - Ajustado para desenvolvimento
app.use(cors({
  origin: '*', // Permite todas as origens durante desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuração do body-parser
app.use(bodyParser.json());

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

// Teste de conexão e log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Teste de conexão com o banco de dados
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
  connection.release();
});

// Rotas para Serviços
app.get('/api/servicos', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Servicos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

// Rotas para Profissionais
app.get('/api/profissionais', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM Profissionais');
    res.json(rows);
  } catch (error) {
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
    const [pacientes] = await pool.promise().query('SELECT * FROM Pacientes');
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
});

// Rota para obter um paciente específico por ID
app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const [pacientes] = await pool.promise().query(
      'SELECT * FROM Pacientes WHERE id = ?',
      [req.params.id]
    );
    
    if (pacientes.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    res.json(pacientes[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar paciente' });
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
    res.json(horarios);
  } catch (error) {
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
    const { data, hora, profissional_id, paciente_id } = req.body;
    const [result] = await pool.promise().query(
      'INSERT INTO HorariosDisponiveis (data, hora, profissional_id, paciente_id) VALUES (?, ?, ?, ?)',
      [data, hora, profissional_id, paciente_id]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
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
    res.status(500).json({ error: 'Erro ao excluir paciente' });
  }
});

// Rota para excluir horário
app.delete('/api/horarios/:id', async (req, res) => {
  try {
    await pool.promise().query('DELETE FROM HorariosDisponiveis WHERE id = ?', [req.params.id]);
    res.json({ message: 'Horário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir horário' });
  }
});

// Rota para adicionar/atualizar profissional
app.post('/api/profissionais', async (req, res) => {
  try {
    const { nome, especialidade } = req.body;
    const [result] = await pool.promise().query(
      'INSERT INTO Profissionais (nome, especialidade) VALUES (?, ?)',
      [nome, especialidade]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar profissional' });
  }
});

app.put('/api/profissionais', async (req, res) => {
  try {
    const { id, nome, especialidade } = req.body;
    await pool.promise().query(
      'UPDATE Profissionais SET nome = ?, especialidade = ? WHERE id = ?',
      [nome, especialidade, id]
    );
    res.json(req.body);
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    res.status(500).json({ error: 'Erro ao atualizar profissional' });
  }
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar admin
    const [admins] = await pool.promise().query(
      'SELECT * FROM Admins WHERE email = ?',
      [email]
    );

    if (admins.length > 0) {
      const admin = admins[0];
      const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
      
      if (senhaValida) {
        const token = jwt.sign(
          { id: admin.id, email: admin.email, tipo: 'admin' },
          'sua_chave_secreta',
          { expiresIn: '24h' }
        );
        return res.json({ 
          token,
          user: {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            tipo: 'admin'
          }
        });
      }
    }

    // Buscar paciente
    const [pacientes] = await pool.promise().query(
      'SELECT * FROM Pacientes WHERE email = ?',
      [email]
    );

    if (pacientes.length > 0) {
      const paciente = pacientes[0];
      const senhaValida = await bcrypt.compare(senha, paciente.senha_hash);
      
      if (senhaValida) {
        const token = jwt.sign(
          { id: paciente.id, email: paciente.email, tipo: 'paciente' },
          'sua_chave_secreta',
          { expiresIn: '24h' }
        );
        return res.json({ 
          token,
          user: {
            id: paciente.id,
            nome: paciente.nome,
            email: paciente.email,
            tipo: 'paciente'
          }
        });
      }
    }

    // Se chegou aqui, as credenciais são inválidas
    return res.status(401).json({ error: 'Credenciais inválidas' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, 'sua_chave_secreta');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rota protegida para administradores
app.get('/api/admin/dashboard', verificarToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  res.json({ message: 'Bem-vindo ao painel administrativo' });
});

// Rota de cadastro para pacientes
app.post('/api/pacientes/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    // Verificar se o email já está cadastrado
    const [pacientes] = await pool.promise().query(
      'SELECT * FROM Pacientes WHERE email = ?',
      [email]
    );

    if (pacientes.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir novo paciente
    const [result] = await pool.promise().query(
      'INSERT INTO Pacientes (nome, email, senha_hash, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, telefone]
    );

    res.status(201).json({
      message: 'Paciente cadastrado com sucesso',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar um novo agendamento
app.post('/api/agendamentos', async (req, res) => {
  try {
    const { paciente_id, profissional_id, servico_id, data, hora, observacoes } = req.body;
    
    console.log('Dados recebidos:', req.body);
    
    // Verificar se os dados necessários estão presentes
    if (!paciente_id || !profissional_id || !servico_id || !data || !hora) {
      return res.status(400).json({ 
        error: 'Dados incompletos para o agendamento',
        received: req.body
      });
    }

    // Iniciar transação
    await pool.promise().query('START TRANSACTION');

    try {
      // Criar o horário disponível
      const [horarioResult] = await pool.promise().query(
        'INSERT INTO HorariosDisponiveis (data, hora, profissional_id, disponivel) VALUES (?, ?, ?, false)',
        [data, hora, profissional_id]
      );

      // Criar o agendamento
      const [result] = await pool.promise().query(
        'INSERT INTO Agendamentos (paciente_id, profissional_id, servico_id, horario_id, status, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
        [paciente_id, profissional_id, servico_id, horarioResult.insertId, 'agendado', observacoes || '']
      );

      // Confirmar transação
      await pool.promise().query('COMMIT');

      // Buscar o agendamento criado com todas as informações
      const [agendamentoCriado] = await pool.promise().query(`
        SELECT 
          a.id,
          a.status,
          a.observacoes,
          a.criado_em,
          p.nome as nome_paciente,
          pr.nome as nome_profissional,
          s.nome as nome_servico,
          h.data,
          h.hora
        FROM Agendamentos a
        JOIN Pacientes p ON a.paciente_id = p.id
        JOIN Profissionais pr ON a.profissional_id = pr.id
        JOIN Servicos s ON a.servico_id = s.id
        JOIN HorariosDisponiveis h ON a.horario_id = h.id
        WHERE a.id = ?
      `, [result.insertId]);

      if (agendamentoCriado.length === 0) {
        throw new Error('Falha ao verificar o agendamento criado');
      }

      // Formatar a data e hora
      const agendamentoFormatado = {
        ...agendamentoCriado[0],
        data_hora: `${agendamentoCriado[0].data} ${agendamentoCriado[0].hora}`
      };

      res.status(201).json(agendamentoFormatado);
    } catch (error) {
      // Em caso de erro, desfazer a transação
      await pool.promise().query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ 
      error: 'Erro ao criar agendamento', 
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
});

// Rota para atualizar um agendamento
app.put('/api/agendamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacoes } = req.body;
    
    // Validar o status
    if (status && !['agendado', 'concluído', 'cancelado'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido',
        details: 'O status deve ser um dos seguintes: agendado, concluído, cancelado'
      });
    }
    
    console.log('Atualizando agendamento:', { id, status, observacoes });
    
    // Iniciar transação
    await pool.promise().query('START TRANSACTION');

    try {
      // Atualizar o agendamento
      await pool.promise().query(
        'UPDATE Agendamentos SET status = ?, observacoes = ? WHERE id = ?',
        [status, observacoes, id]
      );

      // Se o status for cancelado, liberar o horário
      if (status === 'cancelado') {
        const [agendamento] = await pool.promise().query(
          'SELECT horario_id FROM Agendamentos WHERE id = ?',
          [id]
        );

        if (agendamento.length > 0) {
          await pool.promise().query(
            'UPDATE HorariosDisponiveis SET disponivel = true WHERE id = ?',
            [agendamento[0].horario_id]
          );
        }
      }

      // Confirmar transação
      await pool.promise().query('COMMIT');

      // Buscar o agendamento atualizado
      const [agendamentoAtualizado] = await pool.promise().query(`
        SELECT 
          a.id,
          a.status,
          a.observacoes,
          a.criado_em,
          p.nome as nome_paciente,
          pr.nome as nome_profissional,
          s.nome as nome_servico,
          h.data,
          h.hora
        FROM Agendamentos a
        JOIN Pacientes p ON a.paciente_id = p.id
        JOIN Profissionais pr ON a.profissional_id = pr.id
        JOIN Servicos s ON a.servico_id = s.id
        JOIN HorariosDisponiveis h ON a.horario_id = h.id
        WHERE a.id = ?
      `, [id]);

      if (agendamentoAtualizado.length === 0) {
        throw new Error('Falha ao verificar o agendamento atualizado');
      }

      // Formatar a data e hora
      const agendamentoFormatado = {
        ...agendamentoAtualizado[0],
        data_hora: `${agendamentoAtualizado[0].data} ${agendamentoAtualizado[0].hora}`
      };

      res.json(agendamentoFormatado);
    } catch (error) {
      // Em caso de erro, desfazer a transação
      await pool.promise().query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar agendamento',
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
});

app.get('/api/agendamentos', async (req, res) => {
  try {
    console.log('Buscando agendamentos...');
    const [agendamentos] = await pool.promise().query(`
      SELECT 
        a.id,
        a.status,
        a.observacoes,
        a.criado_em,
        p.nome as nome_paciente,
        pr.nome as nome_profissional,
        s.nome as nome_servico,
        h.data,
        h.hora
      FROM Agendamentos a
      JOIN Pacientes p ON a.paciente_id = p.id
      JOIN Profissionais pr ON a.profissional_id = pr.id
      JOIN Servicos s ON a.servico_id = s.id
      JOIN HorariosDisponiveis h ON a.horario_id = h.id
      ORDER BY h.data DESC, h.hora DESC
    `);
    
    // Formatar a data e hora para o frontend
    const agendamentosFormatados = agendamentos.map(agendamento => ({
      ...agendamento,
      data_hora: `${agendamento.data} ${agendamento.hora}`
    }));
    
    console.log('Agendamentos encontrados:', agendamentosFormatados);
    res.json(agendamentosFormatados);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar agendamentos',
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
});

app.get('/api/agendamentos/paciente/:id', async (req, res) => {
  try {
    const [agendamentos] = await pool.promise().query(`
      SELECT 
        a.*,
        p.nome as nome_paciente,
        pr.nome as nome_profissional
      FROM Agendamentos a
      JOIN Pacientes p ON a.paciente_id = p.id
      JOIN Profissionais pr ON a.profissional_id = pr.id
      WHERE a.paciente_id = ?
      ORDER BY a.data, a.hora
    `, [req.params.id]);
    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos do paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos do paciente' });
  }
});

app.delete('/api/agendamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Cancelando agendamento:', id);
    
    // Primeiro, obtém o horário_id do agendamento
    const [agendamento] = await pool.promise().query(
      'SELECT horario_id FROM Agendamentos WHERE id = ?',
      [id]
    );
    
    if (!agendamento.length) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    const horarioId = agendamento[0].horario_id;
    
    // Inicia uma transação
    await pool.promise().query('START TRANSACTION');
    
    try {
      // Atualiza o status do agendamento para cancelado
      await pool.promise().query(
        'UPDATE Agendamentos SET status = "cancelado" WHERE id = ?',
        [id]
      );
      
      // Libera o horário
      await pool.promise().query(
        'UPDATE HorariosDisponiveis SET disponivel = true WHERE id = ?',
        [horarioId]
      );
      
      // Confirma a transação
      await pool.promise().query('COMMIT');
      
      res.json({ message: 'Agendamento cancelado com sucesso' });
    } catch (error) {
      // Em caso de erro, desfaz a transação
      await pool.promise().query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
});

// Rota para verificar estrutura da tabela Admins
app.get('/api/admin/check', async (req, res) => {
  try {
    const [tables] = await pool.promise().query('SHOW TABLES LIKE "Admins"');
    if (tables.length === 0) {
      return res.json({ exists: false, message: 'Tabela Admins não existe' });
    }

    const [columns] = await pool.promise().query('DESCRIBE Admins');
    const [admins] = await pool.promise().query('SELECT * FROM Admins');

    res.json({
      exists: true,
      columns,
      admins
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar tabela Admins' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});