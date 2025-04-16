<template>
  <div class="login-container">
    <div class="login-box">
      <h1>{{ isAdmin ? 'Login Administrativo' : 'Login Paciente' }}</h1>
      
      <form @submit.prevent="handleLogin" class="login-form">
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

        <div v-if="mensagem" class="mensagem">
          {{ mensagem.texto }}
        </div>

        <button type="submit" class="btn-login" :disabled="enviando">
          {{ enviando ? 'Entrando...' : 'Entrar' }}
        </button>

        <div class="links">
          <button type="button" @click="toggleModo" class="btn-toggle">
            {{ isAdmin ? 'Sou paciente' : 'Sou administrador' }}
          </button>
          <router-link to="/cadastro" class="btn-cadastro">
            Criar conta
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isAdmin: false,
      formData: {
        email: '',
        senha: ''
      },
      enviando: false,
      mensagem: null
    }
  },
  methods: {
    toggleModo() {
      this.isAdmin = !this.isAdmin;
      this.mensagem = null;
    },
    async handleLogin() {
      this.enviando = true;
      this.mensagem = null;

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.formData.email,
            senha: this.formData.senha
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Credenciais inválidas');
        }
        
        // Salvar token e dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        this.mensagem = {
          tipo: 'sucesso',
          texto: 'Login realizado com sucesso!'
        };

        // Redirecionar após 1 segundo
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);

      } catch (error) {
        this.mensagem = {
          tipo: 'erro',
          texto: error.message || 'Erro ao fazer login. Por favor, tente novamente.'
        };
      } finally {
        this.enviando = false;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
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

.login-form {
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

.btn-login {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-login:hover {
  background-color: #3aa876;
}

.btn-login:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-toggle,
.btn-cadastro {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}

.mensagem {
  color: #2c3e50;
  text-align: center;
  margin-top: 1rem;
}
</style> 