<template>
  <div class="admin">
    <h2>Админ-панель</h2>
    <p>{{ message }}</p>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script>
// import axios from 'axios' <-- УБРАТЬ ЭТУ СТРОКУ
import apiClient from '../utils/axios' // <-- ОСТАВИТЬ ЭТУ СТРОКУ

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