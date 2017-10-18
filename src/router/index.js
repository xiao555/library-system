import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/view/Index.vue')
const Admin = () => import('@/view/Admin.vue')
const Login = () => import('@/view/Login.vue')
const Register = () => import('@/view/Register.vue')
const IndexBooks = () => import('../view/IndexBooks.vue')

const adminBooks = () => import('../view/adminBooks.vue')
const Welcome = () => import('../view/Welcome.vue')

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    // scrollBehavior: () => ({ y: 0 }), // 切换路由时回到顶部
    routes: [
      { path: '/', component: Index, redirect: '/', children: [
        {
          path: '/',
          name: 'welcome',
          component: Welcome
        }, {
					path: 'books',
					name: 'IndexBooks',
					component: IndexBooks
				}, {
          path: 'login',
          name: 'userLogin',
          component: Login
        }, {
          path: 'register',
          name: 'userRegister',
          component: Register
        }
      ]},
      { path: '/admin', component: Admin, children: [
        {
          path: 'login',
          name: 'adminLogin',
          component: Login
        }, {
          path: 'books',
          name: 'adminBooks',
          component: adminBooks
        }
      ]}
    ]
  })
}
