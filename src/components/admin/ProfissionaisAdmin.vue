<template>
  <div class="admin-content">
    <h2>Gerenciar Profissionais</h2>
    
    <div class="actions">
      <button @click="showForm = true" class="btn-add">Adicionar Profissional</button>
    </div>

    <div v-if="showForm" class="form-container">
      <h3>{{ editingProfissional ? 'Editar Profissional' : 'Novo Profissional' }}</h3>
      <form @submit.prevent="saveProfissional">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="formData.nome" required>
        </div>
        
        <div class="form-group">
          <label for="especialidade">Especialidade</label>
          <input type="text" id="especialidade" v-model="formData.especialidade" required>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">Salvar</button>
          <button type="button" @click="cancelForm" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="profissional in profissionais" :key="profissional.id">
            <td>{{ profissional.nome }}</td>
            <td>{{ profissional.especialidade }}</td>
            <td>
              <button @click="editProfissional(profissional)" class="btn-edit">Editar</button>
              <button @click="deleteProfissional(profissional.id)" class="btn-delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfissionaisAdmin',
  data() {
    return {
      profissionais: [],
      showForm: false,
      editingProfissional: null,
      formData: {
        nome: '',
        especialidade: ''
      }
    }
  },
  created() {
    this.loadProfissionais()
  },
  methods: {
    async loadProfissionais() {
      try {
        const response = await fetch('http://localhost:3000/api/profissionais')
        if (!response.ok) throw new Error('Erro ao carregar profissionais')
        this.profissionais = await response.json()
      } catch (error) {
        alert('Erro ao carregar profissionais: ' + error.message)
      }
    },
    editProfissional(profissional) {
      this.editingProfissional = profissional
      this.formData = { ...profissional }
      this.showForm = true
    },
    async saveProfissional() {
      try {
        const url = this.editingProfissional 
          ? `http://localhost:3000/api/profissionais/${this.editingProfissional.id}`
          : 'http://localhost:3000/api/profissionais'
        
        const method = this.editingProfissional ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        })

        if (!response.ok) throw new Error('Erro ao salvar profissional')
        
        this.cancelForm()
        this.loadProfissionais()
      } catch (error) {
        alert('Erro ao salvar profissional: ' + error.message)
      }
    },
    async deleteProfissional(id) {
      if (!confirm('Tem certeza que deseja excluir este profissional?')) return

      try {
        const response = await fetch(`http://localhost:3000/api/profissionais/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Erro ao excluir profissional')
        
        this.loadProfissionais()
      } catch (error) {
        alert('Erro ao excluir profissional: ' + error.message)
      }
    },
    cancelForm() {
      this.showForm = false
      this.editingProfissional = null
      this.formData = {
        nome: '',
        especialidade: ''
      }
    }
  }
}
</script>

<style scoped>
.admin-content {
  padding: 2rem;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.btn-edit {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 