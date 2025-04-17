<template>
  <div class="pacientes-admin">
    <h2>Gerenciar Pacientes</h2>
    
    <div class="actions">
      <button @click="showForm = true" class="btn-add" v-if="!showForm">Adicionar Paciente</button>
    </div>

    <div v-if="showForm" class="form-container">
      <h3>{{ editingPaciente ? 'Editar Paciente' : 'Novo Paciente' }}</h3>
      <form @submit.prevent="savePaciente">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="formData.nome" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="formData.email" required>
        </div>
        
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" v-model="formData.telefone" required>
        </div>
        
        <div class="form-group">
          <label for="historico">Histórico</label>
          <textarea id="historico" v-model="formData.historico" rows="4"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Salvar</button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="pacientes-list">
      <h3>Lista de Pacientes</h3>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paciente in pacientes" :key="paciente.id">
            <td>{{ paciente.nome }}</td>
            <td>{{ paciente.email }}</td>
            <td>{{ paciente.telefone }}</td>
            <td>
              <button @click="editPaciente(paciente)" class="btn-edit">Editar</button>
              <button @click="deletePaciente(paciente.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PacientesAdmin',
  data() {
    return {
      pacientes: [],
      showForm: false,
      editingPaciente: null,
      formData: {
        nome: '',
        email: '',
        telefone: '',
        historico: ''
      }
    }
  },
  created() {
    this.loadPacientes()
  },
  methods: {
    async loadPacientes() {
      try {
        const response = await fetch('http://localhost:3000/api/pacientes')
        if (!response.ok) throw new Error('Erro ao carregar pacientes')
        this.pacientes = await response.json()
      } catch (error) {
        alert('Erro ao carregar pacientes: ' + error.message)
      }
    },
    editPaciente(paciente) {
      this.editingPaciente = paciente
      this.formData = { ...paciente }
      this.showForm = true
    },
    async savePaciente() {
      try {
        const url = this.editingPaciente 
          ? `http://localhost:3000/api/pacientes/${this.editingPaciente.id}`
          : 'http://localhost:3000/api/pacientes'
        
        const method = this.editingPaciente ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        })

        if (!response.ok) throw new Error('Erro ao salvar paciente')
        
        this.cancelForm()
        this.loadPacientes()
      } catch (error) {
        alert('Erro ao salvar paciente: ' + error.message)
      }
    },
    async deletePaciente(id) {
      if (!confirm('Tem certeza que deseja excluir este paciente?')) return

      try {
        const response = await fetch(`http://localhost:3000/api/pacientes/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Erro ao excluir paciente')
        
        this.loadPacientes()
      } catch (error) {
        alert('Erro ao excluir paciente: ' + error.message)
      }
    },
    cancelForm() {
      this.showForm = false
      this.editingPaciente = null
      this.formData = {
        nome: '',
        email: '',
        telefone: '',
        historico: ''
      }
    }
  }
}
</script>

<style scoped>
.pacientes-admin {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.actions {
  margin-bottom: 2rem;
}

.btn-add {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-add:hover {
  background-color: #3aa876;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.pacientes-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto; /* Permite rolagem horizontal em telas pequenas */
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* Garante largura mínima para legibilidade */
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.btn-edit,
.btn-delete {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .pacientes-admin {
    padding: 1rem;
  }

  .form-container {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .pacientes-list {
    padding: 1rem;
    margin: 0 -1rem;
    border-radius: 0;
  }

  th, td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }

  .btn-edit,
  .btn-delete {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .pacientes-admin {
    padding: 1.5rem;
  }

  .form-container,
  .pacientes-list {
    padding: 1.5rem;
  }

  th, td {
    padding: 0.8rem;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 480px) {
  .pacientes-admin {
    padding: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .btn-add {
    width: 100%;
    text-align: center;
  }
}
</style> 