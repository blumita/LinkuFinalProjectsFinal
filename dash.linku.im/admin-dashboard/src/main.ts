import './assets/base.css'
import './assets/tabler-icons.css'
import './assets/vue3-persian-datetime-picker-dark.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axiosPlugins from "@/plugins/axiosPlugins.ts";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(axiosPlugins)
app.mount('#app')
