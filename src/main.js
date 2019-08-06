import Vue from 'vue'
import App from './App.vue'
// import * as firebase from 'firebase'
// import firebase from 'firebase'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/firebase/'

Vue.use(BootstrapVue)

Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
