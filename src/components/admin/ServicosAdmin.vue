<template>
  <div class="servicos-admin">
    <h2>Gerenciar Serviços</h2>
    
    <div class="form-container">
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
          <button type="button" class="btn-secondary" @click="cancelarEdicao" v-if="modoEdicao">Cancelar</button>
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
export default {
  name: 'ServicosAdmin',
  data() {
    return {
      servicos: [],
      formData: {
        id: null,
        nome: '',
        descricao: '',
        preco: '',
        duracao: ''
      },
      modoEdicao: false
    }
  },
  created() {
    this.carregarServicos()
  },
  methods: {
    async carregarServicos() {
      try {
        const response = await fetch('http://localhost:3000/api/servicos')
        if (!response.ok) throw new Error('Erro ao carregar serviços')
        this.servicos = await response.json()
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao carregar serviços')
      }
    },
    async salvarServico() {
      try {
        const url = this.modoEdicao 
          ? `http://localhost:3000/api/servicos/${this.formData.id}`
          : 'http://localhost:3000/api/servicos'
        
        const method = this.modoEdicao ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...this.formData,
            preco: Number(this.formData.preco)
          })
        })
        
        if (!response.ok) throw new Error('Erro ao salvar serviço')
        
        await this.carregarServicos()
        this.limparFormulario()
        alert('Serviço salvo com sucesso!')
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao salvar serviço')
      }
    },
    editarServico(servico) {
      this.formData = { ...servico }
      this.modoEdicao = true
    },
    cancelarEdicao() {
      this.limparFormulario()
    },
    async excluirServico(id) {
      if (!confirm('Tem certeza que deseja excluir este serviço?')) return
      
      try {
        const response = await fetch(`http://localhost:3000/api/servicos/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Erro ao excluir serviço')
        
        await this.carregarServicos()
        alert('Serviço excluído com sucesso!')
      } catch (error) {
        console.error('Erro:', error)
        alert('Erro ao excluir serviço')
      }
    },
    limparFormulario() {
      this.formData = {
        id: null,
        nome: '',
        descricao: '',
        preco: '',
        duracao: ''
      }
      this.modoEdicao = false
    }
  }
}
</script>

<style scoped>
.servicos-admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.servicos-list {
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

.btn-edit {
  background-color: #ffc107;
  color: #212529;
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