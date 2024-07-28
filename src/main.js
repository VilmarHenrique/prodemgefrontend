import Vue from 'vue'
import App from './App.vue'
import router from './router'; // Importa o roteador
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router, // Usa o roteador
  vuetify,
  render: h => h(App),
}).$mount('#app');