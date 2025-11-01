import { createRouter, createWebHistory } from 'vue-router'
import VacancyList from '../components/VacancyList.vue'
import UserLogin from '../components/UserLogin.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import AdminVacancies from '../components/AdminVacancies.vue'
import AdminUsers from '../components/AdminUsers.vue' // Импортируем новый компонент

const routes = [
    {
        path: '/',
        name: 'Home',
        component: VacancyList
    },
    {
        path: '/vacancies',
        name: 'Vacancies',
        component: VacancyList
    },
    {
        path: '/login',
        name: 'Login',
        component: UserLogin
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminDashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin/vacancies',
        name: 'AdminVacancies',
        component: AdminVacancies,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin/users', // Новый маршрут
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('userToken') !== null;
    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
        next('/login');
    } else {
        next();
    }
})

export default router