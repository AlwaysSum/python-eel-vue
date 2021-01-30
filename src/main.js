import { createApp } from 'vue'
import App from './App.vue'

// Vue.config.productionTip = false
//获取eel
Vue.prototype.$eel = window.eel;
createApp(App).mount('#app')
