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

      <div class="form-group">
        <label for="nome">Nome Completo</label>
        <input 
          type="text" 
          id="nome" 
          v-model="formData.nome" 
          required
          placeholder="Digite seu nome completo"
        >
      </div>

      <div class="form-group">
        <label for="telefone">Telefone</label>
        <input 
          type="tel" 
          id="telefone" 
          v-model="formData.telefone" 
          required
          placeholder="(00) 00000-0000"
        >
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
          placeholder="seu@email.com"
        >
      </div>

      <div class="form-group">
        <label for="historico">Histórico Médico</label>
        <textarea 
          id="historico" 
          v-model="formData.historico" 
          placeholder="Descreva seu histórico médico e motivo da consulta"
        ></textarea>
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
        nome: '',
        telefone: '',
        email: '',
        historico: ''
      },
      profissionais: [],
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
  async created() {
    await this.carregarProfissionais();
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
    async agendarConsulta() {
      this.enviando = true;
      this.mensagem = null;

      try {
        // Primeiro, cadastra o paciente
        const pacienteResponse = await fetch('http://localhost:3000/api/pacientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: this.formData.nome,
            telefone: this.formData.telefone,
            email: this.formData.email,
            historico: this.formData.historico
          })
        });

        if (!pacienteResponse.ok) {
          throw new Error('Erro ao cadastrar paciente');
        }

        // Depois, agenda o horário
        const horarioResponse = await fetch('http://localhost:3000/api/horarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: this.formData.data,
            hora: this.formData.hora,
            profissional_id: this.formData.profissional_id
          })
        });

        if (!horarioResponse.ok) {
          throw new Error('Erro ao agendar horário');
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
          nome: '',
          telefone: '',
          email: '',
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
          texto: 'Erro ao realizar agendamento. Por favor, tente novamente.'
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