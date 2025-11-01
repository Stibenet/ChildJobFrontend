<template>
  <div id="app">
    <h1>Детские Вакансии</h1>
    <VacancyList />
  </div>
</template>

<script>
import VacancyList from './components/VacancyList.vue'

export default {
  name: 'App',
  components: {
    VacancyList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>