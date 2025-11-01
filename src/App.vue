<template>
  <div id="app">
    <nav>
      <router-link to="/">Вакансии</router-link> |
      <router-link to="/login" v-if="!isLoggedIn">Войти</router-link>
      <!-- Изменили текст и добавили ссылку на вакансии -->
      <router-link to="/admin" v-if="isLoggedIn">Панель администратора</router-link> |
      <a href="#" @click.prevent="logout" v-if="isLoggedIn"> Выйти</a>
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
      this.$router.push('/login');
    }
  }
}
</script>