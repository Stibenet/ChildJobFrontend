<template>
  <div class="admin-vacancies">
    <h2>Управление Вакансиями</h2>

    <div class="form-section">
      <h3>{{ editingVacancy ? 'Редактировать Вакансию' : 'Создать Новую Вакансию' }}</h3>
      <form @submit.prevent="editingVacancy ? updateVacancy() : createVacancy()">
        <div>
          <label for="title">Название:</label>
          <input id="title" v-model="form.title" type="text" required />
        </div>
        <div>
          <label for="description">Описание:</label>
          <textarea id="description" v-model="form.description"></textarea>
        </div>
        <div>
          <label for="minAge">Мин. возраст:</label>
          <input id="minAge" v-model.number="form.minAge" type="number" required min="1" max="17" />
        </div>
        <div>
          <label for="maxAge">Макс. возраст:</label>
          <input id="maxAge" v-model.number="form.maxAge" type="number" required min="1" max="17" />
        </div>
        <div>
          <label for="location">Место:</label>
          <input id="location" v-model="form.location" type="text" />
        </div>
        <div>
          <label for="employerContact">Контакт работодателя:</label>
          <input id="employerContact" v-model="form.employerContact" type="text" />
        </div>
        <button type="submit">{{ editingVacancy ? 'Обновить' : 'Создать' }}</button>
        <button v-if="editingVacancy" @click="cancelEdit" type="button">Отмена</button>
      </form>
    </div>

    <div class="list-section">
      <h3>Список Вакансий</h3>
      <div v-if="loading">Загрузка...</div>
      <div v-else>
        <div v-for="vacancy in vacancies" :key="vacancy.id" class="vacancy-item">
          <h4>{{ vacancy.title }}</h4>
          <p>{{ vacancy.description }}</p>
          <p>Возраст: {{ vacancy.minAge }} - {{ vacancy.maxAge }}</p>
          <p>Место: {{ vacancy.location }}</p>
          <p>Контакт: {{ vacancy.employerContact }}</p>
          <p>Активна: {{ vacancy.isActive ? 'Да' : 'Нет' }}</p>
          <button @click="editVacancy(vacancy)">Редактировать</button>
          <button @click="toggleActive(vacancy)">Активировать/Деактивировать</button>
          <button @click="deleteVacancy(vacancy.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../utils/axios'

export default {
  name: 'AdminVacancies',
  data() {
    return {
      vacancies: [],
      loading: true,
      editingVacancy: null,
      form: {
        title: '',
        description: '',
        minAge: null,
        maxAge: null,
        location: '',
        employerContact: ''
      }
    }
  },
  async mounted() {
    await this.fetchVacancies();
    this.loading = false;
  },
  methods: {
    async fetchVacancies() {
      try {
        // Вызов эндпоинта из AdminController, который доступен только админу
        // и возвращает *все* вакансии, не только активные.
        const responseAll = await apiClient.get('/admin/vacancies');
        this.vacancies = responseAll.data;
      } catch (err) {
        console.error('Ошибка получения вакансий:', err);
        // Возможно, стоит перенаправить на login если 401
        if (err.response && err.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    resetForm() {
      this.form = {
        title: '',
        description: '',
        minAge: null,
        maxAge: null,
        location: '',
        employerContact: ''
      };
      this.editingVacancy = null;
    },
    async createVacancy() {
      try {
        await apiClient.post('/vacancies', this.form);
        this.resetForm();
        await this.fetchVacancies(); // Обновить список
      } catch (err) {
        console.error('Ошибка создания вакансии:', err);
        alert('Ошибка при создании вакансии.');
      }
    },
    editVacancy(vacancy) {
      this.editingVacancy = vacancy;
      this.form = { ...vacancy }; // Копируем данные в форму
    },
    cancelEdit() {
      this.resetForm();
    },
    async updateVacancy() {
      if (!this.editingVacancy) return;
      try {
        await apiClient.put(`/vacancies/${this.editingVacancy.id}`, this.form);
        this.resetForm();
        await this.fetchVacancies(); // Обновить список
      } catch (err) {
        console.error('Ошибка обновления вакансии:', err);
        alert('Ошибка при обновлении вакансии.');
      }
    },
    async deleteVacancy(id) {
      if (!confirm('Вы уверены, что хотите удалить эту вакансию?')) return;
      try {
        await apiClient.delete(`/vacancies/${id}`);
        await this.fetchVacancies(); // Обновить список
      } catch (err) {
        console.error('Ошибка удаления вакансии:', err);
        alert('Ошибка при удалении вакансии.');
      }
    },
    async toggleActive(vacancy) {
      try {
        await apiClient.put(`/vacancies/${vacancy.id}/toggle-active`);
        await this.fetchVacancies(); // Обновить список
      } catch (err) {
        console.error('Ошибка переключения статуса вакансии:', err);
        alert('Ошибка при переключении статуса вакансии.');
      }
    }
  }
}
</script>

<style scoped>
.admin-vacancies {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section form div {
  margin-bottom: 8px;
}

.form-section label {
  display: block;
  margin-bottom: 4px;
}

.form-section input, .form-section textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.list-section .vacancy-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin: 10px 0;
  background-color: #f9f9f9;
}
</style>