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
        <el-menu-item index="1">
  				<router-link :to="{ path: '/admin/booking' }">Admin</router-link>
  			</el-menu-item>
        <el-menu-item index="2">
  				<router-link :to="{ path: '/admin/users' }">UserList</router-link>
  			</el-menu-item>
  			<el-menu-item index="3">
  				<router-link :to="{ path: '/admin/books' }">BookList</router-link>
  			</el-menu-item>
        <el-menu-item index="4">
  				<router-link :to="{ path: '/admin/add-books-from-douban' }">DouBan</router-link>
  			</el-menu-item>
  			<el-menu-item index="5" v-if="isLogin">
  				<a @click="dialogVisible = true">Sign out</a>
  			</el-menu-item>
        <el-menu-item index="6" style="float: right">
  				<router-link :to="{ path: '/books' }">Back to Home</router-link>
  			</el-menu-item>
  		</el-menu>
    </header>
		<main>
      <transition name="fade" mode="out-in">
        <router-view v-on:login="login" v-on:logout="logout"></router-view>
      </transition>
  		<el-dialog title="Alert" v-model="dialogVisible" size="tiny">
  			<span>Are you sure?</span>
  			<span slot="footer" class="dialog-footer">
  				<el-button @click="cancel()">Cancel</el-button>
  				<el-button type="primary" @click="logout()">Yes</el-button>
  			</span>
  		</el-dialog>
		</main>

	</div>
</template>

<script>
import api from '@/api'

export default {
  name: 'admin-dashboard',

  data () {
    return {
      title: 'Admin',
      isLogin: false,
      dialogVisible: false
    }
  },

  mounted () {
    if (!this.isLoginf()) return
    console.log(sessionStorage.getItem('uname'));
    if (sessionStorage.getItem('login'))  {
      this.isLogin = true
      this.$store.state.user = sessionStorage.getItem('uname')
    }
  },

  methods: {
    logout () {
      sessionStorage.removeItem('login')
      this.dialogVisible = this.isLogin = false
      this.$router.push({ path: '/admin/login' })
    },
    cancel () {
      this.dialogVisible = false
    },
    // 登录钩子
    login () {
      this.isLogin = true
    },
    // 验证是否登录
    isLoginf () {
      if (!sessionStorage.getItem('login')) {
        this.$message.error('Please sign in first!');
        setTimeout(() => {
          this.$router.push({ path: '/admin/login' })
        }, 2000)
        return false
      }
      return true
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
    margin 100px auto
    width 85%
    height 400px
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
