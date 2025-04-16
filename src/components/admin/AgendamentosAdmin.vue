<template>
  <div class="agendamentos-admin">
    <div class="header">
      <h2>Gerenciar Agendamentos</h2>
      <button class="btn-add" @click="abrirModalNovoAgendamento">
        <i class="fas fa-plus"></i> Novo Agendamento
      </button>
    </div>
    
    <div class="filtros">
      <div class="form-group">
        <label for="status">Filtrar por Status</label>
        <select id="status" v-model="filtroStatus">
          <option value="">Todos</option>
          <option value="agendado">Agendado</option>
          <option value="concluído">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="busca">Buscar por Paciente</label>
        <input type="text" id="busca" v-model="buscaPaciente" placeholder="Nome do paciente">
      </div>
    </div>

    <div class="agendamentos-list">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Profissional</th>
            <th>Serviço</th>
            <th>Data/Hora</th>
            <th>Status</th>
            <th>Observações</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agendamento in agendamentosFiltrados" :key="agendamento.id">
            <td>{{ agendamento.nome_paciente }}</td>
            <td>{{ agendamento.nome_profissional }}</td>
            <td>{{ agendamento.nome_servico }}</td>
            <td>{{ formatarDataHora(agendamento.data_hora) }}</td>
            <td>
              <select v-model="agendamento.status" @change="atualizarStatus(agendamento)">
                <option value="agendado">Agendado</option>
                <option value="concluído">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </td>
            <td>
              <textarea 
                v-model="agendamento.observacoes" 
                @blur="atualizarObservacoes(agendamento)"
                rows="2"
              ></textarea>
            </td>
            <td>{{ formatarData(agendamento.criado_em) }}</td>
            <td>
              <button 
                @click="cancelarAgendamento(agendamento.id)" 
                class="btn-delete"
                :disabled="agendamento.status === 'cancelado'"
              >
                Cancelar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Novo Agendamento -->
    <div v-if="mostrarModalNovoAgendamento" class="modal">
      <div class="modal-content">
        <h3>Novo Agendamento</h3>
        <form @submit.prevent="criarAgendamento">
          <div class="form-group">
            <label for="paciente">Paciente</label>
            <select id="paciente" v-model="novoAgendamento.paciente_id" required>
              <option value="">Selecione um paciente</option>
              <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
                {{ paciente.nome }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="profissional">Profissional</label>
            <select id="profissional" v-model="novoAgendamento.profissional_id" required>
              <option value="">Selecione um profissional</option>
              <option v-for="profissional in profissionais" :key="profissional.id" :value="profissional.id">
                {{ profissional.nome }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="servico">Serviço</label>
            <select id="servico" v-model="novoAgendamento.servico_id" required>
              <option value="">Selecione um serviço</option>
              <option v-for="servico in servicos" :key="servico.id" :value="servico.id">
                {{ servico.nome }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="data">Data</label>
            <input type="date" id="data" v-model="novoAgendamento.data" required>
          </div>

          <div class="form-group">
            <label for="hora">Hora</label>
            <input type="time" id="hora" v-model="novoAgendamento.hora" required>
          </div>

          <div class="form-group">
            <label for="observacoes">Observações</label>
            <textarea id="observacoes" v-model="novoAgendamento.observacoes" rows="3"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="fecharModalNovoAgendamento">Cancelar</button>
            <button type="submit" class="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgendamentosAdmin',
  data() {
    return {
      agendamentos: [],
      filtroStatus: '',
      buscaPaciente: '',
      mostrarModalNovoAgendamento: false,
      pacientes: [],
      profissionais: [],
      servicos: [],
      novoAgendamento: {
        paciente_id: '',
        profissional_id: '',
        servico_id: '',
        data: '',
        hora: '',
        observacoes: ''
      }
    }
  },
  computed: {
    agendamentosFiltrados() {
      return this.agendamentos.filter(agendamento => {
        const statusMatch = !this.filtroStatus || agendamento.status === this.filtroStatus
        const nomeMatch = !this.buscaPaciente || 
          agendamento.nome_paciente.toLowerCase().includes(this.buscaPaciente.toLowerCase())
        return statusMatch && nomeMatch
      })
    }
  },
  created() {
    this.carregarAgendamentos()
  },
  methods: {
    async carregarAgendamentos() {
      try {
        const response = await fetch('http://localhost:3000/api/agendamentos')
        if (!response.ok) throw new Error('Erro ao carregar agendamentos')
        this.agendamentos = await response.json()
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
        alert('Erro ao carregar agendamentos. Por favor, tente novamente.')
      }
    },
    formatarDataHora(dataHora) {
      if (!dataHora) return '';
      const [data, hora] = dataHora.split(' ');
      const dataObj = new Date(data);
      return `${dataObj.toLocaleDateString('pt-BR')} ${hora}`;
    },
    formatarData(data) {
      if (!data) return '';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    },
    async atualizarStatus(agendamento) {
      try {
        const response = await fetch(`http://localhost:3000/api/agendamentos/${agendamento.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: agendamento.status,
            observacoes: agendamento.observacoes
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Erro ao atualizar status');
        }
        
        const agendamentoAtualizado = await response.json();
        
        // Atualizar o agendamento na lista
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        
        alert('Status atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status: ' + error.message);
        // Recarrega os dados para garantir consistência
        this.carregarAgendamentos();
      }
    },
    async atualizarObservacoes(agendamento) {
      try {
        const response = await fetch(`http://localhost:3000/api/agendamentos/${agendamento.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: agendamento.status,
            observacoes: agendamento.observacoes
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Erro ao atualizar observações');
        }
        
        const agendamentoAtualizado = await response.json();
        
        // Atualizar o agendamento na lista
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        
        alert('Observações atualizadas com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar observações:', error);
        alert('Erro ao atualizar observações: ' + error.message);
        // Recarrega os dados para garantir consistência
        this.carregarAgendamentos();
      }
    },
    async cancelarAgendamento(id) {
      if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/agendamentos/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Erro ao cancelar agendamento');
        }
        
        // Atualizar o status do agendamento na lista
        const index = this.agendamentos.findIndex(a => a.id === id);
        if (index !== -1) {
          this.agendamentos[index].status = 'cancelado';
        }
        
        alert('Agendamento cancelado com sucesso!');
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        alert('Erro ao cancelar agendamento: ' + error.message);
        // Recarrega os dados para garantir consistência
        this.carregarAgendamentos();
      }
    },
    async abrirModalNovoAgendamento() {
      try {
        // Carregar dados necessários
        const [pacientesRes, profissionaisRes, servicosRes] = await Promise.all([
          fetch('http://localhost:3000/api/pacientes'),
          fetch('http://localhost:3000/api/profissionais'),
          fetch('http://localhost:3000/api/servicos')
        ]);

        if (!pacientesRes.ok || !profissionaisRes.ok || !servicosRes.ok) {
          throw new Error('Erro ao carregar dados');
        }

        this.pacientes = await pacientesRes.json();
        this.profissionais = await profissionaisRes.json();
        this.servicos = await servicosRes.json();

        this.mostrarModalNovoAgendamento = true;
      } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
      }
    },
    fecharModalNovoAgendamento() {
      this.mostrarModalNovoAgendamento = false;
      this.novoAgendamento = {
        paciente_id: '',
        profissional_id: '',
        servico_id: '',
        data: '',
        hora: '',
        observacoes: ''
      };
    },
    async criarAgendamento() {
      try {
        const response = await fetch('http://localhost:3000/api/agendamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.novoAgendamento)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Erro ao criar agendamento');
        }

        const novoAgendamento = await response.json();
        this.agendamentos.unshift(novoAgendamento);
        this.fecharModalNovoAgendamento();
        alert('Agendamento criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        alert('Erro ao criar agendamento: ' + error.message);
      }
    }
  }
}
</script>

<style scoped>
.agendamentos-admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-add {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add:hover {
  background-color: #218838;
}

.filtros {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

select, input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.agendamentos-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  color: #2c3e50;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-save:hover {
  background-color: #218838;
}
</style> 