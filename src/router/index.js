import Vue from 'vue'
import Router from 'vue-router'

const Welcome = () => import('../view/Welcome.vue')
const Login = () => import('@/view/Login.vue')
const userLogin = () => import('@/view/UserLogin.vue')

const Index = () => import('@/view/Index.vue')
// const Register = () => import('@/view/Register.vue')
const IndexBooks = () => import('../view/IndexBooks.vue')
const UserHistory = () => import('../view/UserHistory.vue')
const UserInfo = () => import('../view/UserInfo.vue')
const BookInfo = () => import('../view/BookInfo.vue')

const Admin = () => import('@/view/Admin.vue')
const adminBooks = () => import('../view/adminBooks.vue')
const adminBooking = () => import('../view/adminBooking.vue')
const adminHistory = () => import('../view/adminHistory.vue')
const adminUsers = () => import('../view/adminUsers.vue')
const adminBookDelete = () => import('../view/adminBookDelete.vue')
const Douban = () => import('../view/addBookFromDouBan.vue')

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
          path: 'books/:isbn',
          name: 'bookInfo',
          component: BookInfo
        }, {
          path: 'login',
          name: 'userLogin',
          component: userLogin
        },
        // {
        //   path: 'register',
        //   name: 'userRegister',
        //   component: Register
        // },
        {
          path: 'user/:id',
          name: 'profile',
          component: UserInfo
        },
        {
          path: 'history/:id',
          name: 'history',
          component: UserHistory
        },
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
        }, {
          path: 'add-books',
          name: 'addBooksFromDouban',
          component: Douban
        }, {
          path: 'booking',
          name: 'adminBooking',
          component: adminBooking
        }, {
          path: 'users',
          name: 'adminUsers',
          component: adminUsers
        }, {
          path: 'history',
          name: 'adminHistory',
          component: adminHistory
        }, {
          path: 'delete',
          name: 'adminBookDelete',
          component: adminBookDelete
        }
      ]}
    ]
  })
}
