<template>
  <div class="agendamento-container">
    <h1>Agendar Consulta</h1>
    
    <form @submit.prevent="agendarConsulta" class="agendamento-form">
      <div class="form-group">
        <label for="data">Data</label>
        <input 
          type="date" 
          id="data" 
          v-model="formData.data" 
          required
          :min="minDate"
        >
      </div>

      <div class="form-group">
        <label for="hora">Hora</label>
        <input 
          type="time" 
          id="hora" 
          v-model="formData.hora" 
          required
          min="08:00"
          max="18:00"
          step="1800"
        >
      </div>

      <div class="form-group">
        <label for="profissional">Profissional</label>
        <select 
          id="profissional" 
          v-model="formData.profissional_id" 
          required
        >
          <option value="">Selecione um profissional</option>
          <option 
            v-for="profissional in profissionais" 
            :key="profissional.id" 
            :value="profissional.id"
          >
            {{ profissional.nome }} - {{ profissional.especialidade }}
          </option>
        </select>
      </div>

      <button type="submit" class="submit-button" :disabled="enviando">
        {{ enviando ? 'Agendando...' : 'Confirmar Agendamento' }}
      </button>

      <div v-if="mensagem" :class="['mensagem', mensagem.tipo]">
        {{ mensagem.texto }}
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Agendamento',
  data() {
    return {
      formData: {
        data: '',
        hora: '',
        profissional_id: '',
        paciente_id: '',
        nome: '',
        telefone: '',
        email: '',
        historico: ''
      },
      profissionais: [],
      horarios: [],
      enviando: false,
      mensagem: null
    }
  },
  computed: {
    minDate() {
      const hoje = new Date();
      return hoje.toISOString().split('T')[0];
    }
  },
  created() {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }

    // Carregar dados do usuário logado
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.formData.paciente_id = userData.id;
      this.formData.nome = userData.nome;
      this.formData.email = userData.email;
      this.formData.telefone = userData.telefone;
    }

    this.carregarProfissionais();
    this.carregarHorarios();
  },
  methods: {
    async carregarProfissionais() {
      try {
        const response = await fetch('http://localhost:3000/api/profissionais');
        if (!response.ok) throw new Error('Erro ao carregar profissionais');
        this.profissionais = await response.json();
      } catch (error) {
        console.error('Erro:', error);
        this.mensagem = {
          tipo: 'erro',
          texto: 'Erro ao carregar profissionais. Por favor, tente novamente.'
        };
      }
    },
    async carregarHorarios() {
      try {
        const response = await fetch('http://localhost:3000/api/horarios');
        if (!response.ok) throw new Error('Erro ao carregar horários');
        this.horarios = await response.json();
      } catch (error) {
        console.error('Erro:', error);
        this.mensagem = {
          tipo: 'erro',
          texto: 'Erro ao carregar horários disponíveis. Por favor, tente novamente.'
        };
      }
    },
    async agendarConsulta() {
      this.enviando = true;
      this.mensagem = null;

      try {
        // Buscar o histórico do paciente
        const pacienteResponse = await fetch(`http://localhost:3000/api/pacientes/${this.formData.paciente_id}`);
        if (!pacienteResponse.ok) {
          if (pacienteResponse.status === 404) {
            throw new Error('Paciente não encontrado. Por favor, faça login novamente.');
          }
          throw new Error('Erro ao buscar dados do paciente');
        }
        const pacienteData = await pacienteResponse.json();

        // Criar o agendamento
        const agendamentoResponse = await fetch('http://localhost:3000/api/agendamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            paciente_id: this.formData.paciente_id,
            profissional_id: this.formData.profissional_id,
            data: this.formData.data,
            hora: this.formData.hora,
            historico: pacienteData.historico || ''
          })
        });

        if (!agendamentoResponse.ok) {
          const errorData = await agendamentoResponse.json();
          throw new Error(errorData.details || 'Erro ao criar agendamento');
        }

        this.mensagem = {
          tipo: 'sucesso',
          texto: 'Agendamento realizado com sucesso! Entraremos em contato em breve.'
        };

        // Limpar formulário
        this.formData = {
          data: '',
          hora: '',
          profissional_id: '',
          paciente_id: this.formData.paciente_id,
          nome: this.formData.nome,
          telefone: this.formData.telefone,
          email: this.formData.email,
          historico: ''
        };

        // Redirecionar para a página inicial após 2 segundos
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Erro:', error);
        this.mensagem = {
          tipo: 'erro',
          texto: error.message || 'Erro ao realizar agendamento. Por favor, tente novamente.'
        };
      } finally {
        this.enviando = false;
      }
    }
  }
}
</script>

<style scoped>
.agendamento-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.agendamento-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #2c3e50;
}

input, select, textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3aa876;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.mensagem {
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  margin-top: 1rem;
}

.sucesso {
  background-color: #d4edda;
  color: #155724;
}

.erro {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .agendamento-container {
    margin: 1rem;
    padding: 1rem;
  }
}
</style> 