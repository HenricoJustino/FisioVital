<template>
  <div class="cadastro-container">
    <div class="cadastro-box">
      <h1>Criar Conta</h1>
      
      <form @submit.prevent="handleCadastro" class="cadastro-form">
        <div class="form-group">
          <label for="nome">Nome Completo</label>
          <input 
            type="text" 
            id="nome" 
            v-model="formData.nome" 
            required
            placeholder="Seu nome completo"
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
          <label for="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            v-model="formData.senha" 
            required
            placeholder="Digite sua senha"
          >
        </div>

        <div class="form-group">
          <label for="confirmarSenha">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirmarSenha" 
            v-model="formData.confirmarSenha" 
            required
            placeholder="Confirme sua senha"
          >
        </div>

        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input 
            type="tel" 
            id="telefone" 
            v-model="formData.telefone" 
            placeholder="(00) 00000-0000"
          >
        </div>

        <div v-if="erro" class="erro-mensagem">
          {{ erro }}
        </div>

        <button type="submit" class="btn-cadastro" :disabled="carregando">
          {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
        </button>

        <div class="links">
          <router-link to="/login" class="btn-login">
            Já tem uma conta? Faça login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cadastro',
  data() {
    return {
      formData: {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        telefone: ''
      },
      carregando: false,
      erro: null
    }
  },
  methods: {
    async handleCadastro() {
      this.carregando = true;
      this.erro = null;

      // Validar senhas
      if (this.formData.senha !== this.formData.confirmarSenha) {
        this.erro = 'As senhas não coincidem';
        this.carregando = false;
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/pacientes/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: this.formData.nome,
            email: this.formData.email,
            senha: this.formData.senha,
            telefone: this.formData.telefone
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao cadastrar');
        }

        // Redirecionar para login
        this.$router.push('/login');
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        this.erro = error.message || 'Erro ao conectar com o servidor. Verifique se o servidor está rodando.';
      } finally {
        this.carregando = false;
      }
    }
  }
}
</script>

<style scoped>
.cadastro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.cadastro-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.cadastro-form {
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

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn-cadastro {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-cadastro:hover {
  background-color: #218838;
}

.btn-cadastro:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.links {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn-login {
  color: #007bff;
  text-decoration: none;
}

.btn-login:hover {
  text-decoration: underline;
}

.erro-mensagem {
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
}
</style> 