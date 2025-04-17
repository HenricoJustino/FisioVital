<template>
  <div class="profissionais-admin">
    <h2>Gerenciar Profissionais</h2>
    
    <div class="actions">
      <button @click="showForm = true" class="btn-add" v-if="!showForm">Adicionar Profissional</button>
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
          <button type="submit" class="btn-primary">Salvar</button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="profissionais-list">
      <h3>Lista de Profissionais</h3>
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
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ProfissionaisAdmin',
  setup() {
    const profissionais = ref([])
    const showForm = ref(false)
    const editingProfissional = ref(null)
    const formData = ref({
      nome: '',
      especialidade: ''
    })

    const loadProfissionais = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/profissionais')
        if (!response.ok) throw new Error('Erro ao carregar profissionais')
        profissionais.value = await response.json()
      } catch (error) {
        alert('Erro ao carregar profissionais: ' + error.message)
      }
    }

    const editProfissional = (profissional) => {
      editingProfissional.value = profissional
      formData.value = { ...profissional }
      showForm.value = true
    }

    const saveProfissional = async () => {
      try {
        const url = editingProfissional.value 
          ? `http://localhost:3000/api/profissionais/${editingProfissional.value.id}`
          : 'http://localhost:3000/api/profissionais'
        
        const method = editingProfissional.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData.value)
        })

        if (!response.ok) throw new Error('Erro ao salvar profissional')
        
        cancelForm()
        await loadProfissionais()
      } catch (error) {
        alert('Erro ao salvar profissional: ' + error.message)
      }
    }

    const deleteProfissional = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este profissional?')) return

      try {
        const response = await fetch(`http://localhost:3000/api/profissionais/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Erro ao excluir profissional')
        
        await loadProfissionais()
      } catch (error) {
        alert('Erro ao excluir profissional: ' + error.message)
      }
    }

    const cancelForm = () => {
      showForm.value = false
      editingProfissional.value = null
      formData.value = {
        nome: '',
        especialidade: ''
      }
    }

    // Handler para eventos de autenticação
    const handleAuthChange = (event) => {
      if (event.detail.isLoggedIn && event.detail.isAdmin) {
        loadProfissionais()
      }
    }

    onMounted(() => {
      loadProfissionais()
      // Adicionar listener para eventos de autenticação
      window.addEventListener('auth-change', handleAuthChange)
      window.addEventListener('login-success', handleAuthChange)
    })

    onUnmounted(() => {
      // Remover listeners quando o componente for desmontado
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('login-success', handleAuthChange)
    })

    return {
      profissionais,
      showForm,
      editingProfissional,
      formData,
      loadProfissionais,
      editProfissional,
      saveProfissional,
      deleteProfissional,
      cancelForm
    }
  }
}
</script>

<style scoped>
.profissionais-admin {
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

.profissionais-list {
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
  .profissionais-admin {
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

  .profissionais-list {
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
  .profissionais-admin {
    padding: 1.5rem;
  }

  .form-container,
  .profissionais-list {
    padding: 1.5rem;
  }

  th, td {
    padding: 0.8rem;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 480px) {
  .profissionais-admin {
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