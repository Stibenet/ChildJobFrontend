<template>
  <div class="admin-users">
    <h2>Управление Пользователями</h2>

    <div class="form-section">
      <h3>{{ editingUser ? 'Редактировать Пользователя' : 'Создать Нового Пользователя' }}</h3>
      <form @submit.prevent="onFormSubmit"> <!-- Изменим обработчик -->
        <div>
          <label for="username">Имя пользователя:</label>
          <input id="username" v-model="form.username" type="text" required />
        </div>
        <div>
          <label for="password">{{ editingUser ? 'Новый пароль (оставьте пустым, чтобы не менять):' : 'Пароль:' }}</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              :required="!editingUser"
              @input="validatePassword"
          />
          <!-- Сообщение об ошибке валидации -->
          <p v-if="passwordError" class="error">{{ passwordError }}</p>
        </div>
        <div>
          <label for="roles">Роли:</label>
          <select id="roles" v-model="form.roles" multiple required>
            <option value="admin">ADMIN</option>
            <option value="parent">PARENT</option>
            <option value="guest">GUEST</option>
            <option value="child">CHILD</option>
          </select>
        </div>
        <!-- Кнопки -->
        <button type="submit" :disabled="!!passwordError || !form.username || !form.roles || form.roles.length === 0">
          {{ editingUser ? 'Обновить' : 'Создать' }}
        </button>
        <button v-if="editingUser" @click="cancelEdit" type="button">Отмена</button>
      </form>
    </div>

    <div class="list-section">
      <h3>Список Пользователей</h3>
      <div v-if="loading">Загрузка...</div>
      <div v-else>
        <div v-for="user in users" :key="user.id" class="user-item">
          <h4>ID: {{ user.id }} - {{ user.username }}</h4>
          <p>Роли: {{ user.roles.join(', ') }}</p>
          <button @click="editUser(user)">Редактировать</button>
          <button @click="deleteUser(user.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../utils/axios'

export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      loading: true,
      editingUser: null,
      form: {
        username: '',
        password: '',
        roles: []
      },
      passwordError: '' // Поле для хранения ошибки валидации пароля
    }
  },
  async mounted() {
    await this.fetchUsers();
    this.loading = false;
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await apiClient.get('/admin/users');
        this.users = response.data;
      } catch (err) {
        console.error('Ошибка получения пользователей:', err);
        if (err.response && err.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    resetForm() {
      this.form = {
        username: '',
        password: '',
        roles: []
      };
      this.passwordError = '';
      this.editingUser = null;
    },
    // Функция валидации пароля
    validatePassword() {
      // При создании пароль обязателен и должен быть длиной 6-40
      if (!this.editingUser) { // Режим создания
        if (!this.form.password) {
          this.passwordError = 'Пароль обязателен.';
          return;
        }
        const length = this.form.password.length;
        if (length < 6) {
          this.passwordError = 'Пароль должен содержать не менее 6 символов.';
          return;
        } else if (length > 40) {
          this.passwordError = 'Пароль не должен превышать 40 символов.';
          return;
        }
      } else { // Режим редактирования
        if (this.form.password) { // Если пароль введён при редактировании, проверяем его
          const length = this.form.password.length;
          if (length < 6) {
            this.passwordError = 'Пароль должен содержать не менее 6 символов.';
            return;
          } else if (length > 40) {
            this.passwordError = 'Пароль не должен превышать 40 символов.';
            return;
          }
        }
        // Если пароль пустой при редактировании, ошибки нет
      }
      // Если все проверки пройдены
      this.passwordError = '';
    },
    // Новый метод для обработки отправки формы
    onFormSubmit() {
      console.log('onFormSubmit вызван'); // <-- Добавим лог
      if (this.editingUser) {
        this.updateUser();
      } else {
        this.createUser();
      }
    },
    async createUser() {
      console.log('Вызов createUser'); // <-- Добавим лог
      // Проверяем валидацию перед отправкой
      this.validatePassword();
      if (this.passwordError) {
        console.error('Ошибка валидации пароля при создании:', this.passwordError);
        alert(`Ошибка валидации: ${this.passwordError}`);
        return; // <-- Выход из функции, если ошибка
      }
      if (!this.form.username) {
        console.error('Имя пользователя обязательно при создании.');
        alert('Имя пользователя обязательно.');
        return;
      }
      if (!this.form.roles || this.form.roles.length === 0) {
        console.error('Необходимо выбрать хотя бы одну роль при создании.');
        alert('Необходимо выбрать хотя бы одну роль.');
        return;
      }

      try {
        console.log('Отправка запроса createUser:', this.form); // <-- Добавим лог
        const response = await apiClient.post('/admin/users', this.form);
        console.log('Пользователь успешно создан:', response.data);
        this.resetForm();
        await this.fetchUsers(); // Обновить список
      } catch (err) {
        console.error('Ошибка создания пользователя (Network):', err);
        let errorMessage = 'Неизвестная ошибка';
        if (err.response) {
          // Сервер вернул ошибку
          errorMessage = err.response.data.message || err.response.data.error || `HTTP ${err.response.status}`;
        } else if (err.request) {
          // Запрос был сделан, но не получен ответ
          errorMessage = 'Нет ответа от сервера';
        } else {
          // Ошибка при настройке запроса
          errorMessage = err.message;
        }
        alert(`Ошибка при создании пользователя: ${errorMessage}`);
      }
    },
    editUser(user) {
      this.editingUser = user;
      this.form = {
        username: user.username,
        password: '', // Не подгружаем старый пароль
        roles: [...user.roles.map(r => r.toLowerCase().replace('role_', ''))] // Преобразуем "ROLE_ADMIN" в "admin"
      };
      this.passwordError = ''; // Сбрасываем ошибку при начале редактирования
    },
    cancelEdit() {
      this.resetForm();
    },
    async updateUser() {
      // При обновлении пароль не обязателен, но если введён - проверяем его
      if (this.form.password) {
        this.validatePassword();
        if (this.passwordError) {
          console.error('Ошибка валидации пароля при обновлении:', this.passwordError);
          alert(`Ошибка валидации: ${this.passwordError}`);
          return;
        }
      }
      if (!this.form.username) {
        console.error('Имя пользователя обязательно при обновлении.');
        alert('Имя пользователя обязательно.');
        return;
      }
      if (!this.form.roles || this.form.roles.length === 0) {
        console.error('Необходимо выбрать хотя бы одну роль при обновлении.');
        alert('Необходимо выбрать хотя бы одну роль.');
        return;
      }

      if (!this.editingUser) return;
      try {
        // Подготовим тело запроса
        const payload = {
          username: this.form.username,
          roles: this.form.roles
        };
        // Отправляем пароль только если он заполнен
        if (this.form.password) {
          payload.password = this.form.password;
        }
        const response = await apiClient.put(`/admin/users/${this.editingUser.id}`, payload);
        console.log('Пользователь успешно обновлён:', response.data);
        this.resetForm();
        await this.fetchUsers(); // Обновить список
      } catch (err) {
        console.error('Ошибка обновления пользователя (Network):', err);
        let errorMessage = 'Неизвестная ошибка';
        if (err.response) {
          errorMessage = err.response.data.message || err.response.data.error || `HTTP ${err.response.status}`;
        } else if (err.request) {
          errorMessage = 'Нет ответа от сервера';
        } else {
          errorMessage = err.message;
        }
        alert(`Ошибка при обновлении пользователя: ${errorMessage}`);
      }
    },
    async deleteUser(id) {
      if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
      try {
        await apiClient.delete(`/admin/users/${id}`);
        await this.fetchUsers(); // Обновить список
      } catch (err) {
        console.error('Ошибка удаления пользователя:', err);
        alert('Ошибка при удалении пользователя.');
      }
    }
  }
}
</script>

<style scoped>
.admin-users {
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

.form-section input, .form-section select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.error {
  color: red;
  font-size: 0.9em;
  margin-top: 4px;
}

.list-section .user-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin: 10px 0;
  background-color: #f9f9f9;
}
</style>