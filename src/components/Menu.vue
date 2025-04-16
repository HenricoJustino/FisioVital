<template>
  <header class="header">
    <div class="logo">
      <router-link to="/">
        <img src="../assets/logo.png" alt="FisioVital Logo">
      </router-link>
    </div>
    <nav class="nav-links">
      <router-link to="/">Início</router-link>
      <router-link to="/servicos">Serviços</router-link>
      <router-link to="/sobre">Sobre</router-link>
      <router-link to="/contato">Contato</router-link>
      <router-link v-if="isAdmin" to="/admin" class="admin-link">Painel de Controle</router-link>
      <router-link v-if="!isLoggedIn" to="/login" class="login-link">Login</router-link>
      <button v-else @click="logout" class="logout-button">Sair</button>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false
    }
  },
  created() {
    this.checkAuth()
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      this.isLoggedIn = !!token
      this.isAdmin = userData.tipo === 'admin'
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      this.isLoggedIn = false
      this.isAdmin = false
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo img {
  height: 50px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #007bff;
}

.admin-link {
  background-color: #007bff;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.admin-link:hover {
  background-color: #0056b3;
  color: white !important;
}

.login-link {
  background-color: #28a745;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.login-link:hover {
  background-color: #218838;
  color: white !important;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>
