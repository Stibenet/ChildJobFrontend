<template>
  <div id="app">
    <nav>
      <router-link to="/">Вакансии</router-link> |
      <!-- Показываем "Войти" если НЕ авторизован -->
      <router-link to="/login" v-if="!isLoggedIn">Войти</router-link>
      <!-- Показываем "Админ" и "Выйти" если авторизован -->
      <router-link to="/admin" v-if="isLoggedIn">Админ</router-link>
      <a href="#" @click.prevent="logout" v-if="isLoggedIn"> (Выйти)</a>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return localStorage.getItem('userToken') !== null;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userToken');
      // Удалите сессию (в реальности тут был бы вызов logout API и удаление токена)
      this.$router.push('/login');
    }
  }
}
</script>