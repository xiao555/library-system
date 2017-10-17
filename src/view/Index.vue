<template>
  <div>

    <header>
  		<el-menu
  			theme="dark"
  			class="el-menu-demo"
  			mode="horizontal"
  		>
  			<el-menu-item index="1">
  				<router-link :to="{ path: '/books' }">Library</router-link>
  			</el-menu-item>
  			<template v-if="isLogin">
          <el-menu-item index="2" v-if ="isLogin">
    				<a @click="logout()">Sign out</a>
    			</el-menu-item>
  			</template>
  			<template v-else>
  				<el-menu-item index="3">
  					<router-link :to = "{ path: '/login' }">Sign in</router-link>
  				</el-menu-item>
          <el-menu-item index="4">
  					<router-link :to = "{ path: '/register' }">Sign up</router-link>
  				</el-menu-item>
  			</template>
        <el-menu-item index="5" style="float: right">
  				<router-link :to="{ path: '/admin/login' }">Admin</router-link>
  			</el-menu-item>
  		</el-menu>
  	</header>
    <main>
      <transition name="fade" mode="out-in">
        <router-view v-on:login="login"></router-view>
      </transition>
    </main>
    <footer-component></footer-component>
    <el-dialog title="Alert" v-model="dialogVisible" size="tiny">
			<span>Are you sure?</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel()">Cancel</el-button>
				<el-button type="primary" @click="logout()">Yes</el-button>
			</span>
		</el-dialog>
  </div>

</template>

<script>
import Footer from '../components/Footer.vue'

export default {
  name: 'index',

  components: {
    FooterComponent: Footer
  },

  data () {
    return {
      title: '',
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
}
</script>

<style lang="stylus">
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
