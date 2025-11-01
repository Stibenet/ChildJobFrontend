<template>
  <div class="admin">
    <h2>Админ-панель</h2>
    <p>{{ message }}</p>
    <!-- Добавим ссылки на управление вакансиями и пользователями -->
    <p>
      <router-link to="/admin/vacancies">Управление Вакансиями</router-link> |
      <router-link to="/admin/users">Управление Пользователями</router-link>
    </p>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script>
import apiClient from '../utils/axios'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      message: ''
    }
  },
  async mounted() {
    try {
      const response = await apiClient.get('/admin/dashboard');
      this.message = response.data;
    } catch (err) {
      console.error('Ошибка получения данных админки:', err);
      // Перехватчик 401 сам перенаправит
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userToken');
      this.$router.push('/login');
    }
  }
}
</script>