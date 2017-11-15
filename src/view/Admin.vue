<template>
  <div>
    <div class="header-mask">
      <div class="violet"></div>
      <div class="indigo"></div>
      <div class="blue"></div>
      <div class="green"></div>
    </div>
    <header>
      <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
        <router-link :to="{ path: '/admin/users' }">
        <el-menu-item index="1">
  				UserList
  			</el-menu-item>
        </router-link>
        <router-link :to="{ path: '/admin/books' }">
  			<el-menu-item index="2">
  				BookList
  			</el-menu-item>
        </router-link>
        <router-link :to="{ path: '/admin/booking' }">
        <el-menu-item index="3">
  				Bor/Res List
  			</el-menu-item>
        </router-link>
        <router-link :to="{ path: '/admin/history' }">
  			<el-menu-item index="4">
  				Bor/Res History
  			</el-menu-item>
        </router-link>
        <router-link :to="{ path: '/admin/delete' }">
  			<el-menu-item index="5">
  				Delete History
  			</el-menu-item>
        </router-link>
        <router-link :to="{ path: '/admin/add-books-from-douban' }">
        <el-menu-item index="6">
  				DouBan
  			</el-menu-item>
        </router-link>
        <router-link :to="{ path: '/books' }">
        <el-menu-item index="7" style="float: right">
  				Back to Home
  			</el-menu-item>
        </router-link>
  		</el-menu>
    </header>
		<main>
      <transition name="fade" mode="out-in">
        <router-view v-on:login="login"></router-view>
      </transition>
		</main>

	</div>
</template>

<script>
import api from '@/api'
import * as Conn from '../utils/connection'

export default {
  name: 'admin-dashboard',

  data () {
    return {
      title: 'Admin',
      isLogin: false,
      dialogVisible: false
    }
  },

  watch: {
    '$route' (to, from) {
      this.load()
    }
  },

  mounted () {
    this.load()
  },

  methods: {
    load () {
      if (!sessionStorage.getItem('admin') && this.$route.path !== '/admin/login') {
        this.$message.error('Please sign in first!');
        return setTimeout(() => {
          this.$router.push({ path: '/admin/login' })
        }, 2000)
      } else if (sessionStorage.getItem('admin')) {
        this.isLogin = true
      }
    },
    // 登录钩子
    login () {
      this.isLogin = true
    },
  },
}
</script>

<style lang='stylus'>
.el-menu
  border-radius 0
a
  text-decoration none
.el-row, .el-table
  margin 10px auto

main
  margin 0 auto
  width 90%

.book-card
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  background: rgba(0,0,0,.8)
  z-index 100
  border none
  border-radius 0
  .container
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 85%
    max-height 520px
    max-width 400px
    background #fff
    padding 20px
    border-radius 10px
    overflow-y auto

.searh-item
  height 222px

.photo
  width 140px
  min-height 200px
  padding 5px
  img
    width 100%
</style>
