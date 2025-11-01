import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Настройка axios для отправки куки (credentials) с каждым запросом
axios.defaults.withCredentials = true;

createApp(App).use(router).mount('#app')