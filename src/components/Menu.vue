<template>
  <header class="header">
    <div class="logo">
      <router-link to="/">
        <img src="../assets/logo.png" alt="FisioVital Logo">
      </router-link>
    </div>

    <!-- Menu Hamburguer -->
    <button class="menu-toggle" @click="toggleMenu" :class="{ 'active': menuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="nav-links" :class="{ 'active': menuOpen }">
      <router-link to="/" @click="closeMenu">Início</router-link>
      <router-link to="/servicos" @click="closeMenu">Serviços</router-link>
      <router-link to="/sobre" @click="closeMenu">Sobre</router-link>
      <router-link to="/contato" @click="closeMenu">Contato</router-link>
      <router-link v-if="isAdmin" to="/admin" class="admin-link" @click="closeMenu">Painel de Controle</router-link>
      <router-link v-if="!isLoggedIn" to="/login" class="login-link" @click="closeMenu">Login</router-link>
      <button v-else @click="handleLogout" class="logout-button">Sair</button>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Menu',
  setup() {
    const router = useRouter()
    const isLoggedIn = ref(false)
    const isAdmin = ref(false)
    const menuOpen = ref(false)

    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      isLoggedIn.value = !!token
      isAdmin.value = userData.tipo === 'admin'
      // Emitir evento global de autenticação
      window.dispatchEvent(new CustomEvent('auth-change', {
        detail: { isLoggedIn: isLoggedIn.value, isAdmin: isAdmin.value }
      }))
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      isLoggedIn.value = false
      isAdmin.value = false
      router.push('/login')
      menuOpen.value = false
      // Emitir evento global de logout
      window.dispatchEvent(new CustomEvent('auth-change', {
        detail: { isLoggedIn: false, isAdmin: false }
      }))
    }

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
      // Prevenir scroll quando menu estiver aberto
      if (menuOpen.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }

    const closeMenu = () => {
      menuOpen.value = false
      document.body.style.overflow = ''
    }

    onMounted(() => {
      checkAuth()
      // Adicionar listener para eventos de login
      window.addEventListener('login-success', checkAuth)
      // Fechar menu ao redimensionar para desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOpen.value) {
          closeMenu()
        }
      })
    })

    return {
      isLoggedIn,
      isAdmin,
      menuOpen,
      handleLogout,
      toggleMenu,
      closeMenu
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
  position: relative;
  z-index: 1000;
}

.logo img {
  height: 50px;
}

/* Menu Toggle Button (Hamburguer) */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: #333;
  transition: all 0.3s ease;
}

.menu-toggle.active span:first-child {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:last-child {
  transform: rotate(-45deg) translate(6px, -6px);
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
}

.login-link {
  background-color: #28a745;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.login-link:hover {
  background-color: #218838;
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

/* Responsive Styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-links {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    z-index: 1000;
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links a {
    font-size: 1.2rem;
  }

  .admin-link,
  .login-link,
  .logout-button {
    width: 200px;
    text-align: center;
  }
}

/* Ajustes para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .header {
    padding: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-links a {
    font-size: 0.9rem;
  }

  .admin-link,
  .login-link,
  .logout-button {
    padding: 0.4rem 0.8rem;
  }
}
</style>
