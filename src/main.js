import Vue from 'vue'
import App from './App'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './utils/title'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(Element)

Vue.mixin(titleMixin)

export function createApp () {
  const store = createStore()
  const router = createRouter()

  // use `store.state.route`
  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
