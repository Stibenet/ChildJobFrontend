<template>
  <div class="login">
    <h2>Вход</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Логин:</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div>
        <label for="password">Пароль:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Войти</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
// import axios from 'axios' <-- УБРАТЬ ЭТУ СТРОКУ
import apiClient from '../utils/axios' // <-- ОСТАВИТЬ ЭТУ СТРОКУ

export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      message: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await apiClient.post('/auth/signin', {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('userToken', response.data.accessToken);
        this.$router.push('/admin');
      } catch (err) {
        console.error('Ошибка входа:', err);
        this.message = 'Неверный логин или пароль.';
      }
    }
  }
}
</script>