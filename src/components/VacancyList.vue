<template>
  <div class="vacancy-list">
    <div v-if="loading">Загрузка вакансий...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="vacancy in vacancies" :key="vacancy.id" class="vacancy-card">
        <h3>{{ vacancy.title }}</h3>
        <p><strong>Описание:</strong> {{ vacancy.description }}</p>
        <p><strong>Возраст:</strong> {{ vacancy.minAge }} - {{ vacancy.maxAge }} лет</p>
        <p><strong>Место:</strong> {{ vacancy.location }}</p>
        <p><strong>Контакт работодателя:</strong> {{ vacancy.employerContact }}</p>
        <p><strong>Активна:</strong> {{ vacancy.isActive ? 'Да' : 'Нет' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VacancyList',
  data() {
    return {
      vacancies: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    try {
      // Замените localhost:8080 на ваш API URL, если он запущен на другом хосте/порте
      const response = await axios.get('http://localhost:8080/api/vacancies/getAllActiveVacancies')
      this.vacancies = response.data
    } catch (err) {
      console.error('Ошибка при получении вакансий:', err);
      this.error = 'Не удалось загрузить вакансии. Проверьте, запущен ли сервер API.';
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.vacancy-list {
  max-width: 800px;
  margin: 0 auto;
}

.vacancy-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin: 10px 0;
  text-align: left;
  background-color: #f9f9f9;
}

.vacancy-card h3 {
  margin-top: 0;
}
</style>