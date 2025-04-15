<template>
  <div class="admin-container">
    <h1>Painel de Controle</h1>
    
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Serviços -->
    <div v-if="currentTab === 'servicos'" class="tab-content">
      <h2>Gerenciar Serviços</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Duração (min)</th>
            <th>Preço (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servico in servicos" :key="servico.id">
            <td>{{ servico.id }}</td>
            <td>{{ servico.nome }}</td>
            <td>{{ servico.duracao }}</td>
            <td>R$ {{ Number(servico.preco).toFixed(2) }}</td>
            <td>
              <button @click="editarServico(servico)" class="btn-editar">Editar</button>
              <button @click="excluirServico(servico.id)" class="btn-excluir">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="adicionarServico" class="btn-adicionar">Adicionar Serviço</button>
    </div>

    <!-- Profissionais -->
    <div v-if="currentTab === 'profissionais'" class="tab-content">
      <h2>Gerenciar Profissionais</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="profissional in profissionais" :key="profissional.id">
            <td>{{ profissional.id }}</td>
            <td>{{ profissional.nome }}</td>
            <td>{{ profissional.especialidade }}</td>
            <td>
              <button @click="editarProfissional(profissional)" class="btn-editar">Editar</button>
              <button @click="excluirProfissional(profissional.id)" class="btn-excluir">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="adicionarProfissional" class="btn-adicionar">Adicionar Profissional</button>
    </div>

    <!-- Pacientes -->
    <div v-if="currentTab === 'pacientes'" class="tab-content">
      <h2>Gerenciar Pacientes</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Histórico</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paciente in pacientes" :key="paciente.id">
            <td>{{ paciente.id }}</td>
            <td>{{ paciente.nome }}</td>
            <td>{{ paciente.telefone }}</td>
            <td>{{ paciente.email }}</td>
            <td>{{ paciente.historico }}</td>
            <td>
              <button @click="editarPaciente(paciente)" class="btn-editar">Editar</button>
              <button @click="excluirPaciente(paciente.id)" class="btn-excluir">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="adicionarPaciente" class="btn-adicionar">Adicionar Paciente</button>
    </div>

    <!-- Horários -->
    <div v-if="currentTab === 'horarios'" class="tab-content">
      <h2>Gerenciar Horários</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Profissional</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horario in horarios" :key="horario.id">
            <td>{{ horario.id }}</td>
            <td>{{ formatarData(horario.data) }}</td>
            <td>{{ horario.hora }}</td>
            <td>{{ horario.nome_profissional }}</td>
            <td>
              <button @click="editarHorario(horario)" class="btn-editar">Editar</button>
              <button @click="excluirHorario(horario.id)" class="btn-excluir">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="adicionarHorario" class="btn-adicionar">Adicionar Horário</button>
    </div>

    <!-- Modal de Edição -->
    <div v-if="modalAberto" class="modal">
      <div class="modal-content">
        <h2>{{ modoEdicao ? 'Editar' : 'Adicionar' }} {{ currentTab }}</h2>
        <form @submit.prevent="salvarDados">
          <!-- Campos dinâmicos baseados na aba atual -->
          <div v-for="(campo, index) in camposAtuais" :key="index" class="form-group">
            <label :for="campo.id">{{ campo.label }}</label>
            <input 
              :type="campo.type" 
              :id="campo.id"
              v-model="dadosEditaveis[campo.id]"
              :required="campo.required"
            >
          </div>
          <div class="modal-buttons">
            <button type="submit" class="btn-salvar">Salvar</button>
            <button type="button" @click="fecharModal" class="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      currentTab: 'servicos',
      tabs: [
        { id: 'servicos', name: 'Serviços' },
        { id: 'profissionais', name: 'Profissionais' },
        { id: 'pacientes', name: 'Pacientes' },
        { id: 'horarios', name: 'Horários' }
      ],
      servicos: [],
      profissionais: [],
      pacientes: [],
      horarios: [],
      modalAberto: false,
      modoEdicao: false,
      dadosEditaveis: {},
      camposPorTab: {
        servicos: [
          { id: 'nome', label: 'Nome', type: 'text', required: true },
          { id: 'duracao', label: 'Duração (min)', type: 'number', required: true },
          { id: 'preco', label: 'Preço (R$)', type: 'number', required: true }
        ],
        profissionais: [
          { id: 'nome', label: 'Nome', type: 'text', required: true },
          { id: 'especialidade', label: 'Especialidade', type: 'text', required: true },
          { id: 'crefito', label: 'CREFITO', type: 'text', required: true },
          { id: 'email', label: 'Email', type: 'email', required: true },
          { id: 'telefone', label: 'Telefone', type: 'tel', required: true }
        ],
        pacientes: [
          { id: 'nome', label: 'Nome', type: 'text', required: true },
          { id: 'telefone', label: 'Telefone', type: 'tel', required: true },
          { id: 'email', label: 'Email', type: 'email', required: true },
          { id: 'historico', label: 'Histórico', type: 'text', required: false }
        ],
        horarios: [
          { id: 'data', label: 'Data', type: 'date', required: true },
          { id: 'hora', label: 'Hora', type: 'time', required: true },
          { id: 'profissional_id', label: 'Profissional', type: 'select', required: true }
        ]
      }
    }
  },
  computed: {
    camposAtuais() {
      return this.camposPorTab[this.currentTab] || [];
    }
  },
  methods: {
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR');
    },
    getNomeProfissional(id) {
      const profissional = this.profissionais.find(p => p.id === id);
      return profissional ? profissional.nome : 'N/A';
    },
    async carregarDados() {
      try {
        // Carregar serviços
        const servicosResponse = await fetch('http://localhost:3000/api/servicos');
        this.servicos = await servicosResponse.json();

        // Carregar profissionais
        const profissionaisResponse = await fetch('http://localhost:3000/api/profissionais');
        this.profissionais = await profissionaisResponse.json();

        // Carregar pacientes
        const pacientesResponse = await fetch('http://localhost:3000/api/pacientes');
        this.pacientes = await pacientesResponse.json();

        // Carregar horários
        const horariosResponse = await fetch('http://localhost:3000/api/horarios');
        this.horarios = await horariosResponse.json();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    },
    abrirModal(edicao = false, dados = {}) {
      this.modoEdicao = edicao;
      this.dadosEditaveis = { ...dados };
      this.modalAberto = true;
    },
    fecharModal() {
      this.modalAberto = false;
      this.dadosEditaveis = {};
    },
    async salvarDados() {
      try {
        const url = `http://localhost:3000/api/${this.currentTab}`;
        const method = this.modoEdicao ? 'PUT' : 'POST';
        
        // Converter preço para número se estiver na aba de serviços
        const dadosParaEnviar = { ...this.dadosEditaveis };
        if (this.currentTab === 'servicos' && dadosParaEnviar.preco) {
          dadosParaEnviar.preco = Number(dadosParaEnviar.preco);
        }
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosParaEnviar)
        });

        if (!response.ok) throw new Error('Erro ao salvar dados');

        await this.carregarDados();
        this.fecharModal();
      } catch (error) {
        console.error('Erro:', error);
      }
    },
    async excluirDados(id) {
      if (!confirm('Tem certeza que deseja excluir este item?')) return;

      try {
        const response = await fetch(`http://localhost:3000/api/${this.currentTab}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir dados');

        await this.carregarDados();
      } catch (error) {
        console.error('Erro:', error);
      }
    },
    // Métodos para serviços
    editarServico(servico) {
      this.abrirModal(true, servico);
    },
    excluirServico(id) {
      this.excluirDados(id);
    },
    adicionarServico() {
      this.abrirModal(false);
    },
    // Métodos para profissionais
    editarProfissional(profissional) {
      this.abrirModal(true, profissional);
    },
    excluirProfissional(id) {
      this.excluirDados(id);
    },
    adicionarProfissional() {
      this.abrirModal(false);
    },
    // Métodos para pacientes
    editarPaciente(paciente) {
      this.abrirModal(true, paciente);
    },
    excluirPaciente(id) {
      this.excluirDados(id);
    },
    adicionarPaciente() {
      this.abrirModal(false);
    },
    // Métodos para horários
    editarHorario(horario) {
      this.abrirModal(true, horario);
    },
    excluirHorario(id) {
      this.excluirDados(id);
    },
    adicionarHorario() {
      this.abrirModal(false);
    }
  },
  async created() {
    await this.carregarDados();
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.tab-button.active {
  background: #42b983;
  color: white;
}

.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.admin-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.btn-editar,
.btn-excluir,
.btn-adicionar {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-editar {
  background-color: #42b983;
  color: white;
  margin-right: 0.5rem;
}

.btn-excluir {
  background-color: #dc3545;
  color: white;
}

.btn-adicionar {
  background-color: #007bff;
  color: white;
  margin-top: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-salvar {
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancelar {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style> 