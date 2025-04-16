<template>
  <div class="admin-panel">
    <h1>Painel de Controle</h1>
    
    <div class="dashboard">
      <div class="card">
        <h2>Serviços</h2>
        <router-link to="/admin/servicos" class="btn">Gerenciar Serviços</router-link>
      </div>
      
      <div class="card">
        <h2>Profissionais</h2>
        <router-link to="/admin/profissionais" class="btn">Gerenciar Profissionais</router-link>
      </div>
      
      <div class="card">
        <h2>Pacientes</h2>
        <router-link to="/admin/pacientes" class="btn">Gerenciar Pacientes</router-link>
      </div>
      
      <div class="card">
        <h2>Agendamentos</h2>
        <router-link to="/admin/agendamentos" class="btn">Gerenciar Agendamentos</router-link>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  created() {
    // Verificar se o usuário é admin
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    if (userData.tipo !== 'admin') {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-panel {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}
</style> 