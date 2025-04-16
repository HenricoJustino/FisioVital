<template>
  <div class="servicos-page">
    <section class="servicos-hero">
      <div class="container">
        <h1>Nossos Serviços</h1>
        <p>Conheça nossos tratamentos especializados</p>
      </div>
    </section>

    <section class="servicos-content">
      <div class="container">
        <!-- Mensagem de erro -->
        <div v-if="erro" class="erro-mensagem">
          {{ erro }}
        </div>

        <!-- Loading -->
        <div v-if="carregando" class="loading-mensagem">
          Carregando serviços...
        </div>

        <!-- Conteúdo -->
        <template v-if="!carregando && !erro">
          <div v-if="servicos.length === 0" class="sem-servicos">
            Nenhum serviço cadastrado.
          </div>

          <div v-else>
            <div class="table-container">
              <table class="servicos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Serviço</th>
                    <th>Duração (min)</th>
                    <th>Preço (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="servico in servicos" :key="servico.id">
                    <td>{{ servico.id }}</td>
                    <td>{{ servico.nome }}</td>
                    <td>{{ servico.duracao }}</td>
                    <td>R$ {{ formatarPreco(servico.preco) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Servicos',
  data() {
    return {
      servicos: [],
      carregando: false,
      erro: null
    }
  },
  methods: {
    formatarPreco(preco) {
      return preco ? Number(preco).toFixed(2) : '0.00';
    },
    async carregarServicos() {
      this.carregando = true;
      this.erro = null;

      try {
        const response = await fetch('http://localhost:3000/api/servicos');
        if (!response.ok) {
          throw new Error('Erro ao carregar serviços');
        }
        const data = await response.json();
        this.servicos = data;
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        this.erro = 'Erro ao carregar serviços. Por favor, tente novamente mais tarde.';
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
    this.carregarServicos();
  }
}
</script>

<style scoped>
.servicos-page {
  width: 100%;
}

.servicos-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  padding: 6rem 2rem;
  text-align: center;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.servicos-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.servicos-hero p {
  font-size: 1.5rem;
  opacity: 0.9;
}

.servicos-content {
  padding: 4rem 2rem;
  background-color: #f5f5f5;
}

.table-container {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 4rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.servicos-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.servicos-table th,
.servicos-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.servicos-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.servicos-table tr:hover {
  background-color: #f8f9fa;
}

.btn-agendar {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-agendar:hover {
  background-color: #3aa876;
}

.erro-mensagem {
  background-color: #fee;
  color: #c00;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 5px;
  text-align: center;
}

.loading-mensagem {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
}

.sem-servicos {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.debug-info {
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  font-family: monospace;
}

.agendar-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.agendar-button:hover {
  background-color: #3aa876;
}

@media (max-width: 768px) {
  .servicos-hero {
    padding: 4rem 1rem;
  }

  .servicos-hero h1 {
    font-size: 2.5rem;
  }

  .servicos-hero p {
    font-size: 1.2rem;
  }

  .servicos-content {
    padding: 2rem 1rem;
  }

  .table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  .servicos-table {
    font-size: 0.9rem;
  }

  .servicos-table th,
  .servicos-table td {
    padding: 0.75rem;
  }
}
</style> 