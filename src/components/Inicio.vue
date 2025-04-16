<template>
  <div class="inicio-page">
    <section class="hero">
      <div class="hero-content">
        <h1>Bem-vindo à FisioVital</h1>
        <p class="hero-subtitle">Sua saúde em primeiro lugar</p>
        <button @click="handleAgendamento" class="btn-agendar">
          Agende sua consulta
        </button>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Por que escolher a FisioVital?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="feature-icon">👨‍⚕️</i>
            <h3>Profissionais Qualificados</h3>
            <p>Equipe especializada e atualizada com as melhores práticas da fisioterapia.</p>
          </div>
          <div class="feature-card">
            <i class="feature-icon">🏥</i>
            <h3>Estrutura Moderna</h3>
            <p>Ambiente climatizado e equipamentos de última geração para seu conforto.</p>
          </div>
          <div class="feature-card">
            <i class="feature-icon">⏱️</i>
            <h3>Atendimento Personalizado</h3>
            <p>Tratamentos individualizados de acordo com suas necessidades.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="servicos">
      <div class="container">
        <h2>Nossos Serviços Principais</h2>
        <div class="servicos-grid">
          <div class="servico-card">
            <div class="servico-imagem ortopedica"></div>
            <div class="servico-content">
              <h3>Fisioterapia Ortopédica</h3>
              <p>Tratamento especializado para lesões musculoesqueléticas.</p>
            </div>
          </div>
          <div class="servico-card">
            <div class="servico-imagem esportiva"></div>
            <div class="servico-content">
              <h3>Fisioterapia Esportiva</h3>
              <p>Prevenção e tratamento de lesões esportivas.</p>
            </div>
          </div>
          <div class="servico-card">
            <div class="servico-imagem cirurgica"></div>
            <div class="servico-content">
              <h3>Reabilitação Pós-Cirúrgica</h3>
              <p>Recuperação personalizada após procedimentos cirúrgicos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="profissionais">
      <div class="container">
        <h2>Nossa Equipe</h2>
        
        <!-- Loading -->
        <div v-if="carregando" class="loading-mensagem">
          Carregando profissionais...
        </div>

        <!-- Erro -->
        <div v-if="erro" class="erro-mensagem">
          {{ erro }}
        </div>

        <!-- Tabela de Profissionais -->
        <div v-if="!carregando && !erro" class="table-container">
          <table class="profissionais-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Especialidade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="profissional in profissionais" :key="profissional.id">
                <td>{{ profissional.nome }}</td>
                <td>{{ profissional.especialidade }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Inicio',
  data() {
    return {
      profissionais: [],
      carregando: false,
      erro: null
    }
  },
  methods: {
    async carregarProfissionais() {
      this.carregando = true;
      this.erro = null;

      try {
        const response = await fetch('http://localhost:3000/api/profissionais');
        if (!response.ok) {
          throw new Error('Erro ao carregar profissionais');
        }
        const data = await response.json();
        this.profissionais = data;
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
        this.erro = 'Erro ao carregar profissionais. Por favor, tente novamente mais tarde.';
      } finally {
        this.carregando = false;
      }
    },
    handleAgendamento() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
      } else {
        this.$router.push('/agendamento');
      }
    }
  },
  created() {
    this.carregarProfissionais();
  }
}
</script>

<style scoped>
.inicio-page {
  width: 100%;
}

.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-agendar {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.btn-agendar:hover {
  background-color: #218838;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features {
  padding: 4rem 0;
  background-color: white;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.profissionais {
  padding: 4rem 0;
  background-color: #f8f9fa;
}

.profissionais h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.table-container {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.profissionais-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.profissionais-table th,
.profissionais-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.profissionais-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.profissionais-table tr:hover {
  background-color: #f8f9fa;
}

.loading-mensagem {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
}

.erro-mensagem {
  background-color: #fee;
  color: #c00;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 5px;
  text-align: center;
}

.servicos {
  padding: 4rem 0;
  background-color: #f5f5f5;
}

.servicos h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
}

.servicos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.servico-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.servico-card:hover {
  transform: translateY(-5px);
}

.servico-imagem {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.ortopedica {
  background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
}

.esportiva {
  background-image: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
}

.cirurgica {
  background-image: url('https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80');
}

.servico-content {
  padding: 1.5rem;
}

.servico-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.servico-content p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .features {
    padding: 2rem 0;
  }

  .features h2,
  .servicos h2,
  .profissionais h2 {
    font-size: 2rem;
  }

  .container {
    padding: 0 1rem;
  }

  .table-container {
    padding: 1rem;
  }

  .profissionais-table th,
  .profissionais-table td {
    padding: 0.75rem;
  }
}
</style>
