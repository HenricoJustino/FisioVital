import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '../components/Inicio.vue';
import Login from '../components/Login.vue';
import Servicos from '../components/Servicos.vue';
import Sobre from '../components/Sobre.vue';
import Contato from '../components/Contato.vue';
import Agendamento from '../components/Agendamento.vue';
import AdminPanel from '../components/AdminPanel.vue';
import ServicosAdmin from '../components/admin/ServicosAdmin.vue';
import ProfissionaisAdmin from '../components/admin/ProfissionaisAdmin.vue';
import PacientesAdmin from '../components/admin/PacientesAdmin.vue';
import AgendamentosAdmin from '../components/admin/AgendamentosAdmin.vue';

const routes = [
    { path: '/', name: 'Home', component: Inicio },
    { path: '/login', name: 'Login', component: Login },
    { 
        path: '/admin', 
        component: AdminPanel,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            { path: 'servicos', name: 'ServicosAdmin', component: ServicosAdmin },
            { path: 'profissionais', name: 'ProfissionaisAdmin', component: ProfissionaisAdmin },
            { path: 'pacientes', name: 'PacientesAdmin', component: PacientesAdmin },
            { path: 'agendamentos', name: 'AgendamentosAdmin', component: AgendamentosAdmin }
        ]
    },
    { path: '/cadastro', name: 'Cadastro', component: () => import('../components/Cadastro.vue') },
    { path: '/servicos', name: 'Servicos', component: Servicos },
    { path: '/sobre', name: 'Sobre', component: Sobre },
    { path: '/contato', name: 'Contato', component: Contato },
    { path: '/agendamento', name: 'Agendamento', component: Agendamento }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// Guarda de navegação para proteger rotas
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isAdmin = userData.tipo === 'admin';

    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.meta.requiresAdmin && !isAdmin) {
        next('/login');
    } else {
        next();
    }
});

export default router;
