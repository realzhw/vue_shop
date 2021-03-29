import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/' // 配置请求的根路径
Vue.prototype.$http = axios // 使每个组件通过this都能访问到$http 从而发起ajax请求

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
