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
  				<router-link :to="{ path: '/admin/books' }">Admin</router-link>
  			</el-menu-item>
  			<el-menu-item index="2">
  				<router-link :to="{ path: '/admin/books' }">BookList</router-link>
  			</el-menu-item>
  			<el-menu-item index="3" v-if="isLogin">
  				<a @click="dialogVisible = true">Sign out</a>
  			</el-menu-item>
        <el-menu-item index="4" style="float: right">
  				<router-link :to="{ path: '/books' }">Back to Home</router-link>
  			</el-menu-item>
  		</el-menu>
    </header>
		<main>
      <router-view v-on:login="login" v-on:logout="logout"></router-view>
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

  methods: {
    logout () {
      sessionStorage.removeItem('uid')
      this.dialogVisible = this.isLogin = false
      this.$router.push({ path: '/admin/login' })
    },
    cancel () {
      this.dialogVisible = false
    },
    login () {
      this.isLogin = true
    }
  },

  beforeMount () {
    this.isLogin = !!sessionStorage.getItem('uid')
  }
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
</style>
