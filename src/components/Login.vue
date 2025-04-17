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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const isAdmin = ref(false)
    const enviando = ref(false)
    const mensagem = ref(null)
    const formData = ref({
      email: '',
      senha: ''
    })

    const handleLogin = async () => {
      try {
        enviando.value = true
        mensagem.value = null

        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.value.email,
            senha: formData.value.senha,
            isAdmin: isAdmin.value
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer login')
        }

        // Salvar dados do usuário
        localStorage.setItem('token', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))

        // Emitir evento de login bem-sucedido
        window.dispatchEvent(new CustomEvent('login-success', {
          detail: { user: data.user }
        }))

        // Redirecionar
        if (data.user.tipo === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } catch (error) {
        mensagem.value = {
          tipo: 'erro',
          texto: error.message
        }
      } finally {
        enviando.value = false
      }
    }

    const toggleModo = () => {
      isAdmin.value = !isAdmin.value
    }

    return {
      isAdmin,
      enviando,
      mensagem,
      formData,
      handleLogin,
      toggleModo
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