<template>
  <div class="servicos-admin">
    <h2>Gerenciar Serviços</h2>
    
    <div class="actions">
      <button @click="showForm = true" class="btn-add" v-if="!showForm">
        Adicionar Serviço
      </button>
    </div>

    <div class="form-container" v-if="showForm">
      <h3>{{ modoEdicao ? 'Editar Serviço' : 'Adicionar Novo Serviço' }}</h3>
      <form @submit.prevent="salvarServico">
        <div class="form-group">
          <label for="nome">Nome do Serviço</label>
          <input type="text" id="nome" v-model="formData.nome" required>
        </div>
        
        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="formData.descricao" required></textarea>
        </div>
        
        <div class="form-group">
          <label for="preco">Preço (R$)</label>
          <input type="number" id="preco" v-model="formData.preco" step="0.01" min="0" required>
        </div>
        
        <div class="form-group">
          <label for="duracao">Duração (minutos)</label>
          <input type="number" id="duracao" v-model="formData.duracao" min="1" required>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary">{{ modoEdicao ? 'Atualizar' : 'Adicionar' }}</button>
          <button type="button" class="btn-secondary" @click="cancelarEdicao">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="servicos-list">
      <h3>Lista de Serviços</h3>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Duração</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servico in servicos" :key="servico.id">
            <td>{{ servico.nome }}</td>
            <td>{{ servico.descricao }}</td>
            <td>R$ {{ Number(servico.preco).toFixed(2) }}</td>
            <td>{{ servico.duracao }} min</td>
            <td>
              <button @click="editarServico(servico)" class="btn-edit">Editar</button>
              <button @click="excluirServico(servico.id)" class="btn-delete">Excluir</button>
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
  name: 'ServicosAdmin',
  setup() {
    const servicos = ref([])
    const showForm = ref(false)
    const modoEdicao = ref(false)
    const formData = ref({
      nome: '',
      descricao: '',
      preco: '',
      duracao: ''
    })

    const carregarServicos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/servicos')
        if (!response.ok) throw new Error('Erro ao carregar serviços')
        servicos.value = await response.json()
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao carregar serviços')
      }
    }

    const salvarServico = async () => {
      try {
        const url = modoEdicao.value
          ? `http://localhost:3000/api/servicos/${formData.value.id}`
          : 'http://localhost:3000/api/servicos'
        
        const method = modoEdicao.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData.value)
        })

        if (!response.ok) throw new Error('Erro ao salvar serviço')
        
        await carregarServicos()
        cancelarEdicao()
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao salvar serviço')
      }
    }

    const editarServico = (servico) => {
      modoEdicao.value = true
      formData.value = { ...servico }
      showForm.value = true
    }

    const excluirServico = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este serviço?')) return
      
      try {
        const response = await fetch(`http://localhost:3000/api/servicos/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Erro ao excluir serviço')
        
        await carregarServicos()
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao excluir serviço')
      }
    }

    const cancelarEdicao = () => {
      modoEdicao.value = false
      showForm.value = false
      formData.value = {
        nome: '',
        descricao: '',
        preco: '',
        duracao: ''
      }
    }

    // Handler para eventos de autenticação
    const handleAuthChange = (event) => {
      if (event.detail.isLoggedIn && event.detail.isAdmin) {
        carregarServicos()
      }
    }

    onMounted(() => {
      carregarServicos()
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
      servicos,
      showForm,
      modoEdicao,
      formData,
      salvarServico,
      editarServico,
      excluirServico,
      cancelarEdicao
    }
  }
}
</script>

<style scoped>
.servicos-admin {
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

.servicos-list {
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
  .servicos-admin {
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

  .servicos-list {
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
  .servicos-admin {
    padding: 1.5rem;
  }

  .form-container,
  .servicos-list {
    padding: 1.5rem;
  }

  th, td {
    padding: 0.8rem;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 480px) {
  .servicos-admin {
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