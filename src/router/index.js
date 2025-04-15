import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '../components/Inicio.vue';
import Servicos from '../components/Servicos.vue';
import Sobre from '../components/Sobre.vue';
import Contato from '../components/Contato.vue';
import Agendamento from '../components/Agendamento.vue';
import Admin from '../components/Admin.vue';

const routes = [
    { path: '/', name: 'Inicio', component: Inicio },
    { path: '/servicos', name: 'Servicos', component: Servicos },
    { path: '/sobre', name: 'Sobre', component: Sobre },
    { path: '/contato', name: 'Contato', component: Contato },
    { path: '/agendamento', name: 'Agendamento', component: Agendamento },
    { path: '/admin', name: 'Admin', component: Admin }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
