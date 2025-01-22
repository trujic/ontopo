import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import '../styles/app.css';
import router from '../router';
import Header from '@/components/Header.vue';
import SearchForm from '@/components/SearchForm.vue';

const app = createApp(App);
app.use(router);
const pinia = createPinia();

app.use(pinia);
app.component('Header', Header);
app.component('SearchForm', SearchForm);

app.mount('#app');