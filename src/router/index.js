import { createRouter, createWebHistory } from 'vue-router'
import VacancyList from '../components/VacancyList.vue'
import UserLogin from '../components/UserLogin.vue' // Изменили
import AdminDashboard from '../components/AdminDashboard.vue' // Изменили

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
        component: UserLogin // Изменили
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminDashboard, // Изменили
        meta: { requiresAuth: true } // Защита маршрута
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Глобальный маршрутный хук для защиты
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
        next('/login');
    } else {
        next();
    }
})

export default router