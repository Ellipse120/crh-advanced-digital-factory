import Vue from 'vue'
import VueCompositionAPI, { createApp } from '@vue/composition-api'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import { makeServer } from '@/server'
import '@/icons' // icon
import '@/permission' // permission control
import { utilsMixin } from '@/mixins'

// if (process.env.NODE_ENV === 'development') {
//   makeServer()
// }
makeServer()

Vue.use(VueCompositionAPI)

const app = createApp({
  router,
  store,
  render: h => h(App)
})
app.config.productionTip = false
app.mixin(utilsMixin)
app.use(ElementUI, { size: 'mini', zIndex: 3000 })
app.mount('#app')
